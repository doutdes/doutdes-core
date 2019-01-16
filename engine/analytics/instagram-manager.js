/** INSTAGRAM MANAGER **/

'use strict';

const Model = require('../../models/index');
const FbToken = Model.FbToken;

const TokenManager = require('../token-manager');

const HttpStatus = require('http-status-codes');

/***************** INSTAGRAM *****************/
const InstagramApi = require('../../api_handler/instagram-api');

// TODO change the response if there are no data
const setMetric = (metric, period) => {
    return (req, res, next) => {
        req.metric = metric;
        req.period = period;
        next();
    }
};

const ig_getPages = async (req, res) => {
    let data, key;
    let pages = [];

    try {
        console.log(req.user.id);
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await InstagramApi.getPagesID(key.api_key))['data'];

        for (const index in data) {
            // console.log(data[index]);

            if (data[index]['instagram_business_account']) {

                const page = {
                    name: data[index]['name'],
                    id: data[index]['instagram_business_account']['id']
                };

                pages.push(page);
            }
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

const ig_getData = async (req, res) => {
    let key;
    let data;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = await InstagramApi.getInstagramData(req.params.page_id, req.metric, req.period, key.api_key);

        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Instagram Bad Request',
                message: 'Invalid OAuth access token.'
            });
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        });
    }
};

//???
const ig_login_success = async (req, res) => {
    const user_id = req.query.state;
    const token = req.user;

    try {
        const upserting = await TokenManager.upsertFbKey(user_id, token);

        res.redirect('http://localhost:4200/#/preferences/api-keys/')

        // if(upserting) {
        //     return res.status(HttpStatus.OK).send({
        //         logged: true,
        //         service: 'Facebook',
        //         service_id: '1'
        //     })
        // }
    } catch (err) {
        console.error(err);
        // return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        //     error: true,
        //     message: 'Error logging to Facebook'
        // })
    }
};

/** EXPORTS **/
module.exports = {setMetric, ig_getData, ig_getPages, ig_login_success};