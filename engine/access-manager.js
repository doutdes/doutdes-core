'use strict';

const DashboardManager = require('./dashboard-manager');
const Model = require('../models');
const User = require('../models/index').Users;
const passport = require('../app').passport;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const HttpStatus = require('http-status-codes');


/**
 * @api {post} /users/create/ Create
 *
 * @apiName Create new user
 * @apiDescription The request create a new user
 * @apiGroup User
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} company_name Name of the company of the user.
 * @apiParam {String} vat_number Vat Number of the company of the user.
 * @apiParam {String} first_name First name of the user.
 * @apiParam {String} last_name Last name of the user.
 * @apiParam {String} birth_place Birth place of the user.
 * @apiParam {Date} birth_date Birth date of the user.
 * @apiParam {String} fiscal_code Fiscal code of the user.
 * @apiParam {String} address Address of residence of the user.
 * @apiParam {String} province Province of residence of the user.
 * @apiParam {String} city City of residence of the user.
 * @apiParam {String} zip Zip code associated to the city of residence of the user.
 * @apiParam {String} password Password needed by the user to login to the platform.
 * @apiParam {String} user_type Type of the user into the platform.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 CREATED
 *     {
 *          "created": true,
 *          "first_name": "Gianni",
 *          "last_name": "Sperti"
 *     }
 *
 * @apiError (400) UserAlreadyExists The username or the email has been alredy used.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 BAD REQUEST
 *     {
 *          "created": false,
 *          "error": "Username or email already exists",
 *     }
 *
 * @apiError (500) InternalServerError Cannot create the new user
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot create the new user"
 *          "username": "administrator"
 *      }
 */
exports.createUser = async function (req, res, next) {
    const Op = Model.Sequelize.Op;
    const user = req.body;
    const password = bcrypt.hashSync(user.password);

    User.findAll({
        where: {
            [Op.or] : [
                { username: user.username },
                { email: user.email }
            ]
        }
    })
        .then(userbn => {
            // user !== null then a username or an email already exists in the sistem
            // the registration has to be rejected
            if(userbn.length !== 0) {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    created: false,
                    error: 'Username or email already exists',
                });
            } else {
                // A new user can be created

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
                    checksum: '0'
                })
                    .then(newUser => {

                        const user_id = newUser.get('id');
                        DashboardManager.internalCreateDefaultDashboards(user_id)
                            .then(() => {
                                return res.status(HttpStatus.CREATED).send({
                                    created: true,
                                    first_name: newUser.get('first_name'),
                                    last_name: newUser.get('last_name')
                                });
                            })
                            .catch(err => {
                                User.destroy({ where: {id : user_id}}); // Deletes the new db row

                                console.log('ACCESS_MANAGER ERROR. Details below:');
                                console.error(err);
                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                                    created:  false,
                                    message: 'Cannot create the new user',
                                    username: user.username
                                });
                            });
                    })
                    .catch(err => {
                        console.log('ACCESS_MANAGER ERROR. Details below:');
                        console.error(err);
                        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                            created:  false,
                            message: 'Cannot create the new user',
                            username: user.username
                        });
                    })
            }
        })
    ;
};

