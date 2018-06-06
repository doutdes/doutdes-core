let createError = require('http-errors');

exports.fun404 = function (req, res, next) {
    //next(createError(404));
    res.status(404).send('Page not found')
};