'use strict';

const Model = require('../models/index');
const User_keys = Model.User_keys;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

exports.readAllKeysById = (req, res, next) => {

    User_keys.findAll({where: {user_id: req.user.id}})
        .then(keys => {
            return res.status(HttpStatus.OK).json(keys)
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: err
            })
        });
};

exports.readServiceKeyByUser = (req, res, next) => {
    User_keys.findOne({
        where: {
            [Op.and]: [{
                user_id: req.user.id,
                service: req.params.service_id
            }]
        }
    })
        .then(key => {
            if (key === null) {
                return res.status(HttpStatus.OK).json({
                    error: 'No service found for the user',
                    user_id: req.user.id,
                    service: parseInt(req.params.service_id)
                })
            }
            return res.status(HttpStatus.OK).json(key)
        })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: 'Cannot read the service selected for the user inserted',
                service: req.params.service_id,
                user_id: req.user.id
            })
        })
};

exports.insertKey = (req, res, next) => {
    let user_keys = req.body;

    User_keys.findOne({
        where: {
            [Op.and]: [{
                user_id: req.user.id,
                service: user_keys.service
            }]
        }
    }).then(key => {
        console.log(key);
        if (key !== null) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'Service already exists',
                service: user_keys.service
            })
        }
        else {
            User_keys.create({
                user_id: req.user.id,
                service: user_keys.service,
                api_key: user_keys.api_key
            })
                .then(new_key => {
                    return res.status(HttpStatus.CREATED).send({
                        created: true,
                        service: parseInt(new_key.get('service'))
                    });
                })
                .catch(err => {
                    console.log(err);

                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                        created: false,
                        service: parseInt(user_keys.service),
                        error: 'Cannot insert the key'
                    });
                })
        }
    })
        .catch(err => {
            console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                created: false,
                service: parseInt(user_keys.service),
                error: 'Cannot insert the key'
            })
        })
};

exports.update = (req, res, next) => {
    let user_keys = req.body;

    User_keys.update({
        api_key: user_keys.api_key
    }, {
        where: {
            [Op.and]: [{
                user_id: req.user.id,
                service: user_keys.service
            }]
        }
    })
        .then(up_key => {
            console.log(up_key);
            return res.status(HttpStatus.OK).json({
                updated: true,
                service: parseInt(user_keys.service)
            })
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                updated: false,
                service: parseInt(user_keys.service),
                error: 'Cannot update the key'
            })
        });
};

exports.delete = (req, res, next) => {
    User_keys.destroy({
        where: {
            [Op.and]: [{
                user_id: req.user.id,
                service: req.body.service
            }]
        }
    })
        .then(() => {
            return res.status(HttpStatus.OK).json({
                deleted: true,
                service: parseInt(req.body.service)
            })
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                deleted: false,
                service: parseInt(req.body.service),
                error: 'Cannot delete the key'
            })
        })
};