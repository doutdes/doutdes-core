/**
 * API calls from Page Insights Facebook
 * */

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const pageID = '1397642170275248';
const accessToken = 'EAAYgMsLsh6kBAHaIb2LuEnDBn4k2KIYvZCgTqqoUeVk8R97ZATKLVRFbPuWr2ppeXwsRsEKxtRdKaqsUogJjaRq3B81UMkVYy5IBAmZAOhUKDvYZBntWjnA865bz8vamvclZAgy3gE3Uv6X4NM5EOeLq38viSq4u4QC80CfTZBfwZDZD';
const fbInsightURI = 'https://graph.facebook.com/' + pageID + '/insights/';
const date_preset = 'this_year';

/** GLOBAL PARAMETERS **/
global.GET = 'GET';
global.POST = 'POST';
global.DAYS_28  = 'days_28';
global.WEEK = 'week';
global.DAY = 'day';
global.LIFETIME = 'lifetime';

/** Facebook Page/Insight query **/

function facebookQuery(method, metric, period) {

    const options = {
        method: method,
        uri: fbInsightURI,
        qs: {
            access_token: accessToken,
            metric: metric,
            period: period,
            date_preset: date_preset
        }
    };
    return Request(options);

}

/** Metrics **/

exports.getInsightsEngagedUsers = function (period) {

    const metric = 'page_engaged_users';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageImpressionsUnique = function (period) {

    const metric = 'page_impressions_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageImpressionsByCityUnique = function (period) {

    const metric = 'page_impressions_by_city_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageImpressionsByCountryUnique = function (period) {

    const metric = 'page_impressions_by_city_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageActionsPostReactionsTotal = function (period) {

    const metric = 'page_impressions_by_city_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFans = function (period) {

    const metric = 'page_fans';
    
    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFansCity = function (period) {

    const metric = 'page_fans_city';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFansCountry = function (period) {

    const metric = 'page_fans_country';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFansAddsUnique = function (period) {

    const metric = 'page_fans_adds_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageFansRemovesUnique = function (period) {

    const metric = 'page_fans_removes_unique';

    return facebookQuery(GET, metric, period);

};

exports.getInsightsPageViewsExternalReferrals = function (period) {

    const metric = 'page_views_external_referrals';

    return facebookQuery(GET, metric, period);

};