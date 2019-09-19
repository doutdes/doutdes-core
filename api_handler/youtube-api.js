/** INSTAGRAM API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');
const Model = require('../models/index');
const {google} = require('googleapis');
const DateFns = require('date-fns');



/** CONSTANTS **/
const config = require('../config/config').production;
const DAYS = {
    yesterday: 1,
    min_date: 90
};

const dataEndPoint = 'https://www.googleapis.com/youtube/v3/';
const analyticsEndPoint = 'https://youtubeanalytics.googleapis.com/v2/reports';
const tokenEndPoint = 'https://www.googleapis.com/oauth2/v4/token';


/** METRIC COSTANT **/
const METRICS = {
    COMMENTS: 'comments',
    LIKES: 'likes',
    DISLIKES: 'dislikes',
    SHARES: 'shares',
    SUB_GAIN: 'subscribersGained',
    SUB_LOSS: 'subscribersLost',
    VIEWS: 'views',
    RED_VIEWS: 'redViews',
    VIEWER_PERC: 'viewerPercentage ',
    EST_MIN_WATCH: 'estimatedMinutesWatched ',
    EST_RED_MIN_WATCH: 'estimatedRedMinutesWatched',
    AVG_VIEW_DUR: 'averageViewDuration ',
    AVG_VIEW_PERC: 'averageViewPercentage',

};
const DIMENSIONS = {
    DAY7: '7DayTotals',
    DAY30: '30DayTotals',
    AGEGROUP: 'ageGroup',
    COUNTRY: 'country',
    GENDER: 'gender',
    DAY: 'day',
    MONTH: 'month'
};

const getAccessToken = async (refreshToken) => {
    let result;

    const options = {
        method: 'POST',
        uri: tokenEndPoint,
        qs: {
            client_id: config.ga_client_id,
            client_secret: config.ga_client_secret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result['access_token'];
    } catch (e) {
        console.error(e);
    }
};

/*main data request: requires a refresh token an endpoint, misc. params and a subendpoint (additional url part like 'subscription'*/
async function yt_getData(refreshToken, queryParams) {
    let data, token;
    let start_date = (DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday), DAYS.min_date)).toISOString().slice(0, 10);
    let end_date = (DateFns.subDays(new Date(), DAYS.yesterday)).toISOString().slice(0, 10); // yesterday


    const params = {
        channel: queryParams.channel_id,
        metric: queryParams.metric,
        dimensions: 'day',
        ids: `channel==${queryParams.channel_id}`,
        startDate: start_date,
        endDate: end_date,
    };

    try {
        token = await getAccessToken(refreshToken);
        data = await youtubeQuery(token, analyticsEndPoint, params);
    } catch (e) {
        console.error(e);
    }

    return data;
}

const youtubeQuery = async (token, endPoint, params) => { // TODO to adapt for the other calls
    const options = {
        method: 'GET',
        uri: endPoint,
        qs: {
            access_token: token,
            channel: params.channel,
            metrics: params.metric,
            dimensions: params.dimensions,
            ids: params.ids,
            startDate: params.startDate,
            endDate: params.end_date,
            analytics: true,
            mine: true
        },
        json: true
    };

    for (let par of Object.keys(params)) {
        options.qs[par] = params[par];
    }

    try {
        return JSON.parse(JSON.stringify(await Request(options)))['rows'];
    } catch (err) {
        console.error(err['message']);
        throw new Error('youtubeQuery -> Error during the YouTube query -> ' + err['message']);
    }
};

module.exports = {METRICS, DIMENSIONS, config, yt_getData};
