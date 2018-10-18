const AccessManager     = require('../engine/access-manager');
const TokenManager   = require('../engine/token-manager');
const DashboardsManager = require('../engine/dashboard-manager');
const ChartsManager     = require('../engine/charts-manager');
const CalendarManager   = require('../engine/calendar-manager');

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
    let calendPath = indexPath + 'calendar/';

    let googlePath   = indexPath + 'ga/';
    let facebookPath = indexPath + 'fb/';

    /* AUTH */
    const requireAuth = passport.authenticate('jwt', {session: false});
    const admin  = '0';
    const user   = '1';
    const editor = '2';
    const all = [admin, user, editor];

    // TODO gestire le delete bene: se il risultato restituito dalla query è 0, allora non ha eliminato niente

    /****************** ACCESS MANAGER ********************/
    app.post('/login', AccessManager.basicLogin);

    /****************** CRUD USERS ********************/
    app.post(amPath   + 'create/', AccessManager.createUser);
    app.get(amPath    + 'getFromId/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.getUserById);
    app.put(amPath    + 'update/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.updateUser);
    app.delete(amPath + 'delete/', requireAuth, AccessManager.roleAuthorization([admin]), AccessManager.deleteUser);

    /****************** CRUD TOKENS ********************/
    app.post(keysPath   + 'insert/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.insertKey);
    app.get(keysPath    + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.readAllKeysById);
    app.put(keysPath    + 'update/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.update);
    app.delete(keysPath + 'delete/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.delete);

    /****************** CRUD DASHBOARD ********************/
    app.get(dashPath    + 'getAllUserDashboards/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readUserDashboards);
    app.get(dashPath    + 'getByType/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readUserDashboardByType);
    app.get(dashPath    + 'getDashboardChartsByType/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readDashboardChartsByType);
    app.get(dashPath    + 'getChart/:dashboard_id/:chart_id', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readChart);
    app.get(dashPath    + 'getChartsNotAddedByDashboardAndType/:dashboard_id/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readNotAddedByDashboardAndType);
    app.post(dashPath   + 'addChartToDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.addChartToDashboard);
    app.delete(dashPath + 'removeChartFromDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.removeChartFromDashboard);
    app.put(dashPath    + 'updateChartInDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.updateChartInDashboard);

    /****************** CRUD CHARTS ********************/
    app.get(chartsPath  + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), ChartsManager.readAll);
    app.get(chartsPath  + 'getByType/:type', requireAuth, AccessManager.roleAuthorization(all), ChartsManager.readByType);
    app.post(chartsPath + 'insert/', requireAuth, AccessManager.roleAuthorization(all), ChartsManager.insert);

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
    app.get(googlePath + 'sessions', GoogleManager.ga_getLastYearSessions);
    app.get(googlePath + 'pageviews', GoogleManager.ga_getPageViews);
    app.get(googlePath + 'mostviews', GoogleManager.ga_getMostPagesViews);
    app.get(googlePath + 'sources', GoogleManager.ga_getSources);

    /****************** CALENDAR MANAGER ******************/
    app.get(calendPath + 'getEvents', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.getEvents);
    app.post(calendPath + 'addEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.addEvent);
    app.put(calendPath + 'updateEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.updateEvent);
    app.delete(calendPath + 'deleteEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.deleteEvent);

    /****************** ERROR HANDLER ********************/
    app.use(ErrorHandler.fun404);
};