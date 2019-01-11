/** INSTAGRAM API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const igInsightURI = 'https://graph.facebook.com/';
const date_preset = 'this_year';

/** GLOBAL PARAMETERS **/
global.GET = 'GET';
global.POST = 'POST';
global.DAYS_28 = 'days_28';
global.WEEK = 'week';
global.DAY = 'day';
global.LIFETIME = 'lifetime';

/**GET pageID from instagram token**/

function getPageId(token) {
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/me',
        qs: {
            access_token: token
        }
    };

    return new Promise((resolve, reject) => {

        Request(options)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
    });
};

/** Facebook Page/Insight query **/

function instagramQuery(method, metric, period, pageID, token) {

    const options = {
        method: method,
        uri: igInsightURI + pageID + '/insights',
        qs: {
            access_token: token,
            metric: metric,
            period: period,
            date_preset: date_preset
        }
    };

    return new Promise((resolve, reject) => {

        Request(options)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
    });
}

/** METRICS **/

/*Getter for business page reach*/
exports.getReach = function (period, token) {
    console.log("Pending App Review");
    return 0;

};

/*Getter for business page profile views*/
exports.getProfileViews = function (period, token) {
    console.log("Pending App Review");
    return 0;

};

/*Getter for business page impressions*/
exports.getImpressions = function (period, token) {
    console.log("Pending App Review");
    return 0;

};