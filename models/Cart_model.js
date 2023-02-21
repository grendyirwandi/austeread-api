'use strict';
const tables = require('./tables');
const Sequelize = require("sequelize");
const generateId = require('../common/helper/generator_id');

class Cart_model {
    async upsert(values, condition) {
        return await tables["tbl_cart"]
            .findOne({ where: condition })
            .then(async function(obj) {
                // update
                if(obj)
                    return obj.update(values);

                // insert
                return await tables["tbl_cart"].create(values);
            });
    }

    async getCartPerson(idPerson) {
        const query = {
            attributes : [
                "list_product"
            ],
            where: {
                id_person : idPerson.toString()
            }
        }

        return await tables["tbl_cart"].findOne(query);
    }

    async upsertCartPerson(idPerson, products) {
        let tempProduct = {};
        tempProduct[products.productId+'-'+products.productChoice] = products;

        const values = {
            id_person : idPerson,
            list_product : tempProduct 
        }; 

        const condition = {
            id_person : idPerson
        };

        const callBack = this.updateStockProductCartPerson
        return await tables["tbl_cart"]
            .findOne({ where: condition })
            .then(async function(obj) {
                // update
                if(obj) {
                    if (obj.dataValues.list_product != null) {
                        const listProduct = JSON.parse(obj.dataValues.list_product);

                        if (listProduct[products.productId+'-'+products.productChoice] != undefined) {
                            return await callBack(idPerson, products.productId+'-'+products.productChoice, true, products.productQty);
                        } else {
                            const set = {
                                list_product : tables.Sequelize.literal(
                                    "JSON_MERGE(`list_product`, '"+ JSON.stringify(tempProduct) +"') "
                                )
                            }
    
                            return await obj.update(set);
                        }
                    } else {
                        return await obj.update(values);
                    }
                }

                // insert
                return await tables["tbl_cart"].create(values);
            });
    }

    async updateStockProductCartPerson(idPerson, productId, isAddStock, totalStockProduct = null) {
        const stock = isAddStock == true ? (totalStockProduct == null ? '+ 1 ' : '+ '+totalStockProduct + ' ') : '- 1 ';
        
        try {            
            const set = {
                list_product : tables.Sequelize.literal(
                    'IF('+
                        'JSON_EXTRACT(`list_product`, "$.'+ productId +'.productQty") = 1 AND "- 1 "="'+stock+'", ' +
                        'JSON_REMOVE(`list_product`, "$.'+ productId +'"), ' +
                        'JSON_SET(' +
                            '`list_product`, "$.'+ productId +'.productQty", ' +
                            'JSON_EXTRACT(`list_product`, "$.'+ productId +'.productQty") '+ stock  +
                        ')' +
                    ')'
                )
            }

            return await tables["tbl_cart"].update(set,  { where: { id_person: idPerson } });
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async clearChartPerson(idPerson, productId = null) {
        let set = {};

        if (productId)
            set = {
                list_product : tables.Sequelize.literal(
                    'JSON_REMOVE(' +
                        '`list_product`, "$.'+ productId +'"'+
                    ')'
                )
            }
        else 
            set = {
                list_product : null
            }

        return await tables["tbl_cart"].update(set,  { where: { id_person:idPerson } })
    }

    async getCartWorkshop(idPerson) {
        const query = {
            attributes : [
                ["id", "id_cart"],
                ["qty", "qty"],
                [Sequelize.col('tp.id'), 'productId'],
                [Sequelize.col('tp.name'), 'name'],
                [Sequelize.col('tp.img'), 'img'],
                [Sequelize.col('tp.workshop_detail'), 'workshop_detail']
            ],
            include: [
                {
                  model: tables["tbl_products"],
                  required: true,
                  as:'tp',
                  attributes: [],
                },
            ],
            where: {
                id_person : idPerson
            },
            raw: true,
            nest: true,
        }

        const cartWorkshop = await tables["tbl_cart_workshop"].findAll(query);

        cartWorkshop.forEach(function(item) {
            item.img = JSON.parse(item.img);
            item.workshop_detail = JSON.parse(item.workshop_detail);
        });

        return cartWorkshop;
    }

    async upsertCartWorkshop(idPerson, products) {
        const id_cart = (await generateId.generate(13))['message'];
        
        const values = {
            id : id_cart+Date.now().toString(),
            id_person: idPerson,
            id_product: products['productId'],
            qty : products['qty'] 
        };
        
        const condition = {
            id_person : idPerson,
            id_product: products['productId']
        };

        return await tables["tbl_cart_workshop"]
            .findOne({ where: condition })
            .then(async function(obj) {
                // update
                if(obj) {
                    return await tables["tbl_cart_workshop"].increment('qty', { by: products['qty'], where: condition });
                } else {
                    // insert
                    return await tables["tbl_cart_workshop"].create(values);
                }
            });
    }

    async updateQtyCartWorkshop(idPerson, productId, qty) {
        const condition = {
            id_person : idPerson,
            id_product: productId
        };

        return await tables["tbl_cart_workshop"].update({qty: qty}, { where: condition });
    }

    async deleteCartWorkshop(idPerson, id_product) {
        const condition = {
            id_person : idPerson,
            id_product: id_product
        };

        return await tables["tbl_cart_workshop"].destroy({ where: condition })
    }
}

module.exports = new Cart_model;