'use strict';

const User = require('../database_handler/user');

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

            User.fetchFromUsername(username)
                .then(user => {

                    // Returning the new object instantiated
                    resolve(user.getEmail());
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