'use strict';

module.exports = (sequelize, DataType) => {
    let DashboardCharts = sequelize.define('DashboardCharts', {
        dashboard_id: {
            type: DataType.INTEGER(5),
            primaryKey: true
        },
        chart_id: {
            type: DataType.INTEGER(5),
            primaryKey: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'dashboard_charts'
    });

    DashboardCharts.removeAttribute('id');

    DashboardCharts.associate = function (models) {

    };

    return DashboardCharts;
};

