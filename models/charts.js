'use strict';

module.exports = (sequelize, DataType) => {
    let Charts = sequelize.define('Charts', {
        ID: {
          type: DataType.INTEGER(5),
          primaryKey: true
        },
        title: DataType.STRING(30),
        type: DataType.INTEGER(5),  // Type identifies the service that the chart belongs to (FB, GA, etc.)
        metric: DataType.STRING(100),
        dimensions: DataType.STRING(100),
        sort: DataType.STRING(100),
        filter: DataType.STRING(100),
        period: DataType.STRING(100),
        interval: DataType.INTEGER(5),
        format: DataType.STRING(30),
        description: DataType.STRING(255),
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'charts'
    });

    Charts.associate = function (models) {
    };

    return Charts;
};

