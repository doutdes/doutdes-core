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

const DAYS = {
    yesterday: 1,
    min_date: 90
};

/***************** GOOGLE ANALYTICS *****************/
const YoutubeApi = require('../../api_handler/youtube-api');

// TODO change the response if there are no data

const yt_storeAllData = async (req, res) => {
    /*let key = req.params.key;
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
              await yt_getDataInternal(user_id, 0, {
                'part': 'snippet', 'metrics': 'playlists', 'ids':
                  'channel==', 'channel': channel
              }, 'playlists');
              await yt_getDataInternal(user_id, 0, {
                'part': 'snippet', 'mine': 'true', 'type': 'video',
                'channelId': ' ', 'metrics': 'videos', 'ids': 'channel==', 'channel': channel
              }, 'search');
              await yt_getDataInternal(user_id, 1, {
                'metrics': 'views', 'dimensions': 'day', 'ids':
                  'channel==', 'channel': channel, 'analytics': true
              });
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
    }*/
}; // TODO refactor

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
    } else if (DateFns.startOfDay(old_startDate) > DateFns.startOfDay(start_date)) {
        params.startDate = start_date.toISOString().slice(0, 10);
        params.endDate = end_date.toISOString().slice(0, 10);
        result = await getResult(rt, EP, params, sEP);
        await MongoManager.removeYtMongoData(user_id, params.channel, params.metrics);
        await MongoManager.storeYtMongoData(user_id, params.channel, params.metrics,
            start_date.toISOString().slice(0, 10), end_date.toISOString().slice(0, 10), result);
        return result;
    } else if (DateFns.startOfDay(old_endDate) < DateFns.startOfDay(end_date)) {
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
    let response, key;

    if (!req.query.metric) {
        return res.status(HttpStatus.BAD_REQUEST).send({
            error: true,
            message: 'You have not provided a metric for the Youtube data request.'
        })
    }

    if (!req.query.channel_id) {
        return res.status(HttpStatus.BAD_REQUEST).send({
            error: true,
            message: 'You have not provided a channel ID for the Youtube data request.'
        })
    }

    try {
        key = await GaToken.findOne({where: {user_id: req.user.id}});
        // console.warn(key.dataValues.private_key);
        response = await YoutubeApi.yt_getData(key.dataValues.private_key, req.query); // TODO ripristinare mongo
        return res.status(HttpStatus.OK).send(getResult(response, req.query.metric));
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
