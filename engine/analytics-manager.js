'use strict';

/***************** FACEBOOK *****************/
const FacebookApi = require('../api_handler/facebook-api');
//const {FB, FacebookApiException} = require('fb');

exports.fb_insights_page_fans = function (req, res, next) {

    FacebookApi.fb_insights_page_fans()
        .then(page_fans => {
            res.json(page_fans);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_engaged_users = function (req, res, next) {

    FacebookApi.fb_insights_engaged_users()
        .then(engaged_users => {
            res.json(engaged_users);
        })
        .catch(err => {
            res.json(err);
        });
};

