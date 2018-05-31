const express = require('express');
let router = express.Router();
let model = require('../models/index');
let access_manager = require('../engine/access_manager');

/* GET users */
router.get('/', function (req, res, next) {
    access_manager.Access_Manager
        .getUsers()
        .then((result) => {
            console.log(result[0].dataValues);
            // console.log(result);
            // console.log(typeof result);
            res.json(result)
        })
        .catch((error) => {
            res.json(error);
        });
});

router.get('/:usern', function (req, res, next) {
    const name = req.params.usern;

    access_manager.Access_Manager
        .getUserByUsername(name)
        .then(result => {
            console.log(result);
            res.json(result);
        })
        .catch(err => console.log(err));

    console.log("Qua sotto ci entra");
    // console.log(access_manager.Access_Manager.getUserByUsername(name).getUserName());
});


module.exports = router;