'use strict';

module.exports = (sequelize, DataType) => {
    let Messages = sequelize.define('Messages', {
        title: DataType.STRING(150),
        text: DataType.STRING(1000)
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'messages'
    });

    return Messages;
};