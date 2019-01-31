'use strict';
const {google} = require('googleapis');
const Request = require('request-promise');

const config = require('../config/config').production;

const METRICS = {
    SESSIONS: 'ga:sessions',
    PAGE_VIEWS: 'ga:pageviews',
    BOUNCE_RATE: 'ga:bounceRate',
    AVG_SESSION_DURATION: 'ga:avgSessionDuration',
    NEW_USER: 'ga:newUsers'
};
const DIMENSIONS = {
    DATE: 'ga:date',
    COUNTRY: 'ga:country',
    BROWSER: 'ga:browser',
    MEDIUM: 'ga:medium',
    PAGE_PATH: 'ga:pagePath',
    MEDIUM_DATE: 'ga:medium, ga:date'
};
const SORT = {
    PAGE_VIEWS_DESC: '-ga:pageviews'
};
const FILTER = {
    SESSIONS_GT_5: 'ga:sessions>5'
};

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
        console.error(e);
    }
};
const getViewID = async (private_key) => {
    const access_token = await getAccessToken(private_key);

    const result = await google.analytics('v3').management.profiles.list({
        'access_token': access_token ,
        'accountId': '~all',
        'webPropertyId': '~all'
    });
    return result.data.items[0].id;
};
const getData = async(private_key, start_date, end_date, metrics, dimensions, sort=null, filters=null) => {

    const view_id = await getViewID(private_key);
    const access_token = await getAccessToken(private_key);

    let params = {
        'access_token': access_token ,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': metrics,
        'dimensions': dimensions
    };

    // Optional fields: if they exist, then they can be added to the query params
    if (sort)       params['sort'] = sort;
    if (filters)    params['filters'] = filters;

    const result = await google.analytics('v3').data.ga.get(params);

    return result.data.rows;
};

/** EXPORTS **/
module.exports = {getData, METRICS, DIMENSIONS, SORT, FILTER};