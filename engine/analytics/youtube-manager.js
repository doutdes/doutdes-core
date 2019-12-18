'use strict';
const Model = require('../../models/index');
const GaToken = Model.GaToken;
const Users = Model.Users;
const DateFns = require('date-fns');
const D_TYPE = require('../dashboard-manager').D_TYPE;
const TokenManager = require('../token-manager');
const MongoManager = require('../mongo-manager');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const DAY = 86400000;

const DAYS = {
    yesterday: 1,
    min_date: 90
};

/***************** GOOGLE ANALYTICS *****************/
const YoutubeApi = require('../../api_handler/youtube-api');

// TODO change the response if there are no data

const yt_storeAllData = async (req, res) => {
    let key = req.params.key;
    let auth = process.env.KEY || null;
    if (auth == null) {
        console.warn("Scaper executed without a valid key");
    }

    let user_id, charts;
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
        charts = await Chart.findAll({
            where: {
                type: D_TYPE.YT
            }
        });
        for (const user of users) {
            user_id = user.dataValues.id;

            try {
                permissionGranted = await TokenManager.checkInternalPermission(user_id, D_TYPE.YT);
                if (permissionGranted.granted) {

                    for (const chart of charts) {

                        await yt_getDataInternal(user_id, chart.metric, channel_id)

                    }
                    console.log("Yt Data updated successfully for user n°", user_id);
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

//returns all the channels for the given user
const yt_getChannels = async (req, res) => {
    let refresh_token, channels = [];

    try {
        refresh_token = await GaToken.findOne({where: {user_id: req.user.id}});
        channels = await YoutubeApi.getChannels(refresh_token.dataValues.private_key);

        return res.status(HttpStatus.OK).send(channels);

    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Youtube servers or with our database'
        })
    }
};

const yt_getDataInternal = async (user_id, metric, channel_id) => {

    let response, key, result, old_date, old_startDate, old_endDate, old_lastDate;

    if (!metric) {
        console.warn("Missing YT metric");
        return;
    }

    if (!channel_id) {
        console.warn("Missing YT channel ID");
        return;
    }

    let start_date = (DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday), DAYS.min_date));
    let end_date = (DateFns.subDays(new Date(), DAYS.yesterday));

    old_date = await MongoManager.getMongoItemDate(D_TYPE.YT, user_id, channel_id, metric);

    old_startDate = old_date.start_date;
    old_endDate = old_date.end_date;
    old_lastDate = old_date.last_date;


    key = await GaToken.findOne({where: {user_id: user_id}});

    if (old_startDate == null) {
        //mettere startDate e endDate
        response = await YoutubeApi.yt_getData(key.dataValues.private_key, metric, channel_id, start_date.toISOString().slice(0, 10), end_date.toISOString().slice(0, 10));
        //applicare nuovo metodo per riempire i dati
        result = getResult(response, metric);

        result = preProcessYTData(result, metric, start_date, end_date);

        await MongoManager.storeMongoData(D_TYPE.YT, user_id, channel_id, metric, start_date.toISOString().slice(0, 10),
            end_date.toISOString().slice(0, 10), result);
    } else if (DateFns.startOfDay(old_startDate) > DateFns.startOfDay(start_date)) {

        response = await YoutubeApi.yt_getData(key.dataValues.private_key, metric, channel_id, start_date.toISOString().slice(0, 10), end_date.toISOString().slice(0, 10));
        result = getResult(response, metric);

        result = preProcessYTData(result, metric, start_date, end_date);

        await MongoManager.removeMongoData(D_TYPE.YT, user_id, channel_id, metric);
        await MongoManager.storeMongoData(D_TYPE.YT, user_id, channel_id, metric, start_date.toISOString().slice(0, 10),
            end_date.toISOString().slice(0, 10), result);

    } else if (DateFns.startOfDay(old_endDate) < DateFns.startOfDay(end_date)) {
        // inserire nuovo start Date pari a un giorno dopo l'end date del documento
        response = await YoutubeApi.yt_getData(key.dataValues.private_key, metric, channel_id, (DateFns.addDays(old_endDate, 1)).toISOString().slice(0, 10), end_date.toISOString().slice(0, 10));
        result = getResult(response, metric);
        result = preProcessYTData(result, metric, DateFns.addDays(old_lastDate, 1), end_date);
        await MongoManager.updateMongoData(D_TYPE.YT, user_id, channel_id, metric, start_date.toISOString().slice(0, 10), end_date.toISOString().slice(0, 10), result);
    }
    result = await MongoManager.getMongoData(D_TYPE.YT, user_id, channel_id, metric);
    return result;
};

