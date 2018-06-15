/**
 * Classe per la gestione delle chiamate API da Facebook Insight
 * */

const Request = require('request-promise');
const page_id = '1397642170275248';
const access_token = 'EAAYgMsLsh6kBAHaIb2LuEnDBn4k2KIYvZCgTqqoUeVk8R97ZATKLVRFbPuWr2ppeXwsRsEKxtRdKaqsUogJjaRq3B81UMkVYy5IBAmZAOhUKDvYZBntWjnA865bz8vamvclZAgy3gE3Uv6X4NM5EOeLq38viSq4u4QC80CfTZBfwZDZD'

exports.fbFanCount = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id,
        qs: {
            access_token: access_token,
            fields: 'fan_count'
        }
    };
    return Request(options);
};

exports.fbInsights = function () {
    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_engaged_users',
            period: 'day'
        }
    };
    return Request(options);
};



