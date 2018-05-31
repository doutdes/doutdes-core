'use strict';

const Model = require('../models/index');

class User {

    constructor(json_obj){

        this.json_obj = json_obj;
    }

    getEmail(){
        return this.json_obj.email;
    }

    static fetchFromUsername(username) {

        return new Promise((resolve, reject) => {

            Model.Users.findOne({
                where: {
                    username: username
                }
            })
            .then(userReceived => {

                // Returning the new object instantiated
                resolve(new User(userReceived.dataValues));
            })
            .catch(err => {

                reject(() => {
                    console.log(err);// TODO: fix these errors
                })
            });
        });
    }

    /*
    static insertUser(user){
       model.User.create({

        })
    }*/

}

module.exports = User;
