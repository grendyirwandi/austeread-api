"use strict";
const tables = require("./tables");
const {
    QueryTypes
} = require("sequelize");

class Products_model {
    queryGetProduct() {
        return {
            attributes: [
                "id",
                "name",
                "img",
                "subcategory_id",
                "choice",
                "workshop_detail",
                "desc",
                "detail",
                "size_chart",
                "creator",
                [tables.Sequelize.fn('date_format', tables.Sequelize.col('tbl_products.createdAt'), '%Y-%m-%d'), 'createdAt']
            ],
            include: [{
                    attributes: ["first_name", "last_name"],
                    model: tables["tbl_users"],
                    required: true,
                },
                {
                    attributes: ["category_id", "name"],
                    model: tables["tbl_product_subcategory"],
                    required: false,
                },
            ],
            order: [
                ["createdAt", "DESC"]
            ]
        }
    }

    async getProductById(id) {
        let query = this.queryGetProduct();

        query.where = {
            id
        }

        return await tables["tbl_products"].findOne(query);
    }

    async getProduct(search = "", subcat = "", page = 1, limit = 6, isPopular = false, isWorkshop = false) {
        let query = this.queryGetProduct();

        if (search != "" || isWorkshop === true)
            query.where = {
                name: {
                    [tables.Sequelize.Op.substring]: search,
                },
                product_type_id: 2
            }

        if (subcat != "") {
            query.include[1].where = {
                name: subcat
            }
        }

        const count = await tables["tbl_products"].count(query);

        const popular = isPopular == false ? "`tbl_products`.`createdAt` " : "total_pembelian ";
        const limitProduct = (page != 0 && limit != 0) ? "LIMIT " + (page - 1) * limit + ", " + limit : ";";

        query = "SELECT " +
            "`tbl_products`.`id`, " +
            "`tbl_products`.`name`, " +
            "`tbl_products`.`img`, " +
            "`tbl_products`.`subcategory_id`, " +
            "`tbl_products`.`choice`, " +
            "`tbl_products`.`workshop_detail`, " +
            "`tbl_products`.`desc`, " +
            "`tbl_products`.`detail`, " +
            "`tbl_products`.`creator`, " +
            "DATE_FORMAT(`tbl_products`.`createdAt`, + '%Y-%m-%d') AS `createdAt`, " +
            "`tbl_user`.`id` AS `tbl_user.id`, " +
            "`tbl_user`.`first_name` AS `tbl_user.first_name`, " +
            "`tbl_user`.`last_name` AS `tbl_user.last_name`, " +
            "`tbl_product_subcategory`.`id` AS `tbl_product_subcategory.id`, " +
            "`tbl_product_subcategory`.`category_id` AS `tbl_product_subcategory.category_id`, " +
            "`tbl_product_subcategory`.`name` AS `tbl_product_subcategory.name`, " +
            "COUNT(`tO`.`id`) AS total_pembelian " +
            "FROM " +
            "`tbl_products` AS `tbl_products` " +
            "INNER JOIN " +
            "`tbl_users` AS `tbl_user` ON `tbl_products`.`creator` = `tbl_user`.`id` " +
            "INNER JOIN " +
            "`tbl_product_subcategory` AS `tbl_product_subcategory` ON `tbl_products`.`subcategory_id` = `tbl_product_subcategory`.`id` AND `tbl_product_subcategory`.`name` LIKE '%" + subcat + "%' " +
            "LEFT JOIN " +
            "`tbl_orders` `tO` ON `tO`.`order` LIKE CONCAT('%', `tbl_products`.`id`, '%') AND `tO`.`status` = 'ON PACKED' " +
            "WHERE " +
            "`tbl_products`.`name` LIKE '%" + search + "%' ";

        query += (isWorkshop === true) ? "AND `tbl_products`.`product_type_id` = 2 " : ""
        query += "GROUP BY " +
            "`tbl_products`.`id` " +
            "ORDER BY " +
            popular +
            "DESC " + limitProduct;

        let rows = await tables.sequelize.query(query, {
            nest: true,
            type: QueryTypes.SELECT
        });
        
        rows.forEach(function(item) {
            item.img = JSON.parse(item.img);
            item.choice = JSON.parse(item.choice);
            item.workshop_detail = JSON.parse(item.workshop_detail);
        });
        
        let pages = null
        if (count != 0 && (page != 0 && limit != 0)) {
            const last_page = Math.ceil(count / limit)
            pages = {
                first_page: 1,
                last_page,
                previous_page: page - 1 < 1 ? 1 : page - 1,
                current_page: page,
                next_page: page + 1 > last_page ? last_page : page + 1
            }
        }

        let response = {
            count,
            rows,
            pages
        }

        return response;
    }

    async getProductForShop(){
        let allCategory = await tables["tbl_product_category"].findAll({raw:true})    
        for (let i = 0; i < allCategory.length; i++) {
          let query = {
            include: [
              {
                attributes: ["first_name", "last_name"],
                model: tables["tbl_users"],
                required: true,
              },
              {
                attributes: ["category_id","name"],
                model: tables["tbl_product_subcategory"],
                required: true,
                where: {category_id: allCategory[i].id}
              }
            ],
            attributes: ["id","name","img","subcategory_id","choice","desc","detail","creator",
              [Sequelize.fn('date_format', Sequelize.col('tbl_products.createdAt'), '%Y-%m-%d'), 'createdAt']
            ],
            limit: 3,
            // raw: true
          }
          let products = await tables["tbl_products"].findAll(query)
          for (let i = 0; i < products.length; i++) {
            products[i].choice = JSON.parse(products[i].choice)
            products[i].img = JSON.parse(products[i].img)
          }
          allCategory[i].products = products
        }
        return allCategory
      }

      
    async insertProducts(body){
        let query = {
            id: Date.now(),
            product_type_id: body.product_type_id,
            name: body.name,
            img: JSON.stringify(body.img),
            subcategory_id: body.subcategory_id,
            desc: body.desc,
            detail: body.detail,
            choice: JSON.stringify(body.choice),
            workshop_detail: JSON.stringify(body.workshop_detail),
            size_chart: body.size_chart,
            creator: body.creator,
        };
        
        return await tables["tbl_products"].create(query);
    }

    async updateProducts(body, id){
        return await tables["tbl_products"].update(body, { where: { id } });
    }

    async delProducts(id){
        return await tables["tbl_products"].destroy({
        where: { id },
        });
    }
}

module.exports = new Products_model();