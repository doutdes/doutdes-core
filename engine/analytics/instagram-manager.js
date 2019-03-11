/** INSTAGRAM MANAGER **/

'use strict';

const Model = require('../../models/index');
const FbToken = Model.FbToken;

const TokenManager = require('../token-manager');

const HttpStatus = require('http-status-codes');

/***************** INSTAGRAM *****************/
const InstagramApi = require('../../api_handler/instagram-api');

// TODO change the response if there are no data
const setMetric = (metric, period, interval = null) => {
    let until = new Date();
    let since = new Date();

    if (interval) {
        since.setDate(since.getDate() - interval);
    }

    return (req, res, next) => {
        req.metric = metric;
        req.period = period;
        if (interval) {
            req.since = since;
            req.until = until;
        }
        next();
    }
};

const ig_getPages = async (req, res) => {
    let data, key;
    let pages = [];

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await InstagramApi.getPagesID(key.api_key))['data'];

        for (const index in data) {
            if (data[index]['instagram_business_account']) {

                const page = {
                    id: data[index]['instagram_business_account']['id'],
                    username: data[index]['instagram_business_account']['username'],
                    name: data[index]['instagram_business_account']['name'],
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

/*Fetches the latest n media objects in profile (IMG/VID, stories excluded, use direct method instead)*/
const ig_getMedia = async (req, res) => {
    let data, key;
    let n = req.params.n;
    let pageID = req.params.page_id;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await InstagramApi.getMedia(pageID, key.api_key, n))['data'];
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

/*Fetches the images in the latest n media objects*/
const ig_getImages = async (req, res) => {
    let data, key;
    let n = req.params.n;
    let pageID = req.params.page_id;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await InstagramApi.getMedia(pageID, key.api_key, n))['data'];
        let filtered_result = [];
        for (const index in data) {
            if (data[index]['media_type'] == 'IMAGE') {
                filtered_result.push(data[index]);
            }
        }

        return res.status(HttpStatus.OK).send(filtered_result);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

/*Fetches the videos in the latest n media objects*/
const ig_getVideos = async (req, res) => {
    let data, key;
    let n = req.params.n;
    let pageID = req.params.page_id;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await InstagramApi.getMedia(pageID, key.api_key, n))['data'];
        let filtered_result = [];
        for (const index in data) {
            if (data[index]['media_type'] == 'VIDEO') {
                filtered_result.push(data[index]);
            }
        }

        return res.status(HttpStatus.OK).send(filtered_result);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

const ig_getData = async (req, res) => {
    let key, data;
    let media_id = req.params.media_id | null;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        (req.since && req.until) ?
            data = await InstagramApi.getInstagramData(req.params.page_id, req.metric, req.period, new Date(req.since), new Date(req.until), key.api_key, media_id)
            :
            data = await InstagramApi.getInstagramData(req.params.page_id, req.metric, req.period, null, null, key.api_key, media_id)

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

/*Fetches he latest n story frames (avaiable for 24 hours only)*/
const ig_getStories = async (req, res) => {
    let data, key;
    let n = req.params.n;
    let pageID = req.params.page_id;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await InstagramApi.getStories(pageID, key.api_key, n))['data'];
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

const ig_getBusinessInfo = async (req, res) => {
    let data, key;
    let pageID = req.params.page_id;

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});
        data = (await InstagramApi.getBusinessDiscoveryInfo(pageID, key.api_key));
        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

/** EXPORTS **/
module.exports = {
    setMetric,
    ig_getData,
    ig_getPages,
    ig_getMedia,
    ig_getVideos,
    ig_getImages,
    ig_getStories,
    ig_getBusinessInfo
};