'use strict';

module.exports = (sequelize, DataType) => {
    let Dashboards = sequelize.define('Dashboards', {
        name: DataType.STRING(30),
        category: DataType.TINYINT(2)
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'dashboards'
    });

    Dashboards.associate = function (models) {
        Dashboards.belongsToMany(models.Charts, {
            through: {
                model: models.DashboardCharts
            },
            foreignKey: 'dashboard_id'
        });
        Dashboards.belongsToMany(models.Users, {
            through: {
                model: models.UserDashboards
            },
            foreignKey: 'dashboard_id'
        });
    };

    return Dashboards;
};

