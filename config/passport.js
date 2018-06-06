const basic     = require('./passport/basic');
const jwtAdmin  = require('./passport/jwt-admin');
const jwtUser   = require('./passport/jwt-user');
const jwtEditor = require('./passport/jwt-editor');

module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // strategies
    passport.use(basic);
    passport.use('jwt-admin', jwtAdmin);
    passport.use('jwt-user', jwtUser);
    passport.use('jwt-editor', jwtEditor);
};