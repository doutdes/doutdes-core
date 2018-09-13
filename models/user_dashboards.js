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

    };

    return UserDashboards;
};

