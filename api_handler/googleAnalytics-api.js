'use strict';
const {google} = require('googleapis');

const getLastYearSessions = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:date',
        'metrics': 'ga:sessions'
    });

    return result.data.rows;
};

const getPageViews = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:date',
        'metrics': 'ga:pageviews'
    });

    return result.data.rows;

};

const getMostPagesVisited = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:pagePath',
        'metrics': 'ga:pageviews',
        'sort': '-ga:pageviews',
    });

    return result.data.rows;
};

const getSources = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:medium',
        'metrics': 'ga:sessions',
        'filters': 'ga:sessions>5'
    });

    return result.data.rows;
};

const getPageViewsByCountry = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date ,
        'end-date': end_date,
        'dimensions': 'ga:country',
        'metrics': 'ga:pageviews',
    });

    return result.data.rows;
};

const getBrowsers = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:browser',
        'metrics': 'ga:sessions'
    });

    return result.data.rows;
};

const getBounceRate = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': 'ga:bounceRate',
        'dimensions': 'ga:date',
    });

    return result.data.rows;
};

const getAvgSessionDuration = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});

    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': 'ga:avgSessionDuration',
        'dimensions': 'ga:date',
    });

    return result.data.rows;
};

const getNewUsers = async (private_key, start_date, end_date) => {
    const view_id = await getViewID(private_key);
    const OaClient = new google.auth.OAuth2();
    OaClient.setCredentials({access_token: private_key});
    
    const result = await google.analytics('v3').data.ga.get({
        auth: OaClient,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': 'ga:newUsers',
        'dimensions': 'ga:date',
    });

    return result.data.rows;
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

module.exports = {getLastYearSessions, getPageViews, getMostPagesVisited, getSources, getPageViewsByCountry, getBrowsers, getBounceRate, getAvgSessionDuration, getNewUsers};