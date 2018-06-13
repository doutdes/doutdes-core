'use strict';

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

    // FB.options({
    //     version: 'v2.6',
    //     accessToken: 'EAAYgMsLsh6kBAK0kapfMxZBgMqtnzVuRO7XAOE42ZBgpF8LEZAjB56yYXZAWBu3CawvtZBWdY6Q9KY9Wim7QYzU6l4mikV5k7bAhUBm2YWuZBRRfIcorg8J3291o7kwj9Rm3UkvVRZCp1ZCTgmZAlRGZAFVONyfaBbVsS3SJE4bM8r3QZDZD'
    // });
    // //FB.extend({appID: '1724252250998697'});
    //
    // FB.api('1397642170275248' /*'1525666877712653'*/ , {insights : ['page_content_activity_by_action_type_unique']} , {fields: ['id', 'name', 'fan_count']} , function (resp) {
    //     if (!resp || resp.error) {
    //         console.log(!resp ? 'error occurred' : resp.error);
    //         return;
    //     }
    //     res.send({id:resp.id, name: resp.name, fan: resp.fan_count});
    // });
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