/** INSTAGRAM API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const YTAnalyticsURI = 'https://youtubeanalytics.googleapis.com/v2/reports';
const date_preset = 'this_year';
const config = require('../config/config').production;


/** METRIC COSTANT **/
const METRICS = {
    COMMENTS: 'comments',
    LIKES: 'likes',
    DISLIKES : 'dislikes',
    SHARES : 'shares',
    SUBGAIN : 'subscribersGained',
    SUBLOSS : 'subscribersLost',
    VIEWS : 'views',
    RED_VIEWS : 'redViews',
    VIEWERPERC : 'viewerPercentage ',
    ESTMINWATCH : 'estimatedMinutesWatched ',
    ESTREDMINWATCH : 'estimatedRedMinutesWatched',
    AVGVIEWDUR : 'averageViewDuration ',
    AVGVIEWPERC : 'averageViewPercentage',

};
const DIMENSIONS = {
    DAY7 : '7DayTotals',
    DAY30 : '30DayTotals',
    AGEGROUP : 'ageGroup',
    COUNTRY : 'country',
    GENDER : 'gender',
    DAY : 'day',
    MONTH : 'month'
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
        result = await Request(options);
    } catch (e) {
        console.error(e);
        throw new Error('getTokenInfo -> Error getting scopes in Google');
    }

    return result;//['scope'].split(' ');
};

const revokePermission = ''; /// TODO


module.exports = {METRICS, DIMENSIONS, config};

/** GET pageID from instagram token**/



