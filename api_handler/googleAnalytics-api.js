'use strict';
const {google} = require('googleapis');
const key = require('../doutdes.json');

const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
const view_id = '181073244';

exports.getBrowsersSessions = async function() {

    const response = await jwt.authorize();
    const result = await google.analytics('v3').data.ga.get({
        'auth': jwt,
        'ids': 'ga:' + view_id,
        'start-date': '30daysAgo',
        'end-date': 'today',
        'dimensions': 'ga:browser',
        'metrics': 'ga:sessions'
    });

    console.log(result.data.rows);
    return result.data.rows;
};

// const {auth}   = require('google-auth-library');
// const CLIENT_ID = '677265943833-pk2h68akq4u3o6elhcupu8bt89qg4cjl.apps.googleusercontent.com';
// const CLIENT_SECRET = 'AIzaSyC4ZSzBxjzevXRDzGbVycZmtmnbHFuBdIU';
// const REDIRECT_URI = '';

// // const TOKEN = 'Bearer  ya29.GlsPBiYGKd-7q9zwF7BIdBzVYotyR7-2lI-oA7SkN6Zx7CcogrBlPlu13BObbiki0L6xng-UvL2wFiwvkMiEsu-7htWUGYHC4SEYhbaXqYDl2Gq1p4KA79qiXqpx';
// //
// ;
//
//
// const oauth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URI
// );
//
// const scopes = [
//     'https://www.googleapis.com/auth/analytics',
//     'https://www.googleapis.com/auth/analytics.readonly'
// ];
//
// // const url = oauth2Client.generateAuthUrl({
// //     access_type: 'offline',
// //     scope: scopes
// // });
//
// const analyticsreporting = google.analyticsreporting({
//     version: 'v4',
//     auth: oauth2Client
// });
// //
// // exports.provaAPI = function () {
// //     const res = analyticsreporting.reports.batchGet({
// //         requestBody: {
// //             reportRequests: [{
// //                 viewId: 'UA-125059833-1',
// //                 dateRanges: [{
// //                     startDate: '3dayAgo',
// //                     endDate: 'yesterday'
// //                 }],
// //                 metrics: [{
// //                     expression: 'ga:users'
// //                 }]
// //             }]
// //         }
// //     });
// //     console.log(res.data);
// // };

