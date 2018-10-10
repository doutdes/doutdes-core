'use strict';

module.exports = (sequelize, DataType) => {
    let Ga_data = sequelize.define('Ga_data', {
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
        tableName: 'fb_user_token'
    });

    Ga_data.associate = function (models) {
        Ga_data.hasMany(models.Users, {foreignKey: 'user_id', sourceKey: models.Users.id})
    };

    return Ga_data;
};

