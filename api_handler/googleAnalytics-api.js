'use strict';
const {google} = require('googleapis');
const key = require('../Agenda.json');

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);

async function getViewID(){
    const response = await jwt.authorize();
    const result = await google.analytics('v3').management.profiles.list({
        'auth': jwt,
        'accountId': '~all',
        'webPropertyId': '~all'
    });
    return result.data.items[0].id;
}

exports.getLastYearSessions = async function () {
    const view_id = await getViewID();
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': '365daysAgo',
        'end-date': 'today',
        'dimensions': 'ga:date',
        'metrics': 'ga:sessions'
    });

    return result.data.rows;
};

exports.getPageViews = async function () {

    const view_id = await getViewID();
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': '365daysAgo',
        'end-date': 'today',
        'dimensions': 'ga:date',
        'metrics': 'ga:pageviews'
    });

    return result.data.rows;

};

exports.getMostPagesVisited = async function() {
    const view_id = await getViewID();
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': '365daysAgo',
        'end-date': 'today',
        'dimensions': 'ga:pagePath',
        'metrics': 'ga:pageviews',
        'sort': '-ga:pageviews',
        'max-results': '10'
    });

    return result.data.rows;
};

exports.getSources = async function() {
    const view_id = await getViewID();
    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': '365daysAgo',
        'end-date': 'today',
        'dimensions': 'ga:medium',
        'metrics': 'ga:sessions',
        'filters': 'ga:sessions>5'
    });

    return result.data.rows;
};



