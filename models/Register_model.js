'use strict';
const {
    SETREDIS,
    GETREDIS
} = require('./Redis');
const tables = require('./tables')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    SignatureRSA
} = require('@ryanbekhen/cryptkhen');
const winston = require('../config/winston');

class Regis_model {
    async check_customer(params) {
        const conditionCustomer = {
            where: {
                [Op.or]: [{
                        username: params.username
                    },
                    {
                        email: params.email
                    },
                    {
                        phone: params.phone
                    },
                ]
            }
        }

        const checkCustomer = await tables.dcp_customer.findAll(conditionCustomer);
        return (checkCustomer.length != 0) ? true : false;
    }

    async check_activation_user(params) {
        const conditionCustomer = {
            where: {
                username: params.username,
                is_actived: 1
            }
        }

        const checkCustomer = await tables.dcp_customer.findOne(conditionCustomer);
        return (checkCustomer) ? true : false;
    }

    async check_subdomain(params) {
        const conditionSubdomain = {
            where: {
                subdomain: params.subdomain
            }
        }

        const checkSubdomain = await tables.dcp_config_server.findAll(conditionSubdomain);
        return (checkSubdomain.length != 0) ? true : false;
    }

    async create(params) {
        let transaction;
        try {
            /*Start a transaction to do the whole lot inside */
            transaction = await tables.sequelize.transaction();

            const salt = await bcrypt.genSalt(10);
            const passwordCustomer = await bcrypt.hash(params.password, salt);
            const insertCustomer = {
                username: params.username,
                password: passwordCustomer,
                firstname: params.firstname,
                lastname: params.lastname,
                email: params.email,
                phone: params.phone,
                address: params.address,
                birth_date: params.birth_date,
                gender: params.gender,
            };
            const customer = await tables.dcp_customer.create(insertCustomer, {
                fields: [
                    'username',
                    'password',
                    'firstname',
                    'lastname',
                    'email',
                    'phone',
                    'address',
                    'birth_date',
                    'gender'
                ],
                transaction
            });
            const insertServerconfig = {
                id_customer: customer.id,
                subdomain: params.subdomain,
                user_db: params.username,
                password_db: (params.username + "_" + salt + "_" + params.phone),
                name_db: params.username,
            };
            const server_config = await tables.dcp_config_server.create(insertServerconfig, {
                fields: [
                    'id_customer',
                    'subdomain',
                    'user_db',
                    'password_db',
                    'name_db',
                ],
                transaction
            });
            const tmpRedis = {
                subdomain: params.subdomain,
                user_db: params.username,
                password_db: (params.username + "_" + salt + "_" + params.phone),
                name_db: params.username,
            }
            SETREDIS('CREATE_NEW_USER:' + params.subdomain + ':dbConfig', JSON.stringify(tmpRedis));
            // Create payload JWT
            const payload = {
                username: params.username,
                email: params.email,
                phone: params.phone,
                subdomain: params.subdomain
            }

            // Create option JWT
            const option = {
                issuer: "Team ERP",
                subject: "RESTFul API untuk POS",
                expiresIn: "24h"
            }

            const tmpJWT = await jwt.sign(payload, "B@GUVIX_^%&_H3Soy@m_567", option);
            await transaction.commit();
            return tmpJWT;
        } catch (error) {
            await transaction.rollback();
            throw new Error(error);
        }
    }

    async activation_user(params) {
        const set = {
            is_actived: 1
        }

        const condition = {
            where: {
                [Op.and]: [{
                        username: params.username
                    },
                    {
                        email: params.email
                    },
                    {
                        phone: params.phone
                    },
                ]
            }
        }

        tables.dcp_customer.update(set, condition);
    }

    decodeToken(token) {
        try {
            // Create option JWT
            const option = {
                issuer: "Team ERP",
                subject: "RESTFul API untuk POS",
                maxAge: "24h"
            }
            return jwt.verify(token, "B@GUVIX_^%&_H3Soy@m_567", option);
        } catch (ex) {
            winston.warn(ex.message);
            return false;
        }
    }

    validation(params) {
        const stringPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        const stringName = /^[A-Za-z\d ]+$/
        const stringPhone = /^[0-9]+$/
        const stringAddress = /^[A-Za-z0-9\d\._,\/ -]+$/
        const schema = {
            username: Joi.string().alphanum().min(1).max(20).trim().required(),
            password: Joi.string().min(6).max(100).regex(stringPass).trim().required(),
            firstname: Joi.string().min(2).max(20).regex(stringName).trim().required(),
            lastname: Joi.string().min(2).max(50).regex(stringName).trim().required(),
            email: Joi.string().email().min(1).max(77).required(),
            phone: Joi.string().regex(stringPhone).min(1).max(15).required(),
            address: Joi.string().regex(stringAddress).min(1).max(255).required(),
            birth_date: Joi.date().less('now').required(),
            gender: Joi.number().min(0).max(1).required(),
            subdomain: Joi.string().alphanum().min(5).max(25).required(),
        }

        return Joi.validate(params, schema, {
            abortEarly: false
        });
    }

    validationConfrim(params) {
        const schema = {
            token: Joi.string().min(10).trim().required()
        }

        return Joi.validate(params, schema, {
            abortEarly: false
        });
    }
}

module.exports = Regis_model;