'use strict';
const DateFns = require('date-fns');
const querystring = require('querystring');
const _ = require('lodash');

const Model = require('../../models/index');
const GaToken = Model.GaToken;
const Users = Model.Users;
const Chart = Model.Charts;

const GAM = require('../../api_handler/googleAnalytics-api').METRICS;
const GAD = require('../../api_handler/googleAnalytics-api').DIMENSIONS;
const GAS = require('../../api_handler/googleAnalytics-api').SORT;
const GAF = require('../../api_handler/googleAnalytics-api').FILTER;

const TokenManager = require('../token-manager');
const HttpStatus = require('http-status-codes');

const site_URL = require('../../app').config['site_URL'];
const D_TYPE = require('../dashboard-manager').D_TYPE;

const MongoManager = require('../mongo-manager');

const DAYS = {
    yesterday: 1,
    min_date: 90
};


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

        res.redirect((site_URL.includes('localhost') ? 'http://localhost:4200' : 'https://www.doutdes-cluster.it/beta') + '/#/preferences/api-keys?err=false');
    } catch (err) {
        console.error(err);
    }
};

const ga_storeAllData = async (req, res) => {
    let key = req.params.key;
    let auth = process.env.KEY || null;

    if (auth == null) {
        console.warn("Scaper executed without a valid key");
    }

    if (key != auth) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Internal Server Error',
            message: 'There is a problem with MongoDB'
        });
    }

    let user_id;
    let permissionGranted;
    let users;
    let charts;
    let page_list;

    try {
        users = await Users.findAll();
        charts = await Chart.findAll({
            where: {
                type: D_TYPE.GA
            }
        });
        for (const user of users) {
            user_id = user.dataValues.id;

            try {
                permissionGranted = await TokenManager.checkInternalPermission(user_id, D_TYPE.GA);
                if (permissionGranted.granted) {

                    page_list = _.map(await ga_viewListInternal(user_id), 'id');

                    for (const chart of charts) {
                        for (const view_id of page_list) {
                            await ga_getDataInternal(user_id, view_id, chart.metric, chart.dimensions, chart.sort, chart.filter)
                        }
                    }
                    console.log("Ga Data updated successfully for user n°", user_id);
                }
            } catch (e) {
                console.warn("The user n°", user_id, " have an invalid key");
            }
        }
        return res.status(HttpStatus.OK).send({
            message: "ga_storeAllData executed successfully"
        });
    }
    catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Internal Server Error',
            message: 'There is a problem with MongoDB'
        });
    }
};

const ga_getDataInternal = async (user_id, view_id, metrics, dimensions, sort = null, filters = null) => {
    let key;
    let response;
    let data;
    let old_startDate;
    let old_endDate;
    let old_date;
    let start_date = new Date(DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday).setUTCHours(0, 0, 0, 0), DAYS.min_date));
    let end_date = new Date(DateFns.subDays(new Date().setUTCHours(0, 0, 0, 0), DAYS.yesterday)); // yesterday
    //get the start date of the mongo document if exists
    key = await GaToken.findOne({where: {user_id: user_id}});
    old_date = await MongoManager.getMongoItemDate(D_TYPE.GA, user_id, view_id, metrics, dimensions); // TODO bug with view ID

    old_startDate = old_date.start_date;
    old_endDate = old_date.end_date;

    //check if the previous document exist and create a new one
    if (old_startDate == null) {
        data = await getAPIData(user_id, view_id, metrics, dimensions, start_date, end_date, sort, filters);
        if (dimensions !== 'ga:userGender,ga:userAgeBracket') {
            await MongoManager.storeMongoData(D_TYPE.GA, user_id, view_id, metrics, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data, dimensions);
        }

        return data;
    }
    //check if the start date is below our start date. If yes, delete the previous document and create a new one.
    else if (old_startDate > start_date) {
        //chiedere dati a Google e accertarmi che risponda
        data = await getAPIData(user_id, view_id, metrics, dimensions, start_date, end_date, sort, filters);
        await MongoManager.removeMongoData(D_TYPE.GA, user_id, view_id, metrics, dimensions);
        await MongoManager.storeMongoData(D_TYPE.GA, user_id, view_id, metrics, start_date.toISOString().slice(0, 10),
            end_date.toISOString().slice(0, 10), data, dimensions);

        return data;
    }
    else if (old_endDate < end_date) {
        data = await getAPIData(user_id, view_id, metrics, dimensions, new Date(DateFns.addDays(old_endDate, 1)), end_date, sort, filters);
        await MongoManager.updateMongoData(D_TYPE.GA, user_id, view_id, metrics, start_date.toISOString().slice(0, 10),
            end_date.toISOString().slice(0, 10), data, dimensions);
    }

    response = await MongoManager.getMongoData(D_TYPE.GA, user_id, view_id, metrics, dimensions);

    return response;

};

const ga_getData = async (req, res) => {

    const metric = req.query.metric;
    const dimensions = req.query.dimensions;
    const sort = querystring.decode(req.query.sort);
    const filter = querystring.decode(req.query.filter);

    try {
        const query = await GaToken.findOne({where: {user_id: req.user.id}});
        const view_id = req.query.view_id || query.dataValues.view_id;

        if (!view_id) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'You have not provided a view ID for the Google Analytics data request.'
            })
        }
        let response = await ga_getDataInternal(req.user.id, view_id, metric, dimensions, sort, filter);
        return res.status(HttpStatus.OK).send(response);
    }
    catch (err) {
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

const ga_viewList = async (req, res) => {
        let result;
    try {
        result = await ga_viewListInternal(req.user.id);

        return res.status(HttpStatus.OK).send(result);
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

async function ga_viewListInternal(user_id) {
    let key, data, index, view_id, result = [];

    key = await GaToken.findOne({where: {user_id: user_id}});
    data = await GoogleApi.getViewList(key.private_key);

    for (const i in data.profileList) { //accountList

        // index = data.profileList.findIndex(el => el.accountId == data.accountList[i]['id'])
        // view_id = data.profileList[index]['id'];
        let name = (data.profileList[i]['websiteUrl']).toString()
        name = name.includes("http://") ? name.replace('http://','') : name.includes("https://") ? name.replace('https://','') : name;
            result.push({
            //id: view_id,
            //name: data.accountList[i]['name']
            id: data.profileList[i]['id'],
            name: name
        });
    }
    console.log('############################################################### ALLERT ###########################################################', result)
    return result;
};

//get the data from the google analytics API
async function getAPIData(userid, view_id, metric, dimensions, start_date, end_date, sort, filters) {
    let key;
    let data;

    try {
        key = await GaToken.findOne({where: {user_id: userid}});

        data = await GoogleApi.getData(key.private_key, view_id, start_date.toISOString().slice(0, 10),
            end_date.toISOString().slice(0, 10), metric, dimensions, sort, filters);

    }
    catch (e) {
        console.error(e);
        throw new Error("getAPIData - error retrieving data from Google API");
    }
    return data;
}

/** EXPORTS **/
module.exports = {setMetrics, ga_login_success, ga_getData, ga_getScopes, ga_viewList, ga_storeAllData};
