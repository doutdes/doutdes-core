'use strict';

const Model = require('../../models/index');
const User_keys = Model.User_keys;
const Op = Model.Sequelize.Op;
const GA_SERVICE = 1;

const HttpStatus = require('http-status-codes');

/***************** GOOGLE ANALYTICS *****************/
const GoogleApi = require('../../api_handler/googleAnalytics-api');

exports.ga_getLastYearSessions = async function (req, res, next) {
    let result = await GoogleApi.getLastYearSessions();

    return res.status(HttpStatus.OK).send(result);
};

exports.ga_getPageViews = async function (req, res, next) {
    let result = await GoogleApi.getPageViews();

    return res.status(HttpStatus.OK).send(result);
};

exports.ga_getMostPagesViews = async function (req, res, next) {
    let result = await GoogleApi.getMostPagesVisited();

    return res.status(HttpStatus.OK).send(result);
};

exports.ga_getSources = async function (req, res, next) {
    let result = await GoogleApi.getSources();

    return res.status(HttpStatus.OK).send(result);
};