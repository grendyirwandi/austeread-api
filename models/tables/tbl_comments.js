/* jshint indent: 1 */
const _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
	let tbl_comments = sequelize.define('tbl_comments', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id_person: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		id_parrent_comment: {
			type: DataTypes.STRING(256),
			allowNull: true,
		},
		id_news: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		listIdReplyComment: {
			type: DataTypes.JSON,
			allowNull: true,
			get() {
				if (this.getDataValue('listIdReplyComment')) {
					const temp = this.getDataValue('listIdReplyComment');

					if (temp.val)
						return this.getDataValue('listIdReplyComment');
					else {
						const listIdReplyComment = JSON.parse(this.getDataValue('listIdReplyComment'));
						if (listIdReplyComment.length == 0)
							return null;
						else
							return listIdReplyComment.length;
					}
				} else
					return null
			}
		},
		listIdLikes: {
			type: DataTypes.JSON,
			allowNull: true,
			get() {
				if (this.getDataValue('listIdLikes')) {
					const temp = this.getDataValue('listIdLikes');

					if (temp.val)
						return this.getDataValue('listIdLikes');
					else {
						const listIdLikes = JSON.parse(this.getDataValue('listIdLikes'));
						if (_.keys(listIdLikes).length == 0)
							return null;
						else
							return {
								countList : _.keys(listIdLikes).length,
								list: listIdLikes
							};
					}
				} else
					return null
			}
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp')
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp')
		}
	}, {
		tableName: 'tbl_comments'
	});

	tbl_comments.associate = function (models) {
		// associations can be defined here
		tbl_comments.belongsTo(models["tbl_person"], {
			foreignKey: 'id_person',
			targetKey: 'id'
		});
	};
	return tbl_comments;
};