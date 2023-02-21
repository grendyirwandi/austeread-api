'use strict';
const Controller = require('../core/Controller'),
    axios = require('axios');

class Home extends Controller {
    constructor(req, res) {
        super(res);
        this.req = req;
        this.users_model = this._model('Users_model');
    }

    async courier(){
        return this.res.json([
            // {text:"POS Indonesia",value:"pos"}, 
            // {text:"Wahana Prestasi Logistik",value:"wahana"}, 
            {text:"J&T Express ",value:"jnt"}, 
            // {text:"SAP Express",value:"sap"}, 
            {text:"SiCepat Express",value:"sicepat"}, 
            // {text:"JET Express",value:"jet"}, 
            // {text:"21 Express",value:"dse"}, 
            // {text:"First Logistics",value:"first"}, 
            // {text:"Ninja Xpress",value:"ninja"}, 
            // {text:"Lion Parcel",value:"lion"}, 
            // {text:"IDL Cargo",value:"idl"}, 
            // {text:"Royal Express Indonesia",value:"rex"}, 
            // {text:"ID Express",value:"ide"}, 
            // {text:"Sentral Cargo",value:"sentral"}, 
            // {text:"AnterAja",value:"anteraja"}
        ])
    }
    async province(){
        let a = await this.fetchAxios(process.env.RAJAONGKIR_URL+'province', 'GET')
        return this.res.json(a.rajaongkir.results)
    }
    async city(){
        let a = await this.fetchAxios(process.env.RAJAONGKIR_URL+'city', 'GET', this.req.query)
        return this.res.json(a.rajaongkir.results)
    }
    async subdistrict(){
        let a = await this.fetchAxios(process.env.RAJAONGKIR_URL+'subdistrict', 'GET', this.req.query)
        return this.res.json(a.rajaongkir.results)
    }
    async cost(){
        let a = await this.fetchAxios(process.env.RAJAONGKIR_URL+'cost', 'POST', this.req.body)
        return this.res.json(a)
    }
    async waybill(){
        let a = await this.fetchAxios(process.env.RAJAONGKIR_URL+'waybill', 'POST', this.req.body)
        return this.res.json(a)
    }

    ////////////////////////////////////////////////////////////////////////////////////

    async fetchAxios(url, method, body=null){
        let options = {
            method,
            url,
            headers:{"key":process.env.RAJAONGKIR_KEY},
        };
        if (method == "GET") {
            options.params = body
        }else{
            options.data = body
        }

        try {
            const data = await axios.request(options)
            // console.log(JSON.stringify(data.data));
            return data.data
        } catch (error) {
            console.error(error);
        }
    }

}

module.exports = Home;