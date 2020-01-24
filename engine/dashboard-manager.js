const Model = require('../models/index');
const Dashboard = Model.Dashboards;
const Charts = Model.Charts;
const DashboardCharts = Model.DashboardCharts;
const UserDashboards = Model.UserDashboards;

const Sequelize = require('../models/index').sequelize;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

const D_TYPE = {
    CUSTOM: 0,
    FB: 1,
    GA: 2,
    IG: 3,
    YT: 4,
    FBM: 5
};

const DS_TYPE = {
    0: 'Custom',
    1: 'Facebook',
    2: 'Google Analytics',
    3: 'Instagram',
    4: 'YouTube'
};

exports.D_TYPE = D_TYPE;
exports.DS_TYPE = DS_TYPE;

/** EXTERNAL METHODS **/

exports.getByFormat = async (req, res) => {
    let charts;

    try {
        charts = await Charts.findAll({where: {format: req.params.format}});

        if(!charts) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'Either there are no charts with this format or it doens\'t exist'
            })
        }

        return res.status(HttpStatus.OK).send(charts);

    } catch (e) {
        console.warn(e);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: true,
            message: 'An error occurred while getting the list of charts for type and format'
        })
    }
};

exports.readUserDashboards = function (req, res, next) {

    UserDashboards.findAll({
        include: [{model: Dashboard, required: true}],
        attributes: {exclude: ['DashboardId']},
        where: {user_id: req.user.id} // Search for the selected user
    })
        .then(userDashboards => {

            if (userDashboards.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(userDashboards)
        })
        .catch(err => {
            console.error(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'An error occurred when loading user dashboard.'
            })
        })
};
exports.getDashboardByType = function (req, res, next) {

    UserDashboards.findAll({
        include: [{model: Dashboard, required: true, where: {category: req.params.type}}],
        attributes: {exclude: ['DashboardId']},
        where: {user_id: req.user.id}
    })
        .then(userDashboards => {

            if (userDashboards.length === 0) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                    error: true,
                    message: 'Cannot get dashboard information'
                })
            }

            return res.status(HttpStatus.OK).send(userDashboards[0]['Dashboard']);
        })
        .catch(err => {
            console.error(err);

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
        replacements: {user_id: req.user.id, dashboard_id: req.params.dashboard_id}
    })
        .then(chartsNotAdded => {
            if (chartsNotAdded[0].length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(chartsNotAdded[0]);
        })
        .catch(err => {
            console.error(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Error when loading remaining available charts.'
            })
        })
};
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
            console.error(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get charts not added information'
            })
        })
};

// It returns all the charts assigned to a chosen dashboard of the user who makes the call
exports.getDashboardByID = async function (req, res, next) {

    let userDashboards, finalResult;
    let dataToReturn = [];

    try {
        // Fetches the chosen dashboard of the user
        userDashboards = await UserDashboards.findAll({
            include: [
                {
                    model: Dashboard,
                    required: true,
                    where: {id: req.params.id} // dashboard type (instagram, facebook, yt, ga)
                }
            ],
            attributes: {exclude: ['DashboardId']},
            where: {user_id: req.user.id}
        });

        if (userDashboards.length === 0) {
            return res.status(HttpStatus.NO_CONTENT).send({});
        }

        // Retrieves all the charts of the dashboard
        finalResult = await DashboardCharts.findAll({
            include: [{model: Charts, required: true,}],
            where: {dashboard_id: userDashboards[0].dataValues.dashboard_id}
        });
        for (const i in finalResult) {
            dataToReturn.push(formatResult(finalResult[i]));
        }

        dataToReturn = dataToReturn.sort((a,b) => a['position'] - b['position']);

        return res.status(HttpStatus.OK).send(dataToReturn); // returns chart list

    } catch (err) {
        console.error(err);

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: true,
            message: 'Cannot get dashboard charts.'
        })
    }
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
                            message: 'The selected chart does not exist.'
                        })
                    }

                    return res.status(HttpStatus.OK).send(chart);
                })
                .catch(err => {
                    console.error(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        dashboard_id: req.params.dashboard_id,
                        chart_id: req.params.chart_id,
                        message: 'Cannot fetch the selected chart.'
                    });
                })
        })
        .catch(err => {
            console.error(err);
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
                    console.error(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        created: false,
                        chart_id: parseInt(chart.chart_id),
                        error: 'Cannot insert the chart'
                    });
                })
        })
        .catch(err => {
            console.error(err);
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
                    console.error(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        deleted: false,
                        dashboard_id: req.body.dashboard_id,
                        chart_id: req.body.chart_id,
                        error: 'Cannot delete the chart from the dashboard'
                    });
                })
        })
        .catch(err => {
            console.error(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                deleted: false,
                dashboard_id: req.body.dashboard_id,
                chart_id: req.body.chart_id,
                error: 'Cannot delete the chart from the dashboard'
            });
        });
};

