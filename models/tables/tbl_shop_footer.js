/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_shop_footer =  sequelize.define('tbl_shop_footer', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		value: {
			type: DataTypes.TEXT,
			allowNull: false,
		}
	}, {
		tableName: 'tbl_shop_footer'
    });
	return tbl_shop_footer;
};
