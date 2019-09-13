const Model = require('../models/index');
const Sequelize = require('../models/index').sequelize;
const Op = Model.Sequelize.Op;
const Message = Model.Messages;
const HttpStatus = require('http-status-codes');

const createMessage = async (req, res) => {
   const message = req.body;
   try {
      if (message){
         Message.create({
             title: message.title,
             text: message.text
         }).then(()=>{
             return res.status(HttpStatus.OK).send({
                 message: 'Message successfully created',
                 title: message.title,
                 text: message.text
             });
         })
      }
   }
   catch (e) {
       return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
           message: 'Cannot create the new message',
       });
   }

};

module.exports = {createMessage};