// It clears the dashboard
exports.clearAllDashboard = async function(req, res, next) {
    let userDashboards, finalResult;

    try {
        // Fetches the chosen dashboard of the user
        userDashboards = UserDashboards.findAll({
            include: [
                {
                    model: Dashboard,
                    required: true,
                    where: {id: req.body.dashboard_id} // dashboard type (instagram, facebook, yt, ga)
                }
            ],
            attributes: {exclude: ['DashboardId']},
            where: {user_id: req.user.id}
        });

        if (userDashboards.length === 0) {
            return res.status(HttpStatus.BAD_REQUEST).send({});
            //message
        }

        // Retrieves all the charts of the dashboard
        finalResult = await DashboardCharts.destroy({
            //include: [{model: Charts, required: true,}],
            where: {dashboard_id: req.body.dashboard_id}
        });

        if (finalResult === 0) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR
            ).send({
                    error: true,
                    message: 'Dashboard is empty'
                }
            )
        }

        return res.status(HttpStatus.OK).send({
            delete: true,
            message: 'Dashboard cleared'
        }); // returns chart list

    } catch (err) {
        console.error(err);

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: true,
            message: 'Cannot delete dashboard charts.'
        })
    }

};

// It updates a chart holded by a dashboard
exports.updateChartInDashboard = function (req, res, next) {
    const chart = req.body.chart;

    UserDashboards.findOne({
        where: {
            user_id: req.user.id,
            dashboard_id: chart.dashboard_id,
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
                    console.error(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        updated: false,
                        dashboard_id: chart.dashboard_id,
                        chart_id: chart.chart_id,
                        error: 'Cannot update the chart from the dashboard'
                    });
                })
        })
        .catch(err => {
            console.error(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                updated: false,
                dashboard_id: chart.dashboard_id,
                chart_id: chart.chart_id,
                error: 'Cannot update the chart from the dashboard'
            });
        });
};

exports.updateArray = (req, res) => {
    const arrayReceived = req.body.arrayReceived;

    return res.send({
        array: arrayReceived
    });
};

// It updates charts holded by a dashboard
exports.updateChartsInDashboard = function (req, res, next) {
    const chartArray = req.body.chartArray;
    let promises = [];

    console.warn(req.body);

    Sequelize.Promise.each(chartArray, function (val, index) {
        return DashboardCharts.update({
            position: val.position
        }, {
            where: {
                dashboard_id: val.dashboard_id,
                chart_id: val.chart_id
            },
            attributes: {
                exclude: ['DashboardId']
            },
        }).then(function (chart) {
        }, function (err) {
            console.error(err);
        });
    }).then (function (updateAll) {
        return res.status(HttpStatus.CREATED).send({
            updated: true,
            updateCharts: updateAll
        });
    }, function (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            updated: false,
            dashboard_id: chartArray,
            error: 'Cannot update the chart array from the dashboard'
        });
    });

    //console.warn(updateCharts);

};

