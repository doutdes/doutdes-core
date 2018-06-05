const AccessManager = require('../engine/access-manager');
const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {

    /* PATHs */
    let indexPath = "/";
    let amPath = indexPath + "users/";


    /****************** ACCESS MANAGER ********************/

    app.get(amPath + 'getUserFromUsername/:usern', AccessManager.getUserFromUsername);
    app.post('/login', passport.authenticate('basic', { session : false }), function (req, res, next) { res.json("Logged In"); });


    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};