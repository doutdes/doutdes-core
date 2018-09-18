'use strict';

const Model = require('../models/index');
const Dashboard = Model.Dashboards;
const Charts = Model.Charts;
const DashboardCharts = Model.DashboardCharts;
const UserDashboards = Model.UserDashboards;
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
                    exclude: ['id']
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

            if(userDashboards.length === 0) {
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
                    exclude: ['id']
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

            if(userDashboards.length === 0) {
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
                    exclude: ['id']
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

            if(userDashboards.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            DashboardCharts.findAll({
                include:[
                    {
                        model: Charts,
                        required: true,
                        attributes: {
                            exclude: ['id']
                        }
                    }
                ],
                where: {
                    dashboard_id: userDashboards[0].dataValues.dashboard_id
                }
            })
                .then(finalResult => {
                    if(finalResult.length === 0) {
                        return res.status(HttpStatus.NO_CONTENT).send({});
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

// It adds a chart to a choosen dashboard
exports.addChartToDashboard = function (req, res, next) {
    const chart = req.body;

    DashboardCharts.create({
        dashboard_id: chart.dashboard_id,
        chart_id: chart.chart_id,
        title: chart.title,
        color: chart.color
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
};