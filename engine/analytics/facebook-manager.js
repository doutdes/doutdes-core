'use strict';

const Model = require('../../models/index');
const User_keys = Model.User_keys;
const Op = Model.Sequelize.Op;
const FB_SERVICE = 0;

const HttpStatus = require('http-status-codes');

/***************** FACEBOOK *****************/
const FacebookApi = require('../../api_handler/facebook-api');

exports.fb_getEngagedUsers = function (req, res, next) {

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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

    User_keys.findOne({
        where: {
            [Op.and]: [
                {user_id: req.user.id},
                {service: FB_SERVICE}
            ]
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
