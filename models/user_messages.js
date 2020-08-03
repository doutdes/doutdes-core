'use strict';

module.exports = (sequelize, DataType) => {
    let UserMessages = sequelize.define('UserMessages', {
        message_id: {
            type: DataType.INTEGER(5),
            primaryKey: true
        },
        user_id: {
            type: DataType.INTEGER(5),
            primaryKey: true
        },
        is_read: {
            type: DataType.BOOLEAN
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        underscored: true,
        tableName: 'user_messages',
    });

    UserMessages.removeAttribute('id');

    UserMessages.associate = function (models) {
        UserMessages.belongsTo(models.Messages, {
            foreignKey: 'message_id',
            sourceKey: models.Messages.id,
            onDelete: 'cascade'
        });

        UserMessages.belongsTo(models.Users, {
            foreignKey: 'user_id',
            sourceKey: models.Users.id
        });
    };

    return UserMessages;
};