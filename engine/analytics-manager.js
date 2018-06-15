'use strict';

/***************** FACEBOOK *****************/
const FacebookApi = require('../api_handler/facebook-api');
//const {FB, FacebookApiException} = require('fb');

exports.fbFanCount = function (req, res, next) {

    FacebookApi.fbFanCount()
        .then(fan_count => {
            res.json(fan_count);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fbInsights = function (req, res, next) {

    FacebookApi.fbInsights()
        .then(fbInsights => {
            res.json(fbInsights);
        })
        .catch(err => {
            res.json(err);
        });
};

