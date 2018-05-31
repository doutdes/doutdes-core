const express = require('express');
let router = express.Router();
const AccessManager = require('../engine/access-manager');

/*
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

*/

router.get('/getEmailFromUsername/:usern', function (req, res, next) {
    const name = req.params.usern;

    AccessManager.getEmailFromUsername(name)
        .then(result => {
            console.log('Ho trovato la mail: '+ result);
            res.json(result);
        })
        .catch(err => console.log(err));
});

module.exports = router;