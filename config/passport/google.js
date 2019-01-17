const GoogleStrategy = require('passport-google-oauth20').Strategy;

const config = require('../config').production;

const clientID      = config.ga_client_id;
const clientSecret  = config.ga_client_secret;
const callbackURL   = 'http://localhost:443/ga/login/success';

module.exports = new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
}, (req, refreshToken, accessToken, profile, done) => {
    console.log(accessToken);
    console.log(refreshToken);
    done(null, {accessToken: accessToken, refreshToken: refreshToken});
});