/** INSTAGRAM API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const igInsightURI = 'https://graph.facebook.com/';
const date_preset = 'this_year';

/** METRIC COSTANT **/
const METRICS = {
    P_AUDIENCE_CITY: 'audience_city',
    P_AUDIENCE_COUNTRY: 'audience_country',
    P_AUDIENCE_GENDER_AGE: 'audience_gender_age',
    P_AUDIENCE_LOCALE: 'audience_locale',
    P_EMAIL_CONTACTS: 'email_contacts',
    P_FOLLOWER_COUNT: 'follower_count',
    P_GET_DIRECTIONS_CLICKS: 'get_directions_clicks',
    P_IMPRESSIONS: 'impressions',
    P_ONLINE_FOLLOWERS: 'online_followers',
    P_PHONE_CALL_CLICKS: 'phone_call_clicks',
    P_PROFILE_VIEWS: 'profile_views',
    P_REACH: 'reach',
    P_TEXT_MESSAGE_CLICKS: 'text_message_clicks',
    P_WEBSITE_CLICKS: 'website_clicks',
};

const PERIOD = {
    DAY: 'day',
    LIFETIME: 'lifetime',
    WEEK: 'week',
    D_28: 'days_28',
};


/** GLOBAL PARAMETERS **/
global.GET = 'GET';
global.POST = 'POST';
global.DAYS_28 = 'days_28';
global.WEEK = 'week';
global.DAY = 'day';
global.LIFETIME = 'lifetime';

async function getPageAccessToken(token, pageID) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/me/accounts',
        qs: {
            access_token: token,
            fields: 'name,id,access_token,instagram_business_account'
        }
    };

    try {
        result = JSON.parse(await Request(options));
        const page = {
            'access_token': null,
            'id': null
        };
        //console.log('RESULT: ');
        //console.log(result['data']);
        for (const index in result['data']) {
            page.access_token = result['data'][index]['access_token'],
            page.business_id = result['data'][index]['instagram_business_account']['id']
            //console.log('Now seeing ID: '+page.id);
            //console.log('With token: '+page.access_token);

            if (page.business_id == pageID)
                return page.access_token;
        }
    } catch (e) {
        console.error(e);
    };

    try {
        result = JSON.parse(await Request(options));
        return result['access_token'];
    } catch (e) {
        console.error(e);
    }
}

/**GET pageID from instagram token**/
async function getPagesID(token) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/me/accounts',
        qs: {
            access_token: token,
            fields: 'name,id,access_token,instagram_business_account'
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

function instagramQuery(method, metric, period, pageID, token, date_preset) {

    const options = {
        method: method,
        uri: igInsightURI + pageID + '/insights/',
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

const getInstagramData = async (pageID, metric, period, token) => {
    let result, access_token;
    try {
        //pageId = await getPageId(token);
        access_token = await getPageAccessToken(token, pageID);
        //console.log('TOKEN OF ID '+pageID+': '+access_token);
        result = await instagramQuery(GET, metric, period, pageID, access_token);
        return result;
    } catch (e) {
        console.error(e);
    }
};

module.exports = {getInstagramData, getPagesID, METRICS, PERIOD};