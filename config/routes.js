const AccessManager = require('../engine/access-manager');
const ErrorHandler = require('../engine/error-handler');
const AnalyticsManager = require('../engine/analytics-manager');

module.exports = function (app, passport) {

    /* PATHs */
    let indexPath = "/";
    let amPath = indexPath + "users/";

    /* AUTH */
    const adminAuth  = passport.authenticate.bind(passport)('jwt-admin',  {session: false});
    const userAuth   = passport.authenticate.bind(passport)('jwt-user',   {session: false});
    const editorAuth = passport.authenticate.bind(passport)('jwt-editor', {session: false});

    /****************** ACCESS MANAGER ********************/

    app.post('/login', AccessManager.basicLogin);
    app.get('/ciao1', adminAuth, function (req, res, next) { res.send('ciao1'); });
    app.get('/ciao2', userAuth, function (req, res, next) { res.send('ciao2'); });
    app.get('/ciao3', editorAuth, function (req, res, next) { res.send('ciao3'); });


    app.get(amPath + 'getUserFromUsername/:usern', AccessManager.getUserFromUsername);

    /****************** FACEBOOK MANAGER ********************/

    app.get('/fbfancount', AnalyticsManager.fbFanCount);

    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};