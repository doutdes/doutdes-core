'use strict';

let users = require('../database_handler/users');

class Access_Manager {
    static getUsers(){
        return new Promise((resolve, reject) => {
            console.log("Ora risolvo da Access Manager");
            resolve(
                users.Users.getUsers()
            );
            console.log("Ora reject da Access Manager");
            reject(err => {
                console.log("Promise rifiutata da Access Manager");
                console.log(err);
            })
        });
    }
}

module.exports.Access_Manager = Access_Manager;