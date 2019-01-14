'use strict';
const {google} = require('googleapis');

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
    PAGE_PATH: 'ga:pagePath'
};
const SORT = {
    PAGE_VIEWS_DESC: '-ga:pageviews'
};
const FILTER = {
    SESSIONS_GT_5: 'ga:sessions>5'
};

const getViewID = async (private_key) => {
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});

    const result = await google.analytics('v3').management.profiles.list({
        auth: OaClient,
        'accountId': '~all',
        'webPropertyId': '~all'
    });
    return result.data.items[0].id;
};

const getData = async(private_key, start_date, end_date, metrics, dimensions, sort=null, filters=null) => {

    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});

    // OaClient.setCredentials({refresh_token: private_key});

    let params = {
        auth: OaClient,
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