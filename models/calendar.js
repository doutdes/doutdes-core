'use strict';

module.exports = (sequelize, DataType) => {
    let Calendar = sequelize.define('Calendar', {
        user_id: DataType.INTEGER(5),
        title: DataType.STRING(50),
        dataStart: DataType.DATE,
        dataEnd: DataType.DATE,
        primaryColor: DataType.STRING(7),
        secondaryColor: DataType.STRING(7),
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'calendar'
    });

    Calendar.associate = function (models) {
        Calendar.belongsTo(models.Users, {foreignKey: 'user_id'});
    };

    return Calendar;
};

