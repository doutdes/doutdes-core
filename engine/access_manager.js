'use strict';

let users = require('../database_handler/user');

class Access_Manager {
    static getUsers() {
        return new Promise((resolve, reject) => {
            resolve(users.User.getUsers());
            reject(err => {
                console.log("Promise rejected by the Access Manager");
                console.log(err);
            })
        });
    }

    static getUserByUsername(username) {
        return new Promise((resolve, reject) => {

            users.User.factorByUsername(username)
                .then(userReceived => {
                    console.log("L'access manager ha ricevuto");
                    console.log(userReceived);
                    let prova = new users.User(userReceived.dataValues);
                    console.log("prova di nome utente vale " + prova.getUserName());
                    resolve(prova.getUserName());
                })
                .catch(err => {
                    console.log("Errore da Access Manager in chiamata factor");
                    console.log(err);
                });
            reject((err) => {
                console.log(err);
                console.log("Qua c'è un errore");
            })
        });


        // })
    }
}

module.exports.Access_Manager = Access_Manager;