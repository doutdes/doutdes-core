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

                    if(user.verifyPassword(password)){
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                })
                .catch(err => {
                    return done(err);
                })
            ;
        }
    );