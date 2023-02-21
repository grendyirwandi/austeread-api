/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_news_category =  sequelize.define('tbl_news_category', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		creator: {
			type: DataTypes.INTEGER(11),
			allowNull: false
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
		tableName: 'tbl_news_category'
    });
	
	tbl_news_category.associate = function (models) {
		// associations can be defined here
		tbl_news_category.belongsTo(models["tbl_users"], {
			foreignKey: 'creator',
			targetKey: 'id'
		});
	};
	return tbl_news_category;
};