// It adds a dashboard to a user
exports.assignDashboardToUser = async function (req, res, next) {

    const dashboard_id = parseInt(req.body.dashboard_id);
    const user_id = req.user.id;

    const result = await internalAssignDashboardToUser(dashboard_id, user_id);

    if (result) { // The dashboard has been assigned
        return res.status(HttpStatus.CREATED).send({
            created: true,
            user_id: user_id,
            dashboard_id: dashboard_id,
            message: 'The dashboard has been assigned to the selected user.'
        })
    } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            created: false,
            user_id: user_id,
            dashboard_id: dashboard_id,
            message: 'Cannot assign the dashboard to the selected user.'
        });
    }
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
exports.createDashboard = async function (req, res, next) {

    const name = req.body.dashboard_name;
    const cat = req.body.dashboard_category;

    const resulting_id = await internalCreateDashboard(name, cat);

    if (resulting_id !== null) {
        console.log(resulting_id);
        return res.status(HttpStatus.CREATED).send({
            created: true,
            dashboard_id: resulting_id,
            name: name,
            category: cat,
            message: 'The new dashboard has been created.'
        })
    }

    // Else
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        created: false,
        name: name,
        category: cat,
        message: 'Cannot create the dashboard.'
    });
};

exports.deleteDashboard = function (req, res, next) {
    const dashboard_id = req.body.dashboard_id;

    Dashboard.destroy({
        where: {
            ID: dashboard_id
        }
    })
        .then(() => {
            return res.status(HttpStatus.OK).send({
                deleted: true,
                dashboard_id: dashboard_id
            })
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                deleted: false,
                dashboard_id: dashboard_id,
                message: 'Cannot delete the dashboard'
            })
        })
};

