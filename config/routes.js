const AccessManager = require('../engine/access-manager');
const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {

    /* PATHs */
    let indexPath = "/";
    let amPath = indexPath + "users/";

    const pauth = passport.authenticate.bind(passport);
    const sess = {session: false};

    /****************** ACCESS MANAGER ********************/

    app.post('/login', AccessManager.basicLogin);
    app.get('/ciao', pauth('jwt', sess), function (req, res, next) { res.send('ciao'); });
    app.get(amPath + 'getUserFromUsername/:usern', AccessManager.getUserFromUsername);

    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};