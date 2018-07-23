'use strict';

const Model = require('../models/index');
const passport = require('../app').passport;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

exports.createUser = function (req, res, next) {
    const Op = Model.Sequelize.Op;
    const user = req.body;
    const password = bcrypt.hashSync(user.password);

    Model.Users.findAll({
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
                res.status(400).send('The username or email choosen already exists in the system');
            } else {
                // A new user can be created

                Model.Users.create({
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
                    password: password,
                    user_type: user.user_type,
                    checksum: '0'
                })
                    .then(newUser => {
                        res.send({
                            created:    true,
                            first_name: newUser.get('first_name'),
                            last_name:  newUser.get('last_name')
                        });
                    })
                    .catch(err => {
                        console.log("User cannot be created");
                        res.send(err);
                    })
            }
        })
    ;
};

exports.getUserById = function (req, res, next) { // TODO fix the responses
    const userId = req.params.id;

    Model.Users.findOne({where: {id: userId}})
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send(err);
        })
};

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
            return res.status(200).json({
                updated: true,
                user_id: req.user.id
            })
        })
        .catch(err => {
            console.log(err);

            return res.status(500).json({
                updated: false,
                user_id: req.user.id,
                error: 'Cannot update the user'
            })
        });
};

exports.deleteUser = function (req, res, next) {
    Model.Users.destroy({where: {user: req.body.username}})
        .then(() => {
            res.send("user" + req.body.username + " destroyed");
        })
        .catch(err => {
            console.log("User cannot be deleted");
            reject(err);
        })
};

exports.basicLogin = function (req, res, next) {
    passport.authenticate('basic', {session: false}, function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                logged: false,
                error: 'unauthorized'
            })
        } else {
            const token = jwt.sign(user.dataValues, 'your_jwt_secret');
            return res.json({user, token});
        }
    })(req, res, next);
};