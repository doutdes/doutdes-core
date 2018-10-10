'use strict';

module.exports = (sequelize, DataType) => {
    let Fb_user_token = sequelize.define('Fb_user_token', {
        user_id: {
            type: DataType.INTEGER(5),
            primaryKey: true,
        },
        api_key: {
            type : DataType.STRING(200),
            primaryKey: true,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'fb_user_token'
    });

    Fb_user_token.associate = function (models) {
        Fb_user_token.hasMany(models.Users, {foreignKey: 'id', sourceKey: models.Users.id})
    };

    return Fb_user_token;
};

