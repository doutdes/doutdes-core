'use strict';

const Model = require('../models/index');
const Dashboard = Model.Dashboards;
const Charts = Model.Charts;
const DashboardCharts = Model.DashboardCharts;
const UserDashboards = Model.UserDashboards;

const Sequelize = require('../models/index').sequelize;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

/**
 * @api {get} /dashboards/getAllUserDashboards/ Get all by user
 * @apiName Get Dashboards
 * @apiDescription This request takes all the dashboards owned by the user who made the call.
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Object[]} dashboards List of dashboards.
 * @apiSuccess (200) {Number} dashboards.dashboard_id Identifier of the dashboard.
 * @apiSuccess (200) {Number} dashboards.user_id ID of the user who owns the dashboard.
 * @apiSuccess (200) {Object} dashboards.Dashboard Details about the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.id  ID of the dashboard.
 * @apiSuccess (200) {String} dashboards.Dashboard.name Name of the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.category Number that identifies the type of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "user_id": 249,
 *              "dashboard_id": 249,
 *              "Dashboard": {
 *                  "id": 229,
 *                  "name": "Facebook",
 *                  "cateogry": 1,
 *              }
 *          }
 *     ]
 *
 * @apiSuccess (204) {NoType} noParameters NO CONTENT
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get dashboard information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get dashboard information"
 *      }
 */
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
                message: 'Cannot get dashboards charts information'
            })
        })
};

/**
 * @api {get} /dashboards/getByType/ Get By Type
 * @apiName Get Dashboards By Type
 * @apiDescription This request takes a single dashboard owned by a user, given its type
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Number} dashboard_id Identifier of the dashboard.
 * @apiSuccess (200) {Number} user_id ID of the user who owns the dashboard.
 * @apiSuccess (200) {Object} Dashboard Details about the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.id  ID of the dashboard.
 * @apiSuccess (200) {String} dashboards.Dashboard.name Name of the dashboard.
 * @apiSuccess (200) {Number} dashboards.Dashboard.category Number that identifies the type of the dashboard
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "user_id": 249,
 *          "dashboard_id": 249,
 *          "Dashboard": {
 *              "id": 229,
 *              "name": "Facebook",
 *              "cateogry": 1,
 *          }
 *      }
 *
 * @apiSuccess (204) {NoType} noParameters NO CONTENT
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get dashboard information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get dashboard information"
 *      }
 */
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

            console.log(userDashboards.dataValues);

            if (userDashboards.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(userDashboards[0])
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get dashboard information'
            })
        })
};

/**
 * @api {get} /dashboards/getChartsNotAddedByDashboardAndType/:dashboard_id/:type/ Get Charts Not Added By Dashboard Id and Type
 * @apiName Get Charts Not Added By Dashboard Id and Type
 * @apiDescription This request returns the charts not added yet into the dashboard, given a dashboard id and its type
 * @apiGroup Dashboard
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiSuccess (200) {Object[]} Charts Array of charts not added yet.
 * @apiSuccess (200) {Number} Charts.id ID of the chart.
 * @apiSuccess (200) {String} Charts.title Title of the chart.
 * @apiSuccess (200) {Number} Charts.type Type of the chart.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *          {
 *              "ID": 249,
 *              "title": "Page Impressions",
 *              "type": 1
 *          }
 *     ]
 *
 * @apiSuccess (204) {NoType} noParameters NO CONTENT
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 NO CONTENT
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get charts not added information
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot get charts not added information"
 *      }
 */
exports.readNotAddedByDashboardAndType = function (req, res, next) {
    Sequelize.query("SELECT charts.ID, charts.title, charts.type FROM charts WHERE charts.Type = :type AND charts.ID NOT IN (" +
        "SELECT charts.ID FROM `user_dashboards` NATURAL JOIN dashboard_charts JOIN charts ON charts.ID = dashboard_charts.chart_id " +
        "WHERE user_id = :user_id AND charts.Type = :type AND dashboard_id = :dashboard_id" +
        ")", {
        replacements: {
            user_id: req.user.id,
            dashboard_id: req.params.dashboard_id,
            type: req.params.type
        }
    })
        .then(chartsNotAdded => {

            console.log(chartsNotAdded[0].length);

            if (chartsNotAdded[0].length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(chartsNotAdded[0]);
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get charts not added informations'
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
