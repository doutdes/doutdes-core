const accessRoute = require('../routes/accessmanager_route');
const AccessManager = require('../engine/access-manager');
const indexRoute = require('../routes/index');

const model = require('../models/index');

module.exports = function (app, passport) {

    const pauth = passport.authenticate.bind(passport);
    const sess = {session: false};

    app.get('/users/getEmailFromUsername/:usern', accessRoute.getEmailFromUsername);

    app.post('/login', AccessManager.basicLogin);

    app.get('/ciao', pauth('jwt', sess), function (req, res, next) {
        res.send('ciao');
    });

    app.get('/', indexRoute.index);
    app.use(indexRoute.fun404);

};