let createError = require('http-errors');

exports.index = function (req, res, next) {
    res.render('index', {title: 'Express'});
};

exports.fun404 = function (req, res, next) {
    next(createError(404));
};