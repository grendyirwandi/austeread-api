"use strict";
const tables = require("./tables");
const db = require("./tables/index");
const { QueryTypes, json } = require("sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const moment = require("moment");
let salt = bcrypt.genSaltSync(10);


class Users_model {
  async updateLastSendEmail(idPersons){
    const query = {
      lastSendNews : new Date()
    }

    return await tables["tbl_person"].update(query, { where: { id: idPersons } });
  }
  
  async getUserWithSubNews(){
    const date = moment().format('YYYY-MM-DD');

    const query = {
      attributes : [
        "id",
        "email",
        "subNews"
      ],
      where : {
        [Op.or] : [
          {
            lastSendNews : {
              [Op.notBetween]: [moment(date +" 00:00:00").toISOString(),moment(date +" 23:59:59").toISOString()]
            }
          },
          {
            lastSendNews : null
          }
        ],
        subNews: {
          [Op.not] : '[]'
        }
      }
    }

    return await tables["tbl_person"].findAll(query);
  }

  async getNewsForEmail(){
    const category = await tables["tbl_news_category"].findAll();
    const date = moment().format('YYYY-MM-DD');

    let data = [];
    for (const key in category) {
      const temp = await this.getAllNewsByCategory({
        category: category[key].name,
        page: 1,
        limit: 3,
        date: date
      })
      
      if (temp.result.length === 3) data = data.concat(temp.result)
    }

    return data;
  }

  async updateLike(isLike, idNews, idPersons) {
    const queryLike = {
      attributes:[
        "like"
      ],
      where: { 
        id: idNews.toString() 
      }
    } 
    const getLike = await tables["tbl_news"].findOne(queryLike);
    console.log(getLike.like)
    
    if (getLike.like === 0 && isLike === 0) return false;

    let query = {};
    if (isLike == 1) {
      query = {
        like: Sequelize.literal('`like` + 1'),
      };
    } else {
      query = {
        like: Sequelize.literal('`like` - 1'),
      };
    }

    await this.upsert({idNews, idPersons, isLike}, {idNews, idPersons});

    return await tables["tbl_news"].update(query, { where: { id: idNews.toString() } });
  }

  async upsert(values, condition) {
    return await tables["tbl_news_like_by_person"]
        .findOne({ where: condition })
        .then(async function(obj) {
            // update
            if(obj)
                return obj.update(values);
            // insert
            return await tables["tbl_news_like_by_person"].create(values);
        })
  }

  async getLikeNewsByPerson(idNews, idPersons) {
    let query = {
      attributes: [
        "isLike"
      ],
      where: { idNews, idPersons }
    }
    return await tables["tbl_news_like_by_person"].findOne(query);
  }
  
  async getSubNewsPerson(id) {
    let query = {
      attributes: [
        "subNews"
      ],
      where: { id: id }
    }
    return await tables["tbl_person"].findOne(query);
  }

  async getEmailByIdPerson(id) {
    let query = {
      attributes: [
        "email"
      ],
      where: { id: id }
    }
    return await tables["tbl_person"].findOne(query);
  }

  async updateSubNewsPerson(subNews, id) {
    let query = {
      subNews: JSON.stringify(subNews),
    };

    return await tables["tbl_person"].update(query, { where: { id } });
  }

  async getAllUsers() {
    let query = {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ],
      where: {
        role: {
          [Sequelize.Op.not]: "Administrator",
        },
      },
    };

    return await tables["tbl_users"].findAll(query);
  }

  async getTotalUsers() {
    let query = {
      where: {
        role: {
          [Sequelize.Op.not]: "Administrator",
        },
      },
    };

    return await tables["tbl_users"].count(query);
  }

  async getTotalNews() {
    return await tables["tbl_news"].count();
  }
  async getTotalQuestions() {
    return await tables["tbl_contact_us"].count();
  }

  async insertUsers(body) {
    let hash = bcrypt.hashSync(body.password, salt);

    let query = {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      role: body.role,
      password: hash,
    };

    return await tables["tbl_users"].create(query);
  }

  async updateUsers(body, id) {
    let query = {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      role: body.role,
    };

    return await tables["tbl_users"].update(query, { where: { id } });
  }

  async cpUsers(body, id) {
    let hash = bcrypt.hashSync(body.password, salt);

    let query = {
      password: hash,
    };

    return await tables["tbl_users"].update(query, { where: { id } });
  }

  async delUsers(id) {
    return await tables["tbl_users"].destroy({
      where: { id },
    });
  }

  ///////////////////////////////////////////////////////////////////////////////

  async getAllNews() {
    const category = await tables["tbl_news_category"].findAll();

    let data = [];
    for (const key in category) {
      
      let qry =
        "SELECT " +
        "`tbl_news`.`id`," +
        "`tbl_news`.`title`," +
        "`tbl_news`.`desc`," +
        "`tbl_news`.`img`," +
        "`tbl_news`.`thumbnail`," +
        "`tbl_news`.`category`," +
        "`tbl_news`.`creator`," +
        "`tbl_news`.`createdAt`," +
        "`tbl_news`.`updatedAt`," +
        "`tbl_user`.`id` AS `tbl_user_id`," +
        "`tbl_user`.`first_name` AS `tbl_user_first_name`," +
        "`tbl_user`.`last_name` AS `tbl_user_last_name`," +
        "`tbl_user`.`createdAt` AS `tbl_user_createdAt`," +
        "`tbl_news_category`.`id` AS `tbl_news_category_id`," +
        "`tbl_news_category`.`name` AS `tbl_news_category_name`," +
        "`tbl_news_category`.`createdAt` AS `tbl_news_category_createdAt` " +
        "FROM " +
        "`tbl_news` AS `tbl_news` " +
        "INNER JOIN `tbl_users` AS `tbl_user` ON " +
        "`tbl_news`.`creator` = `tbl_user`.`id` " +
        "INNER JOIN `tbl_news_category` AS `tbl_news_category` ON " +
        "`tbl_news`.`category` = `tbl_news_category`.`id` " +
        "WHERE `tbl_news`.`category` =  "+ category[key].id +
        " ORDER BY `tbl_news`.`createdAt` DESC LIMIT 6";
        
      let tempResult = await db.sequelize.query(qry, { type: QueryTypes.SELECT });

      data = data.concat(tempResult);
    }
    

    data.forEach((e) => {
      e.createdAt = moment(e.createdAt).utc().format("Do MMMM, YYYY");
    });
    return data;
  }

  async getAllNewsAdmin() {
    let query = {
      attributes: [
        "id",
        "title",
        "desc",
        "img",
        "thumbnail",
        "category",
        "creator",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          attributes: ["first_name", "last_name", "createdAt"],
          model: tables["tbl_users"],
          required: true,
        },
        {
          attributes: ["name", "createdAt"],
          model: tables["tbl_news_category"],
          required: true,
        },
      ],
    };
    let data = await tables["tbl_news"].findAll(query),
      result = JSON.parse(JSON.stringify(data));
    result.forEach((e) => {
      e.createdAt = moment(e.createdAt).utc().format("Do MMMM, YYYY");
    });
    return result;
  }

  async getNewsById(id) {
    let query = {
      attributes: [
        "id",
        "title",
        "desc",
        "img",
        "thumbnail",
        "category",
        "creator",
        "like",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          attributes: ["first_name", "last_name", "createdAt"],
          model: tables["tbl_users"],
          required: true,
        },
        {
          attributes: ["name", "createdAt"],
          model: tables["tbl_news_category"],
          required: true,
        },
      ],
      where: { id },
    };
    let data = await tables["tbl_news"].findOne(query),
      result = JSON.parse(JSON.stringify(data));

    result.createdAt = moment(result["createdAt"])
      .utc()
      .format("Do MMMM, YYYY");
    return result;
  }

  async getAllNewsByCategory(dataFilter) {
    const category = (dataFilter.category === "all") ? "" : dataFilter.category;

    let query = {
      attributes: [
        "id",
        "title",
        "desc",
        "img",
        "thumbnail",
        "category",
        "creator",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
      offset: ( dataFilter.page - 1 ) * dataFilter.limit,
      limit: dataFilter.limit,
      include: [
        {
          attributes: ["name", "createdAt"],
          model: tables["tbl_news_category"],
          required: true,
          where: { 
            name: {
              [Op.substring]: category
            } 
          },
        },
      ],
    };
    let conditionsSearch = {};
    let conditionsDate = {}
    if(dataFilter.search){
      conditionsSearch = {
        [Op.or] : [
          {
            title: {
              [Op.substring]: dataFilter.search,
            },
          },
          {
            desc: {
              [Op.substring]: dataFilter.search,
            },
          },
        ]
      }
    }

    if(dataFilter.date){
      conditionsDate = {
        createdAt : {
          [Op.between]: [moment(dataFilter.date +" 00:00:00").toISOString(),moment(dataFilter.date +" 23:59:59").toISOString()]
        }
      }
    }

    query['where'] = Object.assign({}, conditionsSearch, conditionsDate)
    
    let length = await tables["tbl_news"].count(query)
    let data = await tables["tbl_news"].findAll(query)
    let result = JSON.parse(JSON.stringify(data));

    result.forEach((e) => {
      e.createdAt = moment(e.createdAt).format("Do MMMM, YYYY");
    });

    return {
      category_name:dataFilter.category, 
      page: {
        first_page : 1,
        last_page : Math.ceil( length/dataFilter.limit ),
        previous_page : dataFilter.page - 1,
        current_page : dataFilter.page,
        next_page : dataFilter.page + 1
      },
      result
    };
  }

  async insertNews(body) {
    let query = {
      id: Date.now(),
      title: body.title,
      category: body.category,
      desc: body.desc,
      img: body.img,
      thumbnail: body.thumbnail,
      creator: body.creator,
    };

    return await tables["tbl_news"].create(query);
  }

  async updateNews(body, id) {
    return await tables["tbl_news"].update(body, { where: { id } });
  }

  async delNews(id) {
    return await tables["tbl_news"].destroy({
      where: { id },
    });
  }

  async latestNews() {
    let query = {
      attributes: ["id", "title", "createdAt"],
      include: [
        {
          attributes: ["name"],
          model: tables["tbl_news_category"],
          required: true,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 6,
    };
    let data = await tables["tbl_news"].findAll(query),
      result = JSON.parse(JSON.stringify(data));
    result.forEach((e) => {
      e.createdAt = moment(e.createdAt).utc().format("Do MMMM, YYYY");
    });
    return result;
  }

  async getSearchNews(search) {
    let query = {
      include: [
        {
          attributes: ["name"],
          model: tables["tbl_news_category"],
          required: true,
        },
      ],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: search,
            },
          },
          {
            desc: {
              [Op.substring]: search,
            },
          },
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: 6,
    };
    let data = await tables["tbl_news"].findAll(query),
      result = JSON.parse(JSON.stringify(data));
    result.forEach((e) => {
      e.createdAt = moment(e.createdAt).utc().format("Do MMMM, YYYY");
    });
    return result;
  }

  ///////////////////////////////////////////////////////////////////////////////

  async getAllNewsCategory() {
    let query = {
      attributes: ["id", "name", "creator", "createdAt", "updatedAt"],
      include: [
        {
          attributes: ["first_name", "last_name", "createdAt"],
          model: tables["tbl_users"],
          required: true,
        },
      ],
    };

    return await tables["tbl_news_category"].findAll(query);
  }

  async insertNewsCategory(body) {
    return await tables["tbl_news_category"].create(body);
  }

  async updateNewsCategory(name, id) {
    let query = {
      name,
    };

    return await tables["tbl_news_category"].update(query, { where: { id } });
  }

  async delNewsCategory(id) {
    return await tables["tbl_news_category"].destroy({
      where: { id },
    });
  }

  async getConfig() {
    let query = {
      attributes: ["kunci", "value"],
    };

    return await tables["tbl_config"].findAll(query);
  }

  async updateConfig(body) {
    let query = {
      email: body.email,
      whatsapp: body.whatsapp,
      instagram: body.instagram,
      twitter: body.twitter,
      about: body.about,
      advertising_opportunities: body.advertising_opportunities,
      origin_rajaongkir: body.origin_rajaongkir,
    };
    Object.entries(query).forEach(async (q) => {
      await tables["tbl_config"].update(
        { value: q[1] },
        { where: { kunci: q[0] } }
      );
    });
    return true;
    // return await tables["tbl_news_category"].update(query, { where: {id} });
  }
  
  async getShopFooter(id = null){
    if (id == null) {
      return await tables["tbl_shop_footer"].findAll();
    }else{
      return await tables["tbl_shop_footer"].findOne({where: { id }});
    }
  }

  async addShopFooter(body){
    return await tables["tbl_shop_footer"].create(body)
  }
  
  async updateShopFooter(body, id){
    return await tables["tbl_shop_footer"].update(body, { where: { id } });
  }

  async delShopFooter(id){
    return await tables["tbl_shop_footer"].destroy({
      where: { id },
    });
  }

  async getAllQuestion() {
    let query = {
      attributes: ["id", "name", "address", "phone", "questions", "createdAt"],
    };

    let data = await tables["tbl_contact_us"].findAll(query),
      result = JSON.parse(JSON.stringify(data));
    result.forEach((e) => {
      e.createdAt = moment(e.createdAt).utc().format("Do MMMM, YYYY");
    });
    return result;
  }

  async insertContantUs(body) {
    let query = {
      id: Date.now(),
      name: body.name,
      address: body.address,
      phone: body.phone,
      questions: body.questions,
    };
    let data = await tables["tbl_contact_us"].create(query);
  }

  async getAllProductsCategory(){
    const query = {
      raw:true,
      attributes: [
        "id",
        "name"
      ],
      include: [
        {
          model: tables["tbl_product_subcategory"],
          required: true,
          as:'tps',
          attributes: [],
        },
      ],
      where:{
        name :{
          [Op.notLike] : 'Workshop'
        }
      }
    }
    return await tables["tbl_product_category"].findAll(query)
  }

  async insertProductsCategory(body){
    let query = {
      id: Date.now(),
      name: body.name
    };
    let data = await tables["tbl_product_category"].create(query);
  }

  async updateProductsCategory(name, id) {
    let query = {
      name,
    };
    return await tables["tbl_product_category"].update(query, { where: { id } });
  }

  async delProductsCategory(id) {
    return await tables["tbl_product_category"].destroy({
      where: { id },
    });
  }

  async getAllProductsSubcategory(){
    const query = {
      raw:true,
      attributes: [
        ["id", "category_id"],
        ["name", "category_name"],
        [Sequelize.col('tps.name'), 'name'],
        [Sequelize.col('tps.id'), 'id']
      ],
      include: [
        {
          model: tables["tbl_product_subcategory"],
          required: true,
          as:'tps',
          attributes: [],
        },
      ],
      where:{
        name :{
          [Op.notLike] : 'Workshop'
        }
      }
    }
    return await tables["tbl_product_category"].findAll(query)
  }
  async insertProductsSubcategory(body){
    let query = {
      id: Date.now(),
      category_id: body.category_id,
      name: body.name
    };
    let data = await tables["tbl_product_subcategory"].create(query);
  }

  async updateProductsSubcategory(name, id) {
    let query = {
      name,
    };
    return await tables["tbl_product_subcategory"].update(query, { where: { id } });
  }

  async delProductsSubcategory(id) {
    return await tables["tbl_product_subcategory"].destroy({
      where: { id },
    });
  }

  async getProduct(id=null, limit=null, subcat=null){
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
        },
      ],
      attributes: ["id","name","img","subcategory_id","choice","desc","detail","creator",
        [Sequelize.fn('date_format', Sequelize.col('tbl_products.createdAt'), '%Y-%m-%d'), 'createdAt']
      ],
      order: [["createdAt", "DESC"]],
      
      // raw: true
    }
    if (id) {
      query.where = { id }
      return await tables["tbl_products"].findOne(query)
    }else{
      if(limit){query.limit = limit}
      if(subcat){query.include[1].where = {name:subcat}}
      return await tables["tbl_products"].findAll(query)
    }
  }

}

module.exports = Users_model;
