'use strict';
const tables = require('./tables');
const { generateKeyPairSync } = require('crypto');
var bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);

class Login_model {
    async login(params) {
        let query = {
            where: { email: params.email }
        }
        return await tables["tbl_users"].findOne(query);
    }

    validation(params) {
        if (  req.body.username != "" || (req.body.username != null && req.body.password != "") || req.body.password != null) {

        } else {
            res.redirect("login");
        }
    }

    async updatePassPerson(body){
        let hash = bcrypt.hashSync(body.newpassword, salt);
        let query = {
            password:hash
        }

        return await tables["tbl_person"].update(query, { where: {email:body.email} });
    }

    async updatePicPerson(body){
        let query = {
            img:body.img
        }

        return await tables["tbl_person"].update(query, { where: {email:body.email} });
    }

    async updateAddressPerson(body){
        let query = {
            address:JSON.stringify({
                default:body.default,
                address:body.address
            })
        }
        return await tables["tbl_person"].update(query, { where: {email:body.email} });
    }

    async insertPerson(body){
        let hash
        let query = {
            id: Date.now(),
            fullname: body.fullname,
            img: body.img,
            email: body.email,
            createdAt: body.createdAt,
        }
        if (body.password) {
            hash = bcrypt.hashSync(body.password, salt);
            query.password = hash;
        }else{
            query.register_method = 1;
        }

        return await tables["tbl_person"].create(query);
    }
    
    async getOnePersonByEmail(params){
        let query = {
            where: { email: params.email }
        }
        return await tables["tbl_person"].findOne(query);
    }

    async getAllDiscountCode(){
        return await tables["tbl_discounts"].findAll();
    }

    async getAllDiscountCode(){
        return await tables["tbl_discounts"].findAll();
    }
    async getDiscountCodeById(id){
        let query = {
            where: { id }
        }
        return await tables["tbl_discounts"].findOne(query);
    }

    async addDiscountCode(body){
        let query = {
            "id": Date.now(),
            "code": body.code,
            "price": body.price,
            "active": body.active
        }
        await tables["tbl_discounts"].create(query);
    }

    async updateDiscountCode(id, body){
        return await tables["tbl_discounts"].update(body, { where: {id} });
    }

    async delDiscountCode(id){
        return await tables["tbl_discounts"].destroy({
            where: { id },
        });
    }
}

module.exports = Login_model;