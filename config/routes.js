const accessRoute = require('../routes/accessmanager_route');
const indexRoute = require('../routes/index');
const jwt = require('jsonwebtoken');

const model = require('../models/index');

module.exports = function (app, passport) {


    app.get('/users/getEmailFromUsername/:usern', accessRoute.getEmailFromUsername);

    app.post('/login', function (req, res, next) {
       passport.authenticate('basic', {session: false}, function (err, user, info) {
           if(err) {
               return next(err);
           }
           if(!user) {
               return res.status(401).json({
                   logged: false,
                   error: 'unauthorized'
               })
           } else {
               console.log(user);
               const token = jwt.sign(user.dataValues, 'your_jwt_secret');
               return res.json({user, token});
           }
       })(req, res, next);
    });


    app.get('/ciao', passport.authenticate('jwt', {session: false}), function (req, res, next) {
        res.send('ciao');
    });

    app.get('/user/:id', function (req, res, next) {
        const id = req.params.id;
        console.log(req);

        // model.Users.getById(id)
        model.Users.findOne({where: {id: id}})
            .then(user => {
                res.json(user)
            })
            .catch(err => {
                res.json(err)
            })
    });

    app.get('/', indexRoute.index);
    app.use(indexRoute.fun404);

};