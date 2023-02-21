'use strict';
const tables = require('./tables');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const moment = require('moment');
const generateId = require('../common/helper/generator_id');

class Order_model {
    async getOrder(){
        let query = {
            order: [["createdAt", "DESC"]]
        }

        return await tables["tbl_orders"].findAll(query);
    }

    async getOrderForTransaction(){
        const from = moment().subtract(2, 'day').startOf('day').toDate();
        const to = moment().endOf('day').toDate();
        let query = {
            where : {
                status: 'SELECT PAYMENT',
                payment_method : {
                    [Op.ne] : null
                },
                createdAt : {
                    [Op.between] : [from, to]
                }
            },
            order: [["createdAt", "DESC"]]
        }

        return await tables["tbl_orders"].findAll(query);
    }

    async getOrderById(id){
        let query = {
            order: [["createdAt", "DESC"]],
            where: { id }
        }
        return await tables["tbl_orders"].findOne(query);
    }

    async getOrderByUserId(id_person, is_workshop){
        let query = {
            order: [["createdAt", "DESC"]],
            where: { id_person, is_workshop }
        }
        return await tables["tbl_orders"].findAll(query);
    }

    async insertOrder(body){
        let id = "TRX"+ Date.now()
        let query = {
            id: id,
            id_person: body.id_person,
            is_workshop: body.is_workshop,
            order: body.order,
            name: body.name,
            detail_address: body.detail_address,
            province: body.province,
            city: body.city,
            district: body.district,
            postal_code: body.postal_code,
            courier: body.courier,
            service: body.service,
            phone: body.phone,
            // payment_method: body.payment_method,
            // status: body.status,
            discount_price: body.discount_price,
            shipping_price: body.shipping_price,
            total: body.total
        }; 
        await tables["tbl_orders"].create(query);
        return id
    }

    async updateOrder(body, id){
        await tables["tbl_orders"].update(body, { where: { id } });
    }
}

module.exports = new Order_model;