function preProcessYTData(data, metric, start_date, end_date) {
    if (metric !== 'playlists' && metric !== 'videos' && metric !== 'info') {
        let rows = data;

        let tStart = new Date(start_date.toISOString().slice(0, 10));
        let tEnd = new Date(end_date.toISOString().slice(0, 10));
        let newValue = [];
        if (rows.length > 0) {
            if (tStart.toISOString().slice(0, 10) === rows[0].date.toISOString().slice(0, 10)) {
                newValue.push({'date': rows[0].date, 'value': rows[0].value});
            } else {
                newValue.push({'date': tStart, 'value': 0});
            }

            for (let row of rows) {

                let tDate = new Date(row.date.toISOString().slice(0, 10));
                let dif = tDate.valueOf() - tStart.valueOf();

                if (dif > 0) {
                    let range = (dif / DAY);

                    for (let j = 0; j < range; j++) {
                        tStart = new Date(tStart.valueOf() + DAY);

                        if (tStart.toISOString().slice(0, 10) != row.date.toISOString().slice(0, 10)) {
                            //console.warn("primo if");
                            newValue.push({'date': tStart, 'value': 0});
                        } else {
                            //console.warn("else");
                            newValue.push({'date': row.date, 'value': row.value});
                        }
                    }
                }
                tStart = new Date(row.date);
            }
            if (tEnd.toISOString().slice(0, 10) != newValue[newValue.length - 1].date.toISOString().slice(0, 10)) {
                let dif = tEnd.valueOf() - newValue[newValue.length - 1].date.valueOf();
                let range = dif / DAY;
                tStart = new Date(newValue[newValue.length - 1].date.toISOString().slice(0, 10));
                for (let j = 0; j < range; j++) {
                    tStart = new Date(tStart.valueOf() + DAY);
                    newValue.push({'date': tStart, 'value': 0});
                }
            }
            return newValue;
        }
        else {
            let dif = tEnd.valueOf() - tStart.valueOf();
            let range = (dif / DAY);
            newValue.push({'date': tStart, 'value': 0});
            for (let j = 0; j < range; j++) {
                tStart = new Date(tStart.valueOf() + DAY);
                newValue.push({'date': tStart, 'value': 0});
            }
            return newValue;
        }
    }
    return data;
};

const yt_getData = async (req, res) => {
    let response;

    try {
        response = await yt_getDataInternal(req.user.id, req.query.metric, req.query.channel_id);
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

const getResult = (data, metric) => {
    let result;

    switch (metric) {
        case 'videos':
        case 'playlists':
            result = data.items.map(el => {
                return {
                    id: el.id.videoId || el.id,
                    title: el.snippet.title,
                    description: el.snippet.description,
                    publishedAt: el.snippet.publishedAt,
                    thumbnails: el.snippet.thumbnails
                }
            });
            break;
        case 'info':
            result = data.items.map(el => {
                return {
                    id: el.id,
                    views: el.statistics.viewCount,
                    comments: el.statistics.commentCount,
                    subscribers: el.statistics.subscriberCount,
                    videos: el.statistics.videoCount
                }
            });
            break;
        default:
            result = data.rows.map(el => {
                return {
                    date: new Date(el[0]),
                    value: parseInt(el[1], 10)
                }
            });
            break;
    }

    return result;
};

/** EXPORTS **/
module.exports = {yt_getChannels, yt_getData, yt_storeAllData};
