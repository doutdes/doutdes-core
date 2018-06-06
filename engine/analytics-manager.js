'use strict';

const fbApi = require ('../api_handler/facebook-api');

exports.fbFanCount = function (){
    return new Promise ((resolve,reject)=>{
        fbApi.fbFanCount()
            .then(fan_count =>{
                resolve(fan_count);})
            .catch(err => {
                reject(err);
            });
    });
};