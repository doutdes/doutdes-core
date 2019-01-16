const GoogleStrategy = require('passport-google-oauth20').Strategy;

const clientID      = '677265943833-pk2h68akq4u3o6elhcupu8bt89qg4cjl.apps.googleusercontent.com';
const clientSecret  = 'cXLadVc3IgS';
const callbackURL   = '';

module.exports = new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
}, (accessToken, refreshToken, profile, cb) => {

});