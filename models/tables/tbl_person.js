/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tbl_person', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		fullname: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		img: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(256),
			allowNull: true
		},
		register_method: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: 0 
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: '{"default":null,"address":[]}'
		},
		subNews: {
			type: DataTypes.STRING(128),
			allowNull: true
		},
		lastSendNews: {
			type: DataTypes.DATE,
			allowNull: true
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
		tableName: 'tbl_person'
	});
};
