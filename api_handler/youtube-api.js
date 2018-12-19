'use strict';
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/youtube.readonly';

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
