const AccessManager    = require('../engine/access-manager');
const AnalyticsManager = require('../engine/analytics-manager');
const UserKeysManager  = require('../engine/user-keys-manager');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {
    //
    // function requireAuth, AccessManager.roleAuthorization(strategy) {
    //     return passport.authenticate.bind(passport)(strategy,  {session: false});
    // }

    /* PATHs */
    let indexPath = "/";
    let amPath    = indexPath + 'users/';
    let keysPath  = indexPath + 'keys/';

    /* AUTH */
    const requireAuth = passport.authenticate('jwt', {session: false});
    const admin  = 0;
    const user   = 1;
    const editor = 2;
    const all = [admin, user, editor];

    /****************** ACCESS MANAGER ********************/

    app.post('/login', AccessManager.basicLogin);

    /****************** CRUD USERS ********************/
    app.post(amPath   + 'create/', AccessManager.createUser);        // Create
    app.get(amPath    + 'getFromId/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.getUserById); // Read by ID
    app.put(amPath    + 'update/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.updateUser);        // Update
    app.delete(amPath + 'delete/', requireAuth, AccessManager.roleAuthorization([admin]), AccessManager.deleteUser);        // Delete


    /****************** CRUD USER KEYS ********************/
    app.post(keysPath   + 'insert/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.insertKey);                      // Create
    app.get(keysPath    + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.readAllKeysById);                // Read all keys by User
    app.get(keysPath    + 'getByUserService/:service_id', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.readServiceKeyByUser); // Read a key by User and Service
    app.put(keysPath    + 'update/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.update);                         // Update
    app.delete(keysPath + 'delete/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.delete);                         // Delete


    /****************** FACEBOOK MANAGER ********************/

    app.get('/fbfancount', requireAuth, AccessManager.roleAuthorization(all), AnalyticsManager.fb_getPageFans);
    app.get('/fbfancity', requireAuth, AccessManager.roleAuthorization(all), AnalyticsManager.fb_getPageFansCity);
    app.get('/fbfancountry', requireAuth, AccessManager.roleAuthorization(all),  AnalyticsManager.fb_getPageFansCountry);
    app.get('/fbengageduser', requireAuth, AccessManager.roleAuthorization(all),  AnalyticsManager.fb_getEngagedUsers);
    app.get('/fbpageimpressions', requireAuth, AccessManager.roleAuthorization(all),  AnalyticsManager.fb_getPageImpressionsUnique);
    app.get('/fbpageimpressionscity', requireAuth, AccessManager.roleAuthorization(all),  AnalyticsManager.fb_getPageImpressionsByCityUnique);
    app.get('/fbpageimpressionscountry', requireAuth, AccessManager.roleAuthorization(all),  AnalyticsManager.fb_getPageImpressionsByCountryUnique);
    app.get('/fbpagereactions', requireAuth, AccessManager.roleAuthorization(all), AnalyticsManager.fb_getPageActionsPostReactionsTotal);
    app.get('/fbpageviewsexternals', requireAuth, AccessManager.roleAuthorization(all), AnalyticsManager.fb_getPageViewsExternalReferrals);

    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};