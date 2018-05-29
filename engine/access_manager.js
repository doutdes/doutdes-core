'use strict';

let users = require('../database_handler/users');

class Access_Manager {
    static getUsers(){
        return new Promise((resolve, reject) => {
            resolve(users.Users.getUsers());
            reject(err => {
                console.log("Promise rejected by the Access Manager");
                console.log(err);
            })
        });
    }
}

module.exports.Access_Manager = Access_Manager;