"use strict";
const tables = require("./tables");
const moment = require("moment");

class Comments_model {
  async getComment(id_news) {
    let query = {
      attributes: [
        "id",
        "id_person",
        "id_news",
        "comment",
        "listIdReplyComment",
        "listIdLikes",
        "createdAt"
      ],
      include: [{
        attributes: ["fullname", "img"],
        model: tables["tbl_person"],
        required: true,
      }, ],
      where: {
        id_news,
        id_parrent_comment: null
      },
      order: [
        ["createdAt", "DESC"]
      ],
    };

    let data = await tables["tbl_comments"].findAll(query),
      result = JSON.parse(JSON.stringify(data));

    for (const key in result) {
      const x = new moment();
      const y = new moment(result[key].createdAt);
      const duration = moment.duration(y.diff(x));
      result[key].createdAt = duration.humanize(true);
    }

    return result;
  }

  async getReplyComment(id_parrent_comment, page = 1, limit = 6) {
    let query = {
      attributes: [
        "id",
        "id_person",
        "id_news",
        "comment",
        "listIdLikes",
        "createdAt"
      ],
      include: [{
        attributes: ["fullname", "img"],
        model: tables["tbl_person"],
        required: true,
      }, ],
      where: {
        id_parrent_comment
      },
      order: [
        ["createdAt", "DESC"]
      ],
      offset: (page - 1) * limit,
      limit: limit,
    };

    let data = await tables["tbl_comments"].findAndCountAll(query),
      result = JSON.parse(JSON.stringify(data));

    if (result.count != 0) {
      const last_page = Math.ceil(result.count / limit)

      for (const key in result.rows) {
        const x = new moment();
        const y = new moment(result.rows[key].createdAt);
        const duration = moment.duration(y.diff(x));
        result.rows[key].createdAt = duration.humanize(true);
      }

      result["pages"] = {
        first_page: 1,
        last_page,
        previous_page: page - 1 < 1 ? 1 : page - 1,
        current_page: page,
        next_page: page + 1 > last_page ? last_page : page + 1
      }
    }

    return result;
  }

  async insertComment(id_person, id_news, comment, id_parrent_comment = null) {
    let query = {
      id: Date.now(),
      id_person,
      id_news,
      comment,
    };

    if (id_parrent_comment)
      query["id_parrent_comment"] = id_parrent_comment;

    tables["tbl_comments"].create(query).then(async function (success) {
      if (id_parrent_comment) {
        const set = {
          listIdReplyComment: tables.Sequelize.literal(
            `JSON_MERGE(listIdReplyComment, '["${id_person}"]') `
          )
        }

        await tables["tbl_comments"].update(set, {
          where: {
            id: id_parrent_comment
          }
        })
      }
    });
    return true;
  }

  async likeComment(idPerson, idComment, isLike) {
    let set = {};
    let tempObject = {};
    tempObject[idPerson] = isLike;

    if (isLike == true) {
      const query = {
        attributes: [
          'listIdLikes'
        ],
        where: {
          id: idComment
        }
      };

      const temp = await tables["tbl_comments"].findOne(query);
      const listLikeByComment = await JSON.parse(temp.dataValues.listIdLikes);

      if (listLikeByComment[idPerson] == undefined) {
        set = {
          listIdLikes: tables.Sequelize.literal(
            `JSON_MERGE(listIdLikes, '${JSON.stringify(tempObject)}') `
          )
        }
        return await tables["tbl_comments"].update(set, {
          where: {
            id: idComment
          }
        })
      }

      return true;
    } else {
      set = {
        listIdLikes: tables.Sequelize.literal(
          'JSON_REMOVE(' +
          '`listIdLikes`, "$.' + idPerson + '"' +
          ')'
        )
      }

      return await tables["tbl_comments"].update(set, {
        where: {
          id: idComment
        }
      })
    }
  }
}

module.exports = new Comments_model();