'use strict';

module.exports = (sequelize, DataType) => {
    let Charts = sequelize.define('Charts', {
        type: DataType.INTEGER(5)
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'charts'
    });

    Charts.associate = function (models) {
        Charts.hasMany(models.Dashboards, {through: 'dashboard_charts', as: 'dashboard_charts', foreignKey: 'chart_id'})
    };

    return Charts;
};

