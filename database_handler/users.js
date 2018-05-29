'use strict';

var model = require('../models/index');

class Users {
  static getUsers() {
    let response;

    model.Users.findAll({})
      .then(users => {
        response = users;
      })
      .catch(err => {
        response = users;
      });

    return response;
  }
}

module.exports.Users = Users;
