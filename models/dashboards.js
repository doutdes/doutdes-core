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
        Dashboards.hasMany(models.Charts, {through: 'dashboard_charts', as: 'dashboard_charts', foreignKey: 'dashboard_id'})
    };

    return Dashboards;
};

