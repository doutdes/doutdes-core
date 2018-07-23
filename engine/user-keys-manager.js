'use strict';

const Model = require('../models/index');
const User_keys = Model.User_keys;
const Op = Model.Sequelize.Op;

exports.readAllKeysById = (req, res, next) => {

    User_keys.findAll({where: {user_id: req.user.id}})
        .then(keys => {
            return res.status(200).json(keys)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({
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
            if(key === null) {
                return res.status(200).json({
                    error: 'No service found for the user',
                    user_id: req.user.id,
                    service: parseInt(req.params.service_id)
                })
            }
            return res.status(200).json(key)
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({
                error: 'Cannot read the service selected for the user inserted',
                service: req.params.service_id,
                user_id: req.user.id
            })
        })
};

exports.insertKey = (req, res, next) => {
    let user_keys = req.body;

    User_keys.create({
        user_id: req.user.id,
        service: user_keys.service,
        api_key: user_keys.api_key
    })
        .then(new_key => {
            return res.status(201).send({
                created: true,
                service: parseInt(new_key.get('service'))
            });
        })
        .catch(err => {
            console.log(err);

            return res.status(500).send({
                created: false,
                service: parseInt(user_keys.service),
                error:   'Cannot insert the key'
            });
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
            return res.status(200).json({
                updated: true,
                service: parseInt(user_keys.service)
            })
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
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
            return res.status(200).json({
                deleted: true,
                service: parseInt(req.body.service)
            })
        })
        .catch(err => {
            return res.status(500).json({
                deleted: false,
                service: parseInt(req.body.service),
                error: 'Cannot delete the key'
            })
        })
};