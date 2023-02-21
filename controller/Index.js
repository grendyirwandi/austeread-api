'use strict';
const Controller = require('../core/Controller');
const _ = require('lodash');
const moment = require('moment');

class Index extends Controller {
    constructor(req, res) {
        super(res);
        this.req = req;
        this.users_model = this._model('Users_model');
    }

    async getNews(){
        let allNews = await this.users_model.getAllNews()
        const start = moment().startOf('day').utc(true).toDate();
        const end = moment().endOf('day').utc(true).toDate();
        
        const newsToday = await _.chain(allNews)
                                    .filter(({ updatedAt }) => {
                                            return  _.gte(updatedAt, start) &&
                                                    _.lte(updatedAt, end)
                                                })
                                    .value();

                                    
        let groupByCategory = _.chain(allNews)
            .groupBy("category")
            .map((value, key) => ({ category: key, value: value }))
            .value()
        groupByCategory.unshift({
            category: "All", value: ((newsToday.length >= 6) ? newsToday.slice(0,6) : newsToday)
        })
        
        return this.res.json(groupByCategory);
    }

    async getNewsById(params){
        let getNews = await this.users_model.getNewsById(params.id)
        return this.res.json(getNews);
    }

    async getAllNewsByCategory(params){
        let getAllNewsByCategory = await this.users_model.getAllNewsByCategory(params)
        return this.res.json(getAllNewsByCategory);
    }

    async getLatestNews(){
        let latestNews = await this.users_model.latestNews()
        return this.res.json(latestNews);
    }

    async getAllCategory(){
        let allCategory = await this.users_model.getAllNewsCategory()
        return this.res.json(allCategory);
    }
    async getSearchNews(params){
        let searchNews = await this.users_model.getSearchNews(params.search)
        return this.res.json(searchNews);
    }

    async getSubNews(params){
        try {
            let getSubNews = await this.users_model.getSubNewsPerson(params.id);
            return this.res.json(getSubNews);
        } catch (err) {
            return this.res.json({status: 'Failed', message: err});
        }
    }

    async updateSubNews(subNews, id){
        try {
            await this.users_model.updateSubNewsPerson(subNews, id);
            return this.res.json({status: 'Success', message: 'Update subcribe news by person!'});
        } catch (err) {
            return this.res.json({status: 'Failed', message: err});
        }
    }

    async likeNews(isLike, idNews, idPersons){
        try {
            const temp = await this.users_model.updateLike(isLike, idNews, idPersons);

            if(temp == false) {
                return this.res.json({status: 'Failed', message: 'Like is zero'});
            } else {
                return this.res.json({status: 'Success', message: 'Update like news!'});
            }
        } catch (err) {
            return this.res.json({status: 'Failed', message: err});
        }
    }

    async getLikeNewsByPerson(idNews, idPersons){
        try {
            let getLike = await this.users_model.getLikeNewsByPerson(idNews, idPersons);
            return this.res.json(getLike);
        } catch (err) {
            console.log(err)
            return this.res.json({status: 'Failed', message: err});
        }
    }

}

module.exports = Index;