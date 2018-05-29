const express = require('express');
let router = express.Router();
let model = require('../models/index');
let access_manager = require('../engine/access_manager');

router.get('/', function (req, res, next) {
    access_manager.Access_Manager
        .getUsers()
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            res.json(error);
        });
});

module.exports = router;