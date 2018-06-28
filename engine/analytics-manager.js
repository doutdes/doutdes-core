'use strict';

/***************** FACEBOOK *****************/
const FacebookApi = require('../api_handler/facebook-api');

exports.fb_getEngagedUsers = function (req, res, next) {

    FacebookApi.getInsightsEngagedUsers(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });
};

exports.fb_getPageImpressionsUnique = function (req, res, next) {
    FacebookApi.getInsightsPageImpressionsUnique(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageImpressionsByCityUnique = function (req, res, next) {
    FacebookApi.getInsightsPageImpressionsByCityUnique(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageImpressionsByCountryUnique = function (req, res, next) {
    FacebookApi.getInsightsPageImpressionsByCountryUnique(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageActionsPostReactionsTotal = function (req, res, next) {
    FacebookApi.getInsightsPageActionsPostReactionsTotal(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFans = function (req, res, next) {

    FacebookApi.getInsightsPageFans(LIFETIME)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFansCity = function (req, res, next) {
    FacebookApi.getInsightsPageFansCity(LIFETIME)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFansCountry = function (req, res, next) {
    FacebookApi.getInsightsPageFansCountry(LIFETIME)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFansAddsUnique = function (req, res, next) {
    FacebookApi.getInsightsPageFansAddsUnique(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFansRemovesUnique = function (req, res, next) {
    FacebookApi.getInsightsPageFansRemovesUnique(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageViewsExternalReferrals = function (req, res, next) {
    FacebookApi.getInsightsPageViewsExternalReferrals(DAY)
        .then(result => {
            res.send(result);
        })
        .catch(err => {
            res.json(err);
        });

};


