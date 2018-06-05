const accessRoute = require('../routes/accessmanager_route');
const indexRoute = require('../routes/index');
const facebookRoute = require('../routes/facebookmanager_route')

const model = require('../models/index');

module.exports = function (app, passport) {


    app.get('/users/getEmailFromUsername/:usern', accessRoute.getEmailFromUsername);
    app.post('/login', passport.authenticate('basic', { session : false }), function (req, res, next) {
        res.json("Logged In");
    });
    app.get('/login', accessRoute.login);
    // app.get('/fbsearch',facebookRoute.fbsearch);
    // app.get('/fbinfo',facebookRoute.fbPageInfo);
    app.get('/fbfancount',facebookRoute.fbFanCount);

    app.get('/', indexRoute.index);
    app.use(indexRoute.fun404);

};