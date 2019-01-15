/**
 * API calls from Page Insights Facebook
**/

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const fbInsightURI = 'https://graph.facebook.com/';
const date_preset = 'this_year';

/** METRIC COSTANT **/
const METRICS = {
    P_ENGAGED_USERS: 'page_engaged_users',
    P_IMPRESSIONS_UNIQUE: 'page_impressions_unique',
    P_IMPRESSIONS_BY_CITY_UNIQUE: 'page_impressions_by_city_unique',
    P_IMPRESSIONS_BY_COUNTRY_UNIQUE: 'page_impressions_by_country_unique',
    P_ACTION_POST_REACTIONS_TOTAL: 'page_actions_post_reactions_total',
    P_FANS: 'page_fans',
    P_FANS_CITY: 'page_fans_city',
    P_FANS_COUNTRY: 'page_fans_country',
    P_FANS_ADD_UNIQUE: 'page_fan_adds_unique',
    P_FANS_REMOVES_UNIQUE: 'page_fan_removes_unique',
    P_VIEWS_EXT_REFERRALS: 'page_views_external_referrals',
    P_VIEWS_TOTAL: 'page_views_total',
};

/** GLOBAL PARAMETERS **/
global.GET = 'GET';
global.POST = 'POST';
global.DAYS_28 = 'days_28';
global.WEEK = 'week';
global.DAY = 'day';
global.LIFETIME = 'lifetime';

/** GET pageID from facebook token **/
async function getPageAccessToken(token, pageID) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/' + pageID + '/?fields=access_token',
        qs: {
            access_token: token
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result['access_token'];
    } catch (e) {
        console.error(e);
    }
}

/** GET pageID and Name of the page from FB User Access Token **/
async function getPagesID(token) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/me/accounts',
        qs: {
            access_token: token
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result;
    } catch (e) {
        console.error(e);
    }
}

/** Facebook Page/Insight query **/
async function facebookQuery(method, metric, period, pageID, token) {
    let result;
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

    try {
        result = JSON.parse(await Request(options));
        return result;
    } catch (e) {
        console.error(e);
    }
}

/** METRICS **/
const getFacebookData = async (pageID, metric, period, token) => {
    let result, access_token;

    try {
        // pageId = await getPageId(token);
        access_token = await getPageAccessToken(token, pageID);
        result = await facebookQuery(GET, metric, period, pageID, access_token);

        return result;
    } catch (e) {
        console.error(e);
    }
};

/** EXPORTS **/
module.exports = {getFacebookData, getPagesID, getIgPagesID, METRICS};