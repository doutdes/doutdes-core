'use strict';

module.exports = (sequelize, DataType) => {
    let Charts = sequelize.define('Charts', {
        type: DataType.INTEGER(5),  // Type indentifies the service that the chart belongs to (FB, GA, etc.)
        title: DataType.STRING(30),
    }, {
        freezeTableName: true,
        timestamps: false,
        tableName: 'charts'
    });

    Charts.associate = function (models) {
        Charts.belongsToMany(models.Dashboards, {
            through: {
                model: models.DashboardCharts
            },
            foreignKey: 'chart_id'
        })
    };

    return Charts;
};

