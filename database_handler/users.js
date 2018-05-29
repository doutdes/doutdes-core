'use strict';

var model = require('../models/index');

class Users {
    static getUsers() {
        return model.Users.findAll({});
    }
}

module.exports.Users = Users;
