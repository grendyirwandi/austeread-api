/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_config =  sequelize.define('tbl_config', {
		kunci: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		value: {
			type: DataTypes.TEXT,
			allowNull: false,
		}
	}, {
		tableName: 'tbl_config'
    });
	return tbl_config;
};
