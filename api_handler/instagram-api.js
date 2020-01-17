/** INSTAGRAM API HANDLER **/

/** IMPORTS **/
const Request = require('request-promise');

/** CONSTANTS **/
const igInsightURI = 'https://graph.facebook.com/';

/** Metrics available for media:
 * engagement
 * saved
 * video_views
 */

/** Metrics available for stories:
 * impressions
 * reach
 * exits
 * replies
 * taps_forward
 * taps_back
 */

const revokePermission = require('./facebook-api').revokePermission;

async function getPageAccessToken(token, pageID) {
    let result;
    const options = {
        method: 'GET',
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
};

/** GET pageID from instagram token**/
async function getPagesID(token) {
    let result;
    const options = {
        method: 'GET',
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
        method: 'GET',
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
        method: 'GET',
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
        method: 'GET',
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
        method: 'GET',
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
function instagramQuery(method, metric,pageID, token, period=null, since=null, until=null, date_preset=null, mediaID=null) {
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

    if (since) options['qs']['since'] = since;
    if (until) options['qs']['until'] = until;

    if (period)      options['qs']['period'] = period;
    if (date_preset) options['qs']['date_preset'] = date_preset;

    if (mediaID)   options['uri'] = igInsightURI + mediaID + '/insights/';
    else           options['uri'] = igInsightURI + pageID + '/insights/';

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

const getInstagramData = async (channelId, metric, period, token, since=null, until=null, mediaID=null) => {
    let result = {}, access_token;

    try {
        access_token = await getPageAccessToken(token, channelId);
        result = JSON.parse(await instagramQuery('GET', metric, channelId, access_token, period, since, until, null, mediaID));
        let d={};
        let s;

        if(metric==='online_followers') { //time change compared to the time released by the API Instagram, +9
            for(let el of result['data'][0]['values']){
                d={}
                for (let i in el['value']){
                    s=(parseInt(i)+9)%24;
                    d[''+s]=el['value'][i];
                }
                el['value']=d;

            }
        }
        return result['data'][0]['values'];
    } catch (e) {
        console.error(e);
        throw new Error("Bad Instagram Request");
    }
};

module.exports = {getInstagramData, getPagesID, getMedia, getStories, getBusinessDiscoveryInfo, revokePermission};
