/* jshint indent: 1 */
var moment = require("moment");
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('tbl_orders', {
		id: {
			type: DataTypes.STRING(256),
			allowNull: false,
			primaryKey: true
		},
		id_person: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		is_workshop: {
			type: DataTypes.BOOLEAN(),
			allowNull: false,
		},
		order: {
			type: DataTypes.JSON,
			allowNull: false,
			get() {
				if(this.getDataValue('order'))
					return JSON.parse(this.getDataValue('order'));
				else
					return null
			}
		},
		name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		detail_address: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		province: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		city: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
		},
		district: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		postal_code: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		courier: {
			type: DataTypes.STRING(256),
			allowNull: true
		},
		service: {
			type: DataTypes.STRING(256),
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING(15),
			allowNull: true
		},
		payment_method: {
			type: DataTypes.STRING(256),
			allowNull: true
		},
		payment_expired: {
			type: DataTypes.DATE,
			allowNull: true,
			get() {
				if(this.getDataValue('payment_expired'))
					return moment(this.getDataValue('payment_expired')).format('YYYY-MM-DD HH:mm:ss');
				else
					return null
			}
		},
		payment_fee: {
			type: DataTypes.TEXT,
			allowNull: true,
			get() {
				if(this.getDataValue('payment_fee'))
					return JSON.parse(this.getDataValue('payment_fee'));
				else
					return null
			}
		},
		payment_response: {
			type: DataTypes.TEXT,
			allowNull: true,
			get() {
				if(this.getDataValue('payment_response'))
					return JSON.parse(this.getDataValue('payment_response'));
				else
					return null
			}
		},
		status: {
			type: DataTypes.STRING(256),
			allowNull: true
		},
		receipt: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		discount_price: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		shipping_price: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		total: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
			get() {
				if(this.getDataValue('createdAt'))
					return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
				else
					return null
			}
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			get() {
				if(this.getDataValue('updatedAt'))
					return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
				else
					return null
			}
		}
	}, {
		tableName: 'tbl_orders'
    });
};