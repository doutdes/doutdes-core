const FacebookStrategy = require('passport-facebook').Strategy;

const config = require('../config').production;

const clientID      = config.fb_client_id;
const clientSecret  = config.fb_client_secret;
const callbackURL   = 'http://localhost:443/fb/login/success';

module.exports = new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
}, (access_token, refreshToken, profile, done) => {
    return done(null, access_token);
});