/**
 * @api {get} /users/getFromId/ Get From ID
 * @apiName GetFromId
 * @apiDescription The request gives to the user who made the call all his informaations.
 * @apiGroup User
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 *
 * @apiSuccess {Number} id Identifier of the user.
 * @apiSuccess {String} username Username of the user.
 * @apiSuccess {String} email Email of the user.
 * @apiSuccess {String} company_name Name of the company of the user.
 * @apiSuccess {String} vat_number Vat Number of the company of the user.
 * @apiSuccess {String} first_name First name of the user.
 * @apiSuccess {String} last_name Last name of the user.
 * @apiSuccess {String} birth_place Birth place of the user.
 * @apiSuccess {Date} birth_date Birth date of the user.
 * @apiSuccess {String} fiscal_code Fiscal code of the user.
 * @apiSuccess {String} address Address of residence of the user.
 * @apiSuccess {String} province Province of residence of the user.
 * @apiSuccess {String} city City of residence of the user.
 * @apiSuccess {String} zip Zip code associated to the city of residence of the user.
 * @apiSuccess {String} password Password needed by the user to login to the platform.
 * @apiSuccess {String} user_type Type of the user into the platform.
 * @apiSuccess {String} checksum Field for verify the fairness of the other fields.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "id": 2,
 *          "username": "admin",
 *          "email": "admin",
 *          "company_name": "myCompany",
 *          "vat_number": 123456789456,
 *          "first_name": "Michael",
 *          "last_name": "Bohn",
 *          "birth_place": "Land of Admins",
 *          "birth_date": "1990-06-06",
 *          "fiscal_code": "aaaddd93e92b292u",
 *          "address": "Admin street, 23",
 *          "province": "ad",
 *          "city": "administration",
 *          "zip": "01923",
 *          "password": "a_password",
 *          "user_type": "his_user_type",
 *          "checksum": "a_nice_checksum"
 *     }
 *
 * @apiError (401) Unauthorized The user is not authorized to do the request.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *          Unauthorized
 *
 * @apiError (500) InternalServerError Cannot get the user informations
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "error": true,
 *          "message": "Cannot GET the user informations"
 *      }
 */
exports.getUserById = function (req, res, next) {
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

/**
 * @api {put} /users/update/ Update
 *
 * @apiName Update
 * @apiDescription This request lets the user who made the call to update his informations.
 * @apiGroup User
 * @apiPermission all
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} email Email of the user.
 * @apiParam {String} company_name Name of the company of the user.
 * @apiParam {String} vat_number Vat Number of the company of the user.
 * @apiParam {String} first_name First name of the user.
 * @apiParam {String} last_name Last name of the user.
 * @apiParam {String} birth_place Birth place of the user.
 * @apiParam {Date} birth_date Birth date of the user.
 * @apiParam {String} fiscal_code Fiscal code of the user.
 * @apiParam {String} address Address of residence of the user.
 * @apiParam {String} province Province of residence of the user.
 * @apiParam {String} city City of residence of the user.
 * @apiParam {String} zip Zip code associated to the city of residence of the user.
 * @apiParam {String} password Password needed by the user to login to the platform.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "updated": true,
 *          "user_id": 258,
 *     }
 *
 * @apiError (500) InternalServerError Cannot update the user
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "updated": false,
 *          "user_id": 249,
 *          "message": "Cannot update the user"
 *      }
 */
exports.updateUser = function (req, res, next) {

    const user = req.body;
    const password = bcrypt.hashSync(user.password);

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
        password: password
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

/**
 * @api {delete} /users/delete/ Delete
 *
 * @apiName Delete
 * @apiDescription This request lets the admin to delete a user from the platform.
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiHeader {String} Authorization Json Web Token retrieved from login request.
 *
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "Bearer YW55X25hbWUiOm51bGwsInZhdF9udW1iZXIi"
 *     }
 *
 * @apiParam {String} username Username of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "deleted": true,
 *          "username": "Gianni",
 *     }
 *
 * @apiError (500) InternalServerError Cannot delete the user
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 INTERNAL SERVER ERROR
 *       {
 *          "deleted": false,
 *          "user": "Administrator",
 *          "message": "Cannot delete the user"
 *      }
 */
exports.deleteUser = function (req, res, next) {
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

exports.basicLogin = function (req, res, next) {
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
        }
    })(req, res, next);
};

exports.roleAuth = function(roles){
    return async (req, res, next) => {
        let user = req.user;
        let userFound;

        try {
            userFound = await User.findById(user.id);

            if(roles.indexOf(userFound.user_type) > -1){
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

const getUserTypeByString = (stringType) => {
    let type;

    switch (stringType) {
        case 'company': type = 1;
            break;
        case 'editor': type = 2;
            break;
        case 'analyst': type = 3;
            break;
    }

    return type;
};