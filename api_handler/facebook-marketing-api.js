'use strict';

/**
 * API calls from Page Insights Facebook
 **/
const Request = require('request-promise');
const fbInsightURI = 'https://graph.facebook.com/v3.3/';

const level_params = {
    'insights':'reach, impressions, spend, inline_link_clicks, clicks, cpc, cpp, ctr',
    'campaigns': 'name, effective_status, daily_budget, bid_strategy, budget_remaining, objective, buying_type',
    'adsets':'name, effective_status, bid_amount , billing_event, optimization_goal, insights{campaign_name}',
    'ads':'name, effective_status, insights{campaign_name, adset_name}'};

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
        method: GET,
        uri: 'https://graph.facebook.com/me/accounts',
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


// See how to generalize it
// SET a start_date and end_date period
// Try to use the most fields possible for each query
const facebookQuery = async (pageID, token, level, startDate, endDate, group) => {
    let result;
    console.log(token);
    const options = {
        uri: fbInsightURI + pageID + '/' + level,
        qs: {
            access_token: token,
            //period: period,
            fields: level_params[level],
            time_range: {since: startDate, until: endDate},
            breakdowns: breakdownsParams[group]
        },
        json: true
    };


    try {
        result = await Request(options);
        return result;
    } catch (err) {
        console.error(err['message']);
        throw new Error('facebookQuery -> Error during the Facebook query -> ' + err['message']);
    }
};

module.exports = {getPageAdsIds, facebookQuery, getPagesID};
