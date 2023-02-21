/* jshint indent: 1 */
module.exports = function(sequelize, DataTypes) {
	let tbl_products =  sequelize.define('tbl_products', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		product_type_id: {
			type: DataTypes.TINYINT,
			allowNull: false
		}, 
		name: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		img: {
			type: DataTypes.TEXT,
			allowNull: false,
			get() {
				if(this.getDataValue('img'))
					return JSON.parse(this.getDataValue('img'));
				else
					return null
			}
		},
		subcategory_id: {
			type: DataTypes.STRING(256),
			allowNull: false,
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		detail: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		choice: {
			type: DataTypes.TEXT,
			allowNull: true,
			get() {
				if(this.getDataValue('choice'))
					return JSON.parse(this.getDataValue('choice'));
				else
					return null
			}
		},
		workshop_detail: {
			type: DataTypes.TEXT,
			allowNull: true,
			get() {
				if(this.getDataValue('workshop_detail'))
					return JSON.parse(this.getDataValue('workshop_detail'));
				else
					return null
			}
		},
		size_chart: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		creator: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('current_timestamp'),
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		}
	}, {
		tableName: 'tbl_products'
    });
	
	tbl_products.associate = function (models) {
		// associations can be defined here
		tbl_products.belongsTo(models["tbl_users"], {
			foreignKey: 'creator',
			targetKey: 'id'
		});
		tbl_products.belongsTo(models["tbl_product_subcategory"], {
			foreignKey: 'subcategory_id',
			targetKey: 'id'
		});
	};
	return tbl_products;
};