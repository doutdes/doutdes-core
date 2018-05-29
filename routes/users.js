const express = require('express');
let router = express.Router();
let model = require('../models/index');
let access_manager = require('../engine/access_manager');

router.get('/', function (req, res, next) {
    access_manager.Access_Manager
        .getUsers()
        .then((result) => {
            console.log("Da route");
            console.log(result);
            res.json(result)
        })
        .catch((error) => {
            console.log("Da route err");
            console.log(error);
            res.json(error);
        });
});

module.exports = router;