const accessRoute = require('../routes/accessmanager_route');
const indexRoute = require('../routes/index');

module.exports = function (app, passport) {

    app.get('/', indexRoute.index);
    app.get('/users/getEmailFromUsername/:usern', accessRoute.getEmailFromUsername);
    app.get('/login', accessRoute.login);

    app.use(indexRoute.fun404);

};