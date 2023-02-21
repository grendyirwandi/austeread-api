/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tbl_users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		first_name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(256),
			allowNull: false
		},
		role: {
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
		tableName: 'tbl_users'
	});
};
