let createError = require('http-errors');

exports.fun404 = function (req, res, next) {
    //next(createError(404));
    return res.status(404).send({
        error: true,
        description: 'Call not found'
    })
};