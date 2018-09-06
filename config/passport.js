const basic     = require('./passport/basic');
const jwt  = require('./passport/jwt');

const Users = require('../models/index').Users;

module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((id, done) => {
        Users.findById(id).then(user => {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        })
    });

    // strategies
    passport.use(basic);
    passport.use('jwt', jwt);
};