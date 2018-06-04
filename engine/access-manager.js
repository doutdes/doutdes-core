'use strict';

const Model = require('../models/index');

exports.getUserFromUsername = function (username) {
    return new Promise((resolve, reject) => {

        Model.Users.findOne({ where: { username: username } })
            .then(userReceived => {
                // Returning the new object instantiated
                if(userReceived === null){
                    reject("This username doesn't exist in the platform");
                }
                resolve(userReceived);
            })
            .catch(err => {
                reject(err);
            });
    });
};

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