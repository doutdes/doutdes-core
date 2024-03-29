'use strict';

/**
 * API calls from Page Insights Facebook
**/

const DateFns = require('date-fns');

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const fbInsightURI = 'https://graph.facebook.com/v4.0/';
const config       = require('../app').config;


/** GET pageID from facebook token **/
const getPageAccessToken = async (token, pageID) => {
    let result;
    const options = {
        method: 'GET',
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
        method: 'GET',
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
        method: 'GET',
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
const facebookQuery = async (metric, period, pageID, token, start_date, end_date) => {
    let result;
    const options = {
        method: 'GET',
        uri: `${fbInsightURI}${pageID}/insights/${metric}`,
        qs: {
            access_token: token,
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
        // data = await facebookQuery(metric, period, pageID, access_token, start_date, end_date)['data'] !== undefined
        // ?  await facebookQuery(metric, period, pageID, access_token, start_date, end_date)['data'][0]['values'] : [];
        data = (await facebookQuery(metric, period, pageID, access_token, start_date, end_date))['data'];
        data = data [0]!== undefined ? data [0]['values'] : [];
        return data;
    } catch (e) {
        console.error(e['message']);
        throw new Error('getFacebookData -> Error getting the Facebook Data');
    }
};

const getFacebookPost = async(pageID, token) => {
    let result;
    const options = {
        method: 'GET',
        uri: `${fbInsightURI}${pageID}/posts`,
        qs: {
            access_token: token,
            limit: 100,
            fields: 'id,created_time'
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
        method: 'GET',
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
        throw new Error('getAccountInfo -> Error during the Facebook query -> ' + err['message']);
    }
};
const getTokenInfo = async (token) => {
    let result, accountInfo;
    const options = {
        method: 'GET',
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
        throw new Error('getTokenInfo -> Error during the Facebook query -> ' + err['message']);
    }

};

/** EXPORTS **/
module.exports = {getFacebookData, getFacebookPost, getPagesID, getLongLiveAccessToken, getTokenInfo, revokePermission};
