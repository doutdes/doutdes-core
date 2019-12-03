const AccMan = require('../engine/access-manager');
const TokenManager = require('../engine/token-manager');
const DashMan = require('../engine/dashboard-manager');
const CalMan = require('../engine/calendar-manager');
const MessMan = require('../engine/message-manager');

const FbM = require('../engine/analytics/facebook-manager');
const FbMM = require('../engine/analytics/facebook-marketing-manager');
const IgM = require('../engine/analytics/instagram-manager');
const GaM = require('../engine/analytics/google-manager');
const YtM = require('../engine/analytics/youtube-manager');

const ErrorHandler = require('../engine/error-handler');

module.exports = function (app, passport, config) {

    const site_URL = (config['site_URL'].includes('localhost') ? 'http://localhost:4200' : 'https://www.doutdes-cluster.it/beta') + '/#/preferences/api-keys?err=true';

    /* PATHs */
    const amPath   = '/users';
    const keysPath = '/keys';
    const dashPath = '/dashboards';
    const calPath  = '/calendar';
    const messPath = '/message';

    const gaPath = '/ga';
    const igPath = '/ig';
    const ytPath = '/yt';
    const fbPath = '/fb';
    const fbmPath = '/fbm';

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
    const fbAuth = passport.authenticate('facebook', {failureRedirect: site_URL});

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

    const gaAuth = passport.authenticate('google', {failureRedirect: site_URL});

    const admin = '0';
    const user = '1';
    const editor = '2';
    const analyst = '3';
    const all = [admin, user, editor, analyst];

    // TODO gestire le delete bene: se il risultato restituito dalla query è 0, allora non ha eliminato niente

    /****************** ACCESS MANAGER ********************/
    app.post('/login', AccMan.basicLogin);

    app.get(`${fbPath}/login`, fbReqAuth);
    app.get(`${igPath}/login`, igReqAuth);
    app.get(`${fbPath}/login/success`, fbAuth, FbM.fb_login_success);

    app.get(`${gaPath}/login`, gaOnlyReqAuth);
    app.get(`${ytPath}/login`, ytOnlyReqAuth);
    app.get(`${gaPath}${ytPath}/login`, bothGaYtReqAuth);
    app.get(`${gaPath}/login/success`, gaAuth, GaM.ga_login_success);

    /****************** CRUD USERS ********************/
    app.post(`${amPath}/create/`, AccMan.createUser);
    app.get(`${amPath}/getFromId/`, reqAuth, AccMan.roleAuth(all), AccMan.getUserById);
    app.put(`${amPath}/update/`, reqAuth, AccMan.roleAuth(all), AccMan.updateUser);
    app.delete(`${amPath}/delete/`, reqAuth, AccMan.roleAuth([admin]), AccMan.deleteUser);

    app.get(`${amPath}/verifyEmail`, AccMan.verifyEmail);

    /****************** TOKENS ********************/
    // CRUD
    app.post(`${keysPath}/insert/`, reqAuth, AccMan.roleAuth(all), TokenManager.insertKey);
    app.get(`${keysPath}/getAll/`, reqAuth, AccMan.roleAuth(all), TokenManager.readAllKeysById);
    app.put(`${keysPath}/update/`, reqAuth, AccMan.roleAuth(all), TokenManager.update);
    app.delete(`${keysPath}/delete/`, reqAuth, AccMan.roleAuth(all), TokenManager.deleteKey);

    // Validity
    app.get(`${keysPath}/checkIfExists/:type`, reqAuth, AccMan.roleAuth(all), TokenManager.checkExistence);
    app.get(`${keysPath}/isPermissionGranted/:type`, reqAuth, AccMan.roleAuth(all), TokenManager.permissionGranted);
    app.get(`${keysPath}/isFbTokenValid`, reqAuth, AccMan.roleAuth(all), TokenManager.checkFbTokenValidity);
    app.delete(`${keysPath}/revokePermissions/:type`, reqAuth, AccMan.roleAuth(all), TokenManager.revokePermissions);

    /****************** CRUD DASHBOARD ********************/
    app.get(`${dashPath}/getAllUserDashboards/`, reqAuth, AccMan.roleAuth(all), DashMan.readUserDashboards);
    app.get(`${dashPath}/getDashboardByType/:type`, reqAuth, AccMan.roleAuth(all), DashMan.getDashboardByType);
    app.get(`${dashPath}/getDashboardByID/:id`, reqAuth, AccMan.roleAuth(all), DashMan.getDashboardByID);
    app.get(`${dashPath}/getChart/:dashboard_id/:chart_id`, reqAuth, AccMan.roleAuth(all), DashMan.readChart);
    app.get(`${dashPath}/getChartsByFormat/:format`, reqAuth, AccMan.roleAuth(all), DashMan.getByFormat);
    app.get(`${dashPath}/getChartsNotAddedByDashboard/:dashboard_id/`, reqAuth, AccMan.roleAuth(all), DashMan.readNotAddedByDashboard);
    app.get(`${dashPath}/getChartsNotAddedByDashboardAndType/:dashboard_id/:type`, reqAuth, AccMan.roleAuth(all), DashMan.readNotAddedByDashboardAndType);

    app.put(`${dashPath}/updateChartInDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.updateChartInDashboard);
    app.put(`${dashPath}/updateChartsInDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.updateChartsInDashboard);
    app.put(`${dashPath}/updateProof`, DashMan.updateArray);

    app.post(`${dashPath}/createDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.createDashboard);
    app.post(`${dashPath}/addChartToDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.addChartToDashboard);

    app.delete(`${dashPath}/removeChartFromDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.removeChartFromDashboard);
    app.delete(`${dashPath}/clearDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.clearAllDashboard);
    app.delete(`${dashPath}/deleteUserDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.deleteUserDashboard);
    app.delete(`${dashPath}/deleteDashboard`, reqAuth, AccMan.roleAuth(all), DashMan.deleteDashboard);

    /****************** CRUD MESSAGES ********************/
    app.post(`${messPath}/createMessage`, reqAuth, AccMan.roleAuth(admin), MessMan.createMessage);
    app.get(`${messPath}/getMessageByID/:message_id`, reqAuth, AccMan.roleAuth(all), MessMan.readMessageByID);
    app.get(`${messPath}/getMessagesForUser`, reqAuth, AccMan.roleAuth(all), MessMan.getMessagesForUser);
    app.post(`${messPath}/sendMessageToUser`, reqAuth, AccMan.roleAuth(admin), MessMan.sendMessageToUser);
    app.put(`${messPath}/setMessageRead`, reqAuth, AccMan.roleAuth(all), MessMan.setMessageRead);
    app.delete(`${messPath}/deleteMessageForUser/:message_id`, reqAuth, AccMan.roleAuth(all), MessMan.deleteMessageForUser);
    app.delete(`${messPath}/deleteMessageByID`, reqAuth, AccMan.roleAuth(admin), MessMan.deleteMessageByID);

    /****************** FACEBOOK MANAGER ********************/
    app.get(`${fbPath}/pages`, reqAuth, AccMan.roleAuth(all), FbM.fb_getPages);
    app.get(`${fbPath}/getScopes`, reqAuth, AccMan.roleAuth(all), FbM.fb_getScopes);
    app.get(`${fbPath}/storeAllData/:key*?`, FbM.fb_storeAllData);

    app.get(`${fbPath}/data`, reqAuth, AccMan.roleAuth(all), FbM.fb_getData);
    app.get(`${fbPath}/posts`, reqAuth, AccMan.roleAuth(all), FbM.fb_getPost);

    /****************** FACEBOOK MARKETING MANAGER ********************/
    app.get(`${fbmPath}/pages`, reqAuth, AccMan.roleAuth(all), FbMM.fbm_getPages);

    app.get(`${fbmPath}/adslist`, FbMM.getAdsList);

    app.get(`${fbmPath}/data`, reqAuth, AccMan.roleAuth(all), FbMM.getData);

    app.get(`${fbmPath}/:act_id/:level/breakdowns/:group`, reqAuth, AccMan.roleAuth(all), FbMM.getData);
    app.get(`${fbmPath}/:act_id/:level/:id*?`, reqAuth, AccMan.roleAuth(all),FbMM.getData);

    /****************** GOOGLE MANAGER ********************/
    /** Data response is always an array of arrays as follows:
     * 0 - data
     * data.length - 1 - other values
     **/
    app.get(`${gaPath}/data`, reqAuth, AccMan.roleAuth(all), GaM.ga_getData);
    app.get(`${gaPath}/getScopes/`, reqAuth, AccMan.roleAuth(all), GaM.ga_getScopes);
    app.get(`${gaPath}/getViewList`, reqAuth, AccMan.roleAuth(all), GaM.ga_viewList);
    app.get(`${gaPath}/storeAllData/:key*?`, GaM.ga_storeAllData);

    /****************** INSTAGRAM DASHBOARD ********************/
    app.get(`${igPath}/pages`, reqAuth, AccMan.roleAuth(all), IgM.ig_getPages);
    app.get(`${igPath}/businessInfo`, reqAuth, AccMan.roleAuth(all), IgM.ig_getBusinessInfo);

    app.get(`${igPath}/storeAllData/:key*?`, IgM.ig_storeAllData);
    app.get(`${igPath}/storeAllDataDaily/:key*?`, IgM.ig_storeAllDataDaily);

    app.get(`${igPath}/data`, reqAuth, AccMan.roleAuth(all), IgM.ig_getData);
    app.get(`${igPath}/media`, reqAuth, AccMan.roleAuth(all), IgM.ig_getData);  // includes stories todo check

    /****************** INSTAGRAM MEDIA MANAGER ********************/
    app.get(`${igPath}/:page_id/media/:n*?`, reqAuth, AccMan.roleAuth(all), IgM.ig_getMedia);
    app.get(`${igPath}/:page_id/videos/:n*?`, reqAuth, AccMan.roleAuth(all), IgM.ig_getVideos);
    app.get(`${igPath}/:page_id/images/:n*?`, reqAuth, AccMan.roleAuth(all), IgM.ig_getImages);
    app.get(`${igPath}/:page_id/stories/:n*?`, reqAuth, AccMan.roleAuth(all), IgM.ig_getStories);

    /****************** YOUTUBE MANAGER ********************/
    app.get(`${ytPath}/data`, reqAuth, AccMan.roleAuth(all), YtM.yt_getData);
    app.get(`${ytPath}/channels`, reqAuth, AccMan.roleAuth(all), YtM.yt_getChannels);
    app.get(`${ytPath}/storeAllData/:key*?`, YtM.yt_storeAllData);

    /****************** CALENDAR MANAGER ******************/
    app.get(`${calPath}/getEvents`, reqAuth, AccMan.roleAuth(all), CalMan.getEvents);
    app.post(`${calPath}/addEvent`, reqAuth, AccMan.roleAuth(all), CalMan.addEvent);
    app.put(`${calPath}/updateEvent`, reqAuth, AccMan.roleAuth(all), CalMan.getEvents);
    app.delete(`${calPath}/deleteEvent`, reqAuth, AccMan.roleAuth(all), CalMan.deleteEvent);

    /****************** ERROR HANDLER ********************/
    app.use(ErrorHandler.fun404);
};

