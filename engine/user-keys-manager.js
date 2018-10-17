'use strict';

const Model = require('../models/index');
const FbToken = Model.Fb_user_token;
const GaToken = Model.Ga_data;

const HttpStatus = require('http-status-codes');

exports.readAllKeysById = (req, res, next) => {
    FbToken.findOne({
        where: {
            user_id: req.user.id
        }
    })
        .then(fb_key => {
            GaToken.findOne({
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

exports.insertKey = (req, res, next) => {
    const service_id = req.body.service_id;
    switch (service_id) {
        case 0: //fb
            return insertFbKey(req, res);
        case 1: //google
            return insertGaData(req, res);
        default:
            return res.status(HttpStatus.BAD_REQUEST).send({
                created: false,
                error: 'Insert unavailable for selected service'
            });
    }
    ;
};

exports.update = (req, res, next) => {
    const service_id = req.body.service_id;
    switch (service_id) {
        case 0: //fb
            return updateFbKey(req, res);
        case 1: //google
            return updateGaData(req, res);
        default:
            return res.status(HttpStatus.BAD_REQUEST).send({
                created: false,
                error: 'Update unavailable for selected service'
            });
    }
    ;
};

exports.delete = (req, res, next) => {
    const service_id = req.body.service_id;
    switch (service_id) {
        case 0: //fb
            return deleteFbKey(req, res);
        case 1: //google
            return deleteGaData(req, res);
        default:
            return res.status(HttpStatus.BAD_REQUEST).send({
                created: false,
                error: 'Delete unavailable for selected service'
            });
    }
    ;
};

function insertFbKey(req, res) {
    FbToken.findOne({
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
            FbToken.create({
                user_id: req.user.id,
                api_key: FbToken.api_key
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
                        api_key: FbToken.api_key,
                        error: 'Cannot insert the key'
                    });
                })
        }
    })
};

function insertGaData(req, res) {
    GaToken.findOne({
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
            GaToken.create({
                user_id: req.user.id,
                client_email: GaToken.client_email,
                private_key: GaToken.private_key
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
                        client_email: GaToken.client_email,
                        private_key: GaToken.private_key,
                        error: 'Cannot insert the credentials'
                    });
                })
        }
    })
};

function updateFbKey(req, res) {
    FbToken.update({
        api_key: FbToken.api_key
    }, {
        where: {
            user_id: req.user.id
        }
    }).then(up_key => {
        return res.status(HttpStatus.OK).send({
            updated: true,
            api_key: FbToken.api_key
        })
    }).catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            updated: false,
            api_key: FbToken.api_key,
            error: 'Cannot update the Facebook key'
        })
    })
};

function updateGaData(req, res) {
    GaToken.update({
        client_email: GaToken.client_email,
        private_key: GaToken.private_key
    }, {
        where: {
            user_id: req.user.id
        }
    }).then(up_key => {
        return res.status(HttpStatus.OK).send({
            updated: true,
            client_email: GaToken.client_email,
            private_key: GaToken.private_key
        })
    }).catch(err => {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            updated: false,
            client_email: GaToken.client_email,
            private_key: GaToken.private_key,
            error: 'Cannot update the Google Analytics credentials'
        })
    })
};

function deleteFbKey(req, res) {
    FbToken.destroy({
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

function deleteGaData(req, res) {
    GaToken.destroy({
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
