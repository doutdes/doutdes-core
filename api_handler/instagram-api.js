/** INSTAGRAM API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const igInsightURI = 'https://graph.facebook.com/';
const date_preset = 'this_year';

/** METRIC COSTANT **/
const METRICS = {
    AUDIENCE_CITY: 'audience_city',
    AUDIENCE_COUNTRY: 'audience_country',
    AUDIENCE_GENDER_AGE: 'audience_gender_age',
    AUDIENCE_LOCALE: 'audience_locale',
    EMAIL_CONTACTS: 'email_contacts',
    FOLLOWER_COUNT: 'follower_count',
    GET_DIRECTIONS_CLICKS: 'get_directions_clicks',
    IMPRESSIONS: 'impressions',
    ONLINE_FOLLOWERS: 'online_followers',
    PHONE_CALL_CLICKS: 'phone_call_clicks',
    PROFILE_VIEWS: 'profile_views',
    REACH: 'reach',
    TEXT_MESSAGE_CLICKS: 'text_message_clicks',
    WEBSITE_CLICKS: 'website_clicks',
    ENGAGEMENT: 'engagement',
    SAVED: 'saved',
    VIDEO_VIEWS: 'video_views',
    EXITS: 'exits',
    REPLIES: 'replies',
    TAPS_F: 'taps_forward',
    TAPS_B: 'taps_back'
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
            'business_id': null
        };
        for (const index in result['data']) {
            page.access_token = result['data'][index]['access_token'];
            page.business_id = result['data'][index].hasOwnProperty('instagram_business_account') ? result['data'][index]['instagram_business_account']['id'] : null;

            if (page.business_id === pageID) {
                return page.access_token;
            }
        }
        return null;
    } catch (e) {
        console.error(e);
    }
}

const revokePermission = require('./facebook-api').revokePermission;

/**GET pageID from instagram token**/
async function getPagesID(token) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/me/accounts',
        qs: {
            access_token: token,
            fields: 'name,id,access_token,instagram_business_account{id,username,name}'
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result;
    } catch (e) {
        console.error(e);
    }
}

/**GET the latest n media from instagram **/
async function getMedia(pageID, token, n=20) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/'+pageID+'/media?limit='+n+'&fields=media_type',
        qs: {
            access_token: token,
            fields: 'id,media_type'
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result;
    } catch (e) {
        console.error(e);
    }
}

/**GET the latest n stories from instagram **/
async function getStories(pageID, token, n=20) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/'+pageID+'/stories?limit='+n,
        qs: {
            access_token: token,
            fields: 'id,media_type'
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

function instagramQuery(method, metric, period=null, since=null, until=null,pageID, token, date_preset=null, mediaID=null) {

    if(since){
        since.setDate(since.getDate()-1);
    }
    const options = {
        method: method,
        qs: {
            access_token: token,
            metric: metric,
        }
    };

    if (since)    options['qs']['since'] = since;
    if (until)    options['qs']['until'] = until;

    if (period)      options['qs']['period'] = period;
    if (date_preset) options['qs']['date_preset'] = date_preset;

    if(mediaID)   options['uri'] = igInsightURI + mediaID + '/insights/';
    else          options['uri'] = igInsightURI + pageID + '/insights/';


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

const getInstagramData = async (pageID, metric, period, since=null, until=null, token, mediaID=null) => {
    let result, access_token;
    try {
        access_token = await getPageAccessToken(token, pageID);
        console.log(since+' / '+until);
        if(mediaID)
            result = JSON.parse(await instagramQuery(GET, metric, null, null, null, pageID, access_token, null, mediaID));
        else
            result = JSON.parse(await instagramQuery(GET, metric, period, since, until, pageID, access_token));
        return result['data'][0]['values'];
    } catch (e) {
        console.error(e);
        throw new Error("Bad Instagram Request");
    }
};

module.exports = {getInstagramData, getPagesID, getMedia, getStories, revokePermission, METRICS, PERIOD};