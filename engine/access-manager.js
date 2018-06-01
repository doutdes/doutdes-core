'use strict';

const Model = require('../models/index');
let LocalStrategy = require('passport-local').Strategy;

class AccessManager {

    static getUserFromUsername(username) {
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
    }

    static addUser(user){
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
    }

    static updateUser(user){
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
    }

    /* LOGIN STRATEGY FOR PASSPORT */

    static loginStrategy(username, password, done) {
        AccessManager.getUserFromUsername(username)
            .then(user =>  {
                    if (!user) {
                        return done(null, false, {message: 'Incorrect username'})
                    }

                    if (!user.get('password') === password) {
                        return done(null, false, {message: 'Incorrect password'})
                    }

                    return done(null, user);
                }
            )
            .catch(err => {
                console.log(err);
            })
    }

    static serializeUser(user, done) {
        done(null, user);
    };

    static deserializeUser(user, done) {
        done(null, user);
    };
}

module.exports = AccessManager;