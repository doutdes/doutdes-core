'use strict';
const DateFns = require('date-fns');

const Model = require('../../models/index');
const FbToken = Model.FbToken;
const site_URL = require('../../app').config['site_URL'];

const TokenManager = require('../token-manager');

const HttpStatus = require('http-status-codes');

const MongoManager = require ('../mongo-manager');

const DAYS = {
    yesterday: 1,
    min_date: 90
};
/***************** FACEBOOK *****************/
const FacebookApi = require('../../api_handler/facebook-api');

// TODO change the response if there are no data
const setMetric = (metric) => {
    return (req, res, next) => {
        req.metric = metric;
        next();
    }
};

const fb_getScopes = async (req, res) => {
    let key, data;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = await FacebookApi.getTokenInfo(key.api_key);



        return res.status(HttpStatus.OK).send({scopes: data['data']['scopes']});
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

const fb_getPages = async (req, res) => {
    let data, key;
    let pages = [];

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await FacebookApi.getPagesID(key.api_key))['data'];

        for (const index in data) {
            const page = {
                name: data[index]['name'],
                id: data[index]['id']
            };

            pages.push(page);
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

const fb_getDataInternal = async (user_id, metrics, page_id) => {

    let data;
    let response;
    let old_startDate;
    let old_endDate;
    let old_date;
    let start_date = new Date(DateFns.subDays(DateFns.subDays(new Date(),DAYS.yesterday).setUTCHours(0,0,0,0), DAYS.min_date));
    let end_date = new Date(DateFns.subDays(new Date().setUTCHours(0,0,0,0), DAYS.yesterday)); // yesterday

    try {

        old_date = await MongoManager.getFbMongoItemDate(req.user.id, req.metric);

        old_startDate = old_date.start_date;
        old_endDate = old_date.end_date;

        //check if the previous document exist and create a new one
        if (old_startDate == null) {
            data = await getAPIdata(user_id, page_id, metrics, start_date, end_date);
            await MongoManager.storeFbMongoData(user_id, metrics, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);

            return res.status(HttpStatus.OK).send(data);
        }
        //check if the start date is below our start date. If yes, delete the previous document and create a new one.
        else if (old_startDate > start_date) {
            // chiedere dati a Facebook e accertarmi che risponda
            data = await getAPIdata(user_id, page_id, metrics, start_date, end_date);
            await MongoManager.removeFbMongoData(user_id, metrics);
            await MongoManager.storeFbMongoData(user_id, metrics, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);

            return res.status(HttpStatus.OK).send(data);
        }
        else if (old_endDate < end_date) {
            data = await getAPIdata(user_id, page_id, metrics, new Date(DateFns.addDays(old_endDate,1)), end_date);
            await MongoManager.updateFbMongoData(user_id, metrics, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);
        }

        response = await MongoManager.getFbMongoData(user_id, metrics);

        return response;
    }
    catch (err) {

    }
};

const fb_getData = async (req, res) => {
    try {
        let response = await fb_getDataInternal(req.user.id, req.metric, req.params.page_id);
        return res.status(HttpStatus.OK).send(response);

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

        res.redirect((site_URL.includes('localhost') ? 'http://localhost:4200' : 'https://www.doutdes-cluster.it/prealpha') + '/#/preferences/api-keys?err=false');
    } catch (err) {
        console.error(err);
    }
};

async function getAPIdata (user_id, page_id, metric, start_date, end_date){
    let key;
    let data;
    try {
        key = await FbToken.findOne({where: {user_id: user_id}});
        data = await FacebookApi.getFacebookData(page_id, metric, DAY, key.api_key, start_date, end_date);
        if (metric == 'page_actions_post_reactions_total')
            console.log("DATA ", data);
        return data;
    }
    catch (e) {
        console.error("error retrieving data from facebook insights")
    }
}

/** EXPORTS **/
module.exports = {setMetric, fb_getData, fb_getPost, fb_getPages, fb_login_success, fb_getScopes};