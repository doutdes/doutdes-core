'use strict';

const Model = require('../../models/index');
const GaToken = Model.GaToken;

const TokenManager = require('../token-manager');
const HttpStatus = require('http-status-codes');

const host = require('../../app').config['site_URL'];

/***************** GOOGLE ANALYTICS *****************/
const GoogleApi = require('../../api_handler/googleAnalytics-api');

const setMetrics = (metrics, dimensions, sort=null, filters=null) => {
    return function(req, res, next){
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

/** EXPORTS **/
module.exports = {setMetrics, ga_login_success, ga_getData};