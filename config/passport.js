const jwt      = require('./passport/jwt');
const basic    = require('./passport/basic');
const google   = require('./passport/google');
const facebook = require('./passport/facebook');

const Users = require('../models/index').Users;

module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser((data, done) => {
        if(data.id) done(null, data.id);
        else        done(null, data);
    });

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
    passport.use('google', google);
    passport.use('facebook', facebook);
};