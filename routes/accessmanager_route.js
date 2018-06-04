const AccessManager = require('../engine/access-manager');

exports.getEmailFromUsername = function (req, res, next) {
    const name = req.params.usern;

    AccessManager.getUserFromUsername(name)
        .then(result => {
            console.log('Ho trovato la mail: ' + result.email);
            res.json(result.email);
        })
        .catch(err => {
            res.json(err)
        });
};

exports.login = function (req, res, next) {
    res.json("Logged in");
};