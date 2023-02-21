/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_contact_us =  sequelize.define('tbl_contact_us', {
		id: {
			type: DataTypes.STRING(256),
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING(18),
			allowNull: false,
		},
		questions: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp')
		},
	}, {
		tableName: 'tbl_contact_us'
    });
	return tbl_contact_us;
};
