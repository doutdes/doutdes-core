const AccessManager     = require('../engine/access-manager');
const AnalyticsManager  = require('../engine/analytics-manager');
const UserKeysManager   = require('../engine/user-keys-manager');
const DashboardsManager = require('../engine/dashboard-manager');
const ChartsManager     = require('../engine/charts-manager');

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

    /* AUTH */
    const requireAuth = passport.authenticate('jwt', {session: false});
    const admin  = '0';
    const user   = '1';
    const editor = '2';
    const all = [admin, user, editor];

    /****************** ACCESS MANAGER ********************/
    app.post('/login', AccessManager.basicLogin);

    /****************** CRUD USERS ********************/
    app.post(amPath   + 'create/', AccessManager.createUser);
    app.get(amPath    + 'getFromId/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.getUserById);
    app.put(amPath    + 'update/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.updateUser);
    app.delete(amPath + 'delete/', requireAuth, AccessManager.roleAuthorization([admin]), AccessManager.deleteUser);


    /****************** CRUD USER KEYS ********************/
    app.post(keysPath   + 'insert/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.insertKey);
    app.get(keysPath    + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.readAllKeysById);
    app.get(keysPath    + 'getByUserService/:service_id', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.readServiceKeyByUser);
    app.put(keysPath    + 'update/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.update);
    app.delete(keysPath + 'delete/', requireAuth, AccessManager.roleAuthorization(all), UserKeysManager.delete);

    /****************** CRUD DASHBOARD ********************/
    app.get(dashPath  + 'getAllUserDashboards/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readUserDashboards);
    app.get(dashPath  + 'getByType/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readUserDashboardByType);
    app.get(dashPath  + 'getDashboardChartsByType/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readDashboardChartsByType);
    app.post(dashPath + 'addChartToDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.addChartToDashboard);

    /****************** CRUD CHARTS ********************/
    app.get(chartsPath  + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), ChartsManager.readAll);
    app.get(chartsPath  + 'getByType/:type', requireAuth, AccessManager.roleAuthorization(all), ChartsManager.readByType);
    app.post(chartsPath + 'insert/', requireAuth, AccessManager.roleAuthorization(all), ChartsManager.insert);

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