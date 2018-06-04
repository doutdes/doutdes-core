const local = require('./passport/local');

module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // strategies
    passport.use(local);

};