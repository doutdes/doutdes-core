'use strict';

const fs = require('fs');

const DashboardManager = require('./dashboard-manager');
const Model = require('../models');
const User = require('../models/index').Users;
const passport = require('../app').passport;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto-random-string');
const jwt = require('jsonwebtoken');
const sendmail = require('sendmail')({
    /*
    logger: {
        debug: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error
    },
    silent: false,
    dkim: {
        //domainName: 'gmail.com',
        //keySelector: '2019',
        privateKey: '-----BEGIN RSA PRIVATE KEY-----\n' +
            'MIICXgIBAAKBgQCsCxHs9mCwRJmYz1gAiGeFXeeqTdJQ1zFbsj2AuCZcwesgHo1e\n' +
            'CmHahRXPYnXejTs/tUMQjhdO5KyKv1OGWOJVufGVp/2KVZ25Wx228XEX4yI7l16v\n' +
            'Vr/82ZIZFWyFRDhLlRtw0Hm6WNz0YHWZQtN9ggCAdwieByq3pvrONNEdOQIDAQAB\n' +
            'AoGBAIrwDbPubLstS1Wq7QjRH7kG0xYn7tc2UjgZQ632CZUTTg0MX2I4xDmzDKAE\n' +
            'hegK6nRSsCxoc85UwjrytENk+LKqkKkV8+toAv61EW1DpZFC6LiHJ76oXM8yn6r5\n' +
            'b/5Uzv9ee4X1Kk2BXQOE7KOWTdpqEOkD7ZddDOzOToEfGqbhAkEA4syXNOIjPvow\n' +
            't6basJauVCNXNwCsaKuRJTM9UTYQgVl6nF6yU08KSMgCEhSYjtQL8dIUwdatP3zp\n' +
            's7DQZnUd5QJBAMIxsoudpTHyPKtRn7ztJ+tBbooZW1bP00kcq/Po8zbfiAOCeeXT\n' +
            'xjowkiNtFTx4UzKAsR+fzPRZ/ZuM3C567MUCQQDSD2RNGtZCUkAlGWmb/TPhwgnZ\n' +
            'a8pD+AQrTFYSjdyjsVia1Cqedqqz1mv0ixbx0vxtMYMANfGox+08/RtIiljxAkEA\n' +
            'wd1/U2ZUDqK38ogQIjnXykKOKgvaZbYgRjL7bwq2E6fgTzCopMpgcKMgoYE63B17\n' +
            'YUWcjeeoYqCcT/e1sClDyQJAS4vwcbA3fwZ+yiHbxsS6nZ42Ouah7jV1Fvmdm4dR\n' +
            'Pe1T1ZGXs2emyRZEHqu4OCZFAjp5nwqGQ98M3dvI3Y3qug==\n' +
            '-----END RSA PRIVATE KEY-----',
        keySelector: '1570031675.gmail'
        },
        //devPort: 8080,
        //devHost: 'localhost',
        smtpPort: 465,
        smtpHost: 'smtp.gmail.com'
    */
});

const HttpStatus = require('http-status-codes');

/** USER CRUD **/

const createUser = async (req, res) => {
    const Op = Model.Sequelize.Op;
    const user = req.body;
    const password = bcrypt.hashSync(user.password);
    const token = crypto({length: 30});

    User.findAll({
        where: {
            [Op.or]: [
                {username: user.username},
                {email: user.email}
            ]
        }
    })
        .then(userbn => {
            // user !== null then a username or an email already exists in the sistem
            // the registration has to be rejected
            if (userbn.length !== 0) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    created: false,
                    error: 'Username or email already exists',
                });
            } else {
                User.create({
                    username: user.username,
                    email: user.email,
                    company_name: user.company_name,
                    vat_number: user.vat_number,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    birth_place: user.birth_place,
                    birth_date: user.birth_date || user.birth_date !== '' ? new Date(user.birth_date) : null,
                    fiscal_code: user.fiscal_code,
                    address: user.address,
                    province: user.province,
                    city: user.city,
                    zip: user.zip,
                    password: password,
                    user_type: getUserTypeByString(user.user_type),
                    is_verified: false,
                    token: token,
                    checksum: '0'
                })
                    .then(newUser => {

                        const user_id = newUser.get('id');
                        DashboardManager.internalCreateDefaultDashboards(user_id)
                            .then(() => {
                                //if (!is_verified)
                                try {
                                    // TODO FIX: ripristinare sendmail
                                    //sendMail(res, user.email, token);
                                }
                                catch (err) {
                                    console.error("Cannot send the email. Probably, the SMTP server is not active in this machine.");
                                    //console.log(err);
                                }

                                return res.status(HttpStatus.CREATED).send({
                                    created: true,
                                    first_name: newUser.get('first_name'),
                                    last_name: newUser.get('last_name')
                                });
                            })
                            .catch(err => {
                                User.destroy({where: {id: user_id}}); // Deletes the new db row

                                console.log('ACCESS_MANAGER ERROR. Details below:');
                                console.error(err);
                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                                    created: false,
                                    message: 'Cannot create the new user',
                                    username: user.username
                                });
                            });
                    })
                    .catch(err => {
                        console.log('ACCESS_MANAGER ERROR. Details below:');
                        console.error(err);
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                            created: false,
                            message: 'Cannot create the new user',
                            username: user.username
                        });
                    })
            }
        })
    ;
};

