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

    /****************** CRUD USERS ********************/
    app.post(amPath   + 'create/', adminAuth, AccessManager.createUser);        // Create
    app.get(amPath    + 'getFromId/:id', adminAuth, AccessManager.getUserById); // Read by ID
    app.update(amPath + 'update/', adminAuth, AccessManager.updateUser);        // Update
    app.delete(amPath + 'delete/', adminAuth, AccessManager.deleteUser);        // Delete


    app.get(amPath + 'getUserFromUsername/:usern', AccessManager.getUserFromUsername); // NOT USEFUL

    /****************** FACEBOOK MANAGER ********************/

    app.get('/fbfancount', AnalyticsManager.fbFanCount);

    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};