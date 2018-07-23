'use strict';

const Model = require('../models/index');
const Op = Model.Sequelize.Op;

exports.readAllKeysById = (req, res, next) => {
    Model.User_keys.findAll({where: {user_id: req.params.user_id}})
        .then(keys => {
            res.json(keys)
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
};

exports.readServiceKeyByUser = (req, res, next) => {
    Model.User_keys.findOne({
        where: {
            [Op.and]: [{
                user_id: req.body.user_id,
                service: req.body.service
            }]
        }
    })
        .then(key => {
            res.json(key)
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
};

exports.insertKey = (req, res, next) => {
    let user_keys = req.body;

    Model.User_keys.create({
        user_id: user_keys.user_id,
        service: user_keys.service,
        api_key: user_keys.api_key
    })
        .then(new_key => {
            return res.status(200).send({
                created: true,
                service: new_key.get('service')
            });
        })
        .catch(err => {
            console.log(err);

            return res.status(500).send({
                created: false,
                error:   'Cannot insert the key'
            });
        })

};

exports.update = (req, res, next) => {
    let user_keys = req.body;

    Model.User_keys.update({
        api_key: user_keys.api_key
    }, {
        where: {
            [Op.and]: [{
                user_id: user_keys.user_id,
                service: user_keys.service
            }]
        }
    })
        .then(up_key => {
            res.send(up_key + ' updated');
        })
        .catch(err => {
            console.log(err);
            res.send("Cannot update the key for the service choosen");
        })
};

exports.delete = (req, res, next) => {
    Model.User_keys.destroy({
        where: {
            [Op.and]: [{
                user_id: req.body.user_id,
                service: req.body.service
            }]
        }
        })
        .then(() => {
            res.send("User key " + req.body.service + " destroyed");
        })
        .catch(err => {
            console.log("User key cannot be deleted");
            reject(err);
        })
};