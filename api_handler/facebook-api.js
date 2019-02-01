'use strict';

/**
 * API calls from Page Insights Facebook
**/

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
    P_FANS_ADD_UNIQUE: 'page_fan_adds_unique',
    P_FANS_REMOVES_UNIQUE: 'page_fan_removes_unique',
    P_VIEWS_EXT_REFERRALS: 'page_views_external_referrals',
    P_VIEWS_TOTAL: 'page_views_total',
};

/** GLOBAL PARAMETERS **/
global.GET = 'GET';
global.POST = 'POST';
global.DAYS_28 = 'days_28';
global.WEEK = 'week';
global.DAY = 'day';
global.LIFETIME = 'lifetime';

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
const facebookQuery = async (method, metric, period, pageID, token, date_preset) => {
    let result;
    const options = {
        method: method,
        uri: fbInsightURI + pageID + '/insights',
        qs: {
            access_token: token,
            metric: metric,
            period: period,
            date_preset: date_preset
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

const getFacebookData = async (pageID, metric, period, token) => {
    let access_token, this_year, last_year;

    try {
        access_token = await getPageAccessToken(token, pageID);
        this_year = (await facebookQuery(GET, metric, period, pageID, access_token, 'this_year'))['data'][0]['values'];
        last_year = (await facebookQuery(GET, metric, period, pageID, access_token, 'last_year'))['data'][0]['values'];

        return last_year.concat(this_year);
    } catch (e) {
        console.error(e);
        throw new Error('getFacebookData -> Error getting the Facebook Data');
    }
};

/** GET all the scopes of the token **/
const getScopes = async (token) => {
    let result;
    const options = {
        method: GET,
        uri: fbInsightURI + 'debug_token',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        qs: {
            input_token: token
        },
        json: true
    };

    try {
        result = await Request(options);
        return result['data']['scopes'];
    } catch (err) {
        console.error(err['message']);
        throw new Error('getScopes -> Error during the Facebook query -> ' + err['message']);
    }
};

/** EXPORTS **/
module.exports = {getFacebookData, getPagesID, getLongLiveAccessToken, getScopes, METRICS};