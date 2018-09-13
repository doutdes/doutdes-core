'use strict';

module.exports = (sequelize, DataType) => {
    let Charts = sequelize.define('Charts', {
        type: DataType.INTEGER(5)
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

