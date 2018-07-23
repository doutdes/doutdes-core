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
    app.post(amPath   + 'create/', AccessManager.createUser);                   // Create
    app.get(amPath    + 'getFromId/:id', adminAuth, AccessManager.getUserById); // Read by ID TODO should a user read his infos?
    app.put(amPath    + 'update/', userAuth, AccessManager.updateUser);         // Update
    app.delete(amPath + 'delete/', adminAuth, AccessManager.deleteUser);        // Delete

    /****************** CRUD USER KEYS ********************/
    app.post(keysPath   + 'insert/', userAuth, UserKeysManager.insertKey);                      // Create
    app.get(keysPath    + 'getAll/', userAuth, UserKeysManager.readAllKeysById);                // Read all keys by User
    app.get(keysPath    + 'getByUserService/:service_id', userAuth, UserKeysManager.readServiceKeyByUser); // Read a key by User and Service
    app.put(keysPath    + 'update/', userAuth, UserKeysManager.update);                         // Update
    app.delete(keysPath + 'delete/', userAuth, UserKeysManager.delete);                         // Delete

    /****************** FACEBOOK MANAGER ********************/

    app.get('/fbfancount', AnalyticsManager.fb_getPageFans);
    app.get('/fbfancity', AnalyticsManager.fb_getPageFansCity);
    app.get('/fbfancountry', AnalyticsManager.fb_getPageFansCountry);
    app.get('/fbengageduser', AnalyticsManager.fb_getEngagedUsers);
    app.get('/fbpageimpressions', AnalyticsManager.fb_getPageImpressionsUnique);
    app.get('/fbpageimpressionscity', AnalyticsManager.fb_getPageImpressionsByCityUnique);
    app.get('/fbpageimpressionscountry', AnalyticsManager.fb_getPageImpressionsByCountryUnique);
    app.get('/fbpagereactions', AnalyticsManager.fb_getPageActionsPostReactionsTotal);
    app.get('/fbpageviewsexternals', AnalyticsManager.fb_getPageViewsExternalReferrals);

    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};