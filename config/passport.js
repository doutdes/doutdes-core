const basic = require('./passport/basic');
const jwt   = require('./passport/jwt');

module.exports = function (passport) {

    // serialize sessions
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    // strategies
    passport.use(basic);
    passport.use(jwt);

};