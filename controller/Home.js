'use strict';
const Controller = require('../core/Controller')

class Home extends Controller {
    constructor(req, res) {
        super(res);
        this.req = req;
        this.users_model = this._model('Users_model');
    }

    async getDashboard(){
        let totalUsers = await this.users_model.getTotalUsers()
        let totalNews = await this.users_model.getTotalNews()
        let totalQuestions = await this.users_model.getTotalQuestions()
        // console.log(this.req.user);
        this.res.json({
            totalUsers,
            totalNews,
            totalQuestions
        });
    }

    async users(){
        let listAcc = await this.users_model.getAllUsers()
        return this.res.json(listAcc);
    }

    async addUsers(body){
        try {
            await this.users_model.insertUsers(body)
            return this.res.json({status: 'Success', message: 'User is successfull added!', class: 'alert alert-success alert-dismissible fade show'});
        } catch (err) {
            // console.log('err', err);
            return this.res.json({status: 'Failed', message: 'User is failed added!. email already exists ', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }

    async updateUsers(body, params){
        try {
            await this.users_model.updateUsers(body, params.id)
            return this.res.json({status: 'Success', message: 'User is successfull updated!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'User is failed updated!. email already exists ', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    async cpUsers(body, params){
        try {
            await this.users_model.cpUsers(body, params.id)
            return this.res.json({status: 'Success', message: 'Change password successfull!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('cpUserserr', err);
            return this.res.json({status: 'Failed', message: 'Change password failed!', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    async delUsers(params){
        try {
            await this.users_model.delUsers(params.id)
            return this.res.json({status: 'Success', message: 'Delete user successfull!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Delete user failed!', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    async news(){
        let listAcc = await this.users_model.getAllNewsAdmin()
        this.res.json(listAcc);
    }

    async addNews(body){
        try {
            await this.users_model.insertNews(body)
            return this.res.json({status: 'Success', message: 'News is successfull added!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'News is failed added!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    
    async updateNews(body, params){
        try {
            await this.users_model.updateNews(body, params.id)
            return this.res.json({status: 'Success', message: 'News is successfull updated!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'News is failed updated!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    async delNews(params){
        try {
            await this.users_model.delNews(params.id)
            return this.res.json({status: 'Success', message: 'Delete news successfull!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Delete news failed!', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    async productsCategory(){
        try {
            let category = await this.users_model.getAllProductsCategory();
            return this.res.json(category)
        } catch (err) {
            console.log('erraddProductCategory', err);
            return this.res.json({status: 'Failed', error: err})
        }
    }
    async addProductsCategory(body){
        try {
            await this.users_model.insertProductsCategory(body)
            return this.res.json({status: 'Success', message: 'Product category is successfull added!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddProductCategory', err);
            return this.res.json({status: 'Failed', message: 'Product category is failed added!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    async upProductsCategory(body, params){
        try {
            await this.users_model.updateProductsCategory(body.name, params.id)
            return this.res.json({status: 'Success', message: 'Product category is successfull updated!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddProductCategory', err);
            return this.res.json({status: 'Failed', message: 'Product category is failed updated!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    async delProductsCategory(params){
        try {
            await this.users_model.delProductsCategory(params.id)
            return this.res.json({status: 'Success', message: 'Product category is successfull deleted!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddProductCategory', err);
            return this.res.json({status: 'Failed', message: 'Product category is failed deleted!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    async productsSubcategory(){
        try {
            let category = await this.users_model.getAllProductsSubcategory();
            
            return this.res.json(category)
        } catch (err) {
            console.log('erraddProductSubcategory', err);
            return this.res.json({status: 'Failed', error: err})
        }
    }
    async addProductsSubcategory(body){
        try {
            await this.users_model.insertProductsSubcategory(body)
            return this.res.json({status: 'Success', message: 'Product subcategory is successfull added!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddProductSubcategory', err);
            return this.res.json({status: 'Failed', message: 'Product subcategory is failed added!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    async upProductsSubcategory(body, params){
        try {
            await this.users_model.updateProductsSubcategory(body.name, params.id)
            return this.res.json({status: 'Success', message: 'Product subcategory is successfull updated!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddProductSubcategory', err);
            return this.res.json({status: 'Failed', message: 'Product subcategory is failed updated!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    async delProductsSubcategory(params){
        try {
            await this.users_model.delProductsSubcategory(params.id)
            return this.res.json({status: 'Success', message: 'Product subcategory is successfull deleted!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddProductSubcategory', err);
            return this.res.json({status: 'Failed', message: 'Product subcategory is failed deleted!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    async addNewsCategory(body){
        try {
            await this.users_model.insertNewsCategory(body)
            return this.res.json({status: 'Success', message: 'News category is successfull added!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddNewsCategory', err);
            return this.res.json({status: 'Failed', message: 'News category is failed added!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    async upNewsCategory(body, params){
        try {
            await this.users_model.updateNewsCategory(body.name, params.id)
            return this.res.json({status: 'Success', message: 'News category is successfull updated!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddNewsCategory', err);
            return this.res.json({status: 'Failed', message: 'News category is failed updated!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    async delNewsCategory(params){
        try {
            await this.users_model.delNewsCategory(params.id)
            return this.res.json({status: 'Success', message: 'News category is successfull deleted!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('erraddNewsCategory', err);
            return this.res.json({status: 'Failed', message: 'News category is failed deleted!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    
    ////////////////////////////////////////////////////////////////////////////////////

    async products(){
        try {
            let product;
            if (this.req.params.id) {
                product = await this.users_model.getProduct(this.req.params.id);
            }else if(this.req.query.limit){
                product = await this.users_model.getProduct(null, parseInt(this.req.query.limit));
            }else if(this.req.query.subcat){
                product = await this.users_model.getProduct(null, null, this.req.query.subcat);
            }else{
                product = await this.users_model.getProduct();
            }
            return this.res.json(product)
        } catch (err) {
            console.log('errgetProduct', err);
            return this.res.json({status: 'Failed', error: err})
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////
    
    async getConfig(){
        let config = {}
        let getConfig = await this.users_model.getConfig()
        let shopFooter = await this.users_model.getShopFooter()
        getConfig.forEach(e => {
            config[e.kunci] = e.value
        });
        config.shopFooter = shopFooter
        return this.res.json(config);
    }

    async updateConfig(body){
        try {
            await this.users_model.updateConfig(body)
            return this.res.json({status: 'Success', message: 'Configuration is successfull updated!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('errUpdateConfig', err);
            return this.res.json({status: 'Failed', message: 'Configuration is failed updated!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    async getShopFooter(){
        try {
            let shopFooter
            if(this.req.params.id){
                shopFooter = await this.users_model.getShopFooter(this.req.params.id)
            }else{
                shopFooter = await this.users_model.getShopFooter()
            }
            return this.res.json(shopFooter)
        } catch (err) {
            console.log('getShopFooter', err);
        }
    }
    async addShopFooter(){
        try {
            await this.users_model.addShopFooter(this.req.body)
            return this.res.json({status: 'Success', message: 'Shop Footer is successfull added!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('addShopFooter', err);
            return this.res.json({status: 'Failed', message: 'Shop Footer is failed added!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    async upShopFooter(){
        try {
            await this.users_model.updateShopFooter(this.req.body, this.req.params.id)
            return this.res.json({status: 'Success', message: 'Shop Footer is successfull updated!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('addShopFooter', err);
            return this.res.json({status: 'Failed', message: 'Shop Footer is failed updated!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }
    async delShopFooter(){
        try {
            await this.users_model.delShopFooter(this.req.params.id)
            return this.res.json({status: 'Success', message: 'Shop Footer is successfull deleted!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('addShopFooter', err);
            return this.res.json({status: 'Failed', message: 'Shop Footer is failed deleted!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    async send_questions(body){
        try {
            await this.users_model.insertContantUs(body)
            return this.res.json({status: 'Success', message: 'News category is successfull added!', class: 'alert alert-success alert-dismissible fade show'})
        } catch (err) {
            console.log('errsend_questions', err);
            return this.res.json({status: 'Failed', message: 'News category is failed added!.', class: 'alert alert-danger alert-dismissible fade show'})
        }
    }

    async questions(){
        let getAllQuestion = await this.users_model.getAllQuestion();
        return this.res.json(getAllQuestion)
    }
}

module.exports = Home;