'use strict';

const Model = require('../models/index');

exports.getUserFromUsername = function (req, res, next) {
    const username = req.params.usern;

    Model.Users.findOne({ where: { username: username } })
        .then(user => {
            // Returning the new object instantiated
            if(user === null)
                res.json("This username doesn't exist in the platform.");
            else
                res.json(user.email);
        })
        .catch(err => {
            res.json(err);
        });
};

/*
exports.addUser = function (user) {

    return new Promise((resolve, reject) => {

        Model.Users.create(user)
            .then(newUser => {
                resolve("User " + newUser.get('firt_name') + ' ' + newUser.get('last_name') + ' has been successful created');
            })
            .catch(err => {
                console.log("User cannot be created");
                reject(err);
            })
    });
};

exports.updateUser = function (user) {
    return new Promise((resolve, reject) => {

        Model.Users.update(user, { where: { id: user.id } })
            .then(newUser => {
                resolve("User " + newUser.get('firt_name') + ' ' + newUser.get('last_name') + ' has been successful updated');
            })
            .catch(err => {
                console.log("User cannot be updated");
                reject(err);
            })
    });
};
*/