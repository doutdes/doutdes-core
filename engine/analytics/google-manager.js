'use strict';

const Model = require('../../models/index');
const GaToken = Model.GaToken;

const TokenManager = require('../token-manager');
const HttpStatus = require('http-status-codes');

const host = require('../../app').config['site_URL'];

const gaMongo = require('../../models/mongo/mongo-ga-model');

/***************** GOOGLE ANALYTICS *****************/
const GoogleApi = require('../../api_handler/googleAnalytics-api');

const setMetrics = (metrics, dimensions, sort = null, filters = null) => {
    return function (req, res, next) {
        req.metrics = metrics;
        req.dimensions = dimensions;
        req.sort = sort;
        req.filters = filters;
        next();
    }
};

const ga_login_success = async (req, res) => {
    const user_id = req.query.state;
    const token = req.user.refreshToken;

    try {
        const upserting = await TokenManager.upsertGaKey(user_id, token);

        res.redirect(host + '/#/preferences/api-keys/');
    } catch (err) {
        console.error(err);
    }
};

const ga_getData = async (req, res) => {
    let key;
    let data;

    try {
        key = await GaToken.findOne({where: {user_id: req.user.id}});
        data = await GoogleApi.getData(key.private_key, req.params.start_date, req.params.end_date, req.metrics, req.dimensions, req.sort, req.filters);
        storeMongoData(req.user.id, req.metrics, req.dimensions, req.params.start_date, req.params.end_date, data);
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Google Analytics Bad Request',
                message: 'Invalid access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Google servers or with our database'
        });
    }
};

const ga_getScopes = async (req, res) => {
    let key;
    let scopes;

    try {
        key = await GaToken.findOne({where: {user_id: req.user.id}});

        if (!key) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Token not available',
                message: 'Before get the scopes of the Google token, you should provide an access token instead.'
            })
        }

        scopes = await GoogleApi.getTokenInfo(key.private_key);

        return res.status(HttpStatus.OK).send({
            scopes: scopes
        });
    } catch (e) {
        console.error(e);
        if (e.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Google Analytics Bad Request',
                message: 'Invalid access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Google servers or with our database'
        });
    }
};

function storeMongoData (userid, metric, dimensions, start_date, end_date, file) {
    let data =  new gaMongo({userid: userid, metric: metric, dimensions: dimensions,
        start_date: start_date, end_date: end_date, data: file});
    data.save().then(()=> console.log("saved successfully"));
}

/** EXPORTS **/
module.exports = {setMetrics, ga_login_success, ga_getData, ga_getScopes};