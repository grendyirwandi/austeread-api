'use strict';
const { default: axios } = require('axios');
const Controller = require('../core/Controller'),
        bcrypt = require('bcrypt'),
        jwt = require("jsonwebtoken");

class Login extends Controller {
    constructor(req, res) {
        super(res);
        this.req = req;
        this.login_model = this._model('Login_model');
    }

    async auth(){
        try {
            const getOne = await this.login_model.login(this.req.body)
            if (getOne == null) {
                this.res.status(401).json({message:"Incorrect username or password."});
            }else{
                if (bcrypt.compareSync(this.req.body.password, getOne.password)) {
                    let expiresIn = 18000,
                        info = {
                            id: getOne.id,
                            first_name: getOne.first_name,
                            last_name: getOne.last_name,
                            email: getOne.email,
                            role: getOne.role,
                            createdAt: getOne.createdAt,
                            updatedAt: getOne.updatedAt
                        }
                    const token = jwt.sign(
                        info,
                        process.env.TOKEN_KEY,
                        {expiresIn}
                    );
                    info['token'] = token
                    this.res.status(200).json(info);
                }else {
                    this.res.status(401).json({message:"Incorrect username or password."});
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async register(body){
        try {
            await this.login_model.insertPerson(body)
            return this.res.json({status: 'Success', message: 'Register successfull!', class: 'alert alert-success alert-dismissible fade show'});
        } catch (err) {
            // console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Register is failed!. email already registered', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }
    async changePassPerson(body){
        try {
            const getOne = await this.login_model.getOnePersonByEmail(body);
            if (bcrypt.compareSync(body.oldpassword, getOne.password)) {
                await this.login_model.updatePassPerson(body)
                return this.res.json({status: 'Success', message: 'Change password successfull!', class: 'alert alert-success alert-dismissible fade show'});
            }else {
                return this.res.json({status: 'Failed', message:"Incorrect username or password.", class: 'alert alert-danger alert-dismissible fade show'});
            }
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Change password is failed!. email already or not registered', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }
    async changePicPerson(body){
        try {
            await this.login_model.updatePicPerson(body)
            return this.res.json({status: 'Success', message: 'Change picture successfull!', class: 'alert alert-success alert-dismissible fade show'});
        } catch (err) {
            // console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Change picture is failed!.', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }

    async changeAddressPerson(){
        try {
            await this.login_model.updateAddressPerson(this.req.body)
            return this.res.json({status: 'Success', message: 'Update address successfull!', class: 'alert alert-success alert-dismissible fade show'});
        } catch (err) {
            // console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Update address is failed!.', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }

    async login(){
        try {
            const getOne = await this.login_model.getOnePersonByEmail(this.req.body)
            if (getOne == null) return this.res.json({message:"Incorrect username or password."});
            
            if (this.req.body.register_method == 1) {
                let expiresIn = 18000,
                    info = {
                        id: getOne.id,
                        fullname: getOne.fullname,
                        img: getOne.img,
                        email: getOne.email,
                        register_method: getOne.register_method,
                        address: JSON.parse(getOne.address),
                        createdAt: getOne.updatedAt
                    }
                const token = jwt.sign(
                    info,
                    process.env.TOKEN_KEY,
                    {expiresIn}
                );
                info['token'] = token
                this.res.json(info);
            }else{
                if(!this.req.body.password) return this.res.json({message:"Incorrect username or password."});
                const response_key = this.req.body["captcha_token"],
                secret_key = "6LdofL0cAAAAAAGeXv8bYPWobyQm7kNI8RPqgYgo",
                url =`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
                let verifCaptcha = await axios.request({method: "POST", url});
                if(verifCaptcha.data.success === true){
                    if (bcrypt.compareSync(this.req.body.password, getOne.password)) {
                        let expiresIn = 18000,
                            info = {
                                id: getOne.id,
                                fullname: getOne.fullname,
                                img: getOne.img,
                                email: getOne.email,
                                register_method: getOne.register_method,
                                address: JSON.parse(getOne.address),
                                createdAt: getOne.updatedAt
                            }
                        const token = jwt.sign(
                            info,
                            process.env.TOKEN_KEY,
                            {expiresIn}
                        );
                        info['token'] = token
                        this.res.json(info);
                    }else {
                        this.res.json({message:"Incorrect username or password."});
                    } 
                }else{
                    return this.res.json({message:"Incorrect captcha."});
                }               
            }
        } catch (err) {
            console.log(err);
        }
    }

    async userInfo(){
        try {
            const getOne = await this.login_model.getOnePersonByEmail(this.req.body);
            if (getOne == null) return this.res.json({message:"Incorrect username or password."});
            let info = {
                id: getOne.id,
                fullname: getOne.fullname,
                img: getOne.img,
                email: getOne.email,
                register_method: getOne.register_method,
                address: JSON.parse(getOne.address),
                createdAt: getOne.updatedAt
            };
            this.res.json(info);
        } catch (error) {
            console.log(error);
        }
    }
    
    async discountCode(){
        try {
            if(this.req.query.code){
                let getAllDiscountCode = await this.login_model.getAllDiscountCode();
                for (let i = 0; i < getAllDiscountCode.length; i++) {
                    if(getAllDiscountCode[i].code === this.req.query.code){
                        return this.res.json({code:getAllDiscountCode[i].code, price:getAllDiscountCode[i].price, message:"Valid"});
                    }
                }
                return this.res.json({code:this.req.query.code, price:0, message:"Invalid"});   
            }else if(!this.req.query.code && !this.req.params.id){
                return this.res.json(await this.login_model.getAllDiscountCode());
            }else if(this.req.params.id){
                return this.res.json(await this.login_model.getDiscountCodeById(this.req.params.id));
            }
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Internal Server Error'});
        }
    }

    async addDiscountCode(){
        try {
            await this.login_model.addDiscountCode(this.req.body)
            return this.res.json({status: 'Success', message: 'Insert discount code successfull!', class: 'alert alert-success alert-dismissible fade show'});
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Insert discount code failed!.', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }
    
    async updateDiscountCode(){
        try {
            await this.login_model.updateDiscountCode(this.req.params.id, this.req.body)
            return this.res.json({status: 'Success', message: 'Update discount code successfull!', class: 'alert alert-success alert-dismissible fade show'});
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Update discount code failed!.', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }
    
    async delDiscountCode(){
        try {
            await this.login_model.delDiscountCode(this.req.params.id)
            return this.res.json({status: 'Success', message: 'Delete discount code successfull!', class: 'alert alert-success alert-dismissible fade show'});
        } catch (err) {
            console.log('err', err);
            return this.res.json({status: 'Failed', message: 'Delete discount code failed!.', class: 'alert alert-danger alert-dismissible fade show'});
        }
    }
}

module.exports = Login;