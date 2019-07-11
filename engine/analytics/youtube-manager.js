'use strict';
const Request = require('request-promise');
const Model = require('../../models/index');
const GaToken = Model.GaToken;
const config = require('../../api_handler/youtube-api').config;
const GAn = require('../../api_handler/googleAnalytics-api');
const DateFns = require('date-fns');


const HttpStatus = require('http-status-codes');

const DAYS = {
    yesterday: 1,
    min_date: 90
};

/***************** GOOGLE ANALYTICS *****************/
const YoutubeApi = require('../../api_handler/youtube-api');

// TODO change the response if there are no data
const setParams = function (data) {
    return function (req, res, next) {
        //ids must be passed as boolean to distinguish the case in which I want "channelId" and "ids == channel"
        for (let par of Object.keys(data.params)) {
            req.params[par] = data.params[par];
        }
        next();
    }
};


const setEndPoint = (EP, sEP = null) => {
    return function (req, res, next) {
        req.EP = EP;
        (sEP) ? req.sEP = sEP : null;
        next();
    }

};
const yt_getSubs = async (req, res) => {
    let data;
    let result = [];
    try {
        req.rt = await GaToken.findOne({where: {user_id: req.user.dataValues.id}});
        data = await YoutubeApi.yt_getData(req);
        result.push({
            'value': parseInt(data.pageInfo.totalResults, 10)
        });


        return res.status(HttpStatus.OK).send(result);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
}

const yt_getPages = async (req, res) => {
    let data, rt;
    let pages = [];
    let userId = req.user.dataValues.id;

    try {
        req.rt = await GaToken.findOne({where: {user_id: userId}});
        data = await YoutubeApi.yt_getData(req);
        for (const el of data['items']) {
            pages.push({
                'id': el['id'],
                'name': el['snippet']['title'],
                'date': el['snippet']['publishedAt']
            });
        }

        return res.status(HttpStatus.OK).send(pages);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

const yt_getDataInternal = async (req) => {
    let data;
    let result = [];
    try {
        req.rt = await GaToken.findOne({where: {user_id: req.user.dataValues.id}});
        let start_date = (DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday), DAYS.min_date));
        let end_date = (DateFns.subDays(new Date(), DAYS.yesterday)); // yesterday

        req.params.startDate = start_date.toISOString().slice(0, 10);
        req.params.endDate = end_date.toISOString().slice(0, 10);

        data = await YoutubeApi.yt_getData(req);
        if(req.params['analytics']) {
            for(const el of data['rows']) {
                result.push({
                    'date' : new Date(el[0]),
                    'value' : parseInt(el[1], 10)
                });
            }
        }
        else for (const el of data['items']) {
            result.push({
                'id' : el['id'],
                'name' : el['snippet']['title'],
                'date' : el['snippet']['publishedAt']
            });
        }

        return result;
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Youtube servers or with our database'
        })
    }
};

const yt_getData = async (req, res) => {
    let response;
    try {
        response = await yt_getDataInternal(req);
        return res.status(HttpStatus.OK).send(response);
    } catch (err) {
        console.error(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Youtube Bad Request',
                message: 'Invalid access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Youtube servers or with our database'
        });
    }
};
/*
const fb_getDataInternal = async (user_id, metric, page_id) => {
    let key;
    let data;
    let old_startDate;
    let old_endDate;
    let old_date;
    let start_date = new Date(DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday).setUTCHours(0, 0, 0, 0), DAYS.min_date));
    let end_date = new Date(DateFns.subDays(new Date().setUTCHours(0, 0, 0, 0), DAYS.yesterday)); // yesterday

    try {

        old_date = await MongoManager.getFbMongoItemDate(user_id, metric);

        old_startDate = old_date.start_date;
        old_endDate = old_date.end_date;

        //check if the previous document exist and create a new one
        if (old_startDate == null) {
            data = await getAPIdata(user_id, page_id, metric, start_date, end_date);
            await MongoManager.storeFbMongoData(user_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);

            return data;
        }
        //check if the start date is below our start date. If yes, delete the previous document and create a new one.
        else if (old_startDate > start_date) {
            // chiedere dati a Facebook e accertarmi che risponda
            data = await getAPIdata(user_id, page_id, metric, start_date, end_date);
            await MongoManager.removeFbMongoData(user_id, metric);
            await MongoManager.storeFbMongoData(user_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);

            return data;
        }
        else if (old_endDate < end_date) {
            data = await getAPIdata(user_id, page_id, metric, new Date(DateFns.addDays(old_endDate, 1)), end_date);
            await MongoManager.updateFbMongoData(user_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);
        }

        let response = await MongoManager.getFbMongoData(user_id, metric);
        return response;

    } catch (err) {
        throw err;
    }
};

const fb_getPost = async (req, res) => {
    let key;
    let data;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = await FacebookApi.getFacebookPost(req.params.page_id, key.api_key);

        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Facebook Bad Request',
                message: 'Invalid OAuth access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        });
    }
};

const fb_login_success = async (req, res) => {
    const user_id = req.query.state;
    const token = req.user;

    try {
        // Before to upsert the token to the database, the token has to be exchanged with a long-live token
        const longToken = await FacebookApi.getLongLiveAccessToken(token);
        const upserting = await TokenManager.upsertFbKey(user_id, longToken);

        res.redirect((site_URL.includes('localhost') ? 'http://localhost:4200' : 'https://www.doutdes-cluster.it/beta') + '/#/preferences/api-keys?err=false');
    } catch (err) {
        console.error(err);
    }
};

async function getAPIdata(user_id, page_id, metric, start_date, end_date) {
    let key;
    let data;
    try {
        key = await FbToken.findOne({where: {user_id: user_id}});
        data = await FacebookApi.getFacebookData(page_id, metric, DAY, key.api_key, start_date, end_date);
        return data;
    }
    catch (e) {
        console.error("error retrieving data from facebook insights")
    }
}
*/
/** EXPORTS **/
module.exports = {setParams, yt_getPages, setEndPoint, yt_getData, yt_getSubs};
