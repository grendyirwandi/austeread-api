'use strict';
const tables = require("./tables");
const moment = require("moment");

class News_model {
    async getHighlight() {
        const query = {
            attributes: [
                "id",
                "word_query"
            ]
        }

        const result = await tables['tbl_news_highlight'].findAll(query);
        return result;
    }

    async getAllNewsByCategory(categoryNews = null, search = null, date = null, page = 1, limit = 6) {
        let conditionsSearch = {};
        let conditionsDate = {};

        const category = (categoryNews === "all" || categoryNews === null) ? "" : categoryNews;

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
            order: [
                ["createdAt", "DESC"]
            ],
            offset: (page - 1) * limit,
            limit: limit,
            include: [{
                attributes: ["name", "createdAt"],
                model: tables["tbl_news_category"],
                required: true,
                where: {
                    name: {
                        [tables.Sequelize.Op.substring]: category
                    }
                },
            }, ],
        };

        if (search) {
            conditionsSearch = {
                [tables.Sequelize.Op.or]: [{
                        title: {
                            [tables.Sequelize.Op.substring]: search,
                        },
                    },
                    {
                        desc: {
                            [tables.Sequelize.Op.substring]: search,
                        },
                    },
                ]
            }
        }

        if (date) {
            conditionsDate = {
                createdAt: {
                    [tables.Sequelize.Op.between]: [moment(date + " 00:00:00").toISOString(), moment(date + " 23:59:59").toISOString()]
                }
            }
        }

        query['where'] = Object.assign({}, conditionsSearch, conditionsDate)

        let data = await tables["tbl_news"].findAndCountAll(query);
        let result = JSON.parse(JSON.stringify(data));

        result.rows.forEach((e) => {
            e.createdAt = moment(e.createdAt).format("Do MMMM, YYYY");
        });

        const last_page = Math.ceil(result.count / limit);

        return {
            category_name: categoryNews,
            page: {
                first_page: 1,
                last_page,
                previous_page: page - 1 < 1 ? 1 : page - 1,
                current_page: page,
                next_page: page + 1 > last_page ? last_page : page + 1
            },
            result: result.rows
        };
    }

    async getHighlightForNews() {
        const tempDataNews = [];
        const highlight = await this.getHighlight();

        for (const key in highlight) {
            const kataPencarian = highlight[key].word_query;
            const temp = await this.getAllNewsByCategory(undefined, kataPencarian, undefined, undefined, 1);
            tempDataNews.push(temp.result[0]);
        }

        return tempDataNews;
    }

    async updateWordQueryHighlight(id, word_query) {
        const query = {
            word_query
        }

        const condition = {
            where: {
                id
            }
        }

        const result = await tables['tbl_news_highlight'].update(query, condition);
        return result;
    }
}

module.exports = new News_model();