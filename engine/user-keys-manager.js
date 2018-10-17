'use strict';

const Model = require('../models/index');
const Users = Model.Users;
const Fb_user_token = Model.Fb_user_token;
const Ga_data = Model.Ga_data;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

exports.readAllKeysById = (req, res, next) => {
    Fb_user_token.findOne({
        where: {
            user_id: req.user.id
        }
    })
        .then(fb_key => {
            Ga_data.findOne({
                where: {
                    user_id: req.user.id
                }
            }).then(ga_key => {

                // controllare che ci siano sia fb key che ga_key
                // se uno o l'altro non esiste, mettere null nei suoi campi
                // se non esiste nulla, rendere NO_CONTENT

                if (fb_key === null && ga_key === null) {
                    return res.status(HttpStatus.NO_CONTENT).send({});
                }

                if (fb_key === null) {
                    return res.status(HttpStatus.OK).send({
                        user_id: req.user.id,
                        fb_token: null,
                        ga_client_email: ga_key.client_email,
                        ga_private_key: ga_key.private_key
                    });
                }

                if (ga_key === null) {
                    return res.status(HttpStatus.OK).send({
                        user_id: req.user.id,
                        fb_token: fb_key.api_key,
                        ga_client_email: null,
                        ga_private_key: null
                    });
                }

                return res.status(HttpStatus.OK).send({
                    user_id: req.user.id,
                    fb_token: fb_key.api_key,
                    ga_client_email: ga_key.client_email,
                    ga_private_key: ga_key.private_key
                });
            })

        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: err
            })
        });
};

exports.insertFbKey = (req, res, next) => {
    Fb_user_token.findOne({
        where: {
            user_id: req.user.id,
        }
    }).then(key => {
        if (key !== null) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'Facebook token already exists'
            })
        }
        else {
            Fb_user_token.create({
                user_id: req.user.id,
                api_key: Fb_user_token.api_key
            })
                .then(new_key => {
                    return res.status(HttpStatus.CREATED).send({
                        created: true,
                        api_key: new_key.api_key
                    });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        created: false,
                        api_key: Fb_user_token.api_key,
                        error: 'Cannot insert the key'
                    });
                })
        }
    })
};

exports.insertGaData = (req, res, next) => {
    Ga_data.findOne({
        where: {
            user_id: req.user.id,
        }
    }).then(key => {
        if (key !== null) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'Google Analytics data already exists'
            })
        }
        else {
            Ga_data.create({
                user_id: req.user.id,
                client_email: Ga_data.client_email,
                private_key: Ga_data.private_key
            })
                .then(new_key => {
                    return res.status(HttpStatus.CREATED).send({
                        created: true,
                        client_email: new_key.client_email,
                        private_key: new_key.private_key
                    });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        created: false,
                        client_email: Ga_data.client_email,
                        private_key: Ga_data.private_key,
                        error: 'Cannot insert the credentials'
                    });
                })
        }
    })
};

exports.updateFbKey = (req, res, next) => {
    Fb_user_token.update({
        api_key: Fb_user_token.api_key
    }, {
        where: {
            user_id: req.user.id
        }
    }).then(up_key => {
        return res.status(HttpStatus.OK).send({
            updated: true,
            api_key: Fb_user_token.api_key
        })
    }).catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            updated: false,
            api_key: Fb_user_token.api_key,
            error: 'Cannot update the Facebook key'
        })
    })
};

exports.updateGaData = (req, res, next) => {
    Ga_data.update({
        client_email: Ga_data.client_email,
        private_key: Ga_data.private_key
    }, {
        where: {
            user_id: req.user.id
        }
    }).then(up_key => {
        return res.status(HttpStatus.OK).send({
            updated: true,
            client_email: Ga_data.client_email,
            private_key: Ga_data.private_key
        })
    }).catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            updated: false,
            client_email: Ga_data.client_email,
            private_key: Ga_data.private_key
            error: 'Cannot update the Google Analytics credentials'
        })
    })
};

exports.deleteFbKey = (req, res, next) => {
    Fb_user_token.destroy({
        where: {
            user_id: req.user.id
        }
    }).then(del => {
        return res.status(HttpStatus.OK).send({
            deleted: true,
            message: 'Facebook token deleted successfully'
        })
    }).catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            deleted: false,
            error: 'Cannot delete the Facebook key'
        })
    })
};

exports.deleteGaData = (req, res, next) => {
    Ga_data.destroy({
        where: {
            user_id: req.user.id
        }
    }).then(del => {
        return res.status(HttpStatus.OK).send({
            deleted: true,
            message: 'Google Analytics data deleted successfully'
        })
    }).catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            deleted: false,
            error: 'Cannot delete the key'
        })
    })
};
