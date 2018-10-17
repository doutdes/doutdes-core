'use strict';

module.exports = (sequelize, DataType) => {
    let GaToken = sequelize.define('GaToken', {
        user_id: {
            type: DataType.INTEGER(5),
            primaryKey: true,
        },
        client_email: {
            type : DataType.STRING(100),
            primaryKey: true,
        },
        private_key: DataType.STRING(2000)
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'ga_token'
    });

    GaToken.associate = function (models) {
        GaToken.belongsTo(models.Users, {foreignKey: 'user_id'});
    };

    return GaToken;
};

