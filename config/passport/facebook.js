const FacebookStrategy = require('passport-facebook').Strategy;

const clientID = '2465723383501355';
const clientSecret = '066a7043258396eeb0df8581bef8b0c8';
const callbackURL = 'http://localhost:443/fb/login/success';

module.exports = new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
}, (access_token, refreshToken, profile, done) => {
    return done(null, access_token);
});

