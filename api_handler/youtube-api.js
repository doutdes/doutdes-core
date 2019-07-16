/** INSTAGRAM API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');
const Model = require('../models/index');
const GaToken = Model.GaToken;

/** CONSTANTS **/
const date_preset = 'this_year';
const config = require('../config/config').production;

const dataEndPoint = 'https://www.googleapis.com/youtube/v3/';
const analyticsEndPoint = 'https://youtubeanalytics.googleapis.com/v2/reports';
const tokenEndPoint = 'https://www.googleapis.com/oauth2/v4/token';


/** METRIC COSTANT **/
const METRICS = {
    COMMENTS: 'comments',
    LIKES: 'likes',
    DISLIKES: 'dislikes',
    SHARES: 'shares',
    SUBGAIN: 'subscribersGained',
    SUBLOSS: 'subscribersLost',
    VIEWS: 'views',
    RED_VIEWS: 'redViews',
    VIEWERPERC: 'viewerPercentage ',
    ESTMINWATCH: 'estimatedMinutesWatched ',
    ESTREDMINWATCH: 'estimatedRedMinutesWatched',
    AVGVIEWDUR: 'averageViewDuration ',
    AVGVIEWPERC: 'averageViewPercentage',

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

const getAccessToken = async (rt) => {
    let result;
    rt = rt['dataValues']['private_key'];
    const options = {
        method: 'POST',
        uri: tokenEndPoint,
        qs: {
            client_id: config.ga_client_id,
            client_secret: config.ga_client_secret,
            refresh_token: rt,//await GaToken.findOne({where: {user_id: req.user.id}})['dataValues']['private_key'],
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

async function yt_getData(req) {
    let data;

    try {
        req.token = await getAccessToken(req.rt);
        data = await youtubeQuery(req);
    } catch (e) {
        console.error(e);
    }

    return data;
}

//TODO check why it is necessary adds and subs in dates
const youtubeQuery = async (req) => {
    let result;
    let EP;

    //getting which endpoint should be used
    switch (req.EP) {
        case 0 :
            EP = dataEndPoint;
            break;
        case 1:
            EP = analyticsEndPoint;
            break;
        case 2:
            EP = tokenEndPoint;
    }

    //adding the sub-endpoint if avaiable
    EP += (req.sEP) ? req.sEP : '';
    const options = {
        method: GET,
        uri: EP,
        qs: {
            access_token: req.token
        },
        json: true
    };
    for (let par of Object.keys(req.params)) {
        options.qs[par] = req.params[par];
    }
    (options.qs.ids) ? options.qs.ids += req.params.channel : null;
    (!options.qs['mySubscribers']) ? options.qs.mine = true : null;
    (options.qs.channelId) ? options.qs.channelId = req.params.channel : null;
    try {
        result = await Request(options);
        result = JSON.parse(JSON.stringify(result));
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('youtubeQuery -> Error during the YouTube query -> ' + err['message']);
    }
};

module.exports = {METRICS, DIMENSIONS, config, yt_getData};
