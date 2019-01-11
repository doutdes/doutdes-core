'use strict';

const Model = require('../../models/index');
const FbToken = Model.FbToken;

const HttpStatus = require('http-status-codes');

/***************** FACEBOOK *****************/
const FacebookApi = require('../../api_handler/facebook-api');

// TODO change the response if there are no data
const setMetric = (metric) => {
    return function(req, res, next){
        req.metric = metric;
        next();
    }
};
const fb_getData = async (req, res, next) => {
    let key;
    let data;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = await FacebookApi.getFacebookData(req.metric, DAY, key.api_key);

        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Facebook Bad Request',
                message: 'Invalid OAuth access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        });
    }
};

/** EXPORTS **/
module.exports = {setMetric, fb_getData};