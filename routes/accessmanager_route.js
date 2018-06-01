const express       = require('express');
let   router        = express.Router();
let   passport      = require('passport');
const AccessManager = require('../engine/access-manager');

router.get('/getEmailFromUsername/:usern', function (req, res, next) {
    const name = req.params.usern;

    AccessManager.getUserFromUsername(name)
        .then(result => {
            console.log('Ho trovato la mail: '+ result.email);
            res.json(result.email);
        })
        .catch(err => {
            res.json(err)
        });
});

router.post('/login', passport.authenticate('local'), function (req, res, next) {
        res.json("Logged in");
    }
);

module.exports = router;