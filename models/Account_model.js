'use strict';
const tables = require('./tables');

class Account_model {
    async getAccount(params) {
            let query = {
                attributes: [
                    'id_account',
                    'id_bank',
                    'name_account',
                    'no_rekening',
                    'flag'
                ],
                // where : {
                //     username : params.login.username
                // },
                include : [{
                    attributes: ['info_bank'],
                    model: tables["tbl_bank"],
                    required: true,
                }]
            }

            return await tables["tbl_accounts"].findAll(query);
    }
    async getMutatiion(id_account, id_bank) {
            let tbl
            if (id_bank == '5'){tbl = 'bca'}
            else if (id_bank == '3'){tbl = 'bni'}
            else if (id_bank == '2'){tbl = 'mandiri'}
            let query = {
                attributes: [
                    'id_account',
                ],
                where : {
                    id_account : id_account
                },
                include : [{
                    // attributes: ['info_bank'],
                    model: tables[`tbl_mutasi_${tbl}`],
                    required: true,
                }]
            }

            return await tables["tbl_accounts"].findAll(query);
    }
}

module.exports = Account_model;