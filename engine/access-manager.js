'use strict';

const Model = require('../models/index');

class AccessManager {

    /*
    static getUsers() {
        return new Promise((resolve, reject) => {
            resolve(User.getUsers());
            reject(err => {
                console.log("Promise rejected by the Access Manager");
                console.log(err);
            })
        });
    }*/

    static getEmailFromUsername(username) {
        return new Promise((resolve, reject) => {

            Model.Users.findOne({ where: { username: username } })
                .then(userReceived => {
                    // Returning the new object instantiated
                    resolve(userReceived.get('first_name'));
                })
                .catch(err => {
                    reject(() => {
                        console.log(err);// TODO: fix these errors
                    })
                });
        });
    }
}

module.exports = AccessManager;