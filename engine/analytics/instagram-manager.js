/** INSTAGRAM MANAGER **/

'use strict';
const DateFns = require('date-fns');

const Model = require('../../models/index');
const FbToken = Model.FbToken;
const Users = Model.Users;
const IGM = require('../../api_handler/instagram-api').METRICS;
const IGP = require('../../api_handler/instagram-api').PERIOD;
const IGI = require('../../api_handler/instagram-api').INTERVAL;

const D_TYPE = require('../dashboard-manager').D_TYPE;

const TokenManager = require('../token-manager');

const HttpStatus = require('http-status-codes');

const MongoManager = require('../mongo-manager');

const DAYS = {
    yesterday: 1,
    min_date: 30
};

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

// Replace some special chars in API JSONs, which are not allowed by Mongoose
function preProcessIGData(data, metric) {

    let stringified;

    if (metric.toString() === "audience_gender_age") {// This metric has dots in keys, which are not allowed
        stringified = JSON.stringify(data);
        stringified = stringified.replace(/F./g, "F").replace(/M./g, "M");
        data = JSON.parse(stringified);
    }

    return data;
}

function getIntervalDate(data) {
    return {
        start_date: data[0].end_time,
        end_date: data[data.length - 1].end_time
    }
}

const ig_getDataInternal = async (user_id, page_id, metric, period, since = null, until = null, media_id = null) => {

    let data;
    let response;

    let old_date, old_startDate, old_endDate;
    let date, today;
    try {
        old_date = await MongoManager.getIgMongoItemDate(user_id, metric);

        old_startDate = old_date.start_date;
        old_endDate = old_date.end_date;
        today = new Date();

        if (old_startDate == null) {
            data = await getAPIdata(user_id, page_id, metric, period, since, until, media_id);
            data = preProcessIGData(data, metric);
            date = getIntervalDate(data);
            console.log ("DATE ", date);
            await MongoManager.storeIgMongoData(user_id, metric, date.start_date.slice(0, 10), date.end_date.slice(0, 10), data);
            return data;
        } else if (old_endDate < today) {
            data = await getAPIdata(user_id, page_id, metric, period, since, until, media_id);
            date = getIntervalDate(data);
            data = preProcessIGData(data, metric);
            await MongoManager.updateIgMongoData(user_id, metric, date.end_date.slice(0, 10), data);
        }

        response = await MongoManager.getIgMongoData(user_id, metric);
        return response;
    } catch (err) {
        throw err;
    }

};

const ig_storeAllData = async (req, res) => {

    let key = req.params.key;
    let auth = process.env.KEY || null;

    if (auth == null) {
        console.warn("Scaper executed without a valid key");
    }

    if (key != auth) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            error: 'Internal Server Error',
            message: 'There is a problem with MongoDB'
        });
    }
    let user_id;
    let permissionGranted;
    let users;
    try {
        users = await Users.findAll();
        for (const user of users) {
            user_id = user.dataValues.id;
            try {
                permissionGranted = await TokenManager.checkInternalPermission(user_id, D_TYPE.IG);
                if (permissionGranted.granted) {
                    let key = await FbToken.findOne({where: {user_id: user_id}});
                    let page_id = (await InstagramApi.getPagesID(key.api_key))['data'][0]['instagram_business_account']['id'];

                    await ig_getDataInternal(user_id, page_id, [IGM.AUDIENCE_CITY], IGP.LIFETIME);
                    await ig_getDataInternal(user_id, page_id, [IGM.AUDIENCE_COUNTRY], IGP.LIFETIME);
                    await ig_getDataInternal(user_id, page_id, [IGM.AUDIENCE_GENDER_AGE], IGP.LIFETIME);
                    await ig_getDataInternal(user_id, page_id, [IGM.AUDIENCE_LOCALE], IGP.LIFETIME);
                    await ig_getDataInternal(user_id, page_id, [IGM.EMAIL_CONTACTS], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.FOLLOWER_COUNT], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.GET_DIRECTIONS_CLICKS], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.IMPRESSIONS], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.ONLINE_FOLLOWERS], IGP.LIFETIME, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.PHONE_CALL_CLICKS], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.PROFILE_VIEWS], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.REACH], IGP.D_28, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.TEXT_MESSAGE_CLICKS], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.WEBSITE_CLICKS], IGP.DAY, IGI.MONTH);
                    await ig_getDataInternal(user_id, page_id, [IGM.WEBSITE_CLICKS, IGM.TEXT_MESSAGE_CLICKS, IGM.PHONE_CALL_CLICKS, IGM.GET_DIRECTIONS_CLICKS], IGP.DAY, IGI.MONTH);


                    console.log("Ig Data updated successfully for user n°", user_id);
                }
            } catch (err) {
                console.log(err);
                console.warn("The user #", user_id, " have an invalid key or an invalid page_id.");
            }
        }
        return res.status(HttpStatus.OK).send({
            message: "ig_storeAllData executed successfully"
        });
    } catch (err) {

    }
};

const ig_getData = async (req, res) => {
    let response;
    try {
        response = await ig_getDataInternal(req.user.id, req.params.page_id, req.metric, req.period, req.since, req.until, req.params.media_id);

        return res.status(HttpStatus.OK).send(response);
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

//get data from Instagram insights
async function getAPIdata(user_id, page_id, metric, period, start_date = null, end_date = null, media_id = null) {
    let data, key;
    key = await FbToken.findOne({where: {user_id: user_id}});

    try {
        (start_date && end_date) ? data = await InstagramApi.getInstagramData(page_id, metric, period, key.api_key, new Date(start_date), new Date(end_date), media_id) :
            data = await InstagramApi.getInstagramData(page_id, metric, period, key.api_key);
    } catch (e) {
        console.error("Error retrieving Instagram data");
    }

    return data;
}

/** EXPORTS **/
module.exports = {
    setMetric,
    ig_getData,
    ig_getPages,
    ig_getMedia,
    ig_getVideos,
    ig_getImages,
    ig_getStories,
    ig_getBusinessInfo,
    ig_storeAllData
};