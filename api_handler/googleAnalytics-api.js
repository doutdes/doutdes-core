'use strict';
const {google} = require('googleapis');
const Request = require('request-promise');

const config = require('../config/config').production;

const getAccessToken = async (refresh_token) => {
    let result;

    const options = {
        method: 'POST',
        uri: 'https://www.googleapis.com/oauth2/v4/token',
        qs: {
            client_id: config.ga_client_id,
            client_secret: config.ga_client_secret,
            refresh_token: refresh_token,
            grant_type: 'refresh_token'
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result['access_token'];
    } catch (e) {
        //console.error(e);
    }
};
const getTokenInfo = async (private_key) => {
    let result = null;
    let access_token;
    const options = {
        method: 'GET',
        uri: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
        qs: {
            access_token: null
        },
        json: true
    };

    try {
        options.qs.access_token = await getAccessToken(private_key);
        if (options.qs.access_token){
            result = await Request(options);
        } else{
            throw new Error('getTokenInfo -> Error getting scopes in Google (invalid refresh token)');
        }

    } catch (err) {
        throw new Error('getTokenInfo -> Error getting scopes in Google (401) -> ' + err['message']);
    }

    return result;//['scope'].split(' ');
};
const getViewList = async (private_key) => {
    const access_token = await getAccessToken(private_key);

    const accountList = await google.analytics('v3').management.accounts.list({
        'access_token': access_token,
    });

    const profileList = await google.analytics('v3').management.profiles.list({
        'access_token': access_token,
        'accountId': '~all',
        'webPropertyId': '~all'
    });


    return {
        accountList: accountList.data.items,
        profileList: profileList.data.items,
    };
};
const getData = async (private_key, view_id, start_date, end_date, metrics, dimensions, sort = null, filters = null) => {

    const access_token = await getAccessToken(private_key);

    let params = {
        'access_token': access_token,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': metrics,
        'dimensions': dimensions,
        'max-results': 10000
    };

    // Optional fields: if they exist, then they can be added to the query params
    if (sort) params['sort'] = sort;
    if (filters) params['filters'] = filters;

    const result = await google.analytics('v3').data.ga.get(params);

    return result.data.rows;
};
const revokePermissions = async (private_key) => {
    let result;
    const options = {
        method: 'GET',
        uri: 'https://accounts.google.com/o/oauth2/revoke',
        qs: {
            token: private_key
        },
        json: true
    };

    try {
        result = await Request(options);

        return result;
    } catch (e) {
        console.error(e);
        throw new Error('googleAnalytics.revokePermissions -> error revoking permissions');
    }
};

/** EXPORTS **/
module.exports = {getData, getTokenInfo, revokePermissions, getViewList};