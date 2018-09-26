'use strict';

module.exports = (sequelize, DataType) => {
    let UserDashboards = sequelize.define('UserDashboards', {
        user_id: {
            type: DataType.INTEGER(5),
            primaryKey: true
        },
        dashboard_id: {
            type: DataType.INTEGER(5),
            primaryKey: true
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'user_dashboards'
    });

    UserDashboards.removeAttribute('id');

    UserDashboards.associate = function (models) {
        UserDashboards.belongsTo(models.Users, {
            foreignKey: 'user_id',
            sourceKey: models.Users.id
        });

        UserDashboards.belongsTo(models.Dashboards, {
            foreignKey: 'dashboard_id',
            sourceKey: models.Dashboards.id
        });
    };

    return UserDashboards;
};

