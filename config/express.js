'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
let path = require('path');
let helmet = require('helmet');
let logger = require('morgan');
let config = require('./index');

module.exports = function (app, passport) {

    // use passport
    app.use(passport.initialize());
    app.use(passport.session());

    // use helmet
    app.use(helmet());

    // view engine setup
    app.set('views', config.root + '/views');
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(config.root + '/public'));

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

};