/* jshint indent: 1 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tbl_news_highlight', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        word_query: {
            type: DataTypes.STRING(75),
            allowNull: false,
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
        tableName: 'tbl_news_highlight'
    });
};