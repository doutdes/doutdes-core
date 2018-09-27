'use strict';

const Model = require('../models/index');
const Dashboard = Model.Dashboards;
const Charts = Model.Charts;
const DashboardCharts = Model.DashboardCharts;
const UserDashboards = Model.UserDashboards;

const Sequelize = require('../models/index').sequelize;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

// It retuns all the dashboards data of the user who makes the call
exports.readUserDashboards = function (req, res, next) {
    UserDashboards.findAll({
        include: [
            {
                model: Dashboard,
                required: true,
                attributes: {
                    exclude: []
                }
            }
        ],
        attributes: {
            exclude: ['DashboardId']
        },
        where: {
            user_id: req.user.id
        }
    })
        .then(userDashboards => {

            if (userDashboards.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(userDashboards)
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get dashboards charts informations'
            })
        })
};

// It returns the dashboard of a choosen type of the user who makes the call
exports.readUserDashboardByType = function (req, res, next) {
    UserDashboards.findAll({
        include: [
            {
                model: Dashboard,
                required: true,
                attributes: {
                    exclude: []
                },
                where: {
                    category: req.params.type
                }
            }
        ],
        attributes: {
            exclude: ['DashboardId']
        },
        where: {
            user_id: req.user.id
        }
    })
        .then(userDashboards => {

            if (userDashboards.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(userDashboards[0])
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get dashboards charts informations'
            })
        })
};

// It returns all the charts assigned to a choosen type dashboard of the user who makes the call
exports.readDashboardChartsByType = function (req, res, next) {
    UserDashboards.findAll({
        include: [
            {
                model: Dashboard,
                required: true,
                attributes: {
                    exclude: []
                },
                where: {
                    category: req.params.type
                }
            }
        ],
        attributes: {
            exclude: ['DashboardId']
        },
        where: {
            user_id: req.user.id
        }
    })
        .then(userDashboards => {

            if (userDashboards.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            DashboardCharts.findAll({
                include: [
                    {
                        model: Charts,
                        required: true,
                        attributes: {
                            exclude: []
                        }
                    }
                ],
                where: {
                    dashboard_id: userDashboards[0].dataValues.dashboard_id
                }
            })
                .then(finalResult => {
                    console.log(userDashboards[0].dataValues);
                    if (finalResult.length === 0) {
                        return res.status(HttpStatus.PARTIAL_CONTENT).send({
                            dashboard_id: userDashboards[0].dataValues.dashboard_id,
                            user_id: req.user.id,
                        });
                    }

                    return res.status(HttpStatus.OK).send(finalResult)
                })
                .catch(err => {
                    console.log(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        error: true,
                        message: 'Cannot get dashboards charts informations'
                    })
                });
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get dashboards charts informations'
            })
        })
};

// It returns a single chart in the dashboard, given dashboard_id and chart_id
exports.readChart = function (req, res, next) {
    console.log(req.params);

    UserDashboards.findOne({
        where: {
            user_id: req.user.id,
            dashboard_id: req.params.dashboard_id
        },
        attributes: {
            exclude: ['DashboardId']
        },
    })
        .then(dashboard => {

            if (!dashboard) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    updated: false,
                    chart_id: parseInt(req.params.chart_id),
                    dashboard_id: parseInt(req.params.dashboard_id),
                    error: 'Cannot update a chart in a dashboard that doesn\'t exists or that you doesn\'t own'
                });
            }

            console.log(dashboard.dataValues);

            DashboardCharts.findOne({
                where: {
                    [Op.and]: [{
                        dashboard_id: req.params.dashboard_id,
                        chart_id: req.params.chart_id
                    }]
                }
            })
                .then(chart => {

                    console.log(chart.dataValues);

                    if (chart === 0) {
                        return res.status(HttpStatus.BAD_REQUEST).send({
                            dashboard_id: req.params.dashboard_id,
                            chart_id: req.params.chart_id,
                            message: 'Cannot get a chart that doesn\'t exists'
                        })
                    }

                    return res.status(HttpStatus.OK).send(chart);
                })
                .catch(err => {
                    console.log(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        dashboard_id: req.params.dashboard_id,
                        chart_id: req.params.chart_id,
                        message: 'Cannot get the chart informations'
                    });
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                updated: false,
                dashboard_id: req.params.dashboard_id,
                chart_id: req.params.chart_id,
                message: 'Cannot get the chart informations'
            });
        });
};

