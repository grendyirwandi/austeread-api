/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_product_category = sequelize.define('tbl_product_category', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		}
	}, {
		tableName: 'tbl_product_category'
    });

	tbl_product_category.associate = function (models) {
		tbl_product_category.belongsTo(models["tbl_product_subcategory"], {
			foreignKey: 'id',
			targetKey: 'category_id',
			as:'tps'
		});
	}
	return tbl_product_category
};
