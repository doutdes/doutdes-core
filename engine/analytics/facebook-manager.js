'use strict';

const Model = require('../../models/index');
const fb_user_token = Model.Fb_user_token;

const HttpStatus = require('http-status-codes');

/***************** FACEBOOK *****************/
const FacebookApi = require('../../api_handler/facebook-api');

exports.fb_getEngagedUsers = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsEngagedUsers(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};

exports.fb_getPageImpressionsUnique = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageImpressionsUnique(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        });

};

exports.fb_getPageImpressionsByCityUnique = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageImpressionsByCityUnique(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};

exports.fb_getPageImpressionsByCountryUnique = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageImpressionsByCountryUnique(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};

exports.fb_getPageActionsPostReactionsTotal = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageActionsPostReactionsTotal(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};

exports.fb_getPageFans = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
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
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};

exports.fb_getPageFansCity = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageFansCity(LIFETIME, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        })

};

exports.fb_getPageFansCountry = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageFansCountry(LIFETIME, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        });

};

exports.fb_getPageFansAddsUnique = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageFansAddsUnique(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        });

};

exports.fb_getPageFansRemovesUnique = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageFansRemovesUnique(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        });

};

exports.fb_getPageViewsExternalReferrals = function (req, res, next) {

    fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    }).then(key => {
        FacebookApi.getInsightsPageViewsExternalReferrals(DAY, key.api_key)
            .then(result => {
                var jsonResult = JSON.parse(result);
                console.log('Analytics Manager: ' + jsonResult);
                return res.status(HttpStatus.OK).send(jsonResult.data[0].values);
            })
            .catch(err => {
                console.log(err);
                if (err.statusCode === 400) {
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
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                name: 'Database Internal Error',
                message: 'There is a problem with our database'
            });
        });

};
