'use strict';
const DateFns = require('date-fns');
const _ = require('lodash');

const Model = require('../../models/index');
const FbToken = Model.FbToken;
const Users = Model.Users;
const Chart = Model.Charts;
const site_URL = require('../../app').config['site_URL'];
const D_TYPE = require('../dashboard-manager').D_TYPE;
const FBM = require('../../api_handler/facebook-api').METRICS;

const TokenManager = require('../token-manager');
const MongoManager = require('../mongo-manager');

const HttpStatus = require('http-status-codes');

const DAYS = {
    yesterday: 1,
    min_date: 90
};

/***************** FACEBOOK *****************/
const FacebookApi = require('../../api_handler/facebook-api');

// TODO change the response if there are no data
const fb_getScopes = async (req, res) => {
    let key, data;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = await FacebookApi.getTokenInfo(key.api_key);

        data = _.map(data['data'], el => el.status === 'granted' ? el.permission : '');
        data = _.filter(data, el => el !== '');

        return res.status(HttpStatus.OK).send({scopes: data});
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

const updatePages = async (req, res) => {
    let fbData, pagesListMongo = [], pagesList = [], key, removedPages = [];

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});

        (await FacebookApi.getPagesID(key.api_key))['data'].forEach(el => pagesList.push(el.id));
        fbData = await MongoManager.getFbPagesMongo(req.user.id);
        fbData.forEach(p => pagesListMongo.push(p.page_id));
        pagesListMongo = pagesListMongo.filter(function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        });
        pagesListMongo.forEach(p => pagesList.includes(p.toString()) !== true
            ? (removedPages.push(p.toString()), MongoManager.removeFbPageMongo(req.user.id, p))
            : null
        );
        return res.status(HttpStatus.OK).send(removedPages);
    }
    catch (err) {
        console.error(err['message']);
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

const fb_storeAllData = async (req, res) => {
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
    let page_id;
    let page_list;
    let charts;

    try {
        users = await Users.findAll();
        charts = await Chart.findAll({
            where: {
                type: D_TYPE.FB
            }
        });

        for (const user of users) {
            user_id = user.dataValues.id;

            try {
                permissionGranted = await TokenManager.checkInternalPermission(user_id, D_TYPE.FB);
                if (permissionGranted.granted) {

                    let key = await FbToken.findOne({where: {user_id: user_id}});

                    page_list = _.map((await FacebookApi.getPagesID(key.api_key)).data,'id');

                    for (page_id of page_list) {

                        for (const chart of charts) {
                            await fb_getDataInternal(user_id, chart.metric, page_id)
                        }
                    }

                    console.log("Fb Data updated successfully for user n°", user_id);
                }
            } catch (err) {
                console.log(err);
                console.warn("The user #", user_id, " have an invalid key or an invalid page_id.");
            }
        }
        return res.status(HttpStatus.OK).send({
            message: "fb_storeAllData executed successfully"
        });
    } catch (err) {

    }

};

const fb_getData = async (req, res) => {
    const metric = req.query.metric;
    let response, page_id;

    try {
        page_id = req.query.page_id || (await FbToken.findOne({where: {user_id: req.user.id}}))['fb_page_id'];

        if(!page_id) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'You have not provided a page ID for the Facebook data request.'
            })
        }

        if(!metric) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'You have not provided a metric for the Facebook data request.'
            })
        }

        response = await fb_getDataInternal(req.user.id, metric, page_id);

        return res.status(HttpStatus.OK).send(response);
    }
    catch (err) {
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

const fb_getDataInternal = async (user_id, metric, page_id) => {
    let key;
    let data;
    let old_startDate;
    let old_endDate;
    let old_date;
    let response;
    let start_date = new Date(DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday).setUTCHours(0, 0, 0, 0), DAYS.min_date));
    let end_date = new Date(DateFns.subDays(new Date().setUTCHours(0, 0, 0, 0), DAYS.yesterday)); // yesterday

    try {
        old_date = await MongoManager.getMongoItemDate(D_TYPE.FB, user_id, page_id, metric);

        old_startDate = old_date.start_date;
        old_endDate = old_date.end_date;

        //check if the previous document exist and create a new one
        if (old_startDate == null) {
            data = await getAPIdata(user_id, page_id, metric, start_date, end_date);
            data = preProcessFBData(data, metric);
            await MongoManager.storeMongoData(D_TYPE.FB, user_id, page_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);

            return data;
        }
        //check if the start date is below our start date. If yes, delete the previous document and create a new one.
        else if (old_startDate > start_date) {
            // chiedere dati a Facebook e accertarmi che risponda
            data = await getAPIdata(user_id, page_id, metric, start_date, end_date);
            data = preProcessFBData(data, metric);
            await MongoManager.removeMongoData(D_TYPE.FB, user_id, page_id, metric);
            await MongoManager.storeMongoData(D_TYPE.FB, user_id, page_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);

            return data;
        }
        else if (old_endDate < end_date) {
            data = await getAPIdata(user_id, page_id, metric, new Date(DateFns.addDays(old_endDate, 1)), end_date);
            data = preProcessFBData(data, metric);
            await MongoManager.updateMongoData(D_TYPE.FB, user_id, page_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data);
        }

        response = await MongoManager.getMongoData(D_TYPE.FB, user_id, page_id, metric);
        return response;

    } catch (err) {
        throw err;
    }
};

function preProcessFBData(data, metric) {

    let stringified;

    if (metric.toString() === "page_views_external_referrals") {// This metric has dots in keys, which are not allowed
        stringified = JSON.stringify(data);
        stringified = stringified.replace(/\./g, "$");

        data = JSON.parse(stringified);
    }

    return data;
}

const fb_getPost = async (req, res) => {
    let key;
    let data;
    let page_id;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        page_id = req.query.page_id || key.dataValues.fb_page_id;

        if(!page_id) {
            return res.status(HttpStatus.BAD_REQUEST).send({
               error: true,
               message: 'You must specify a page id in the request'
            });
        }

        data = await FacebookApi.getFacebookPost(page_id, key.api_key);

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
    const key = await FbToken.findOne({where: {user_id: user_id}});
    return await FacebookApi.getFacebookData(page_id, metric, 'day', key.api_key, start_date, end_date);
}

/** EXPORTS **/
module.exports = {fb_getData, fb_getPost, fb_getPages, fb_login_success, fb_getScopes, fb_storeAllData, updatePages};
