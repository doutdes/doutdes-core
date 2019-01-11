/** INSTAGRAM MANAGER **/

'use strict';

const Model = require('../../models/index');
const IgToken = Model.FbToken;

const HttpStatus = require('http-status-codes');

/***************** INSTAGRAM *****************/
const InstagramApi = require('../../api_handler/instagram-api');

exports.ig_getReach = function (req, res, next) {

    IgToken.findOne({
        where: {
            user_id: req.user.id
        }
    })
        .then(key => {
            InstagramApi.getReach(DAY, key.api_key)
                .then(result => {
                    var jsonResult = JSON.parse(result);
                    console.log('Analytics Manager: ' + jsonResult);
                    return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
                })
                .catch(err => {
                    console.error(err);
                    if (err.statusCode === 400) {
                        return res.status(HttpStatus.BAD_REQUEST).send({
                            name: 'Instagram Bad Request',
                            message: 'Invalid OAuth access token.'
                        });
                    }
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        name: 'Instagram Internal Server Error',
                        message: 'There is a problem with Instagram servers'
                    });
                })
        })
        .catch(err => {
            console.error(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};

exports.ig_getProfileViews = function (req, res, next) {

    IgToken.findOne({
        where: {
            user_id: req.user.id
        }
    })
        .then(key => {
            InstagramApi.getProfileViews(DAY, key.api_key)
                .then(result => {
                    var jsonResult = JSON.parse(result);
                    console.log('Analytics Manager: ' + jsonResult);
                    return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
                })
                .catch(err => {
                    console.error(err);
                    if (err.statusCode === 400) {
                        return res.status(HttpStatus.BAD_REQUEST).send({
                            name: 'Instagram Bad Request',
                            message: 'Invalid OAuth access token.'
                        });
                    }
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        name: 'Instagram Internal Server Error',
                        message: 'There is a problem with Instagram servers'
                    });
                })
        })
        .catch(err => {
            console.error(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })
};

exports.ig_getImpressions = function (req, res, next) {

    IgToken.findOne({
        where: {
            user_id: req.user.id
        }
    })
        .then(key => {
            InstagramApi.getImpressions(DAY, key.api_key)
                .then(result => {
                    var jsonResult = JSON.parse(result);
                    console.log('Analytics Manager: ' + jsonResult);
                    return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
                })
                .catch(err => {
                    console.error(err);
                    if (err.statusCode === 400) {
                        return res.status(HttpStatus.BAD_REQUEST).send({
                            name: 'Instagram Bad Request',
                            message: 'Invalid OAuth access token.'
                        });
                    }
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        name: 'Instagram Internal Server Error',
                        message: 'There is a problem with Instagram servers'
                    });
                })
        })
        .catch(err => {
            console.error(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};