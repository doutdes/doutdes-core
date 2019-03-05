'use strict';
const DateFns = require('date-fns');

const Model = require('../../models/index');
const GaToken = Model.GaToken;

const TokenManager = require('../token-manager');
const HttpStatus = require('http-status-codes');

const host = require('../../app').config['site_URL'];

const gaMongo = require('../../models/mongo/mongo-ga-model');

const DAYS = {
    yesterday: 1,
    min_date: 30
};

const start_date = new Date('2019-01-01');
const end_date = DateFns.subDays(new Date(), DAYS.yesterday); // yesterday

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
    let mongoStartDate;

    try {
        //get the start date of the mongo document if exists
        mongoStartDate = await getStartDateMongo(req.user.id, req.metrics, req.dimensions);

        key = await GaToken.findOne({where: {user_id: req.user.id}});
        data = await GoogleApi.getData(key.private_key, start_date.toISOString().slice(0,10),
            end_date.toISOString().slice(0,10), req.metrics, req.dimensions, req.sort, req.filters);

        //check if the previous document exist and create a new one
        if (mongoStartDate == null) {
            await storeMongoData(req.user.id, req.metrics, req.dimensions, start_date.toISOString().slice(0,10),
                end_date.toISOString().slice(0,10), data);
            return res.status(HttpStatus.OK).send(data);
        }
        //check if the start date is below our start date. If yes, delete the previous document and create a new one.
        if (mongoStartDate < start_date) {
            await removeMongoData(req.user.id, req.metrics, req.dimensions);
            await storeMongoData(req.user.id, req.metrics, req.dimensions, start_date.toISOString().slice(0,10),
                end_date.toISOString().slice(0,10), data);
            return res.status(HttpStatus.OK).send(data);
        }

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

//store data in mongo db
async function storeMongoData(userid, metric, dimensions, start_date, end_date, file) {
    let data;
    try {
        data = await new gaMongo({
            userid: userid, metric: metric, dimensions: dimensions,
            start_date: start_date, end_date: end_date, data: file
        });
        data.save().then(() => console.log("saved successfully"));
    }
    catch (e) {
        console.error(e);
        throw new Error("storeMongoData - error doing the insert");
    }
}

//return the start date of a document in mongo
async function getStartDateMongo(userid, metric, dimensions) {
    let result;
    try {
        result = await gaMongo.find({
            'userid': userid,
            'metric': metric,
            'dimensions': dimensions
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getStartDateMongo - error doing the query");
    }
    return result[0] ? new Date(result[0].start_date) : null;
}

//remove a mongo document
async function removeMongoData(userid, metric, dimensions) {
    try {
        await gaMongo.findOneAndRemove({
            'userid': userid,
            'metric': metric,
            'dimensions': dimensions
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removeMongoData - error removing data");
    }
}

/** EXPORTS **/
module.exports = {setMetrics, ga_login_success, ga_getData, ga_getScopes};