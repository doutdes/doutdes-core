'use strict';

/***************** FACEBOOK *****************/
const FacebookApi = require('../api_handler/facebook-api');

exports.fb_insights_page_fans = function (req, res, next) {

    FacebookApi.fb_insights_page_fans()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_engaged_users = function (req, res, next) {

    FacebookApi.fb_insights_engaged_users()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });
};

exports.fb_insights_page_impressions_unique = function (req, res, next) {
    FacebookApi.fb_insights_page_impressions_unique()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_impressions_by_city_unique = function (req, res, next) {
    FacebookApi.fb_insights_page_impressions_by_city_unique()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_impressions_by_city_unique = function (req, res, next) {
    FacebookApi.fb_insights_page_impressions_by_city_unique()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_impressions_by_country_unique = function (req, res, next) {
    FacebookApi.fb_insights_page_impressions_by_country_unique()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_actions_post_reactions_total = function (req, res, next) {
    FacebookApi.fb_insights_page_actions_post_reactions_total()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_fans_city = function (req, res, next) {
    FacebookApi.fb_insights_page_fans_city()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_fans_country = function (req, res, next) {
    FacebookApi.fb_insights_page_fans_country()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_fans_adds_unique = function (req, res, next) {
    FacebookApi.fb_insights_page_fans_adds_unique()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_fans_removes_unique = function (req, res, next) {
    FacebookApi.fb_insights_page_fans_removes_unique()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};

exports.fb_insights_page_views_external_referrals = function (req, res, next) {
    FacebookApi.fb_insights_page_views_external_referrals()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        });

};


