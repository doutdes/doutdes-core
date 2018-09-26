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
        underscored: true,
        tableName: 'dashboard_charts'
    });

    DashboardCharts.associate = function (models) {
        DashboardCharts.belongsTo(models.Dashboards, {
            foreignKey: 'dashboard_id',
            sourceKey: models.Dashboards.id
        });

        DashboardCharts.belongsTo(models.Charts, {
            foreignKey: 'chart_id',
            sourceKey: models.Charts.id
        });
    };

    DashboardCharts.removeAttribute('DashboardId');

    return DashboardCharts;
};

