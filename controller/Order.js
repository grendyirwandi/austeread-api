'use strict';
const Controller = require('../core/Controller');
const orderModel = require('../models/Order_model');
const cartController = require('../controller/Cart');
const _ = require('lodash');
const moment = require('moment');

class Order extends Controller {
    constructor(req, res) {
        super(res);
        this.req = req;
    }

    async getOrder(){
        try {
            let res = null;
            
            if (this.req.query.id) {
                res = await orderModel.getOrderById(this.req.query.id)
            }else if(!this.req.query.id && this.req.user.id && !this.req.user.role){
                res = await orderModel.getOrderByUserId(this.req.user.id, this.req.query.is_workshop)
            }else if(!this.req.query.id && this.req.user.role == "Administrator"){
                res = await orderModel.getOrder()
            }
            return this.res.json(res);
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: err});
        }
    }

    async insertOrder(){
        try {
            let res = await orderModel.insertOrder(this.req.body)
            if (this.req.body.is_workshop) {
                this.req.body.order.forEach(element => {
                    cartController.deleteProductFromCartWorkshop(this.req.body.id_person, element.productId);
                });
            }
            return this.res.json({status: 'Success', message: 'Order successfull!', transactionId: res});
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Order is failed!.'});
        }
    }

    async updateOrder(){
        try {
            await orderModel.updateOrder(this.req.body, this.req.params.id)
            return this.res.json({status: 'Success', message: 'Update order successfull!'});
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Update order is failed!.'});
        }
    }
}


module.exports = Order;