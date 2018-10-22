'use strict';

const Model = require('../../models/index');
const GaToken = Model.GaToken;

const HttpStatus = require('http-status-codes');

/***************** GOOGLE ANALYTICS *****************/
const GoogleApi = require('../../api_handler/googleAnalytics-api');

exports.ga_getLastYearSessions = async function (req, res, next) {

    GaToken.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        //console.log("manager: " + key.client_email);
        GoogleApi.getLastYearSessions(key.client_email, key.private_key)
            .then(value => {
                if (value.length === 0) {
                    return res.status(HttpStatus.NO_CONTENT).send({});
                } else
                    return res.status(HttpStatus.OK).send(value);
            })
            .catch(err => {
                console.log(err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                    error: true,
                    message: 'Cannot get informations'
                })
            })
    }).catch(err => {
        console.log(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Google Analytics Bad Request',
                message: 'Invalid OAuth access token.'
            });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Google Analytics Internal Server Error',
            message: 'There is a problem with Facebook servers'
        });
    });
};

exports.ga_getPageViews = async function (req, res, next) {

    GaToken.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        GoogleApi.getPageViews(key.client_email, key.private_key)
            .then(value => {
                if (value.length === 0) {
                    return res.status(HttpStatus.NO_CONTENT).send({});
                } else
                    return res.status(HttpStatus.OK).send(value);
            })
            .catch(err => {
                console.log(err);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                    error: true,
                    message: 'Cannot retrieve data.'
                })
            })
    }).catch(err => {
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Google Analytics Bad Request',
                message: 'Invalid access token.'
            });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Google Analytics Internal Server Error',
            message: 'There is a problem with an external source.'
        });
    });
};

exports.ga_getMostPagesViews = async function (req, res, next) {
    let result = await GoogleApi.getMostPagesVisited();

    return res.status(HttpStatus.OK).send(result);
};

exports.ga_getSources = async function (req, res, next) {
    let result = await GoogleApi.getSources();

    return res.status(HttpStatus.OK).send(result);
};