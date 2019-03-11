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

const INTERVAL = {
    MONTH: 29,
    FOUR_WEEKS: 28
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

/** GET pageID from instagram token**/
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

/** GET username from id **/
async function getUsernameFromId(pageID, token) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/' + pageID,
        qs: {
            access_token: token,
            fields: 'username'
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result['username'];
    } catch (e) {
        console.error(e);
    }
}

/** GET the latest n media from instagram **/
async function getMedia(pageID, token, n=20) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/'+pageID+'/media',
        qs: {
            access_token: token,
            fields: 'id,media_type,timestamp',
            limit: n,
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result;
    } catch (e) {
        console.error(e);
    }
}

/** GET the latest n stories from instagram **/
async function getStories(pageID, token, n=20) {
    let result;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/'+pageID+'/stories',
        qs: {
            access_token: token,
            fields: 'id,media_type',
            limit: n
        }
    };

    try {
        result = JSON.parse(await Request(options));
        return result;
    } catch (e) {
        console.error(e);
    }
}

/** GET informations about the page using BUSINESS DISCOVERY **/
async function getBusinessDiscoveryInfo(pageID, token) {
    let result, username;
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/' + pageID,
        qs: {
            access_token: token,
            fields: ''
        }
    };

    try {
        username = await getUsernameFromId(pageID, token);
        options.qs.fields = 'business_discovery.username(' + username + '){followers_count,media_count}';

        result = JSON.parse(await Request(options));
        return result['business_discovery'];
    } catch (e) {
        console.error(e);
    }
}

/** Facebook Page/Insight query **/
function instagramQuery(method, metric, period=null, since=null, until=null,pageID, token, date_preset=null, mediaID=null) {

    if(since){
        since.setDate(since.getDate());
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
    let result = {}, access_token;
    try {
        access_token = await getPageAccessToken(token, pageID);
        let final = [];
        let temp = [];
        for(let index in metric) {
            temp.push(JSON.parse(await instagramQuery(GET, metric[index], period, since, until, pageID, access_token, null, mediaID))['data'][0]['values']);
            //every data carries on its metric
            for(let i in temp[temp.length-1]) {
                temp[temp.length-1][i].metric = metric[index];
            }
        }
        for(let index in temp) {
            final = final.concat(temp[index]);
            //final = final.concat('-');
        }
        result = final;
        return result;//['data'][0]['values'];
    } catch (e) {
        console.error(e);
        throw new Error("Bad Instagram Request");
    }
};

module.exports = {getInstagramData, getPagesID, getMedia, getStories, getBusinessDiscoveryInfo, revokePermission, METRICS, PERIOD, INTERVAL};
