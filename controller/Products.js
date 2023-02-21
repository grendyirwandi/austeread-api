'use strict';
const productsModel = require('../models/Products_model');

class Products {
    async getProductById(idProduct) {
        try {
            return await productsModel.getProductById(idProduct);
        } catch (err) {
            console.log('ErrorGetProductsById', err);
            return {status: 'Failed', error: err}
        }
    }

    async get(search = "", subcat = "", page = 1, limit = 6, isPopular = false, isWorkshop = false) {
        try {
            return await productsModel.getProduct(search, subcat, page, limit, isPopular, isWorkshop);
        } catch (err) {
            console.log('ErrorGetProducts', err);
            return {status: 'Failed', error: err}
        }
    }

    async getProductForShop(){
        try {
            return await productsModel.getProductForShop();
        } catch (err) {
            console.log('errgetProduct', err);
            return {status: 'Failed', error: err}
        }
    }
    
    async addProducts(body){
        try {
            await productsModel.insertProducts(body)
            return {status: 'Success', message: 'Product is successfull added!', class: 'alert alert-success alert-dismissible fade show'}
        } catch (err) {
            console.log('erraddNewsCategory', err);
            return {status: 'Failed', message: 'Product is failed added!.', class: 'alert alert-danger alert-dismissible fade show'}
        }
    }
    
    async updateProducts(body, params){
        try {
            await productsModel.updateProducts(body, params.id)
            return {status: 'Success', message: 'Product is successfull updated!', class: 'alert alert-success alert-dismissible fade show'}
        } catch (err) {
            console.log('updateProducts', err);
            return {status: 'Failed', message: 'Product is failed updated!.', class: 'alert alert-danger alert-dismissible fade show'}
        }
    }

    async delProducts(params){
        try {
            await productsModel.delProducts(params.id)
            return {status: 'Success', message: 'Product is successfull deleted!', class: 'alert alert-success alert-dismissible fade show'}
        } catch (err) {
            console.log('errdelProducts', err);
            return {status: 'Failed', message: 'Product is failed deleted!.', class: 'alert alert-danger alert-dismissible fade show'}
        }
    }
}

module.exports = new Products();