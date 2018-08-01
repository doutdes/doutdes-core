'use strict';

const Model = require('../models/index');
const User_keys = Model.User_keys;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

/***************** FACEBOOK *****************/
const FacebookApi = require('../api_handler/facebook-api');

exports.fb_getEngagedUsers = function (req, res, next) {


    FacebookApi.getInsightsEngagedUsers(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });
};

exports.fb_getPageImpressionsUnique = function (req, res, next) {

    FacebookApi.getInsightsPageImpressionsUnique(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageImpressionsByCityUnique = function (req, res, next) {

    FacebookApi.getInsightsPageImpressionsByCityUnique(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageImpressionsByCountryUnique = function (req, res, next) {

    FacebookApi.getInsightsPageImpressionsByCountryUnique(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageActionsPostReactionsTotal = function (req, res, next) {

    FacebookApi.getInsightsPageActionsPostReactionsTotal(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFans = function (req, res, next) {

    const accessToken = 'EAAYgMsLsh6kBAHaIb2LuEnDBn4k2KIYvZCgTqqoUeVk8R97ZATKLVRFbPuWr2ppeXwsRsEKxtRdKaqsUogJjaRq3B81UMkVYy5IBAmZAOhUKDvYZBntWjnA865bz8vamvclZAgy3gE3Uv6X4NM5EOeLq38viSq4u4QC80CfTZBfwZDZD';

    FacebookApi.getInsightsPageFans(LIFETIME, accessToken)
        .then(result => {
            var jsonResult = JSON.parse(result);
            console.log('Analytics Manager: ' + jsonResult);
            return res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            console.log('errore' + err);
            return res.send(err);
        });
};

exports.fb_getPageFansCity = function (req, res, next) {

    FacebookApi.getInsightsPageFansCity(LIFETIME)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFansCountry = function (req, res, next) {

    FacebookApi.getInsightsPageFansCountry(LIFETIME)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFansAddsUnique = function (req, res, next) {

    FacebookApi.getInsightsPageFansAddsUnique(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageFansRemovesUnique = function (req, res, next) {

    FacebookApi.getInsightsPageFansRemovesUnique(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_getPageViewsExternalReferrals = function (req, res, next) {

    FacebookApi.getInsightsPageViewsExternalReferrals(DAY)
        .then(result => {
            var jsonResult = JSON.parse(result);
            res.send(jsonResult.data[0].values);
        })
        .catch(err => {
            res.json(err);
        });

};
