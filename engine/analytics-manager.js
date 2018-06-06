'use strict';

const fbApi = require ('../api_handler/facebook-api');

exports.fbFanCount = function (req,res,next){
    fbApi.fbFanCount()
        .then(fan_count =>{
            res.json(fan_count);})
        .catch(err => {
            res.json(err);
        });
};