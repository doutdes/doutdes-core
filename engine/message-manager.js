const Model = require('../models/index');
const Sequelize = require('../models/index').sequelize;
const Op = Model.Sequelize.Op;
const Message = Model.Messages;
const UserMessages = Model.UserMessages;
const HttpStatus = require('http-status-codes');

const createMessage = async (req, res) => {
    const message = req.body;
    try {
        if (message) {
            Message.create({
                title: message.title,
                text: message.text
            }).then(() => {
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
            error: 'Cannot create the new message',
        });
    }
};

const readMessageByID = async (req, res) => {
    const message_id = req.params.message_id;
    const user_id = req.user.id;
    let message;
    let usermessage;
    try {
        //check if the message is the db
        message = await Message.findById(message_id);
        if (message) {
            //check if there the message can be read from the user
            usermessage = await UserMessages.findAll({
                where: {
                    message_id: message_id,
                    user_id: user_id
                }
            });
            if (usermessage.length > 0) {
                return res.status(HttpStatus.OK).send(message);
            }
            else {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    error: 'the message cannot be read from the user'
                });
            }
        }
        else {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'there isn\'t message for the given id'
            });
        }
    } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Cannot retrieve the message for the given id',
        });
    }
};

const getMessagesForUser = async (req, res) => {
    let usermessages;
    try {
        usermessages = await UserMessages.findAll({
            where: {
                user_id: req.user.id
            }
        });

        if (usermessages.length > 0) {
            return res.status(HttpStatus.OK).send(usermessages);
        }
        return res.status(HttpStatus.BAD_REQUEST).send({
            error: 'there isn\'t message for the given user'
        });
    } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Cannot retrieve the messages for the given user',
        });
    }
};

const sendMessageToUser = async (req,res) => {
    
};

module.exports = {createMessage, readMessageByID, getMessagesForUser};