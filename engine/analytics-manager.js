'use strict';

const FacebookApi = require ('../api_handler/facebook-api');

exports.fbFanCount = function (req,res,next){

    FacebookApi.fbFanCount()
        .then(fan_count =>{
            res.json(fan_count);})
        .catch(err => {
            res.json(err);
        });
};