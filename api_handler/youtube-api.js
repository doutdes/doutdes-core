'use strict';
const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/yt-analytics.readonly';

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

exports.sampleQuery = async function (client_email, private_key, start_date, end_date) {
    const view_id = await getViewID(client_email, private_key);
    const jwt = new google.auth.JWT(client_email, null, private_key, scopes);
    const response = await jwt.authorize();
    const result = await gapi.client.youtubeAnalytics.reports.query({
        "ids": "channel==MINE",
        "startDate": "2017-01-01",
        "endDate": "2017-12-31",
        "metrics": "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
        "dimensions": "day",
        "sort": "day"
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
    return result.data.rows;
}

