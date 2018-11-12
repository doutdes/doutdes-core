'use strict';
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';

async function getViewID(client_email, private_key) {
    // console.log('sono in getviewID');
    // console.log(client_email);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').management.profiles.list({
        'auth': jwt,
        'accountId': '~all',
        'webPropertyId': '~all'
    });
    return result.data.items[0].id;
}

exports.getLastYearSessions = async function (client_email, private_key, start_date, end_date) {
    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:date',
        'metrics': 'ga:sessions'
    });

    return result.data.rows;
};

exports.getPageViews = async function (client_email, private_key, start_date, end_date) {

    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:date',
        'metrics': 'ga:pageviews'
    });

    return result.data.rows;

};

exports.getMostPagesVisited = async function (client_email, private_key, start_date, end_date) {

    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:pagePath',
        'metrics': 'ga:pageviews',
        'sort': '-ga:pageviews',
        'max-results': '10'
    });

    return result.data.rows;
};

exports.getSources = async function (client_email, private_key, start_date, end_date) {

    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:medium',
        'metrics': 'ga:sessions',
        'filters': 'ga:sessions>5'
    });

    return result.data.rows;
};

exports.getPageViewsByCountry = async function (client_email, private_key, start_date, end_date) {

    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date ,
        'end-date': end_date,
        'dimensions': 'ga:country',
        'metrics': 'ga:pageviews',
    });

    return result.data.rows;
};

exports.getBrowsers = async function (client_email, private_key, start_date, end_date) {

    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'dimensions': 'ga:browser',
        'metrics': 'ga:sessions'
    });

    return result.data.rows;
};

exports.getBounceRate = async function (client_email, private_key, start_date, end_date) {

    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': 'ga:bounceRate',
        'dimensions': 'ga:date',
    });

    return result.data.rows;
};

exports.getAvgSessionDuration = async function (client_email, private_key, start_date, end_date){
    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': 'ga:avgSessionDuration',
        'dimensions': 'ga:date',
    });

    return result.data.rows;

};


exports.getPageviewsPerSession = async function (client_email, private_key, start_date, end_date){
    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': start_date,
        'end-date': end_date,
        'metrics': 'ga:avgSessionDuration',
        'dimensions': 'ga:date',
    });

    return result.data.rows;

};