'use strict';

const Model = require('../../models/index');
const FbToken = Model.FbToken;

const TokenManager = require('../token-manager');

const HttpStatus = require('http-status-codes');

/***************** FACEBOOK *****************/
const FacebookApi = require('../../api_handler/facebook-api');

// TODO change the response if there are no data
const setMetric = (metric) => {
    return (req, res, next) => {
        req.metric = metric;
        next();
    }
};

const fb_getPages = async (req, res) => {
    let data, key;
    let pages = [];

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await FacebookApi.getPagesID(key.api_key))['data'];

        for (const index in data) {
            const page = {
                name: data[index]['name'],
                id: data[index]['id']
            };

            pages.push(page);
        }

        return res.status(HttpStatus.OK).send(pages);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

const fb_getData = async (req, res) => {
    let key;
    let data;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = await FacebookApi.getFacebookData(req.params.page_id, req.metric, DAY, key.api_key);

        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Facebook Bad Request',
                message: 'Invalid OAuth access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        });
    }
};

const fb_login_success = async (req, res) => {
    const user_id = req.query.state;
    const token = req.user;

    try {
        // Before to upsert the token to the database, the token has to be exchanged with a long-live token
        // const longToken = await FacebookApi.getLongLiveAccessToken(token);
        // const upserting = await TokenManager.upsertFbKey(user_id, longToken);

        res.redirect('http://localhost:4200/#/preferences/api-keys/'); // TODO to choose a url to send an error
    } catch (err) {
        console.error(err);
    }
};

/** EXPORTS **/
module.exports = {setMetric, fb_getData, fb_getPages, fb_login_success};