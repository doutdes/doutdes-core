const Model = require('../models/index');
const Sequelize = require('../models/index').sequelize;
const Op = Model.Sequelize.Op;
const User = require('../models/index').Users;
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
        //get all messages for the user from the db
        usermessages = await UserMessages.findAll({
            where: {
                user_id: req.user.id
            }
        });
        //check if there are messages for the user
        if (usermessages.length > 0) {
            return res.status(HttpStatus.OK).send(usermessages);
        }
        else {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'there isn\'t message for the given user'
            });
        }
    } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Cannot retrieve the messages for the given user',
        });
    }
};

const sendMessageToUser = async (req, res) => {
    let message_id = req.body.message_id;
    let user_id = req.body.user_id;

    let message, user, sentMessage, existsMessage;

    try {
        //check first if the message exists
        message = await Message.findById(message_id);
        if (message) {
            //check if the user exists
            user = await User.findById(user_id);
            if (user) {
                //check if the message was previously sent to the user
                existsMessage = await UserMessages.findAll({
                    where: {
                        message_id: message_id,
                        user_id: user_id
                    }
                });
                if (existsMessage.length > 0) {
                    return res.status(HttpStatus.BAD_REQUEST).send({
                        error: 'the message has been sent previously for the selected user'
                    });
                } else {
                    sentMessage = await UserMessages.create({
                        message_id: message_id,
                        user_id: user_id
                    });

                    return res.status(HttpStatus.OK).send({
                        message: 'Message sent successfully'
                    });
                }
            } else {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    error: 'The user selected doesn\'t exists'
                });
            }
        } else {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'The message selected doesn\'t exists'
            });
        }

    }
    catch
        (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'The message selected doesn\'t exists'
        });
    }
};

const setMessageRead = async (req, res) => {

    let message_id = req.body.message_id;
    let user_id = req.user.id;

    let message, usermessage;

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
            if (usermessage.length > 0 && !usermessage[0].dataValues.is_read) {
                await UserMessages.update({
                        is_read: true
                    },
                    {
                        where: {
                            message_id: message_id,
                            user_id: user_id
                        }
                    });
                return res.status(HttpStatus.OK).send({message: 'message set to read successfully'});
            }
            else {
                return res.status(HttpStatus.BAD_REQUEST).send({
                    error: 'the message cannot be read from the user or the message is read already'
                });
            }
        }
        else {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: 'there isn\'t message for the given id'
            });
        }


    } catch (e) {

    }

};

module.exports = {createMessage, readMessageByID, getMessagesForUser, sendMessageToUser, setMessageRead};