/** INTERNAL METHODS **/
exports.internalAssignDashboardToUser = async function (dashboard_id, user_id) {

    return new Promise(resolve => {
        UserDashboards.findOne({
            where: {dashboard_id: dashboard_id},
            attributes: {exclude: ['DashboardId']}
        }).then(() => {

            UserDashboards.create({user_id: user_id, dashboard_id: dashboard_id})
                .then(() => {
                    resolve(true);
                }).catch(err => {
                console.error(err);
                resolve(false);
            })
        }).catch(err => {
            console.error(err);
            resolve(false);
        });
    });
};
exports.internalCreateDashboard = async function (name, category) {

    const newDashboard = {name: name, category: category};

    return new Promise(resolve => {
        Dashboard.create(newDashboard)
            .then(dashboard => {
                return resolve(dashboard.id);
            })
            .catch(err => {
                console.error(err);
                return resolve(null);
            })
    });
};
exports.internalCreateDefaultDashboards = async function (user_id) {

    const CUSTOM_DASHBOARD = {category: 0, name: 'Custom'};
    const FACEBOOK_DASHBOARD = {category: 1, name: 'Facebook'};
    const ANALYTICS_DASHBOARD = {category: 2, name: 'Analytics'};
    const INSTAGRAM_DASHBOARD = {category: 3, name: 'Instagram'};
    const YOUTUBE_DASHBOARD = {category: 4, name: 'YouTube'};

    const dash1 = await this.internalCreateDashboard(CUSTOM_DASHBOARD.name, CUSTOM_DASHBOARD.category);
    const dash2 = await this.internalCreateDashboard(FACEBOOK_DASHBOARD.name, FACEBOOK_DASHBOARD.category);
    const dash3 = await this.internalCreateDashboard(ANALYTICS_DASHBOARD.name, ANALYTICS_DASHBOARD.category);
    const dash4 = await this.internalCreateDashboard(INSTAGRAM_DASHBOARD.name, INSTAGRAM_DASHBOARD.category);
    const dash5 = await this.internalCreateDashboard(YOUTUBE_DASHBOARD.name, YOUTUBE_DASHBOARD.category);

    let check1 = (dash1 == null) ? false : await this.internalAssignDashboardToUser(dash1, user_id); // Recall that this function returns true or false (doesn't fail)
    let check2 = (dash2 == null) ? false : await this.internalAssignDashboardToUser(dash2, user_id);
    let check3 = (dash3 == null) ? false : await this.internalAssignDashboardToUser(dash3, user_id);
    let check4 = (dash4 == null) ? false : await this.internalAssignDashboardToUser(dash4, user_id);
    let check5 = (dash5 == null) ? false : await this.internalAssignDashboardToUser(dash5, user_id);

    return new Promise((resolve, reject) => {

        if (!check1 || !check2 || !check3 || !check4 || !check5) { // At least one dashboard has not been created
            reject('One of the default dashboards as not been created.');
        }
        else {
            resolve();
        }
    });
};
exports.deleteChartsFromDashboardByType = async (user_id, dashboard_type) => {
    let dashboard_id, deletion, deletion_custom;

    try {
        // GET the ID of the dashboard of type dashboard_type
        dashboard_id = (await UserDashboards.findOne({
            include: [{model: Dashboard, required: true, where: {category: dashboard_type}}],
            attributes: {exclude: ['DashboardId']},
            where: {user_id: user_id}
        }))['dashboard_id'];

        deletion = await DashboardCharts.destroy({where: {dashboard_id: dashboard_id}});

        // GET the ID of the dashboard custom
        dashboard_id = (await UserDashboards.findOne({
            include: [{model: Dashboard, required: true, where: {category: D_TYPE.CUSTOM}}],
            attributes: {exclude: ['DashboardId']},
            where: {user_id: user_id}
        }))['dashboard_id'];

        deletion_custom = await Sequelize.query(
            'DELETE FROM dashboard_charts WHERE dashboard_charts.dashboard_id = :dashboard_id AND chart_ID IN ( SELECT ID from charts where type = :type )', {
                replacements: {dashboard_id: dashboard_id, type: dashboard_type},
                type: Sequelize.QueryTypes.DELETE
            });
    } catch (e) {
        console.error(e);
        throw new Error('deleteFromDashboardByType -> error deleting the dashboards for type ' + dashboard_type);
    }

    return deletion && deletion_custom;
};

const formatResult = (dashChart) => {

    /**
     * now   {dashboard_id: 4, chart_id: 6, title: "My Sources", Chart: {…}} Chart: {id: 6, type: 2, title: "Sources", format: "pie"} chart_id: 6 dashboard_id: 4 title: "My Sources" }
     * after {chart_id: 6 dashboard_id: 4 format: "pie" originalTitle: "Sources" title: "My Sources" type: 2 }
     * **/

    return {
        chart_id: dashChart['dataValues']['chart_id'],
        dashboard_id: dashChart['dataValues']['dashboard_id'],
        title: dashChart['dataValues']['title'],
        type: dashChart['dataValues']['Chart']['dataValues']['type'],
        metric: dashChart['dataValues']['Chart']['dataValues']['metric'],
        dimensions: dashChart['dataValues']['Chart']['dataValues']['dimensions'],
        sort: dashChart['dataValues']['Chart']['dataValues']['sort'],
        filter: dashChart['dataValues']['Chart']['dataValues']['filter'],
        period: dashChart['dataValues']['Chart']['dataValues']['period'],
        interval: dashChart['dataValues']['Chart']['dataValues']['interval'],
        format: dashChart['dataValues']['Chart']['dataValues']['format'],
        originalTitle: dashChart['dataValues']['Chart']['dataValues']['title'],
        position: dashChart['dataValues']['position'],
        description: dashChart['dataValues']['Chart']['dataValues']['description'],
        domain: dashChart['dataValues']['Chart']['dataValues']['domain'],
        breakdowns: dashChart['dataValues']['Chart']['dataValues']['breakdowns'],
        countFan: dashChart['dataValues']['Chart']['dataValues']['countFan']
    };
};
