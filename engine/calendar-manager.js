'use strict';

const Calendar = require('../models/index').Calendar;
const Op = require('../models/index').Sequelize.Op;

const HttpStatus = require('http-status-codes');

exports.getEvents = function (req, res, next) {
  Calendar.findAll({
      where: {
          user_id: req.user.id
      }
  }).then(events => {

      if (events.length === 0) {
          return res.status(HttpStatus.NO_CONTENT).send({});
      }

      return res.status(HttpStatus.OK).send(events)
  })
      .catch(err => {
          console.log(err);

          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
              error: true,
              message: 'Cannot get events informations'
          })
      })
};

exports.addEvent = function (req, res, next) {
    let event = req.body;

    Calendar.create({
        user_id: req.user.id,
        title: event.title,
        dataStart: event.dataStart,
        dataEnd: event.dataEnd,
        primaryColor: event.primaryColor,
        secondaryColor: event.secondaryColor
    })
        .then(new_event => {
            return res.status(HttpStatus.CREATED).send({
                created: true,
                id: new_event.id,
                title: event.title,
            });
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                created: false,
                title: event.title,
                error: 'Cannot insert the new event'
            });
        })
};

exports.updateEvent = function (req, res, next) {

    let event = req.body;

    Calendar.update({
        title: event.title,
        dataStart: event.dataStart,
        dataEnd: event.dataEnd,
        primaryColor: event.primaryColor,
        secondaryColor: event.secondaryColor
    }, {
        where: {
            [Op.and]: [
                { id: event.id },
                { user_id: req.user.id }
            ]
        }
    })
        .then(eventUpdated => {
            return res.status(HttpStatus.OK).json({
                updated: true,
                id: event.id,
                title: event.title,
            })
        })
        .catch(err => {
            console.log(err);

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                updated: false,
                event_id: event.id,
                error: 'Cannot update the event'
            })
        });
};

exports.deleteEvent = function (req, res, next) {
    Calendar.destroy({
        where: {
            [Op.and]: [
                {id: req.body.id},
                {user_id: req.user.id}
            ]
        }
    })
        .then(() => {
            return res.status(HttpStatus.OK).json({
                deleted: true,
                event: parseInt(req.body.id)
            })
        })
        .catch(err => {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                deleted: false,
                event: req.body.id,
                error: 'Cannot delete the event'
            })
        })
};

