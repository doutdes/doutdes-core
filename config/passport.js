const basic     = require('./passport/basic');
const jwtAdmin  = require('./passport/jwt-admin');
const jwtUser   = require('./passport/jwt-user');
const jwtEditor = require('./passport/jwt-editor');

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
    passport.use('jwt-admin', jwtAdmin);
    passport.use('jwt-user', jwtUser);
    passport.use('jwt-editor', jwtEditor);
};