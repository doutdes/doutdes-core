const AccessManager = require('../engine/access-manager');
const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {

    /* PATHs */
    let indexPath = "/";
    let amPath = indexPath + "users/";

    const pauth = passport.authenticate.bind(passport);
    const sess = {session: false};

    /****************** ACCESS MANAGER ********************/
    app.get('/users/getEmailFromUsername/:usern', accessRoute.getEmailFromUsername);

    app.post('/login', AccessManager.basicLogin);

    app.get('/ciao', pauth('jwt', sess), function (req, res, next) {
        res.send('ciao');
    });

    app.get(amPath + 'getUserFromUsername/:usern', AccessManager.getUserFromUsername);
    app.post('/login', passport.authenticate('basic', { session : false }), function (req, res, next) { res.json("Logged In"); });


    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};