// It adds a chart to a choosen dashboard
exports.addChartToDashboard = function (req, res, next) {
    const chart = req.body.chart;

    UserDashboards.findOne({
        where: {
            user_id: req.user.id,
            dashboard_id: chart.dashboard_id
        },
        attributes: {
            exclude: ['DashboardId']
        },
    })
        .then(dashboard => {

            console.log(dashboard);
            console.log(chart);

            if (!dashboard)
                return res.status(HttpStatus.BAD_REQUEST).send({
                    inserted: false,
                    chart_id: parseInt(chart.chart_id),
                    error: 'Cannot insert a chart in a dashboard that doesn\'t exists or that you doesn\'t own'
                });

            DashboardCharts.create({
                dashboard_id: chart.dashboard_id,
                chart_id: chart.chart_id,
                title: chart.title,
            })
                .then(chartInserted => {
                    return res.status(HttpStatus.CREATED).send({
                        created: true,
                        dashboard_id: chartInserted.get('dashboard_id'),
                        chart_id: chartInserted.get('chart_id')
                    });
                })
                .catch(err => {
                    console.log(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        created: false,
                        chart_id: parseInt(chart.chart_id),
                        error: 'Cannot insert the chart'
                    });
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                inserted: false,
                chart_id: parseInt(chart.chart_id),
                error: 'Cannot insert the chart into the dashboard'
            });
        });
};

// It removes a chart from the dashboard given its identifier
exports.removeChartFromDashboard = function (req, res, next) {

    UserDashboards.findOne({
        where: {
            user_id: req.user.id,
            dashboard_id: req.body.dashboard_id
        },
        attributes: {
            exclude: ['DashboardId']
        },
    })
        .then(dashboard => {

            if (!dashboard)
                return res.status(HttpStatus.BAD_REQUEST).send({
                    deleted: false,
                    chart_id: parseInt(req.body.chart_id),
                    dashboard_id: parseInt(req.body.dashboard_id),
                    error: 'Cannot remove a chart in a dashboard that doesn\'t exists or that you doesn\'t own'
                });

            DashboardCharts.destroy({
                where: {
                    [Op.and]: [{
                        dashboard_id: req.body.dashboard_id,
                        chart_id: req.body.chart_id
                    }]
                }
            })
                .then(chartDeleted => {
                    console.log(chartDeleted);

                    if (chartDeleted == 0) {
                        return res.status(HttpStatus.BAD_REQUEST).send({
                            deleted: false,
                            dashboard_id: req.body.dashboard_id,
                            chart_id: req.body.chart_id,
                            message: 'Cannot delete a chart that doesn\'t exists'
                        })
                    }

                    return res.status(HttpStatus.CREATED).send({
                        deleted: true,
                        dashboard_id: req.body.dashboard_id,
                        chart_id: req.body.chart_id
                    });
                })
                .catch(err => {
                    console.log(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        deleted: false,
                        dashboard_id: req.body.dashboard_id,
                        chart_id: req.body.chart_id,
                        error: 'Cannot delete the chart from the dashboard'
                    });
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                deleted: false,
                dashboard_id: req.body.dashboard_id,
                chart_id: req.body.chart_id,
                error: 'Cannot delete the chart from the dashboard'
            });
        });
};

// It updates a chart holded by a dashboard
exports.updateChartInDashboard = function (req, res, next) {
    const chart = req.body.chart;

    console.log(req.body);

    UserDashboards.findOne({
        where: {
            user_id: req.user.id,
            dashboard_id: chart.dashboard_id
        },
        attributes: {
            exclude: ['DashboardId']
        },
    })
        .then(dashboard => {

            if (!dashboard) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    updated: false,
                    chart_id: parseInt(chart.chart_id),
                    dashboard_id: parseInt(chart.dashboard_id),
                    error: 'Cannot update a chart in a dashboard that doesn\'t exists or that you doesn\'t own'
                });
            }

            DashboardCharts.update({
                title: chart.title,
            }, {
                where: {
                    [Op.and]: [{
                        dashboard_id: chart.dashboard_id,
                        chart_id: chart.chart_id
                    }]
                },
                logging: console.log
            })
                .then(chartUpdated => {

                    console.log(chartUpdated);

                    if (chartUpdated[0] === 0) {
                        return res.status(HttpStatus.BAD_REQUEST).send({
                            updated: false,
                            dashboard_id: chart.dashboard_id,
                            chart_id: chart.chart_id,
                            message: 'Cannot update a chart that doesn\'t exists'
                        })
                    }

                    return res.status(HttpStatus.CREATED).send({
                        updated: true,
                        dashboard_id: chart.dashboard_id,
                        chart_id: chart.chart_id
                    });
                })
                .catch(err => {
                    console.log(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        updated: false,
                        dashboard_id: chart.dashboard_id,
                        chart_id: chart.chart_id,
                        error: 'Cannot update the chart from the dashboard'
                    });
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                updated: false,
                dashboard_id: chart.dashboard_id,
                chart_id: chart.chart_id,
                error: 'Cannot update the chart from the dashboard'
            });
        });
};
