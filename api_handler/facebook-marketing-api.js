'use strict';

/**
 * API calls from Page Insights Facebook
 **/
const Request = require('request-promise');
const fbInsightURI = 'https://graph.facebook.com/v4.0/';

const level_params = {
    'insights':'reach, impressions, spend, inline_link_clicks, clicks, cpc, cpp, ctr',
    'campaigns': 'id, name, effective_status, daily_budget, bid_strategy, budget_remaining, objective, buying_type, insights{reach, impressions, spend, inline_link_clicks, clicks, cpc, cpp, ctr}',
    'adsets':'id, name, effective_status, bid_amount , billing_event, optimization_goal, campaign{name}, insights{reach, impressions, spend, inline_link_clicks, clicks, cpc, cpp, ctr}',
    'ads':'id, name, effective_status, campaign{name}, adset{name}, insights{reach, impressions, spend, inline_link_clicks, clicks, cpc, cpp, ctr}'};

const breakdownsParams = {
    age: 'age',
    gender: 'gender',
    genderAge: 'age, gender',
    countryRegion: 'country,region',
    hourlyAdvertiser: 'hourly_stats_aggregated_by_advertiser_time_zone',
    hourlyAudience: 'hourly_stats_aggregated_by_audience_time_zone'
};

const getPageAdsIds = async (token) => {
    let result;
    const options = {

        //method: GET,
        uri: fbInsightURI + 'me/adaccounts',
        qs: {
            access_token: token
        },
        json: true
    };

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('getPagesID -> Error during the Facebook query -> ' + err['message']);
    }
};

const getPagesID = async (token) =>  {
    let result;
    const options = {
        method: 'GET',
        uri: 'https://graph.facebook.com/v4.0/me/adaccounts',
        qs: {
            access_token: token,
            fields: 'name, business_name',
        },
        json: true
    };

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('getPagesID -> Error during the Facebook query -> ' + err['message']);
    }
};

const facebookQuery = async (pageID, token, domain, breakdown, metric, startDate, endDate, id) => {
    let result;

    metric = metric !== 'null' ? metric : level_params[domain];
    breakdown = breakdown !== 'null' ? breakdown : '';

    const options = {
        uri: fbInsightURI + pageID + '/' + domain,
        qs: {
            access_token: token,
            fields: metric,
            //time_range: {since: startDate, until: endDate},
            date_preset: 'last_90d',
            time_increment: 1,
            breakdowns: breakdown,
            limit: 10000
        },
        json: true
    };

    if (id && domain === 'adsets') {
        options.qs.filtering = [{"field":"campaign.id","operator":"EQUAL", "value":id}];
    }
    else if(id && domain === 'ads') {
        options.qs.filtering = [{"field":"adset.id","operator":"EQUAL", "value":id}];
    }

    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('facebookQuery -> Error during the Facebook query -> ' + err['message']);
    }
};

module.exports = {getPageAdsIds, facebookQuery, getPagesID};
