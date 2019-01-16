const AccessManager     = require('../engine/access-manager');
const TokenManager      = require('../engine/token-manager');
const DashboardsManager = require('../engine/dashboard-manager');
const CalendarManager   = require('../engine/calendar-manager');

const FbManager = require('../engine/analytics/facebook-manager');
const IgManager = require('../engine/analytics/instagram-manager');
const GaManager = require('../engine/analytics/google-manager');
const YtManager = require('../engine/analytics/youtube-manager');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport) {
    /* PATHs */
    let indexPath  = "/";
    let amPath     = indexPath + 'users/';
    let keysPath   = indexPath + 'keys/';
    let dashPath   = indexPath + 'dashboards/';
    let calendPath = indexPath + 'calendar/';

    let gaPath    = indexPath + 'ga/';
    let fbPath  = indexPath + 'fb/';
    let igPath = indexPath + 'ig/';
    let ytPath   = indexPath + 'yt/';

    /* AUTH */
    const requireAuth = passport.authenticate('jwt', {session: false});
    const fbReqAuth = (req,res,next) => {passport.authenticate('facebook', {scope: 'manage_pages', state: req.query.user_id})(req, res, next)};
    const fbAuth = passport.authenticate('facebook');
    const gaReqAuth = (req,res,next) => {
        passport.authenticate('google', {
            scope: 'https://www.googleapis.com/auth/userinfo.email  https://www.googleapis.com/auth/analytics.readonly',
            accessType: 'offline',
            prompt: 'consent',
            state: req.query.user_id
        })(req, res, next)
    };
    const gaAuth = passport.authenticate('google');

    const admin  = '0';
    const user   = '1';
    const editor = '2';
    const all = [admin, user, editor];

    // TODO gestire le delete bene: se il risultato restituito dalla query è 0, allora non ha eliminato niente

    /* SERVICE METRICS*/
    const FBM = require('../api_handler/facebook-api').METRICS;
    const IGM = require('../api_handler/instagram-api').METRICS;
    const GAM = require('../api_handler/googleAnalytics-api').METRICS;
    const GAD = require('../api_handler/googleAnalytics-api').DIMENSIONS;
    const GAS = require('../api_handler/googleAnalytics-api').SORT;
    const GAF = require('../api_handler/googleAnalytics-api').FILTER;

    /****************** ACCESS MANAGER ********************/
    app.post('/login', AccessManager.basicLogin);

    app.get(fbPath + 'login', fbReqAuth);
    app.get(fbPath + 'login/success', fbAuth, FbManager.fb_login_success);

    app.get(gaPath + 'login', gaReqAuth);
    app.get(gaPath + 'login/success', gaAuth, GaManager.ga_login_success);

    /****************** CRUD USERS ********************/
    app.post(amPath     + 'create/', AccessManager.createUser);
    app.get(amPath      + 'getFromId/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.getUserById);
    app.put(amPath      + 'update/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.updateUser);
    app.delete(amPath   + 'delete/', requireAuth, AccessManager.roleAuthorization([admin]), AccessManager.deleteUser);

    /****************** CRUD TOKENS ********************/
    app.post(keysPath   + 'insert/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.insertKey);
    app.get(keysPath    + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.readAllKeysById);
    app.get(keysPath    + 'checkIfExists/:type', requireAuth, AccessManager.roleAuthorization(all), TokenManager.checkExistence);
    app.put(keysPath    + 'update/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.update);
    app.delete(keysPath + 'delete/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.deleteKey);

    /****************** CRUD DASHBOARD ********************/
    app.get(dashPath    + 'getAllUserDashboards/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readUserDashboards);
    app.get(dashPath    + 'getDashboardByType/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.getDashboardByType);
    app.get(dashPath    + 'getDashboardByID/:id', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.getDashboardByID);
    app.get(dashPath    + 'getChart/:dashboard_id/:chart_id', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readChart);
    app.get(dashPath    + 'getChartsNotAddedByDashboard/:dashboard_id/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readNotAddedByDashboard);
    app.get(dashPath    + 'getChartsNotAddedByDashboardAndType/:dashboard_id/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readNotAddedByDashboardAndType);
    app.post(dashPath   + 'addChartToDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.addChartToDashboard);
    app.delete(dashPath + 'removeChartFromDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.removeChartFromDashboard);
    app.put(dashPath    + 'updateChartInDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.updateChartInDashboard);
    // app.post(dashPath   + 'assignDashboardToUser', requireAuth, AccessManager.roleAuthorization(all),DashboardsManager.assignDashboardToUser);
    app.delete(dashPath + 'deleteUserDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.deleteUserDashboard);
    app.post(dashPath   + 'createDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.createDashboard);
    app.delete(dashPath + 'deleteDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.deleteDashboard);

    /****************** FACEBOOK MANAGER ********************/
    app.get(fbPath + 'pages', requireAuth, AccessManager.roleAuthorization(all), FbManager.fb_getPages);

    app.get(fbPath + ':page_id/fancount', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_FANS), FbManager.fb_getData);
    app.get(fbPath + ':page_id/fancity', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_FANS_CITY), FbManager.fb_getData);
    app.get(fbPath + ':page_id/fancountry', requireAuth, AccessManager.roleAuthorization(all),  FbManager.setMetric(FBM.P_FANS_COUNTRY), FbManager.fb_getData);
    app.get(fbPath + ':page_id/engageduser', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_ENGAGED_USERS), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageimpressions', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_IMPRESSIONS_UNIQUE), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageimpressionscity', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_IMPRESSIONS_BY_CITY_UNIQUE),  FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageimpressionscountry', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_IMPRESSIONS_BY_COUNTRY_UNIQUE), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pagereactions', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_ACTION_POST_REACTIONS_TOTAL), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageviewsexternals', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_VIEWS_EXT_REFERRALS), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageviewstotal', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_VIEWS_TOTAL), FbManager.fb_getData);

    /****************** INSTAGRAM DASHBOARD ********************/
    app.get(igPath + 'pages', requireAuth, AccessManager.roleAuthorization(all), IgManager.ig_getPages);

    app.get(igPath + ':page_id/audcity', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_AUDIENCE_CITY, ), IgManager.ig_getData);
    app.get(igPath + ':page_id/audcountry', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_AUDIENCE_COUNTRY), IgManager.ig_getData);
    app.get(igPath + ':page_id/audgenderage', requireAuth, AccessManager.roleAuthorization(all),  IgManager.setMetric(IGM.P_AUDIENCE_GENDER_AGE), IgManager.ig_getData);
    app.get(igPath + ':page_id/audlocale', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_AUDIENCE_LOCALE), IgManager.ig_getData);
    app.get(igPath + ':page_id/emailcontacts', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_EMAIL_CONTACTS), IgManager.ig_getData);
    app.get(igPath + ':page_id/followercount', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_FOLLOWER_COUNT),  IgManager.ig_getData);
    app.get(igPath + ':page_id/getdirclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_GET_DIRECTIONS_CLICKS), IgManager.ig_getData);
    app.get(igPath + ':page_id/impressions', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_IMPRESSIONS), IgManager.ig_getData);
    app.get(igPath + ':page_id/onlinefollowers', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_ONLINE_FOLLOWERS), IgManager.ig_getData);
    app.get(igPath + ':page_id/phonecallclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_PHONE_CALL_CLICKS), IgManager.ig_getData);
    app.get(igPath + ':page_id/profileviews', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_PROFILE_VIEWS), IgManager.ig_getData);
    app.get(igPath + ':page_id/reach', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_REACH), IgManager.ig_getData);
    app.get(igPath + ':page_id/textmessageclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_TEXT_MESSAGE_CLICKS), IgManager.ig_getData);
    app.get(igPath + ':page_id/websiteclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.P_WEBSITE_CLICKS), IgManager.ig_getData);


    /****************** GOOGLE MANAGER ********************/
    app.get(gaPath + 'sessions/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.SESSIONS, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'pageviews/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PAGE_VIEWS, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'mostviews/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PAGE_VIEWS, GAD.PAGE_PATH, GAS.PAGE_VIEWS_DESC), GaManager.ga_getData);
    app.get(gaPath + 'sources/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.SESSIONS, GAD.MEDIUM, null, GAF.SESSIONS_GT_5), GaManager.ga_getData);
    app.get(gaPath + 'viewsbycountry/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PAGE_VIEWS, GAD.COUNTRY), GaManager.ga_getData);
    app.get(gaPath + 'browsers/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.SESSIONS, GAD.COUNTRY), GaManager.ga_getData);
    app.get(gaPath + 'bouncerate/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.BOUNCE_RATE, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'avgsessionduration/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.AVG_SESSION_DURATION, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'newusers/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.NEW_USER, GAD.DATE), GaManager.ga_getData);

    /****************** YOUTUBE MANAGER ********************/
    app.get(ytPath + 'proof/', YtManager.proof);

    /****************** CALENDAR MANAGER ******************/
    app.get(calendPath    + 'getEvents', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.getEvents);
    app.post(calendPath   + 'addEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.addEvent);
    app.put(calendPath    + 'updateEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.updateEvent);
    app.delete(calendPath + 'deleteEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.deleteEvent);

    /****************** ERROR HANDLER ********************/
    app.use(ErrorHandler.fun404);
};

