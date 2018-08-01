'use strict';

const Model = require('../models/index');
const User_keys = Model.User_keys;
const Op = Model.Sequelize.Op;
const FB_SERVICE = 0;
const GA_SERVICE = 1;

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
    //const accessToken = 'EAAYgMsLsh6kBAHaIb2LuEnDBn4k2KIYvZCgTqqoUeVk8R97ZATKLVRFbPuWr2ppeXwsRsEKxtRdKaqsUogJjaRq3B81UMkVYy5IBAmZAOhUKDvYZBntWjnA865bz8vamvclZAgy3gE3Uv6X4NM5EOeLq38viSq4u4QC80CfTZBfwZDZD';
    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
        }
    }).then(key => {
        FacebookApi.getInsightsPageFans(LIFETIME, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if(err.statusCode === 400){
                    return res.status(HttpStatus.BAD_REQUEST).send({
                        name: 'Facebook Bad Request',
                        message: 'Invalid OAuth access token.'
                    });
                }
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                    name: 'Facebook Internal Server Error',
                    message: 'There is a problem with Facebook servers'
                });
            })
    })
        .catch(err =>{
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

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
