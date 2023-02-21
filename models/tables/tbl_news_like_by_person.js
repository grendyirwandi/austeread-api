/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tbl_news_like_by_person', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		idNews: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		idPersons: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		isLike: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
            default:0
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
		tableName: 'tbl_news_like_by_person'
	});
};
