'use strict';
const DateFns = require('date-fns');

const HttpStatus = require('http-status-codes');
const Model = require('../../models/index');
const FbToken = Model.FbToken;
const FacebookMApi = require('../../api_handler/facebook-marketing-api');

const D_TYPE = require('../dashboard-manager').D_TYPE;
const MongoManager = require('../mongo-manager');
const DAYS = {
    yesterday: 1,
    min_date: 90
};
// This method will call Facebook Marketing API
const getData = async (req, res) => {
    let response;
    let page_id;

    let domain = req.query.domain;
    let breakdown = req.query.breakdowns;
    let metric = req.query.metric;
    let id = req.query.campaignsId || null;

    try {
        let key = await FbToken.findOne({where: {user_id: req.user.id}});
        page_id = req.query.act_id || (await FbToken.findOne({where: {user_id: req.user.id}}))['fbm_page_id'];;
        response = (await fb_getDataInternal(req.user.id, metric, page_id, domain, id, breakdown, key));
        // response = await FacebookMApi.facebookQuery(page_id, key.api_key, domain, breakdown, metric, startDate, endDate, id);
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
        // data = data.filter(d => d.business_name !== '');
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

const fb_getDataInternal = async (user_id, metric, page_id, domain, id, breakdown, key) => {
    let data;
    let old_startDate;
    let old_endDate;
    let old_date;
    let response;
    let d_type = domain === 'insights' ? D_TYPE.FBM : D_TYPE.FBC;
    let start_date = new Date(DateFns.subDays(DateFns.subDays(new Date(), DAYS.yesterday).setUTCHours(0, 0, 0, 0), DAYS.min_date));
    let end_date = new Date(DateFns.subDays(new Date().setUTCHours(0, 0, 0, 0), DAYS.yesterday)); // yesterday

    try {
        old_date = await MongoManager.getMongoItemDate(d_type, user_id, page_id, metric, null, domain, breakdown, id);

        old_startDate = old_date.start_date;
        old_endDate = old_date.end_date;

        //check if the previous document exist and create a new one
        if (old_startDate == null) {
            data =  await FacebookMApi.facebookQuery(page_id, key.api_key, domain, breakdown, metric, start_date, end_date, id);
            await MongoManager.storeMongoData(d_type, user_id, page_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data, null, domain, breakdown, id);

            return data;
        }
        //check if the start date is below our start date. If yes, delete the previous document and create a new one.
        else if (old_startDate > start_date) {
            // chiedere dati a Facebook e accertarmi che risponda
            data =  await FacebookMApi.facebookQuery(page_id, key.api_key, domain, breakdown, metric, start_date, end_date, id);
            await MongoManager.removeMongoData(d_type, user_id, page_id, metric, null, domain, breakdown, id);
            await MongoManager.storeMongoData(d_type, user_id, page_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data, null, domain, breakdown, id);

            return data;
        }
        else if (old_endDate < end_date) {
            data =  await FacebookMApi.facebookQuery(page_id, key.api_key, domain, breakdown, metric, new Date(DateFns.addDays(old_endDate, 1)), end_date, id);
            await MongoManager.updateMongoData(d_type, user_id, page_id, metric, start_date.toISOString().slice(0, 10),
                end_date.toISOString().slice(0, 10), data, null, domain, breakdown, id);
        }

        response = (await MongoManager.getMongoData(d_type, user_id, page_id, metric, null, domain, breakdown, id))[0];
        return response;

    } catch (err) {
        throw err;
    }
};
module.exports = {getData, getAdsList, fbm_getPages};
