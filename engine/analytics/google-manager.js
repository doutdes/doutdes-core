'use strict';

const Model = require('../../models/index');
const User_keys = Model.User_keys;
const Op = Model.Sequelize.Op;
const GA_SERVICE = 1;

const HttpStatus = require('http-status-codes');

/***************** FACEBOOK *****************/
const GoogleApi = require('../../api_handler/googleAnalytics-api');

exports.ga_getLastYearSessions = async function (req, res, next) {
    let result = await GoogleApi.getLastYearSessions();

    return res.status(HttpStatus.OK).send(result);
};

exports.ga_getUsersCities = async function (req, res, next) {
    let result = await GoogleApi.getUsersCities();

    return res.status(HttpStatus.OK).send(result);
};