const getUserById = (req, res) => {
    User.findById(req.user.id)
        .then(user => {
            return res.status(HttpStatus.OK).send(user);
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot GET the user informations'
            });
        })
};

const updateUser = (req, res) => {

    const user = req.body;
    const password = user.password ? bcrypt.hashSync(user.password) : null;

    Model.Users.update({
        username: user.username,
        email: user.email,
        company_name: user.company_name,
        vat_number: user.vat_number,
        first_name: user.first_name,
        last_name: user.last_name,
        birth_place: user.birth_place,
        birth_date: new Date(user.birth_date),
        fiscal_code: user.fiscal_code,
        address: user.address,
        province: user.province,
        city: user.city,
        zip: user.zip,
        lang: user.lang,
        password: password || req.user.password
    }, {
        where: {
            id: req.user.id
        }
    })
        .then(newUser => {
            return res.status(HttpStatus.OK).json({
                updated: true,
                user_id: req.user.id
            })
        })
        .catch(err => {
            console.error(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                updated: false,
                user_id: req.user.id,
                error: 'Cannot update the user'
            })
        });
};

const deleteUser = (req, res) => {
    Model.Users.destroy({where: {user: req.body.username}})
        .then(() => {
            return res.status(HttpStatus.OK).json({
                deleted: true,
                username: parseInt(req.body.username)
            })
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                deleted: false,
                user: req.body.username,
                message: 'Cannot delete the user'
            })
        })
};

/*Sends the mail in order to confirm registration to DoUtDes platform*/
const sendMail = (res, email, token) => {
    let mail = 'Click on this <a href="http://localhost:8080/users/verifyEmail?token=' + token +
        '&email=' + email + '&redirect=true"' + '> link </a> to verify your email.' +
        ' <br>Se il link non funziona, clicca <a href="http://localhost:4200/#/authentication/account-verification">qui</a> ' +
        'ed inserisci il token: ' + token;

    sendmail({
        from: 'doutdes.unica@gmail.com',
        to: email,
        subject: 'Registrazione DoUtDes.',
        html: mail
    }, function (err, reply) {
        if (err) {
            console.error(err);
            console.log(reply);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                message: 'Email non inviata',
                error: err
            })
        } else {
            return res.status(HttpStatus.OK).send({
                message: 'Email inviata'
            })
        }
    });

};

const verifyEmail = (req, res) => {
    const email = req.query.email;
    const token = req.query.token;
    const redirect = req.query.redirect ? (req.query.redirect === 'true') : false;

    User.find({
        where: {email: email}
    }).then(user => {
        if (user.is_verified) {
             if (redirect) {
                return res.redirect('http://localhost:4200/#/authentication/login?verified=true&token_verified=true');
             }

            return res.status(HttpStatus.OK).send({
                verified: true,
                message: 'Email Already Verified'
            });

        } else {
            if (user.token === token) {
                user
                    .update({is_verified: true})
                    .then(updateUser => {
                        if (redirect){
                            return res.redirect('http://localhost:4200/#/authentication/login?verified=true&token_verified=false');
                        }

                        return res.status(HttpStatus.OK).send({
                            verified: true,
                            message: 'User with ' + email + ' has been verified'
                        });

                    })
                    .catch(reason => {

                        if (redirect) {
                            return res.redirect('http://localhost:4200/#/authentication/account-verification?verified=false&token_validation=false');
                        }

                        return res.status(HttpStatus.FORBIDDEN).send({
                            verified: false,
                            message: 'Token failed'
                        });

                    });
            } else {
                if (redirect) {
                    return res.redirect('http://localhost:4200/#/authentication/account-verification?verified=false&token_validation=false');
                }
                return res.status(HttpStatus.NOT_FOUND).send({
                    verified: false,
                    message: 'Token expired',
                });
            }
        }
    })
        .catch(reason => {
            if (redirect) {
                return res.redirect('http://localhost:4200/#/authentication/account-verification?verified=false&email_validation=false');
            }

            return res.status(HttpStatus.NOT_FOUND).send({
                verified: false,
                message: 'Email not found'
            });
        });
};

/** INTERNAL METHODS **/
const getUserTypeByString = (stringType) => {
    let type;

    switch (stringType) {
        case 'company':
            type = 1;
            break;
        case 'editor':
            type = 2;
            break;
        case 'analyst':
            type = 3;
            break;
    }

    return type;
};


/** LOGIN METHODS **/
const basicLogin = (req, res, next) => {
    passport.authenticate('basic', {session: false}, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                logged: false,
                error: 'unauthorized'
            })
        } else {
            const token = jwt.sign(user.dataValues, 'your_jwt_secret');

            if(user.is_verified) {
                return res.status(HttpStatus.OK).send({
                    'User': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'user_type': user.user_type
                    },
                    'token': token
                });
            } else {
                return res.status(HttpStatus.FORBIDDEN).send({
                    logged: false,
                    error: 'Account not verified'
                })
            }
        }
    })(req, res, next);
};
const roleAuth = function (roles) {
    return async (req, res, next) => {
        let user = req.user;
        let userFound;

        try {
            userFound = await User.findById(user.id);

            if (roles.indexOf(userFound.user_type) > -1) {
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');


        } catch (e) {
            res.status(422).json({error: 'No user found.'});
            return next(err);
        }
    }
};

/** METHOD EXPORT **/
module.exports = {createUser, getUserById, updateUser, deleteUser, sendMail, basicLogin, roleAuth, verifyEmail};
