'use strict';
const {google} = require('googleapis');
//const apis = google.getSupportedAPIs();
const CLIENT_ID = '677265943833-pk2h68akq4u3o6elhcupu8bt89qg4cjl.apps.googleusercontent.com';
const CLIENT_SECRET = 'AIzaSyC4ZSzBxjzevXRDzGbVycZmtmnbHFuBdIU';
const REDIRECT_URL = '';

// const TOKEN = 'Bearer  ya29.GlsPBiYGKd-7q9zwF7BIdBzVYotyR7-2lI-oA7SkN6Zx7CcogrBlPlu13BObbiki0L6xng-UvL2wFiwvkMiEsu-7htWUGYHC4SEYhbaXqYDl2Gq1p4KA79qiXqpx';
//
// const analyticsreporting = google.analyticsreporting({
//     version: 'v4',
//     auth: TOKEN
// });

// exports.provaAPI = function () {
//     const res = analyticsreporting.reports.batchGet({
//         requestBody: {
//             reportRequests: [{
//                 viewId: 'UA-125059833-1',
//                 dateRanges: [{
//                     startDate: '3dayAgo',
//                     endDate: 'yesterday'
//                 }],
//                 metrics: [{
//                     expression: 'ga:users'
//                 }]
//             }]
//         }
//     });
//     console.log(res.data);
//     return res.data;
// }

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly'
];

const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});
