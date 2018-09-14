'use strict';

const Model = require('../models/index');
const Charts = Model.Charts;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

exports.readAll = function (req, res, next) {
    Charts.findAll({})
        .then(charts => {

            if(charts.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(charts)
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get charts informations'
            })
        })
};
