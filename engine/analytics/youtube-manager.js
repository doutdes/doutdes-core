'use strict';
const Request = require('request-promise');
const Model = require('../../models/index');
const GaToken = Model.GaToken;
const Users = Model.Users;
const config = require('../../api_handler/youtube-api').config;
const GAn = require('../../api_handler/googleAnalytics-api');
const DateFns = require('date-fns');
const D_TYPE = require('../dashboard-manager').D_TYPE;
const TokenManager = require('../token-manager');
const MongoManager = require('../mongo-manager');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');

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

const yt_getInternalSubs = async (user_id, EP, params, sEP) => {
    let data, rt;
    let result = [];

    rt = await GaToken.findOne({where: {user_id: user_id}});

    data = await YoutubeApi.yt_getData(rt, EP, params, sEP);

    for (let el of data.items) {
        result.push({
            'value': el.snippet.channelId, //id of the subscriber's channel
            'date': new Date(el.snippet.publishedAt).toISOString().slice(0, 10)
        });
    }

    return result;
};

const yt_getSubs = async (req, res) => {
    let result;
    try {
        result = await yt_getInternalSubs(req.user.dataValues.id, req.EP, req.params, req.sEP);
        return res.status(HttpStatus.OK).send(result);
    }
    catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Youtube servers or with our database'
        })
    }
};

const yt_storeAllData = async (req, res) => {
    let key = req.params.key;
    let auth = process.env.KEY || null;
    if (auth == null) {
        console.warn("Scaper executed without a valid key");
    }

    let user_id;
    let permissionGranted;
    let users, channel_list, channel;

    if (key != auth) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Internal Server Error',
            message: 'There is a problem with MongoDB'
        });
    }
    try {
        users = await Users.findAll();
        for (const user of users) {
            user_id = user.dataValues.id;
            try {
                permissionGranted = await TokenManager.checkInternalPermission(user_id, D_TYPE.YT);
                if (permissionGranted.granted) {
                    channel_list = _.map((await yt_getInternalPages(user_id, 0, {'part': 'snippet, id'}, 'channels')), 'id');
                    for (channel of channel_list) {
                        await yt_getDataInternal(user_id, 0, {'part': 'snippet', 'metrics': 'playlists', 'ids':
                                'channel==', 'channel': channel}, 'playlists');
                        await yt_getDataInternal(user_id, 0, {'part': 'snippet', 'mine': 'true', 'type': 'video',
                            'channelId': ' ', 'metrics': 'videos', 'ids': 'channel==', 'channel': channel}, 'search');
                        await yt_getDataInternal(user_id, 1, {'metrics': 'views', 'dimensions': 'day', 'ids':
                                'channel==', 'channel': channel, 'analytics': true});
                        await yt_getDataInternal(user_id, 1, {
                            'metrics': 'comments',
                            'dimensions': 'day',
                            'ids': 'channel==',
                            'channel': channel,
                            'analytics': true
                        });
                        await yt_getDataInternal(user_id, 1, {
                            'metrics': 'likes',
                            'dimensions': 'day',
                            'ids': 'channel==',
                            'channel': channel,
                            'analytics': true
                        });
                        await yt_getDataInternal(user_id, 1, {
                            'metrics': 'dislikes',
                            'dimensions': 'day',
                            'ids': 'channel==',
                            'channel': channel,
                            'analytics': true
                        });
                        await yt_getDataInternal(user_id, 1, {
                            'metrics': 'shares',
                            'dimensions': 'day',
                            'ids': 'channel==',
                            'channel': channel,
                            'analytics': true
                        });
                        await yt_getDataInternal(user_id, 1, {
                            'metrics': 'averageViewDuration',
                            'dimensions': 'day',
                            'ids': 'channel==',
                            'channel': channel,
                            'analytics': true
                        });
                        await yt_getDataInternal(user_id, 1, {
                            'metrics': 'estimatedMinutesWatched',
                            'dimensions': 'day',
                            'ids': 'channel==',
                            'channel': channel,
                            'analytics': true
                        });
                    }
                    console.log("Ga Data updated successfully for user n°", user_id);
                }
            } catch (e) {
                console.warn("The user n°", user_id, " have an invalid key");
            }
        }
        return res.status(HttpStatus.OK).send({
            message: "yt_storeAllData executed successfully"
        });
    }
    catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Internal Server Error',
            message: 'There is a problem with MongoDB'
        });
    }
};

