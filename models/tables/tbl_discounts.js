/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tbl_discounts', {
		id: {
			type: DataTypes.STRING(256),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		code: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		active: {
			type: DataTypes.INTEGER(1),
			allowNull: true,
		}
	}, {
		tableName: 'tbl_discounts'
	});
};
