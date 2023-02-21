/* jshint indent: 1 */
const _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
	const tbl_cart = sequelize.define('tbl_cart', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		id_person: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		list_product: {
			type: DataTypes.JSON,
			allowNull: true,
			get() {
				if (this.getDataValue('list_product')) {
					const temp = this.getDataValue('list_product');
					
					if (temp.val) 
						return this.getDataValue('list_product');
					else {
						const list_product = JSON.parse(this.getDataValue('list_product'));
						if (_.keys(list_product).length == 0)
							return null;
						else 
							return list_product;			
					}						
				}
				else
					return null
			}
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
		tableName: 'tbl_cart'
	});

	tbl_cart.associate = function (models) {
		// associations can be defined here
		tbl_cart.belongsTo(models["tbl_person"], {
			foreignKey: 'id_person',
			targetKey: 'id'
		});
	};

	return tbl_cart;
};