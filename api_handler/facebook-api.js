'use strict';

/**
 * API calls from Page Insights Facebook
**/

const DateFns = require('date-fns');

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const fbInsightURI = 'https://graph.facebook.com/';
const config       = require('../app').config;

/** METRIC COSTANT **/
const METRICS = {
    P_ENGAGED_USERS: 'page_engaged_users',
    P_IMPRESSIONS_UNIQUE: 'page_impressions_unique',
    P_IMPRESSIONS_BY_CITY_UNIQUE: 'page_impressions_by_city_unique',
    P_IMPRESSIONS_BY_COUNTRY_UNIQUE: 'page_impressions_by_country_unique',
    P_ACTION_POST_REACTIONS_TOTAL: 'page_actions_post_reactions_total',
    P_FANS: 'page_fans',
    P_FANS_CITY: 'page_fans_city',
    P_FANS_COUNTRY: 'page_fans_country',
    P_FANS_ADDS: 'page_fan_adds',
    P_FANS_REMOVES: 'page_fan_removes',
    P_VIEWS_EXT_REFERRALS: 'page_views_external_referrals',
    P_VIEWS_TOTAL: 'page_views_total',
    P_CONSUMPTIONS: 'page_consumptions',
    P_PLACES_CHECKIN_TOTAL: 'page_places_checkin_total',
    P_NEGATIVE_FEEDBACK: 'page_negative_feedback',
    P_FANS_ONLINE_DAY: 'page_fans_online_per_day',
    P_IMPRESSIONS_PAID: 'page_impressions_paid',
    P_VIDEO_VIEWS: 'page_video_views',
    POST_IMPRESSIONS: 'post_impressions',
    P_VIDEO_ADS: 'page_daily_video_ad_break_ad_ impressions_by_crosspost_status'
};

//

/** GLOBAL PARAMETERS **/
global.GET = 'GET';
global.POST = 'POST';

/** GET pageID from facebook token **/
const getPageAccessToken = async (token, pageID) => {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/' + pageID + '/?fields=access_token',
        qs: {
            access_token: token
        },
        json: true
    };

    try {
        result = await Request(options);
        return result['access_token'];
    } catch (err) {
        console.error(err['message']);
        throw new Error('getPageAccessToken -> Error during the Facebook query -> ' + err['message']);
    }
};

/** GET Given a short-live token, it returns a long-live token **/
const getLongLiveAccessToken = async (token) => {
    const FB_CLIENT_ID     = config['fb_client_id'];
    const FB_CLIENT_SECRET = config['fb_client_secret'];

    let result;
    const options = {
        method: GET,
        uri: fbInsightURI + 'oauth/access_token',
        qs: {
            grant_type: 'fb_exchange_token',
            client_id: FB_CLIENT_ID,
            client_secret: FB_CLIENT_SECRET,
            fb_exchange_token: token
        },
        json: true
    };

    try {
        result = await Request(options);
        return result['access_token'];
    } catch (err) {
        console.error(err['message']);
        throw new Error('getLongLiveAccessToken -> Error during the Facebook query -> ' + err['message']);
    }
};

/** DELETE the permissions from the token **/
const revokePermission = async (token) => {
    let result;
    const options = {
        method: 'DELETE',
        uri: fbInsightURI + 'me/permissions/',
        qs: {
            access_token: token,
        },
        json: true
    };

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        console.error(err);
        throw new Error('deletePermissions -> Error during the Facebook query -> ' + err['message']);
    }
};

/** GET pageID and Name of the page from FB User Access Token **/
const getPagesID = async (token) =>  {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/me/accounts',
        qs: {
            access_token: token
        },
        json: true
    };

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('getPagesID -> Error during the Facebook query -> ' + err['message']);
    }
};

/** Facebook Page/Insight query **/
//TODO check why it is necessary adds and subs in dates
const facebookQuery = async (method, metric, period, pageID, token, start_date, end_date) => {
    let result;
    const options = {
        method: method,
        uri: fbInsightURI + pageID + '/insights',
        qs: {
            access_token: token,
            metric: metric,
            period: period,
            since: DateFns.subDays(start_date,1),
            until: DateFns.addDays(end_date,1)
        },
        json: true
    };

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('facebookQuery -> Error during the Facebook query -> ' + err['message']);
    }
};

const getFacebookData = async (pageID, metric, period, token, start_date, end_date) => {
    let access_token, data;

    try {
        access_token = await getPageAccessToken(token, pageID);
        data = (await facebookQuery(GET, metric, period, pageID, access_token, start_date, end_date))['data'][0]['values'];
        return data;
    } catch (e) {
        console.error(e);
        throw new Error('getFacebookData -> Error getting the Facebook Data');
    }
};
const getFacebookPost = async(pageID, token) => {
    let result;
    const options = {
        method: 'GET',
        uri: fbInsightURI + pageID + '/posts',
        qs: {
            access_token: token,
            limit: 100,
            fields: 'id,name,created_time'
        },
        json: true
    };

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('getFacebookPost -> Error during the Facebook query -> ' + err['message']);
    }
};

/** GET informations about the token - It is useful either to know if the token is valid or the scopes authorized **/
const getAccountInfo = async (token) => {
    let result;
    const options = {
        method: GET,
        uri: fbInsightURI + 'me',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        //console.error(err);
        throw new Error('getAccountInfo -> Error during the Facebook query -> ' + err['message']);
    }
};


const getTokenInfo = async (token) => {
    let result, accountInfo;
    const options = {
        method: GET,
        uri: fbInsightURI,// + '/' + id + '/permissions',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    try {
        accountInfo = await getAccountInfo(token);
        options['uri'] += '/' + accountInfo['id'] + '/permissions';
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err);
        throw new Error('getTokenInfo2 -> Error during the Facebook query -> ' + err['message']);
    }

};

/** EXPORTS **/
module.exports = {getFacebookData, getFacebookPost, getPagesID, getLongLiveAccessToken, getTokenInfo, revokePermission, METRICS};
