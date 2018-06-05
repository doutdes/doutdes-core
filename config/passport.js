const basic = require('./passport/basic');

module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // strategies
    passport.use(basic);

};