const yt_getInternalPages = async (user_id, EP, params, sEP) => {
    let data, rt;
    let pages = [];

    rt = await GaToken.findOne({where: {user_id: user_id}});
    data = await YoutubeApi.yt_getData(rt, EP, params, sEP);
    for (const el of data['items']) {
        pages.push({
            'id': el['id'],
            'name': el['snippet']['title'],
            'date': el['snippet']['publishedAt']
        });
    }
    return pages;
};

const yt_getPages = async (req, res) => {
    let pages = [];
    let userId = req.user.dataValues.id;

    try {
        pages = await yt_getInternalPages(userId, req.EP, req.params, req.sEP);
        return res.status(HttpStatus.OK).send(pages);
    }
    catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Youtube servers or with our database'
        })
    }
};

const yt_getDataInternal = async (user_id, EP, params, sEP = null) => {
    let data, old_date, old_startDate, old_endDate, old_lastDate;
    let result = [];
    let start_date = (DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday), DAYS.min_date));
    let end_date = (DateFns.subDays(new Date(), DAYS.yesterday)); // yesterday

    let rt = await GaToken.findOne({where: {user_id: user_id}});
    old_date = await MongoManager.getYtMongoItemDate(user_id, params.channel, params.metrics);

    old_startDate = old_date.start_date;
    old_endDate = old_date.end_date;
    old_lastDate = old_date.last_date;

    //check if the previous document exist and create a new one
    if (old_startDate == null) {
        params.startDate = start_date.toISOString().slice(0, 10);
        params.endDate = end_date.toISOString().slice(0, 10);
        result = await getResult(rt, EP, params, sEP);
        await MongoManager.storeYtMongoData(user_id, params.channel, params.metrics,
            start_date.toISOString().slice(0, 10), end_date.toISOString().slice(0, 10), result);
        return result;
    }

    else if (old_startDate > start_date) {
        params.startDate = start_date.toISOString().slice(0, 10);
        params.endDate = end_date.toISOString().slice(0, 10);
        result = await getResult(rt, EP, params, sEP);
        await MongoManager.removeYtMongoData(user_id, params.channel, params.metrics);
        await MongoManager.storeYtMongoData(user_id, params.channel, params.metrics,
            start_date.toISOString().slice(0, 10), end_date.toISOString().slice(0, 10), result);
        return result;
    }
    else if (DateFns.startOfDay(old_endDate) < DateFns.startOfDay(end_date)) {
        params.startDate = (DateFns.addDays(old_lastDate, 1)).toISOString().slice(0, 10);
        params.endDate = end_date.toISOString().slice(0, 10);
        result = await getResult(rt, EP, params, sEP);
        await MongoManager.updateYtMongoData(user_id, params.channel, params.metrics,
            params.endDate, result);
    }
    result = await MongoManager.getYtMongoData(user_id, params.channel, params.metrics);
    return result;
};

const yt_getData = async (req, res) => {
    let response;
    try {
        response = await yt_getDataInternal(req.user.dataValues.id, req.EP, req.params, req.sEP);
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

async function getResult(rt, EP, params, sEP = null) {
    let data = await YoutubeApi.yt_getData(rt, EP, params, sEP);
    let result = [];
    if (params['analytics']) {
        for (const el of data['rows']) {
            result.push({
                'date': new Date(el[0]),
                'value': parseInt(el[1], 10)
            });
        }
    }
    else for (const el of data['items']) {
        result.push({
            'id': el['id'],
            'name': el['snippet']['title'],
            'date': el['snippet']['publishedAt']
        });
    }
    return result;
}

/** EXPORTS **/
module.exports = {setParams, yt_getPages, setEndPoint, yt_getData, yt_getSubs, yt_storeAllData};
