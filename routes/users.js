const express = require('express');
let router = express.Router();
let model = require('../models/index');
let users = require('../database_handler/users');

router.get('/', function (req, res, next) {
    model.Users.findAll({})
        .then(users => res.json(users))
        .catch(err => res.json(err))
    ;
});

module.exports = router;