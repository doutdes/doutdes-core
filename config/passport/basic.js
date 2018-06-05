const AccessManager = require('../../engine/access-manager');
const BasicStrategy = require('passport-http').BasicStrategy;
const model = require('../../models/index');

module.exports =
    new BasicStrategy(
        function (username, password, cb) {
            // AccessManager.getUserFromUsername(username)
            model.Users.findOne({where: {username: username}})
                .then(user => {
                    if (!user) {
                        return cb(null, false);
                    }

                    if (user.verifyPassword(password)) {
                        return cb(null, user);
                    }

                    return cb(null, false);

                })
                .catch(err => {
                    return cb(err);
                })
            ;
        }
    );