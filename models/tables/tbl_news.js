/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_news =  sequelize.define('tbl_news', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		img: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		thumbnail: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		category: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		creator: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		like: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0
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
		tableName: 'tbl_news'
    });
	
	tbl_news.associate = function (models) {
		// associations can be defined here
		tbl_news.belongsTo(models["tbl_users"], {
			foreignKey: 'creator',
			targetKey: 'id'
		});
		tbl_news.belongsTo(models["tbl_news_category"], {
			foreignKey: 'category',
			targetKey: 'id'
		});
	};
	return tbl_news;
};
