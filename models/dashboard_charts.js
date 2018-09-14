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
        },
        title: {
            type: DataType.STRING(30)
        },
        color: {
            type: DataType.STRING(7)
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'dashboard_charts'
    });

    DashboardCharts.removeAttribute('id');

    DashboardCharts.associate = function (models) {
        // TODO Fix reletions
    };

    return DashboardCharts;
};

