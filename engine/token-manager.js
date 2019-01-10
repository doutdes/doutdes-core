'use strict';

const Model = require('../models/index');
const Users = Model.Users;
const FbToken = Model.FbToken;
const GaToken = Model.GaToken;

const HttpStatus = require('http-status-codes');
const Request = require('request-promise');

exports.readAllKeysById = (req, res, next) => {

    Users.findOne({
            where: {id: req.user.id},
            include: [
                {model: GaToken},
                {model: FbToken}]
        }
    )
        .then(result => {
            let fb = result.dataValues.FbTokens[0];
            let ga = result.dataValues.GaTokens[0];

            console.log("Tokens: " + fb + "\n" + ga);

            if (fb == null && ga == null)
                return res.status(HttpStatus.NO_CONTENT).send({});

            let fb_token = (fb == null) ? null : fb.dataValues.api_key;       // Token
            let ga_token = (ga == null) ? null : ga.dataValues.client_email;  // Client email

            return res.status(HttpStatus.OK).send({
                user_id: req.user.id,
                fb_token: fb_token,
                ga_token: ga_token
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Cannot retrieve user tokens.'
            })
        });
};

exports.insertKey = (req, res, next) => {
    const service_id = parseInt(req.body.service_id);

    switch (service_id) {
        case 0: //fb
            return insertFbKey(req, res);
        case 1: //google
            return insertGaData(req, res);
        default:
            console.log('ERROR TOKEN-MANAGER. Unrecognized service type: ' + service_id);
            return res.status(HttpStatus.BAD_REQUEST).send({
                created: false,
                error: 'Unrecognized service type.'
            });
    }

};

exports.update = (req, res, next) => {
    const service_id = parseInt(req.body.service_id);
    switch (service_id) {
        case 0: //fb
            return updateFbKey(req, res);
        case 1: //google
            return updateGaData(req, res);
        default:
            return res.status(HttpStatus.BAD_REQUEST).send({
                created: false,
                error: 'Unrecognized service type.'
            });
    }

};

exports.delete = (req, res, next) => {
    const service_id = parseInt(req.body.service_id);

    switch (service_id) {
        case 0: //fb
            return deleteFbKey(req, res);
        case 1: //google
            return deleteGaData(req, res);
        default:
            return res.status(HttpStatus.BAD_REQUEST).send({
                created: false,
                error: 'Unrecognized service type.'
            });
    }
};

function insertFbKey(req, res) {
    FbToken.findOne({
        where: {
            user_id: req.user.id,
        }
    }).then(async key => {
        if (key !== null) {
            console.log('ERROR TOKEN-MANAGER. Key already exists.');
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'Facebook token already exists'
            })
        }
        else {
            // Get the right token by doing the call to /me/accounts
            const token = await getPageToken(req.body.api_key);

            console.log(token);

            FbToken.create({
                user_id: req.user.id,
                api_key: token
            })
                .then(new_key => {
                    return res.status(HttpStatus.CREATED).send({
                        created: true,
                        api_key: token
                    });
                })
                .catch(err => {
                    console.log('ERROR TOKEN-MANAGER. Cannot insert the row in db. Details below:');
                    console.log(err);
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        created: false,
                        api_key: token,
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
                error: 'Google Analytics access token already exists!'
            });
        }
        else {
            let user_id = req.user.id;
            let client_email = req.body.client_email;
            let private_key = req.body.private_key;

            GaToken.create({
                user_id: user_id,
                client_email: client_email,
                private_key: private_key
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
                        client_email: client_email,
                        private_key: private_key,
                        error: 'Cannot add new Google Analytics access token.'
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

async function getPageToken(token) {
    const options = {
        method: GET,
        uri: 'https://graph.facebook.com/me/accounts',
        qs: {
            access_token: token
        }
    };

    try {
        const response = JSON.parse(await Request(options));
        return response['data'][0]['access_token'];
    } catch (e) {
        console.error(e);
        return null;
    }
}
