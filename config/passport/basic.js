const BasicStrategy = require('passport-http').BasicStrategy;
const User = require('../../models/index').Users;

module.exports =
    new BasicStrategy(
        function (username, password, cb) {
            User.findOne({where: {username: username}})
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