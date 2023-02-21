/* jshint indent: 1 */
const _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
	const tbl_cart_workshop = sequelize.define('tbl_cart_workshop', {
		id: {
			type: DataTypes.STRING(66),
			allowNull: false,
			primaryKey: true
		},
		id_person: {
			type: DataTypes.STRING(66),
			allowNull: false,
		},
		id_product: {
			type: DataTypes.STRING(66),
			allowNull: false,
		},
		qty: {
			type: DataTypes.TINYINT(),
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp')
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp')
		}
	}, {
		tableName: 'tbl_cart_workshop'
	});

	tbl_cart_workshop.associate = function (models) {
		// associations can be defined here
		tbl_cart_workshop.belongsTo(models["tbl_person"], {
			foreignKey: 'id_person',
			targetKey: 'id'
		});

		tbl_cart_workshop.belongsTo(models["tbl_products"], {
			foreignKey: 'id_product',
			targetKey: 'id',
			as: "tp"
		});
	};

	return tbl_cart_workshop;
};