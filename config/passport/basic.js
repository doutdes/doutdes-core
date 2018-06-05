const AccessManager = require('../../engine/access-manager');
const BasicStrategy = require('passport-http').BasicStrategy;
const model = require('../../models/index');

module.exports =
    new BasicStrategy(
        function (username, password, done) {
            // AccessManager.getUserFromUsername(username)
            model.Users.findOne({where: {username: username}})
                .then(user => {
                    if (!user) {
                        return done(null, false);
                    }

                    user.verifyPassword(password, function (err, isMatch) {
                        if (err) {
                            return done(err);
                        }

                        // Password did not match
                        if (!isMatch) {
                            return done(null, false);
                        }

                        // Success
                        return done(null, user);
                    });

                    return done(null, user);
                })
                .catch(err => {
                    return done(err);
                })
            ;
        }
    );