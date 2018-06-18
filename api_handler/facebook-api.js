/**
 * API calls from Page Insights Facebook
 * */

const Request = require('request-promise');
const page_id = '1397642170275248';
const access_token = 'EAAYgMsLsh6kBAHaIb2LuEnDBn4k2KIYvZCgTqqoUeVk8R97ZATKLVRFbPuWr2ppeXwsRsEKxtRdKaqsUogJjaRq3B81UMkVYy5IBAmZAOhUKDvYZBntWjnA865bz8vamvclZAgy3gE3Uv6X4NM5EOeLq38viSq4u4QC80CfTZBfwZDZD'

exports.fb_insights_engaged_users = function () {

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

exports.fb_insights_page_impressions_unique = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_impressions_unique',
            period: 'days_28'
        }
    };
    return Request(options);

};

exports.fb_insights_page_impressions_by_city_unique = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_impressions_by_city_unique',
            period: 'days_28'
        }
    };
    return Request(options);

};

exports.fb_insights_page_impressions_by_country_unique = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_impressions_by_country_unique',
            period: 'days_28'
        }
    };
    return Request(options)

};

exports.fb_insights_page_actions_post_reactions_total = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_actions_post_reactions_total',
            period: 'days_28'
        }
    };
    return Request(options);

};

exports.fb_insights_page_fans = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_fans'
        }
    };
    return Request(options);

};

exports.fb_insights_page_fans_city = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_fans_city'
        }
    };
    return Request(options);

};

exports.fb_insights_page_fans_country = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_fans_country'
        }
    };
    return Request(options);

};

exports.fb_insights_page_fans_adds_unique = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_fans_adds_unique',
            period: 'day'
        }
    };
    return Request(options);

};

exports.fb_insights_page_fans_removes_unique = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_fans_removes_unique',
            period: 'day'
        }
    };
    return Request(options);

};

exports.fb_insights_page_views_external_referrals = function () {

    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/' + page_id + '/insights/',
        qs: {
            access_token: access_token,
            metric: 'page_views_external_referrals',
            period: 'day'
        }
    };
    return Request(options);

};