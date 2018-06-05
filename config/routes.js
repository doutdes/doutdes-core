const accessRoute = require('../routes/accessmanager_route');
const indexRoute = require('../routes/index');
const facebookRoute = require('../routes/facebookmanager_route')

module.exports = function (app, passport) {

    app.get('/', indexRoute.index);
    app.get('/users/getEmailFromUsername/:usern', accessRoute.getEmailFromUsername);
    app.get('/login', accessRoute.login);
    // app.get('/fbsearch',facebookRoute.fbsearch);
    // app.get('/fbinfo',facebookRoute.fbPageInfo);
    app.get('/fbfancount',facebookRoute.fbFanCount);

    app.use(indexRoute.fun404);

};