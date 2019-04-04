const AccessManager = require('../engine/access-manager');
const TokenManager = require('../engine/token-manager');
const DashboardsManager = require('../engine/dashboard-manager');
const CalendarManager = require('../engine/calendar-manager');

const FbManager = require('../engine/analytics/facebook-manager');
const IgManager = require('../engine/analytics/instagram-manager');
const GaManager = require('../engine/analytics/google-manager');
const YtManager = require('../engine/analytics/youtube-manager');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport, config) {
    const site_URL = config['site_URL'] + (config['site_URL'].includes('localhost') ? ':4200' : '/prealpha') + '/#/preferences/api-keys?err=true';

    /* PATHs */
    let indexPath = "/";
    let amPath = indexPath + 'users/';
    let keysPath = indexPath + 'keys/';
    let dashPath = indexPath + 'dashboards/';
    let calendPath = indexPath + 'calendar/';

    let gaPath = indexPath + 'ga/';
    let fbPath = indexPath + 'fb/';
    let igPath = indexPath + 'ig/';
    let ytPath = indexPath + 'yt/';

    /* AUTH */
    const requireAuth = passport.authenticate('jwt', {session: false});

    const fbReqAuth = (req, res, next) => {
        passport.authenticate('facebook', {
            scope: ['manage_pages', 'read_insights', 'ads_read'],
            state: req.query.user_id,
        })(req, res, next)
    };
    const igReqAuth = (req, res, next) => {
        passport.authenticate('facebook', {
            scope: ['manage_pages', 'read_insights', 'ads_read', 'instagram_basic', 'instagram_manage_insights'],
            state: req.query.user_id,
        })(req, res, next)
    };
    const fbAuth = passport.authenticate('facebook', { failureRedirect: site_URL});

    const gaOnlyReqAuth = (req, res, next) => {
        passport.authenticate('google', {
            scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/analytics.readonly',
            accessType: 'offline',
            prompt: 'consent',
            state: req.query.user_id,
        })(req, res, next)
    };
    const ytOnlyReqAuth = (req, res, next) => {
        passport.authenticate('google', {
            scope: 'https://www.googleapis.com/auth/userinfo.email ' +
                'https://www.googleapis.com/auth/youtube.readonly ' +
                'https://www.googleapis.com/auth/yt-analytics-monetary.readonly ' +
                'https://www.googleapis.com/auth/yt-analytics.readonly',
            accessType: 'offline',
            prompt: 'consent',
            state: req.query.user_id,
        })(req, res, next)
    };
    const bothGaYtReqAuth = (req, res, next) => {
        passport.authenticate('google', {
            scope: 'https://www.googleapis.com/auth/userinfo.email ' +
                'https://www.googleapis.com/auth/analytics.readonly ' +
                'https://www.googleapis.com/auth/youtube.readonly ' +
                'https://www.googleapis.com/auth/yt-analytics-monetary.readonly ' +
                'https://www.googleapis.com/auth/yt-analytics.readonly',
            accessType: 'offline',
            prompt: 'consent',
            state: req.query.user_id,
        })(req, res, next)
    };

    const gaAuth = passport.authenticate('google', { failureRedirect: site_URL});

    const admin = '0';
    const user = '1';
    const editor = '2';
    const all = [admin, user, editor];

    // TODO gestire le delete bene: se il risultato restituito dalla query è 0, allora non ha eliminato niente

    /* SERVICE METRICS*/
    const FBM = require('../api_handler/facebook-api').METRICS;
    const IGM = require('../api_handler/instagram-api').METRICS;
    const IGP = require('../api_handler/instagram-api').PERIOD;
    const IGI = require('../api_handler/instagram-api').INTERVAL;
    const GAM = require('../api_handler/googleAnalytics-api').METRICS;
    const GAD = require('../api_handler/googleAnalytics-api').DIMENSIONS;
    const GAS = require('../api_handler/googleAnalytics-api').SORT;
    const GAF = require('../api_handler/googleAnalytics-api').FILTER;

    /****************** ACCESS MANAGER ********************/
    app.post('/login', AccessManager.basicLogin);

    app.get(fbPath + 'login', fbReqAuth);
    app.get(igPath + 'login', igReqAuth);
    app.get(fbPath + 'login/success', fbAuth, FbManager.fb_login_success);

    app.get(gaPath + 'login', gaOnlyReqAuth);
    app.get(ytPath + 'login', ytOnlyReqAuth);
    app.get(gaPath + ytPath + 'login', bothGaYtReqAuth);
    app.get(gaPath + 'login/success', gaAuth, GaManager.ga_login_success);

    /****************** CRUD USERS ********************/
    app.post(amPath + 'create/', AccessManager.createUser);
    app.get(amPath + 'getFromId/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.getUserById);
    app.put(amPath + 'update/', requireAuth, AccessManager.roleAuthorization(all), AccessManager.updateUser);
    app.delete(amPath + 'delete/', requireAuth, AccessManager.roleAuthorization([admin]), AccessManager.deleteUser);

    /****************** TOKENS ********************/
    // CRUD
    app.post(keysPath + 'insert/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.insertKey);
    app.get(keysPath + 'getAll/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.readAllKeysById);
    app.put(keysPath + 'update/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.update);
    app.delete(keysPath + 'delete/', requireAuth, AccessManager.roleAuthorization(all), TokenManager.deleteKey);

    // Validity
    app.get(keysPath + 'checkIfExists/:type', requireAuth, AccessManager.roleAuthorization(all), TokenManager.checkExistence);
    app.get(keysPath + 'isPermissionGranted/:type', requireAuth, AccessManager.roleAuthorization(all), TokenManager.permissionGranted);
    app.get(keysPath + 'isFbTokenValid', requireAuth, AccessManager.roleAuthorization(all), TokenManager.checkFbTokenValidity);
    app.delete(keysPath + 'revokePermissions/:type', requireAuth, AccessManager.roleAuthorization(all), TokenManager.revokePermissions);
    // Delete permissions
    // app.delete();

    /****************** CRUD DASHBOARD ********************/
    app.get(dashPath + 'getAllUserDashboards/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readUserDashboards);
    app.get(dashPath + 'getDashboardByType/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.getDashboardByType);
    app.get(dashPath + 'getDashboardByID/:id', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.getDashboardByID);
    app.get(dashPath + 'getChart/:dashboard_id/:chart_id', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readChart);
    app.get(dashPath + 'getChartsNotAddedByDashboard/:dashboard_id/', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readNotAddedByDashboard);
    app.get(dashPath + 'getChartsNotAddedByDashboardAndType/:dashboard_id/:type', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.readNotAddedByDashboardAndType);
    app.post(dashPath + 'addChartToDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.addChartToDashboard);
    app.delete(dashPath + 'removeChartFromDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.removeChartFromDashboard);
    app.put(dashPath + 'updateChartInDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.updateChartInDashboard);
    // app.post(dashPath   + 'assignDashboardToUser', requireAuth, AccessManager.roleAuthorization(all),DashboardsManager.assignDashboardToUser);
    app.delete(dashPath + 'deleteUserDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.deleteUserDashboard);
    app.post(dashPath + 'createDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.createDashboard);
    app.delete(dashPath + 'deleteDashboard', requireAuth, AccessManager.roleAuthorization(all), DashboardsManager.deleteDashboard);

    /****************** FACEBOOK MANAGER ********************/
    app.get(fbPath + 'pages', requireAuth, AccessManager.roleAuthorization(all), FbManager.fb_getPages);
    app.get(fbPath + 'getScopes/', requireAuth, AccessManager.roleAuthorization(all), FbManager.fb_getScopes);
    app.get(fbPath + ':page_id/posts/', requireAuth, AccessManager.roleAuthorization(all), FbManager.fb_getPost);

    app.get(fbPath + ':page_id/fancount', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_FANS), FbManager.fb_getData);
    app.get(fbPath + ':page_id/fancity', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_FANS_CITY), FbManager.fb_getData);
    app.get(fbPath + ':page_id/fancountry', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_FANS_COUNTRY), FbManager.fb_getData);
    app.get(fbPath + ':page_id/engageduser', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_ENGAGED_USERS), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageimpressions', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_IMPRESSIONS_UNIQUE), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageimpressionscity', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_IMPRESSIONS_BY_CITY_UNIQUE), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageimpressionscountry', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_IMPRESSIONS_BY_COUNTRY_UNIQUE), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pagereactions', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_ACTION_POST_REACTIONS_TOTAL), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageviewsexternals', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_VIEWS_EXT_REFERRALS), FbManager.fb_getData);
    app.get(fbPath + ':page_id/pageviewstotal', requireAuth, AccessManager.roleAuthorization(all), FbManager.setMetric(FBM.P_VIEWS_TOTAL), FbManager.fb_getData);

    /****************** INSTAGRAM DASHBOARD ********************/
    app.get(igPath + 'pages', requireAuth, AccessManager.roleAuthorization(all), IgManager.ig_getPages);
    app.get(igPath + ':page_id/businessInfo', requireAuth, AccessManager.roleAuthorization(all), IgManager.ig_getBusinessInfo);

    app.get(igPath + ':page_id/audcity', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.AUDIENCE_CITY], IGP.LIFETIME), IgManager.ig_getData);
    app.get(igPath + ':page_id/audcountry', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.AUDIENCE_COUNTRY], IGP.LIFETIME), IgManager.ig_getData);
    app.get(igPath + ':page_id/audgenderage', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.AUDIENCE_GENDER_AGE], IGP.LIFETIME), IgManager.ig_getData);
    app.get(igPath + ':page_id/audlocale', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.AUDIENCE_LOCALE], IGP.LIFETIME), IgManager.ig_getData);
    app.get(igPath + ':page_id/emailcontacts', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.EMAIL_CONTACTS], IGP.DAY, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/followercount', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.FOLLOWER_COUNT], IGP.DAY, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/getdirclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.GET_DIRECTIONS_CLICKS], IGP.DAY, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/impressions', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.IMPRESSIONS], IGP.D_28, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/onlinefollowers', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.ONLINE_FOLLOWERS], IGP.LIFETIME, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/phonecallclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.PHONE_CALL_CLICKS], IGP.DAY, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/profileviews', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.PROFILE_VIEWS], IGP.DAY, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/reach', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.REACH], IGP.D_28, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/textmessageclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.TEXT_MESSAGE_CLICKS], IGP.DAY, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/websiteclicks', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.WEBSITE_CLICKS], IGP.DAY, IGI.MONTH), IgManager.ig_getData);
    app.get(igPath + ':page_id/actionsperformed', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric([IGM.WEBSITE_CLICKS, IGM.TEXT_MESSAGE_CLICKS, IGM.PHONE_CALL_CLICKS, IGM.GET_DIRECTIONS_CLICKS], IGP.DAY, IGI.MONTH), IgManager.ig_getData);

    /****************** INSTAGRAM MEDIA MANAGER ********************/
    app.get(igPath + ':page_id/media/:n*?', requireAuth, AccessManager.roleAuthorization(all), IgManager.ig_getMedia);
    app.get(igPath + ':page_id/videos/:n*?', requireAuth, AccessManager.roleAuthorization(all), IgManager.ig_getVideos);
    app.get(igPath + ':page_id/images/:n*?', requireAuth, AccessManager.roleAuthorization(all), IgManager.ig_getImages);
    app.get(igPath + ':page_id/stories/:n*?', requireAuth, AccessManager.roleAuthorization(all), IgManager.ig_getStories);

    //media insights
    app.get(igPath + ':page_id/engagement/:media_id', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.ENGAGEMENT), IgManager.ig_getData);
    app.get(igPath + ':page_id/saved/:media_id', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.SAVED), IgManager.ig_getData);
    app.get(igPath + ':page_id/vid_views/:media_id', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.VIDEO_VIEWS), IgManager.ig_getData);

    //stories insights
    app.get(igPath + ':page_id/exits/:media_id', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.EXITS), IgManager.ig_getData);
    app.get(igPath + ':page_id/replies/:media_id', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.REPLIES), IgManager.ig_getData);
    app.get(igPath + ':page_id/taps_f/:media_id', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.TAPS_F), IgManager.ig_getData);
    app.get(igPath + ':page_id/taps_b/:media_id', requireAuth, AccessManager.roleAuthorization(all), IgManager.setMetric(IGM.TAPS_B), IgManager.ig_getData);

    /****************** GOOGLE MANAGER ********************/
    /** Data response is always an array of arrays as follows:
     * 0 - data
     * i - other values
     **/
    app.get(gaPath + 'getScopes/', requireAuth, AccessManager.roleAuthorization(all), GaManager.ga_getScopes);

    app.get(gaPath + 'sessions/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.SESSIONS, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'pageviews/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PAGE_VIEWS, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'mostviews/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PAGE_VIEWS, GAD.PAGE_DATE, GAS.PAGE_VIEWS_DESC), GaManager.ga_getData);
    app.get(gaPath + 'sources/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.SESSIONS, GAD.MEDIUM_DATE, null, GAF.SESSIONS_GT_5), GaManager.ga_getData);
    app.get(gaPath + 'viewsbycountry/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PAGE_VIEWS, GAD.COUNTRY_DATE), GaManager.ga_getData);
    app.get(gaPath + 'browsers/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.SESSIONS, GAD.BROWSER_DATE), GaManager.ga_getData);
    app.get(gaPath + 'bouncerate/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.BOUNCE_RATE, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'avgsessionduration/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.AVG_SESSION_DURATION, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'users/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.USERS, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'newusers/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.NEW_USERS, GAD.DATE), GaManager.ga_getData);
    app.get(gaPath + 'mobiledevices/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.SESSIONS, GAD.MOBILE_DEVICE_DATE), GaManager.ga_getData);
    app.get(gaPath + 'pageloadtime/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PAGE_LOAD_TIME, GAD.PAGE_DATE), GaManager.ga_getData);
    app.get(gaPath + 'percentnewsessions/:start_date/:end_date', requireAuth, AccessManager.roleAuthorization(all), GaManager.setMetrics(GAM.PERCENT_NEW_SESSIONS, GAD.DATE), GaManager.ga_getData);
    /****************** YOUTUBE MANAGER ********************/
    app.get(ytPath + 'proof/', YtManager.proof);

    /****************** CALENDAR MANAGER ******************/
    app.get(calendPath + 'getEvents', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.getEvents);
    app.post(calendPath + 'addEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.addEvent);
    app.put(calendPath + 'updateEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.updateEvent);
    app.delete(calendPath + 'deleteEvent', requireAuth, AccessManager.roleAuthorization(all), CalendarManager.deleteEvent);

    /****************** ERROR HANDLER ********************/
    app.use(ErrorHandler.fun404);
};

