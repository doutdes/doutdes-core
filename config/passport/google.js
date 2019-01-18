const GoogleStrategy = require('passport-google-oauth20').Strategy;

const config = require('../../app').config;

const clientID      = config['ga_client_id'];
const clientSecret  = config['ga_client_secret'];
const callbackURL   = config['site_URL'] + 'ga/login/success';

module.exports = new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
}, (req, refreshToken, accessToken, profile, done) => {
    return done(null, {accessToken: accessToken, refreshToken: refreshToken});
});