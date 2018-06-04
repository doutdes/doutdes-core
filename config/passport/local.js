const AccessManager = require('../../engine/access-manager');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(function (username, password, done) {
    AccessManager.getUserFromUsername(username)
        .then(user => {
                if (!user) {
                    return done(null, false, {message: 'Incorrect username'})
                }

                if (!user.get('password') === password) {
                    return done(null, false, {message: 'Incorrect password'})
                }

                return done(null, user);
            }
        )
        .catch(err => {
            console.log(err);
        })
});