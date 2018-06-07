'use strict';

const Model = require('../models/index');
const Op = Model.Sequelize.Op;

exports.readAllKeysByUser = (req, res, next) => {
    Model.User_keys.findAll({where: {username: req.params.username}})
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
                username: req.params.username,
                service: req.params.service
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

exports.insert = (req, res, next) => {
    let user_keys = req.body;

    Model.User_keys.create({
        user_id: user_keys.user_id,
        service: user_keys.service,
        api_key: user_keys.api_key
    })
        .then(new_key => {
            res.send("The new key for the service " + user_keys.service + " has been created");
        })
        .catch(err => {
            console.log(err);
            res.send("Cannot create the new key for the service choosen");
        })

};

exports.update = (req, res, next) => {

};

exports.delete = (req, res, next) => {

};