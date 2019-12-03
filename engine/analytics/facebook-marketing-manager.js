'use strict';

const HttpStatus = require('http-status-codes');
const Model = require('../../models/index');
const FbToken = Model.FbToken;
const FacebookMApi = require('../../api_handler/facebook-marketing-api');

// This method will call Facebook Marketing API
const getData = async (req, res) => {
    let response;
    let page_id;

    let startDate = '2019-08-01';
    let endDate =  '2019-11-04';

    let domain = req.query.domain;
    let breakdown = req.query.breakdowns;
    let metric = req.query.metric;
    let id = req.query.campaignsId || null;

    try {
        let key = await FbToken.findOne({where: {user_id: req.user.id}});
        page_id = req.query.act_id || (await FbToken.findOne({where: {user_id: req.user.id}}))['fbm_page_id'];;

        response = await FacebookMApi.facebookQuery(page_id, key.api_key, domain, breakdown, metric, startDate, endDate, id);
        return res.status(HttpStatus.OK).send(response);
    }
    catch (err) {
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

// This method will call Facebook Marketing API - getPageAdsIds
const getAdsList = async (req, res) => {
    let data;
    let pages = [];

    try {
        data = (await FacebookMApi.getPageAdsIds(FbToken))['data'];

        for (const index in data) {
            const page = {
                account_id: data[index]['account_id'],
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

const fbm_getPages = async (req, res) => {
    let data, key;
    let pages = [];
    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await FacebookMApi.getPagesID(key.api_key))['data'];

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

module.exports = {getData, getAdsList, fbm_getPages};
