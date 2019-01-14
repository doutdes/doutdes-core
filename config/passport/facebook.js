const FacebookStrategy = require('passport-facebook').Strategy;

const clientID = '2465723383501355';
const clientSecret = '16ed689c0b2e05eaf7c8b20fa32a68eb';


module.exports = new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: ''
}, (access_token, refreshToken, profile, cb) => {

});
