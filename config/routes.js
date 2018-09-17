const AccessManager     = require('../engine/access-manager');
const UserKeysManager   = require('../engine/user-keys-manager');
const DashboardsManager = require('../engine/dashboard-manager');
const ChartsManager     = require('../engine/charts-manager');

const FacebookManager   = require('../engine/analytics/facebook-manager');
const GoogleManager     = require('../engine/analytics/google-manager');

const Google            = require('../api_handler/googleAnalytics-api');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {
    //
    // function requireAuth, AccessManager.roleAuthorization(strategy) {
    //     return passport.authenticate.bind(passport)(strategy,  {session: false});
    // }

    /* PATHs */
    let indexPath  = "/";
    let amPath     = indexPath + 'users/';
    let keysPath   = indexPath + 'keys/';
    let dashPath   = indexPath + 'dashboards/';
    let chartsPath = indexPath + 'charts/';

    let googlePath   = indexPath + 'ga/';
    let facebookPath = indexPath + 'fb/';

    /* AUTH */
    const requireAuth = passport.authenticate('jwt', {session: false});
    const admin  = '0';
    const user   = '1';
    const editor = '2';
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

    /****************** CRUD DASHBOARD ********************/
    app.get(dashPath + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readAll);
    app.get(dashPath + 'getAllDashboardCharts/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readDashboardCharts);
    app.get(dashPath + 'getAllUserDashboards/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readUserDashboards);



    /****************** CRUD CHARTS ********************/
    app.get(chartsPath + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), ChartsManager.readAll);

    /****************** FACEBOOK MANAGER ********************/
    app.get(facebookPath + 'fancount', requireAuth, AccessManager.roleAuthorization(all), FacebookManager.fb_getPageFans);
    app.get(facebookPath + 'fancity', requireAuth, AccessManager.roleAuthorization(all), FacebookManager.fb_getPageFansCity);
    app.get(facebookPath + 'fancountry', requireAuth, AccessManager.roleAuthorization(all),  FacebookManager.fb_getPageFansCountry);
    app.get(facebookPath + 'engageduser', requireAuth, AccessManager.roleAuthorization(all),  FacebookManager.fb_getEngagedUsers);
    app.get(facebookPath + 'pageimpressions', requireAuth, AccessManager.roleAuthorization(all),  FacebookManager.fb_getPageImpressionsUnique);
    app.get(facebookPath + 'pageimpressionscity', requireAuth, AccessManager.roleAuthorization(all),  FacebookManager.fb_getPageImpressionsByCityUnique);
    app.get(facebookPath + 'pageimpressionscountry', requireAuth, AccessManager.roleAuthorization(all),  FacebookManager.fb_getPageImpressionsByCountryUnique);
    app.get(facebookPath + 'pagereactions', requireAuth, AccessManager.roleAuthorization(all), FacebookManager.fb_getPageActionsPostReactionsTotal);
    app.get(facebookPath + 'pageviewsexternals', requireAuth, AccessManager.roleAuthorization(all), FacebookManager.fb_getPageViewsExternalReferrals);

    /****************** GOOGLE MANAGER ********************/
    app.get(googlePath + 'sessions', GoogleManager.ga_getBrowsersSessions);

    /****************** ERROR HANDLER ********************/
    app.use(ErrorHandler.fun404);
};