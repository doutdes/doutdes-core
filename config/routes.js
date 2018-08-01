const AccessManager    = require('../engine/access-manager');
const AnalyticsManager = require('../engine/analytics-manager');
const UserKeysManager  = require('../engine/user-keys-manager');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {

    function auth(strategy) {
        return passport.authenticate.bind(passport)(strategy,  {session: false});
    }

    /* PATHs */
    let indexPath = "/";
    let amPath    = indexPath + 'users/';
    let keysPath  = indexPath + 'keys/';

    /* AUTH */
    const admin  = 'jwt-admin';
    const user   = 'jwt-user';
    const editor = 'jwt-editor';
    const all = [admin, user, editor];

    /****************** ACCESS MANAGER ********************/

    app.post('/login', AccessManager.basicLogin);

    /****************** CRUD USERS ********************/
    app.post(amPath   + 'create/', AccessManager.createUser);        // Create
    app.get(amPath    + 'getFromId/', auth(all), AccessManager.getUserById); // Read by ID
    app.put(amPath    + 'update/', auth([admin]), AccessManager.updateUser);        // Update
    app.delete(amPath + 'delete/', auth([admin]), AccessManager.deleteUser);        // Delete


    /****************** CRUD USER KEYS ********************/
    app.post(keysPath   + 'insert/', auth(all), UserKeysManager.insertKey);                      // Create
    app.get(keysPath    + 'getAll/', auth(all), UserKeysManager.readAllKeysById);                // Read all keys by User
    app.get(keysPath    + 'getByUserService/:service_id', auth(all), UserKeysManager.readServiceKeyByUser); // Read a key by User and Service
    app.put(keysPath    + 'update/', auth(all), UserKeysManager.update);                         // Update
    app.delete(keysPath + 'delete/', auth(all), UserKeysManager.delete);                         // Delete


    /****************** FACEBOOK MANAGER ********************/

    app.get('/fbfancount', auth(all), AnalyticsManager.fb_getPageFans);
    app.get('/fbfancity', auth(all), AnalyticsManager.fb_getPageFansCity);
    app.get('/fbfancountry', auth(all),  AnalyticsManager.fb_getPageFansCountry);
    app.get('/fbengageduser', auth(all),  AnalyticsManager.fb_getEngagedUsers);
    app.get('/fbpageimpressions', auth(all),  AnalyticsManager.fb_getPageImpressionsUnique);
    app.get('/fbpageimpressionscity', auth(all),  AnalyticsManager.fb_getPageImpressionsByCityUnique);
    app.get('/fbpageimpressionscountry', auth(all),  AnalyticsManager.fb_getPageImpressionsByCountryUnique);
    app.get('/fbpagereactions', auth(all), AnalyticsManager.fb_getPageActionsPostReactionsTotal);
    app.get('/fbpageviewsexternals', auth(all), AnalyticsManager.fb_getPageViewsExternalReferrals);

    /****************** ERROR HANDLER ********************/

    app.use(ErrorHandler.fun404);
};