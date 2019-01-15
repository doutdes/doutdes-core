const FacebookStrategy = require('passport-facebook').Strategy;
const FbToken = require('../../models/index').FbToken;

const clientID = '';
const clientSecret = '';
const callbackURL = 'http://localhost:443/fb/login/success';


module.exports = new FacebookStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
}, (access_token, refreshToken, profile, done) => {
    // It creates or it updates the entry in the Facebook table in the Database

    console.log('access_token -->');
    console.log(access_token);

    done(null, access_token);
});
