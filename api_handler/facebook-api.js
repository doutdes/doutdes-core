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
            period: 'days_28'
        }
    };
    return Request(options);
};


// const {FB, FacebookApiException} = require('fb');
//
// FB.options({
//     version: 'v3.0',
//     accessToken: 'EAACEdEose0cBAIZB3e0oYIXKONS9F1sVCXZBajegts94uwfd4S05KZCcNbbmOEhulReJMdI6ezOTJkLKXvp2RBZARvBaqF5pGD8mCuXeW9nB7Rk3EKt70fHAKllGbcHx1A234NhhIZCvl1xHSpbffvwzeWQ7Jo0HMA0RJE0KXHJHcw7qt3wbEtaBxCA0Q1BHHaH3viMLDtQZDZD'
// });
// FB.extend({appID: '1397642170275248'});
//
// exports.fbFanCount = () => {
//     return FB.api('4', {fields: ['id', 'name']}, function (res) {
//         if (!res || res.error) {
//             console.log(!res ? 'error occurred' : res.error);
//             return;
//         }
//         console.log(res.id);
//         console.log(res.name);
//     });
// };




