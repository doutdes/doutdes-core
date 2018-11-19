'use strict';

module.exports = (sequelize, DataType) => {
    let FbToken = sequelize.define('FbToken', {
        user_id: {
            type: DataType.INTEGER(5),
            primaryKey: true,
        },
        api_key: {
            type : DataType.STRING(250),
            primaryKey: true,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'fb_token'
    });
    //
    FbToken.associate = function (models) {
         FbToken.belongsTo(models.Users, {foreignKey: 'user_id'});
    };

    return FbToken;
};

