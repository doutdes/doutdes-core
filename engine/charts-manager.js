'use strict';

const Model = require('../models/index');
const Charts = Model.Charts;
const Op = Model.Sequelize.Op;

const HttpStatus = require('http-status-codes');

exports.readAll = (req, res, next) => {
    Charts.findAll({})
        .then(charts => {

            if (charts.length === 0) {
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

exports.insert =  (req, res, next) => {
    let chart = req.body;

    Charts.create({
        type: chart.type,
        title: chart.title,
        color: chart.color
    })
        .then(new_chart => {
            return res.status(HttpStatus.CREATED).send({
                created: true,
                id: new_chart.id,
                title: chart.title,
            });
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                created: false,
                title: chart.title,
                error: 'Cannot insert the new chart'
            });
        })

};

exports.readByType = (req, res, next) => {
    Charts.findAll({
        where: {
            type: req.params.type
        }
    })
        .then(charts => {

            if (charts.length === 0) {
                return res.status(HttpStatus.NO_CONTENT).send({});
            }

            return res.status(HttpStatus.OK).send(charts)
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                error: true,
                message: 'Cannot get charts informations by type'
            })
        })
};