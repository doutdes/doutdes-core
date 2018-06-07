const AccessManager    = require('../engine/access-manager');
const AnalyticsManager = require('../engine/analytics-manager');
const UserKeysManager  = require('../engine/user-keys-manager');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {

    /* PATHs */
    let indexPath = "/";
    let amPath    = indexPath + 'users/';
    let keysPath  = indexPath + 'keys/';

    /* AUTH */
    const adminAuth  = passport.authenticate.bind(passport)('jwt-admin',  {session: false});
    const userAuth   = passport.authenticate.bind(passport)('jwt-user',   {session: false});
    const editorAuth = passport.authenticate.bind(passport)('jwt-editor', {session: false});

    /****************** ACCESS MANAGER ********************/

    app.post('/login', AccessManager.basicLogin);

    /****************** CRUD USERS ********************/
    app.post(amPath   + 'create/', adminAuth, AccessManager.createUser);        // Create
    app.get(amPath    + 'getFromId/:id', adminAuth, AccessManager.getUserById); // Read by ID
    app.put(amPath    + 'update/', adminAuth, AccessManager.updateUser);        // Update
    app.delete(amPath + 'delete/', adminAuth, AccessManager.deleteUser);        // Delete


    app.get(amPath + 'getUserFromUsername/:usern', AccessManager.getUserFromUsername); // NOT USEFUL

    /****************** CRUD USER KEYS ********************/
    app.post(keysPath   + 'insert/', adminAuth, UserKeysManager.insertKey);                      // Create
    app.get(keysPath    + 'getAll/:user_id', adminAuth, UserKeysManager.readAllKeysById);        // Read all keys by User
    app.get(keysPath    + 'getByUserService/', adminAuth, UserKeysManager.readServiceKeyByUser); // Read a key by User and Service
    app.put(keysPath    + 'update/', adminAuth, UserKeysManager.update);                         // Update
    app.delete(keysPath + 'delete/', adminAuth, UserKeysManager.delete);                         // Delete

    /****************** FACEBOOK MANAGER ********************/

    app.get('/fbfancount', AnalyticsManager.fbFanCount);

    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};