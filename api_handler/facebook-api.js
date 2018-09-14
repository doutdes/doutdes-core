/**
 * API calls from Page Insights Facebook
 * */

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const fbInsightURI = 'https://graph.facebook.com/';
const date_preset = 'this_year';

/** GLOBAL PARAMETERS **/
global.GET = 'GET';
global.POST = 'POST';
global.DAYS_28 = 'days_28';
global.WEEK = 'week';
global.DAY = 'day';
global.LIFETIME = 'lifetime';

/**GET pageID from facebook token**/

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
                console.log('getPageId: ' + result);
                resolve(result);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    });
};

/** Facebook Page/Insight query **/

function facebookQuery(method, metric, period, pageID, token) {

    const options = {
        method: method,
        uri: fbInsightURI + pageID + '/insights',
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
                console.log('FacebookQuery: ' + result);
                resolve(result);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
    });
    ;
}

/** METRICS **/

/** The number of people who engaged with your Page. Engagement includes any click or story created. (Unique Users)**/

exports.getInsightsEngagedUsers = function (period) {

    const metric = 'page_engaged_users';

    return facebookQuery(GET, metric, period);

};

/** The number of people who had any content from your Page or about your Page enter their screen. This includes posts, check-ins, ads, social information from people who interact with your Page and more. (Unique Users) **/

exports.getInsightsPageImpressionsUnique = function (period, token) {

    const metric = 'page_impressions_unique';

    return new Promise((resolve, reject) => {

        getPageId(token)
            .then(result => {
                const jsonResult = JSON.parse(result);
                console.log('exports.getInsights -> jsonResult.id: ' + jsonResult.id);
                facebookQuery(GET, metric, period, jsonResult.id, token)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            })
    })

};

/** **/

exports.getInsightsPageImpressionsByCityUnique = function (period) {

    const metric = 'page_impressions_by_city_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageImpressionsByCountryUnique = function (period) {

    const metric = 'page_impressions_by_country_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageActionsPostReactionsTotal = function (period) {

    const metric = 'page_actions_post_reactions_total';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFans = function (period, token) {

    const metric = 'page_fans';

    return new Promise((resolve, reject) => {

        getPageId(token)
            .then(result => {
                const jsonResult = JSON.parse(result);
                console.log('exports.getInsights -> jsonResult.id: ' + jsonResult.id);
                facebookQuery(GET, metric, period, jsonResult.id, token)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
        .catch(err => {
            reject(err);
        })
    })
};

exports.getInsightsPageFansCity = function (period) {

    const metric = 'page_fans_city';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFansCountry = function (period, token) {

    const metric = 'page_fans_country';

    return new Promise((resolve, reject) => {

        getPageId(token)
            .then(result => {
                const jsonResult = JSON.parse(result);
                console.log('exports.getInsights -> jsonResult.id: ' + jsonResult.id);
                facebookQuery(GET, metric, period, jsonResult.id, token)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(err => {
                        reject(err);
                    });
            })
            .catch(err => {
                reject(err);
            })
    })

};

exports.getInsightsPageFansAddsUnique = function (period) {

    const metric = 'page_fan_adds_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFansRemovesUnique = function (period) {

    const metric = 'page_fan_removes_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageViewsExternalReferrals = function (period) {

    const metric = 'page_views_external_referrals';

    return facebookQuery(GET, metric, period);

};