const AccMan = require('../engine/access-manager');
const TokenManager = require('../engine/token-manager');
const DashMan = require('../engine/dashboard-manager');
const CalMan = require('../engine/calendar-manager');

const FbM = require('../engine/analytics/facebook-manager');
const IgM = require('../engine/analytics/instagram-manager');
const GaM = require('../engine/analytics/google-manager');
const YtM = require('../engine/analytics/youtube-manager');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport, config) {

    const site_URL = (config['site_URL'].includes('localhost') ? 'http://localhost:4200' : 'https://www.doutdes-cluster.it/beta') + '/#/preferences/api-keys?err=true';

    /* PATHs */
    let indexPath = "/";
    let amPath    = indexPath + 'users/';
    let keysPath  = indexPath + 'keys/';
    let dashPath  = indexPath + 'dashboards/';
    let calPath   = indexPath + 'calendar/';


    let gaPath = indexPath + 'ga/';
    let fbPath = indexPath + 'fb/';
    let igPath = indexPath + 'ig/';
    let ytPath = indexPath + 'yt/';

    /* AUTH */
    const reqAuth = passport.authenticate('jwt', {session: false});

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
        console.log(req);
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
    const analyst = '3';
    const all = [admin, user, editor, analyst];

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
    app.post('/login', AccMan.basicLogin);

    app.get(fbPath + 'login', fbReqAuth);
    app.get(igPath + 'login', igReqAuth);
    app.get(fbPath + 'login/success', fbAuth, FbM.fb_login_success);

    app.get(gaPath + 'login', gaOnlyReqAuth);
    app.get(ytPath + 'login', ytOnlyReqAuth);
    app.get(gaPath + 'yt/login', bothGaYtReqAuth);
    app.get(gaPath + 'login/success', gaAuth, GaM.ga_login_success);

    /****************** CRUD USERS ********************/
    app.post(amPath + 'create/', AccMan.createUser);
    app.get(amPath + 'getFromId/', reqAuth, AccMan.roleAuth(all), AccMan.getUserById);
    app.put(amPath + 'update/', reqAuth, AccMan.roleAuth(all), AccMan.updateUser);
    app.delete(amPath + 'delete/', reqAuth, AccMan.roleAuth([admin]), AccMan.deleteUser);

    app.get(amPath + 'verifyEmail', AccMan.verifyEmail);

    /****************** TOKENS ********************/
    // CRUD
    app.post(keysPath + 'insert/', reqAuth, AccMan.roleAuth(all), TokenManager.insertKey);
    app.get(keysPath + 'getAll/', reqAuth, AccMan.roleAuth(all), TokenManager.readAllKeysById);
    app.put(keysPath + 'update/', reqAuth, AccMan.roleAuth(all), TokenManager.update);
    app.delete(keysPath + 'delete/', reqAuth, AccMan.roleAuth(all), TokenManager.deleteKey);

    // Validity
    app.get(keysPath + 'checkIfExists/:type', reqAuth, AccMan.roleAuth(all), TokenManager.checkExistence);
    app.get(keysPath + 'isPermissionGranted/:type', reqAuth, AccMan.roleAuth(all), TokenManager.permissionGranted);
    app.get(keysPath + 'isFbTokenValid', reqAuth, AccMan.roleAuth(all), TokenManager.checkFbTokenValidity);
    app.delete(keysPath + 'revokePermissions/:type', reqAuth, AccMan.roleAuth(all), TokenManager.revokePermissions);


    // Delete permissions
    // app.delete();

    /****************** CRUD DASHBOARD ********************/
    app.get(dashPath + 'getAllUserDashboards/', reqAuth, AccMan.roleAuth(all), DashMan.readUserDashboards);
    app.get(dashPath + 'getDashboardByType/:type', reqAuth, AccMan.roleAuth(all), DashMan.getDashboardByType);
    app.get(dashPath + 'getDashboardByID/:id', reqAuth, AccMan.roleAuth(all), DashMan.getDashboardByID);
    app.get(dashPath + 'getChart/:dashboard_id/:chart_id', reqAuth, AccMan.roleAuth(all), DashMan.readChart);
    app.get(dashPath + 'getChartsNotAddedByDashboard/:dashboard_id/', reqAuth, AccMan.roleAuth(all), DashMan.readNotAddedByDashboard);
    app.get(dashPath + 'getChartsNotAddedByDashboardAndType/:dashboard_id/:type', reqAuth, AccMan.roleAuth(all), DashMan.readNotAddedByDashboardAndType);
    app.post(dashPath + 'addChartToDashboard', reqAuth, AccMan.roleAuth(all), DashMan.addChartToDashboard);
    app.delete(dashPath + 'removeChartFromDashboard', reqAuth, AccMan.roleAuth(all), DashMan.removeChartFromDashboard);
    app.put(dashPath + 'updateChartInDashboard', reqAuth, AccMan.roleAuth(all), DashMan.updateChartInDashboard);
    app.delete(dashPath + 'clearDashboard', reqAuth, AccMan.roleAuth(all), DashMan.clearAllDashboard);
    // app.post(dashPath   + 'assignDashboardToUser', requireAuth, AccessManager.roleAuth(all),DashboardsManager.assignDashboardToUser);
    app.delete(dashPath + 'deleteUserDashboard', reqAuth, AccMan.roleAuth(all), DashMan.deleteUserDashboard);
    app.post(dashPath + 'createDashboard', reqAuth, AccMan.roleAuth(all), DashMan.createDashboard);
    app.delete(dashPath + 'deleteDashboard', reqAuth, AccMan.roleAuth(all), DashMan.deleteDashboard);

    /****************** FACEBOOK MANAGER ********************/
    app.get(fbPath + 'pages', reqAuth, AccMan.roleAuth(all), FbM.fb_getPages);
    app.get(fbPath + 'getScopes/', reqAuth, AccMan.roleAuth(all), FbM.fb_getScopes);
    app.get(fbPath + 'storeAllData/:key*?', FbM.fb_storeAllData);

    app.get(fbPath + ':page_id*?/posts/', reqAuth, AccMan.roleAuth(all), FbM.fb_getPost);
    app.get(fbPath + ':page_id*?/fancount', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_FANS), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/fancity', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_FANS_CITY), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/fancountry', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_FANS_COUNTRY), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/engageduser', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_ENGAGED_USERS), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pageviewstotal', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_VIEWS_TOTAL), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pageimpressions', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_IMPRESSIONS_UNIQUE), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pageviewsexternals', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_VIEWS_EXT_REFERRALS), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pagereactions', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_ACTION_POST_REACTIONS_TOTAL), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pageimpressionscity', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_IMPRESSIONS_BY_CITY_UNIQUE), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pageimpressionscountry', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_IMPRESSIONS_BY_COUNTRY_UNIQUE), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pageconsumptions', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_CONSUMPTIONS), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/placescheckin', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_PLACES_CHECKIN_TOTAL), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/negativefeedback', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_NEGATIVE_FEEDBACK), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/fansonlineperday', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_FANS_ONLINE_DAY), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/fansadds', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_FANS_ADDS), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/fanremoves', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_FANS_REMOVES), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/pageimpressionspaid', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_IMPRESSIONS_PAID), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/videoviews', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_VIDEO_VIEWS), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/postimpressions', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.POST_IMPRESSIONS), FbM.fb_getData);
    app.get(fbPath + ':page_id*?/videoads', reqAuth, AccMan.roleAuth(all), FbM.setMetric(FBM.P_VIDEO_ADS), FbM.fb_getData);

    /****************** INSTAGRAM DASHBOARD ********************/
    app.get(igPath + 'pages', reqAuth, AccMan.roleAuth(all), IgM.ig_getPages);
    app.get(igPath + ':page_id/businessInfo', reqAuth, AccMan.roleAuth(all), IgM.ig_getBusinessInfo);
    app.get(igPath + 'storeAllData/:key*?', IgM.ig_storeAllData);
    app.get(igPath + 'storeAllDataDaily/:key*?', IgM.ig_storeAllDataDaily);

    app.get(igPath + ':page_id/reach', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.REACH], IGP.DAY, IGI.MONTH), IgM.ig_getData);
    app.get(igPath + ':page_id/audgenderage', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.AUDIENCE_GENDER_AGE], IGP.LIFETIME), IgM.ig_getData);
    app.get(igPath + ':page_id/audlocale', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.AUDIENCE_LOCALE], IGP.LIFETIME), IgM.ig_getData);
    app.get(igPath + ':page_id/impressions', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.IMPRESSIONS], IGP.DAY, IGI.MONTH), IgM.ig_getData);
    app.get(igPath + ':page_id/audcity', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.AUDIENCE_CITY], IGP.LIFETIME), IgM.ig_getData);
    app.get(igPath + ':page_id/audcountry', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.AUDIENCE_COUNTRY], IGP.LIFETIME), IgM.ig_getData);
    app.get(igPath + ':page_id/onlinefollowers', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.ONLINE_FOLLOWERS], IGP.LIFETIME, IGI.MONTH), IgM.ig_getData);

    app.get(igPath + ':page_id/emailcontacts', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.EMAIL_CONTACTS], IGP.DAY, IGI.MONTH), IgM.ig_getData);
    app.get(igPath + ':page_id/followercount', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.FOLLOWER_COUNT], IGP.DAY, IGI.MONTH), IgM.ig_getData);
    app.get(igPath + ':page_id/getdirclicks', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.GET_DIRECTIONS_CLICKS], IGP.DAY, IGI.MONTH), IgM.ig_getData);


    app.get(igPath + ':page_id/phonecallclicks', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.PHONE_CALL_CLICKS], IGP.DAY, IGI.MONTH), IgM.ig_getData);
    app.get(igPath + ':page_id/profileviews', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.PROFILE_VIEWS], IGP.DAY, IGI.MONTH), IgM.ig_getData);

    app.get(igPath + ':page_id/textmessageclicks', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.TEXT_MESSAGE_CLICKS], IGP.DAY, IGI.MONTH), IgM.ig_getData);
    app.get(igPath + ':page_id/websiteclicks', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.WEBSITE_CLICKS], IGP.DAY, IGI.MONTH), IgM.ig_getData);
    app.get(igPath + ':page_id/actionsperformed', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.WEBSITE_CLICKS, IGM.TEXT_MESSAGE_CLICKS, IGM.PHONE_CALL_CLICKS, IGM.GET_DIRECTIONS_CLICKS], IGP.DAY, IGI.MONTH), IgM.ig_getData);

    /****************** INSTAGRAM MEDIA MANAGER ********************/
    app.get(igPath + ':page_id/media/:n*?', reqAuth, AccMan.roleAuth(all), IgM.ig_getMedia);
    app.get(igPath + ':page_id/videos/:n*?', reqAuth, AccMan.roleAuth(all), IgM.ig_getVideos);
    app.get(igPath + ':page_id/images/:n*?', reqAuth, AccMan.roleAuth(all), IgM.ig_getImages);
    app.get(igPath + ':page_id/stories/:n*?', reqAuth, AccMan.roleAuth(all), IgM.ig_getStories);

    //media insights
    app.get(igPath + ':page_id/engagement/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.ENGAGEMENT]), IgM.ig_getData);
    app.get(igPath + ':page_id/saved/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.SAVED]), IgM.ig_getData);
    app.get(igPath + ':page_id/vid_views/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.VIDEO_VIEWS]), IgM.ig_getData);

    //stories insights
    app.get(igPath + ':page_id/impressions/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.IMPRESSIONS]), IgM.ig_getData);
    app.get(igPath + ':page_id/reach/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.REACH]), IgM.ig_getData);
    app.get(igPath + ':page_id/exits/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.EXITS]), IgM.ig_getData);
    app.get(igPath + ':page_id/replies/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.REPLIES]), IgM.ig_getData);
    app.get(igPath + ':page_id/taps_f/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.TAPS_F]), IgM.ig_getData);
    app.get(igPath + ':page_id/taps_b/:media_id', reqAuth, AccMan.roleAuth(all), IgM.setMetric([IGM.TAPS_B]), IgM.ig_getData);

    /****************** GOOGLE MANAGER ********************/
    /** Data response is always an array of arrays as follows:
     * 0 - data
     * data.length - 1 - other values
     **/
    app.get(gaPath + 'getScopes/', reqAuth, AccMan.roleAuth(all), GaM.ga_getScopes);
    app.get(gaPath + 'getViewList', reqAuth, AccMan.roleAuth(all), GaM.ga_viewList);
    app.get(gaPath + 'storeAllData/:key*?', GaM.ga_storeAllData);

    app.get(gaPath + 'sessions/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.SESSIONS, GAD.DATE), GaM.ga_getData);
    app.get(gaPath + 'pageviews/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.PAGE_VIEWS, GAD.DATE), GaM.ga_getData);
    app.get(gaPath + 'mostviews/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.PAGE_VIEWS, GAD.PAGE_DATE, GAS.PAGE_VIEWS_DESC), GaM.ga_getData);
    app.get(gaPath + 'sources/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.SESSIONS, GAD.MEDIUM_DATE, null, GAF.SESSIONS_GT_5), GaM.ga_getData);
    app.get(gaPath + 'viewsbycountry/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.PAGE_VIEWS, GAD.COUNTRY_DATE), GaM.ga_getData);
    app.get(gaPath + 'browsers/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.SESSIONS, GAD.BROWSER_DATE), GaM.ga_getData);
    app.get(gaPath + 'bouncerate/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.BOUNCE_RATE, GAD.DATE), GaM.ga_getData);
    app.get(gaPath + 'avgsessionduration/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.AVG_SESSION_DURATION, GAD.DATE), GaM.ga_getData);
    app.get(gaPath + 'users/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.USERS, GAD.DATE), GaM.ga_getData);
    app.get(gaPath + 'newusers/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.NEW_USERS, GAD.DATE), GaM.ga_getData);
    app.get(gaPath + 'mobiledevices/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.SESSIONS, GAD.MOBILE_DEVICE_DATE, null, GAF.SESSIONS_GT_1), GaM.ga_getData);
    app.get(gaPath + 'pageloadtime/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.PAGE_LOAD_TIME, GAD.PAGE_DATE, null, GAF.PAGE_LOAD_TIME_GT_0), GaM.ga_getData);
    app.get(gaPath + 'percentnewsessions/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.PERCENT_NEW_SESSIONS, GAD.DATE), GaM.ga_getData);
    app.get(gaPath + 'onlineusers/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.SESSIONS, GAD.DATE_HOUR, null, GAF.SESSIONS_GT_0), GaM.ga_getData);
    app.get(gaPath + 'devicecategory/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.SESSIONS, GAD.DEVICE_CAT_DATE, null, GAF.SESSIONS_GT_0), GaM.ga_getData);
    app.get(gaPath + 'usersinterests/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.USERS, GAD.INTEREST_DATE), GaM.ga_getData);
    app.get(gaPath + 'audgenderage/', reqAuth, AccMan.roleAuth(all), GaM.setMetrics(GAM.USERS, GAD.AUD_GENDER_AGE_DATE), GaM.ga_getData);

    /****************** YOUTUBE MANAGER ********************/
    app.get(ytPath + 'channels', reqAuth, AccMan.roleAuth(all), YtM.setEndPoint(0, 'channels'), YtM.setParams({'params':{'part':'snippet, id'}}), YtM.yt_getPages);
    app.get(ytPath + 'storeAllData/:key*?', YtM.yt_storeAllData);

    app.get(ytPath + ':channel/subscribers/', reqAuth, AccMan.roleAuth(all), YtM.setEndPoint(0, 'subscriptions'), YtM.setParams({'params':{'part':'snippet','mySubscribers':true, 'metrics':'subscribers'}}), YtM.yt_getSubs);
    app.get(ytPath + ':channel/playlists/', reqAuth, AccMan.roleAuth(all), YtM.setEndPoint(0, 'playlists'), YtM.setParams({'params':{'part':'snippet', 'metrics': 'playlists'}}), YtM.yt_getData);
    app.get(ytPath + ':channel/videos/', reqAuth, AccMan.roleAuth(all), YtM.setEndPoint(0, 'search'), YtM.setParams({'params':{'part':'snippet', 'mine':'true', 'type':'video', 'channelId':' ', 'metrics': 'videos'}}), YtM.yt_getData);
    app.get(ytPath + ':channel/views/', reqAuth, AccMan.roleAuth(all),YtM.setEndPoint(1 ), YtM.setParams({'params':{'metrics':'views','dimensions':'day','ids':'channel==', 'analytics': true}}), YtM.yt_getData);
    app.get(ytPath + ':channel/comments/', reqAuth, AccMan.roleAuth(all),YtM.setEndPoint(1 ), YtM.setParams({'params':{'metrics':'comments','dimensions':'day','ids':'channel==', 'analytics': true}}), YtM.yt_getData);
    app.get(ytPath + ':channel/likes/', reqAuth, AccMan.roleAuth(all),YtM.setEndPoint(1 ), YtM.setParams({'params':{'metrics':'likes','dimensions':'day','ids':'channel==', 'analytics': true}}), YtM.yt_getData);
    app.get(ytPath + ':channel/dislikes/', reqAuth, AccMan.roleAuth(all),YtM.setEndPoint(1 ), YtM.setParams({'params':{'metrics':'dislikes','dimensions':'day','ids':'channel==', 'analytics': true}}), YtM.yt_getData);
    app.get(ytPath + ':channel/shares/', reqAuth, AccMan.roleAuth(all),YtM.setEndPoint(1 ), YtM.setParams({'params':{'metrics':'shares','dimensions':'day','ids':'channel==', 'analytics': true}}), YtM.yt_getData);
    app.get(ytPath + ':channel/avgView/', reqAuth, AccMan.roleAuth(all),YtM.setEndPoint(1 ), YtM.setParams({'params':{'metrics':'averageViewDuration','dimensions':'day','ids':'channel==', 'analytics': true}}), YtM.yt_getData);
    app.get(ytPath + ':channel/estWatch/', reqAuth, AccMan.roleAuth(all),YtM.setEndPoint(1 ), YtM.setParams({'params':{'metrics':'estimatedMinutesWatched','dimensions':'day','ids':'channel==', 'analytics': true}}), YtM.yt_getData);

    app.get(ytPath + 'getViewList', reqAuth, AccMan.roleAuth(all), YtM.setEndPoint(0, 'channels'), YtM.setParams({'params':{'part':'snippet, id'}}), YtM.yt_getPages);


    /****************** CALENDAR MANAGER ******************/
    app.get(calPath + 'getEvents', reqAuth, AccMan.roleAuth(all), CalMan.getEvents);
    app.post(calPath + 'addEvent',reqAuth, AccMan.roleAuth(all), CalMan.addEvent);
    app.put(calPath + 'updateEvent', reqAuth, AccMan.roleAuth(all), CalMan.getEvents);
    app.delete(calPath + 'deleteEvent', reqAuth, AccMan.roleAuth(all), CalMan.deleteEvent);

    /****************** ERROR HANDLER ********************/
    app.use(ErrorHandler.fun404);
};

