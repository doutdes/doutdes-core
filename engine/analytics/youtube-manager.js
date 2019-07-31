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
        for (let el of data.items) {
            result.push({
                'value': el.snippet.channelId, //id of the subscriber's channel
                'date': new Date(el.snippet.publishedAt).toISOString().slice(0, 10)
            });

        }
        /*result.push({
            'value' : parseInt(data.pageInfo.totalResults, 10)
        });*/


        return res.status(HttpStatus.OK).send(result);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

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

        console.log(pages);

        return res.status(HttpStatus.OK).send(pages);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

const yt_getData = async (req, res) => {
    let data;
    let result = [];
    try {
        req.rt = await GaToken.findOne({where: {user_id: req.user.dataValues.id}});
        let start_date = (DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday), DAYS.min_date));
        let end_date = (DateFns.subDays(new Date(), DAYS.yesterday)); // yesterday

        req.params.startDate = start_date.toISOString().slice(0, 10);
        req.params.endDate = end_date.toISOString().slice(0, 10);

        console.log("endDate", req.params.endDate);

        data = await YoutubeApi.yt_getData(req);
        if (req.params['analytics']) {
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

        return res.status(HttpStatus.OK).send(result);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

/** EXPORTS **/
module.exports = {setParams, yt_getPages, setEndPoint, yt_getData, yt_getSubs};
