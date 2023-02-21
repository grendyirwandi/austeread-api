'use strict';
const cartModel = require('../models/Cart_model');

class Cart {
    async get(idPerson, is_workshop=false) {
        if (is_workshop) {
            return await cartModel.getCartWorkshop(idPerson);
        } else {
            return await cartModel.getCartPerson(idPerson);
        }
    }

    async post(idPerson, product, is_workshop=false) {
        if (is_workshop) {
            return await cartModel.upsertCartWorkshop(idPerson, product);
        } else {
            return await cartModel.upsertCartPerson(idPerson, product);
        }
    }

    async put(idPerson, productId, productChoice, isAddStock, is_workshop=false) {
        return await cartModel.updateStockProductCartPerson(idPerson, productId+'-'+productChoice, isAddStock);
    }

    async patchQtyWorkshop(idPerson, productId, qty) {
        return await cartModel.updateQtyCartWorkshop(idPerson, productId, qty);
    }

    async deleteProductFromCartWorkshop(idPerson, id_product) {
        return await cartModel.deleteCartWorkshop(idPerson, id_product);
    }

    async delete(idPerson, productId = null, is_workshop=false) {
        return await cartModel.clearChartPerson(idPerson, productId);
    }
}

module.exports = new Cart();