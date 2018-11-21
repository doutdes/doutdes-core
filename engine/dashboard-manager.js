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

// This works for the custom/hybrid dashboards. It doesn't check the type of the chart
exports.readNotAddedByDashboard = function (req, res, next) {
    Sequelize.query("SELECT * FROM charts WHERE charts.ID NOT IN (" +
        "SELECT charts.ID FROM `user_dashboards` NATURAL JOIN dashboard_charts JOIN charts ON charts.ID = dashboard_charts.chart_id " +
        "WHERE user_id = :user_id AND dashboard_id = :dashboard_id" +
        ")", {
        replacements: {
            user_id: req.user.id,
            dashboard_id: req.params.dashboard_id,
        }
    })
        .then(chartsNotAdded => {
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
    Sequelize.query("SELECT * FROM charts WHERE charts.Type = :type AND charts.ID NOT IN (" +
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

// It returns all the charts assigned to a chosen dashboard of the user who makes the call
exports.readDashboardChartsByType = function (req, res, next) {
    UserDashboards.findAll({ // Fetches the chosen dashboard of the user
        include: [
            {
                model: Dashboard,
                required: true,
                where: {category: req.params.type} // dashboard type (instagram, facebook, ecc)
            }
        ],
        attributes: {exclude: ['DashboardId']},
        where: {user_id: req.user.id}
    })
        .then(userDashboards => {

            if (userDashboards.length === 0) { // dashboard does not exist
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            DashboardCharts.findAll({ // Retrieves all the charts of the dashboard
                include: [
                    {
                        model: Charts,
                        required: true,
                    }
                ],
                where: {dashboard_id: userDashboards[0].dataValues.dashboard_id}
            })
                .then(finalResult => {

                    if (finalResult.length === 0) { // dashboard is empty
                        return res.status(HttpStatus.PARTIAL_CONTENT).send({
                            dashboard_id: userDashboards[0].dataValues.dashboard_id,
                            user_id: req.user.id,
                        });
                    }

                    return res.status(HttpStatus.OK).send(finalResult) // returns chart list
                })
                .catch(err => {
                    console.log(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        error: true,
                        message: 'Cannot get dashboard charts.'
                    })
                });
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get dashboard charts.'
            })
        })
};

// Given dashboard ID and chart ID, it returns the corresponding chart
exports.readChart = function (req, res, next) {
    UserDashboards.findOne({ // Retrieves the chosen dashboard
        where: {
            user_id: req.user.id,
            dashboard_id: req.params.dashboard_id
        },
        attributes: {exclude: ['DashboardId']},
    })
        .then(dashboard => {

            if (!dashboard) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    updated: false,
                    chart_id: parseInt(req.params.chart_id),
                    dashboard_id: parseInt(req.params.dashboard_id),
                    error: 'Cannot update a chart of the selected dashboard: dashboard that doesn\'t exists or is forbidden.'
                });
            }

            DashboardCharts.findOne({ // Retrieves the chart from the dashboard
                where: {
                    [Op.and]: [{
                        dashboard_id: req.params.dashboard_id,
                        chart_id: req.params.chart_id
                    }]
                }
            })
                .then(chart => {

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
                        message: 'Cannot fetch the selected chart.'
                    });
                })
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                updated: false,
                dashboard_id: req.params.dashboard_id,
                chart_id: req.params.chart_id,
                message: 'Cannot fetch the selected chart.'
            });
        });
};

// It adds a chart to a chosen dashboard
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

// It adds a dashboard to a user
exports.addUserDashboard = function (req, res, next) {
    const dashboard_id = parseInt(req.body.dashboard_id);
    UserDashboards.findOne({
        where: {
            dashboard_id: dashboard_id
        },
        attributes: {
            exclude: ['DashboardId']
        },
    }).then(dashboard => {
        console.log(dashboard);
        if (dashboard != null) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                created: false,
                user_id: req.user.id,
                dashboard_id: dashboard_id,
                message: 'Cannot insert a dashboard that is not your or does not exists'
            })
        }
        else {
            UserDashboards.create({
                user_id: req.user.id,
                dashboard_id: dashboard_id
            })
                .then(dashboard => {
                    console.log(dashboard);
                    return res.status(HttpStatus.CREATED).send({
                        created: true,
                        user_id: dashboard.user_id,
                        dashboard_id: dashboard.dashboard_id
                    })
                })
                .catch(err => {
                    console.log(err);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        created: false,
                        user_id: req.user.id,
                        dashboard_id: dashboard_id,
                        message: 'Cannot insert the new dashboard'
                    })
                })
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                created: false,
                user_id: req.user.id,
                dashboard_id: dashboard_id,
                message: 'Cannot insert the new dashboard for the selected user'
            });
        });


};

// It removes a dashboard from a user
exports.deleteUserDashboard = function (req, res, next) {
    const dashboard_id = req.body.dashboard_id;
    UserDashboards.destroy({
        where: {
            [Op.and]: {
                user_id: req.user.id,
                dashboard_id: dashboard_id
            }
        }
    })
        .then(() => {
            return res.status(HttpStatus.OK).send({
                deleted: true,
                user_id: req.user.id,
                dashboard_id: dashboard_id
            })
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                deleted: false,
                user_id: req.user.id,
                dashboard_id: dashboard_id,
                message: 'Cannot delete the dashboard'
            })
        })
};

// It adds a new dashboard
exports.addDashboard = function (req, res, next) {

    const dashboard_name = req.body.dashboard_name;
    const dashboard_category = req.body.dashboard_category;

    Dashboard.create({
        name: dashboard_name,
        category: dashboard_category
    })
        .then(dashboard => {
            return res.status(HttpStatus.CREATED).send({
                created: true,
                name: dashboard.name,
                category: dashboard.category
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                created: false,
                name: dashboard_name,
                category: dashboard_category,
                message: 'Cannot insert the new dashboard'
            });
        })
};
