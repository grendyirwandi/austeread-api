/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_product_subcategory = sequelize.define('tbl_product_subcategory', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		category_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		}
	}, {
		tableName: 'tbl_product_subcategory'
    });

	tbl_product_subcategory.associate = function (models) {
		tbl_product_subcategory.hasMany(models["tbl_product_category"], {
			as:'tpc'
		});
	}

	return tbl_product_subcategory;
};
