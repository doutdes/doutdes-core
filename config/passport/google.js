const GoogleStrategy = require('passport-google-oauth20').Strategy;

const clientID      = '677265943833-pk2h68akq4u3o6elhcupu8bt89qg4cjl.apps.googleusercontent.com';
const clientSecret  = 'cXLadVc3IgSPrkRHwSqdgEZy';
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