'use strict';

const Model = require('../models/index');
const Dashboard = Model.Dashboards;
const DashboardCharts = Model.DashboardCharts;
const UserDashboards = Model.UserDashboards;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

exports.readAll = function (req, res, next) {
  Dashboard.findAll({})
      .then(dashboards => {

          if(dashboards.length === 0) {
              return res.status(HttpStatus.NO_CONTENT).send({});
          }

          return res.status(HttpStatus.OK).send(dashboards)
      })
      .catch(err => {
          console.log(err);

          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
              error: true,
              message: 'Cannot get dashboards informations'
          })
      })
};

exports.readDashboardCharts = function (req, res, next) {
    DashboardCharts.findAll({})
        .then(dashboardsCharts => {

            if(dashboardsCharts.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(dashboardsCharts)
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get dashboards charts informations'
            })
        })
};

exports.readUserDashboards = function (req, res, next) {
    UserDashboards.findAll({})
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

exports.readUserDashboardByType = function (req, res, next) {
    DashboardCharts.findAll({
        include: [
            {
                model: Dashboard,
                required: true,
            },
            {
                model: Model.Charts,
                required: true
            }
        ]
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