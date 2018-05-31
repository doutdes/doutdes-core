'use strict';

var model = require('../models/index');

class User {

    // constructor(username, email, company_n, vat_n, first_name, last_name, birth_date, fiscal_code, address, province,
    //             city, zip, psw, user_type, checksum){

    constructor(json_obj){
        // this.username = username;
        // this.email = email;
        // this.company_name = company_n;
        // this.vat_number = vat_n;
        // this.first_name = first_name;
        // this.last_name = last_name;
        // this.birth_date = birth_date;
        // this.fiscal_code = fiscal_code;
        // this.address = address;
        // this.province = province;
        // this.city = city;
        // this.zip = zip;
        // this.password = psw;
        // this.user_type = user_type;
        // this.checksum = checksum;
        this.json_obj = json_obj;
    }

    getUserName(){
        return this.json_obj.username;
    }

    static getUsers() {
        return model.Users.findAll({});
    }

    static factorByUsername(username) {
        console.log("2. Sono in factor e ora uso " + username);
        return model.Users.findOne({
            where: {
                username: username
            }
        })
/*
            .then(result => {
                return result.dataValues;
            });
        .then(result => {
            console.log(result.dataValues);
            return new User(result.dataValues);
            return new Promise((resolve, reject) => {
               resolve(new User(result.dataValues));
               reject(err => {
                   console.log("Errore nella promise di db_handler");
                   console.log(err);
               })
            });
        })
            .catch(err => {
                console.log("errore su factor db");
            })
            ;*/
    }

    static insertUser(user){
/*        model.User.create({

        })*/
    }

}

module.exports.User = User;
