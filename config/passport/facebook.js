const FacebookStrategy = require('passport-facebook').Strategy;
const FbToken = require('../../models/index').FbToken;

const clientID = '2465723383501355';
const clientSecret = '52179fb1d97377d14444390bab168855';
const callbackURL = 'http://localhost:443/fb/login/success';

module.exports = new FacebookStrategy({
    display: 'popup',
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL,
    passReqToCallback: true,
    scope: 'manage_pages',
    enableProof: true
}, (req, access_token, refreshToken, profile, done) => {
    // It creates or it updates the entry in the Facebook table in the Database

    console.log(req);

    console.log('access_token_strategy: ' + access_token);

    done(null, access_token);
});

