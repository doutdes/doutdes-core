'use strict';

module.exports = (sequelize, DataType) => {
    let Messages = sequelize.define('Messages', {
        title: DataType.STRING(150),
        text: DataType.TEXT(1000)
    }, {
        freezeTableName: true,
        tableName: 'messages'
    });

    return Messages;
};