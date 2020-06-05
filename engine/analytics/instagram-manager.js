/** INSTAGRAM MANAGER **/

'use strict';
const DateFns = require('date-fns');
const _ = require('lodash');

const Model = require('../../models/index');
const FbToken = Model.FbToken;
const Users = Model.Users;
const Chart = Model.Charts;
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

    return (req, res, next) => {
        req.metric = metric;
        req.period = period;
        req.interval = interval;
        next();
    }
};

const ig_getPages = async (req, res) => {

    let pages = [];

    try {
        pages = await ig_getInternalPages(req.user.id);
        return res.status(HttpStatus.OK).send(pages);
    } catch (err) {
        //  console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Instagram servers or with our database'
        })
    }
};

async function ig_getInternalPages (user_id){
    let data, key;
    let pages = [];

    key = await FbToken.findOne({where: {user_id: user_id}});
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
    return pages;
}

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
            message: 'There is a problem either with Instagram servers or with our database'
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
            message: 'There is a problem either with Instagram servers or with our database'
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
            message: 'There is a problem either with Instagram servers or with our database'
        })
    }
};

// Replace some special chars in API JSONs, which are not allowed by Mongoose
function preProcessIGData(data, metric, period) {

    let stringified;

    if (metric.toString() === "audience_gender_age" && data) {// This metric has dots in keys, which are not allowed
        stringified = JSON.stringify(data);
        stringified = stringified.replace(/F./g, "F").replace(/M./g, "M").replace(/U./g, "U");
        data = JSON.parse(stringified);
    }

    if (metric.toString() === "audience_city" && data) {// This metric has dots in keys, which are not allowed
        stringified = JSON.stringify(data);
        stringified = stringified.replace( /\./g , " " ); //replace all dots, remember
        data = JSON.parse(stringified);
    }


    if (period !== "lifetime")
        data = data.slice(0,-1);

    return data;
}

function getIntervalDate(data) {
    //console.log ("getIntervalDate -> ", data);
    let date = {start_date: data[0].end_time,
        end_date: data[data.length - 1].end_time};
    return date;
}

const ig_getDataInternal = async (user_id, page_id, metric, period, interval = null, media_id = null) => {
    let data;
    let response;
    let since = null;
    let until = null;

    // handling interval
    if (interval) {
        since = new Date();
        until = new Date();
        since.setDate(since.getDate() - interval);
    }

    let old_date, old_startDate, old_endDate;
    let date, today, yesterday;
    try {
        old_date = await MongoManager.getMongoItemDate(D_TYPE.IG, user_id, page_id, metric);
        old_startDate = old_date.start_date; //primo giorno su mongo
        old_endDate = old_date.end_date; //ultimo giorno su mongo
        today = new Date(); //giorno di oggi
        yesterday = new Date(DateFns.subDays(new Date().setUTCHours(0, 0, 0, 0), 1)); //giorno di ieri


        if (old_startDate == null) { //se non ci sono date, chiama tutti i dati e gli salva una volta
            data = await getAPIdata(user_id, page_id, metric, period, since, until, media_id);
            data = preProcessIGData(data, metric, period);
            date = getIntervalDate(data);
            await MongoManager.storeMongoData(D_TYPE.IG, user_id, page_id, metric, date.start_date.slice(0, 10), date.end_date.slice(0, 10), data);
            return data;
        } else if (DateFns.startOfDay(old_endDate) < DateFns.startOfDay(today) && period === "lifetime") {
            data = await getAPIdata(user_id, page_id, metric, period, since, until, media_id);
            data = preProcessIGData(data, metric, period);
            date = getIntervalDate(data);
            await MongoManager.updateMongoData(D_TYPE.IG, user_id, page_id, metric, date.start_date.slice(0, 10), date.end_date.slice(0, 10), data);
        }   else if (DateFns.startOfDay(old_endDate) < DateFns.startOfDay(yesterday)){
            data = await getAPIdata(user_id, page_id, metric, period, since, until, media_id);
            data = preProcessIGData(data, metric, period);
            date = getIntervalDate(data);
            await MongoManager.updateMongoData(D_TYPE.IG, user_id, page_id, metric, '', date.end_date.slice(0, 10), data);
        }

        response = await MongoManager.getMongoData(D_TYPE.IG, user_id, page_id, metric);

        return response;
    } catch (err) {
        throw err;
    }

};

async  function supportCheckData(data, user_id, page_id, metric, period, since, until, media_id){
    let date;
    data = await getAPIdata(user_id, page_id, metric, period, since, until, media_id);
    data = preProcessIGData(data, metric, period);
    date = getIntervalDate(data);

    return data, date;
}

const ig_getData = async (req, res) => {
    let response;

    try {
        if (!req.query.page_id) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'You have not provided a page ID for the Instagram data request.'
            })
        }

        if (!req.query.metric) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'You have not provided a metric for the Instagram data request.'
            })
        }

        if (!req.query.period && !req.query.media_id) { // Period is not necessary in the media query
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'You have not provided a period for the Instagram data request.'
            })
        }

        if (req.url.includes('/media') && !req.query.media_id) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                error: true,
                message: 'You have not provided a media ID for the Instagram media request.'
            })
        }
        response = await getResponseData(req, res);

        return res.status(HttpStatus.OK).send(response);
    } catch (err) {
        if (err.statusCode === 400) {
            return res.status(HttpStatus.BAD_REQUEST).send({
                name: 'Instagram Bad Request',
                message: 'Invalid OAuth access token.'
            });
        }
        return res.status(HttpStatus.CONFLICT).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Instagram servers or with our database'
        });
    }
};

const getResponseData = async (req, res) => {
    let response = [], data = [], n = 1000;
    let metric = [];
    let key = await FbToken.findOne({where: {user_id: req.user.id}});
    let pageID = req.query.page_id;
    let since = (new Date()).getFullYear() + '-01-01';

    req.query.metric.includes(',')
        ? metric = req.query.metric.split(',')
        : metric.push(req.query.metric); // più metriche assieme

    if (req.query.metric === 'lost_followers') {
        response = await getLostFollowers(req, res);
    } else if (req.query.metric.includes('media')) {
        let date = await MongoManager.getMongoItemDate(D_TYPE.IG, req.user.id, pageID, 'media');

        if (!DateFns.isToday(date.end_date)) {
            data = (await InstagramApi.getMedia(pageID, key.api_key, n, true))['data'];
            data = data.filter(el => new Date(el.timestamp).getTime() >= new Date(since).getTime());

            const images = [], album = [], video = [];
            data.forEach( el => el.media_type ==='CAROUSEL_ALBUM' ? album.push(el) : el.media_type === 'IMAGE' ? images.push(el) : video.push(el));
            for (let el of images) {
                let tmp = await getAPIdata(req.user.id, req.query.page_id, 'reach,impressions,saved,engagement','lifetime', null, null, el.id);
                response.push({'end_time': el.timestamp, 'media_type': 'image',
                    'reach': tmp[0].values[0].value,
                    'impressions': tmp[1].values[0].value,
                    'saved': tmp[2].values[0].value,
                    'engagement': tmp[3].values[0].value,
                    'like': el['like_count'],
                    'comments': el['comments_count']
                });
            }
            for (let el of video) {
                let tmp = await getAPIdata(req.user.id, req.query.page_id, 'reach,impressions,saved,engagement','lifetime', null, null, el.id);

                response.push({'end_time': el.timestamp, 'media_type': 'video',
                    'reach': tmp[0].values[0].value,
                    'impressions': tmp[1].values[0].value,
                    'saved': tmp[2].values[0].value,
                    'engagement': tmp[3].values[0].value,
                    'like': el['like_count'],
                    'comments': el['comments_count']
                });
            }
            for (let el of album) {
                let tmp = await getAPIdata(req.user.id, req.query.page_id, 'reach,impressions,saved,engagement','lifetime', null, null, el.id);

                response.push({'end_time': el.timestamp, 'media_type': 'album',
                    'reach': tmp[0].values[0].value,
                    'impressions': tmp[1].values[0].value,
                    'saved': tmp[2].values[0].value,
                    'engagement': tmp[3].values[0].value,
                    'like': el['like_count'],
                    'comments': el['comments_count']
                });
        }
            response = response.reverse();
        }

        response = await saveMongo(req.query.page_id, req.user.id, 'media', response);
        req.query.metric.includes('Like') ? response.forEach(el => el['value'] = el.like) : response.forEach(el => el['value'] = el.engagement + el.saved);
    } else {
        for (let el of metric) {
            data.push(await ig_getDataInternal(req.user.id, req.query.page_id, el, req.query.period, parseInt(req.query.interval), req.query.media_id));
        }
        data.length === 1 ? response = data[0] : response.push({data, 'end_time': data[0][data[0].length - 1].end_time, 'metrics': metric}); // response prende il risultato di una o più metriche
    }

    return response;
}

async function saveMongo(pageID, user_id, metric, data) {
    let today = new Date();
    let date;

    try {
        if (data.length > 0) {

            const start = data[0].end_time;
            const end = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

            date = await MongoManager.getMongoItemDate(D_TYPE.IG, user_id, pageID, metric);

            if (date.start_date === null) {
                data['end_date'] = end;

                await MongoManager.storeMongoData(D_TYPE.IG, user_id, pageID, metric, start.slice(0, 10), end.slice(0, 10), [data]);
            } else if (date.end_date < DateFns.startOfDay(today)) {
                await MongoManager.updateMongoData(D_TYPE.IG, user_id, pageID, metric, '', end, [data]);
            }
        }
        data = await MongoManager.getMongoData(D_TYPE.IG, user_id, pageID, metric);
        return data[data.length - 1];
    } catch (e) {
        console.error(e);
    }
}

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
    let charts;
    try {
        users = await Users.findAll();
        charts = await Chart.findAll({
            where: {
                type: D_TYPE.IG
            }
        });
        for (const user of users) {
            user_id = user.dataValues.id;
            try {
                permissionGranted = await TokenManager.checkInternalPermission(user_id, D_TYPE.IG);
                if (permissionGranted.granted) {
                    let pages = await ig_getInternalPages(user_id);

                    pages = _.map(pages,"id");

                    for (const page_id of pages) {

                        for (const chart of charts) {
                            await ig_getDataInternal(user_id, page_id, chart.metric, chart.period, chart.interval)
                        }
                    }

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

const ig_storeAllDataDaily = async (req, res) => {
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
    let charts;
    try {
        users = await Users.findAll();
        for (const user of users) {
            user_id = user.dataValues.id;

            charts = await Chart.findAll({
                where: {
                    type: D_TYPE.IG,
                    period: "lifetime"
                }
            });
            try {
                permissionGranted = await TokenManager.checkInternalPermission(user_id, D_TYPE.IG);
                if (permissionGranted.granted) {

                    let pages = await ig_getInternalPages(user_id);

                    pages = _.map(pages,"id");

                    for (const page_id of pages) {

                        await getBusinessInfo(page_id, user_id)

                        for (const chart of charts) {
                            await ig_getDataInternal(user_id, page_id, chart.metric, chart.period)
                        }
                    }

                    console.log("Ig Data Daily updated successfully for user n°", user_id);
                }
            } catch (err) {
                console.log(err);
                console.warn("The user #", user_id, " have an invalid key or an invalid page_id.");
            }
        }
        return res.status(HttpStatus.OK).send({
            message: "ig_storeAllDataDaily executed successfully"
        });
    } catch (err) {

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
            message: 'There is a problem either with Instagram servers or with our database'
        })
    }
};

const ig_getBusinessInfo = async (req, res) => {
    let data;
    let pageID = req.query.page_id;

    try {
        data = await getBusinessInfo(pageID, req.user.id);

        return res.status(HttpStatus.OK).send(data);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Instagram servers or with our database'
        })
    }
};

async function getBusinessInfo(pageID, user_id, since = null) {
    let date, data, key, dataArray;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let day_time = 1000*60*60*24;

    today = yyyy + '-' + mm + '-' + dd;
    try {
        date = await MongoManager.getMongoItemDate(D_TYPE.IG, user_id, pageID, 'business');
        key = await FbToken.findOne({where: {user_id: user_id}});

        if (date.start_date === null) {
                data = (await InstagramApi.getBusinessDiscoveryInfo(pageID, key.api_key));
                data['end_date'] = today;
                await MongoManager.storeMongoData(D_TYPE.IG, user_id, pageID, 'business', today, today, data);
        } else {
                dataArray = await MongoManager.getMongoData(D_TYPE.IG, user_id, pageID, 'business');
                if (date.end_date - new Date(today) < 0) {
                    let diff_time = Math.abs(new Date(today) - new Date(dataArray[dataArray.length -1 ].end_time));
                    data = (await InstagramApi.getBusinessDiscoveryInfo(pageID, key.api_key));
                    if (diff_time > day_time) {
                        for (let i = (diff_time/day_time) - 1; i > 0; i--){
                            dataArray.push({'followers_count': 0,'media_count': 0, 'id': data['id'], 'end_time': (yyyy + '-' + mm + '-' + (dd - i))});
                        }
                    }
                    data['end_time'] = today;
                    dataArray.push(data);
                    await MongoManager.updateMongoData(D_TYPE.IG, user_id, pageID, 'business', '', today, dataArray);
                }
            }
        data = await MongoManager.getMongoData(D_TYPE.IG, user_id, pageID, 'business');
        if (since) {
            data = data.filter(el => new Date(el.end_time).getTime() > since);
        }
        return data;
    } catch (err) {
        console.error(err);
    }
}

//get data from Instagram insights
async function getAPIdata(user_id, page_id, metric, period, start_date = null, end_date = null, media_id = null) {
    const key = await FbToken.findOne({where: {user_id: user_id}});
    let data;
    if(start_date) {
        start_date = new Date(start_date)
    }

    if(end_date) {
        end_date = new Date(end_date);
    }

    try {
        //  data = //(start_date && end_date)
        //? await InstagramApi.getInstagramData(page_id, metric, period, key.api_key, new Date(start_date), new Date(end_date), media_id) :
        data = await InstagramApi.getInstagramData(page_id, metric, period, key.api_key, start_date, end_date, media_id);

        if(metric === 'online_followers') { //time change compared to the time released by the API Instagram, +9
            data= online_Followers(data);
        }

        return data;

    } catch (e) {
        console.error("Error retrieving Instagram data");
    }

}

async function getLostFollowers(req, res) {
    let data = [], date;
    let followers, business;

    let since = new Date();
    since = since.setDate(since.getDate() - req.query.interval);

    try {
        date = await MongoManager.getMongoItemDate(D_TYPE.IG, req.user.id, req.query.page_id, 'business');
        business = await getBusinessInfo(req.query.page_id, req.user.id, since);
        data.push({'business': business, 'end_time': since});

        followers = await getAPIdata(req.user.id, req.query.page_id,'follower_count', req.query.period, since, null);
        followers = followers.filter(el => new Date(el.end_time).getTime() > new Date(business[0].end_time).getTime());

        data.push({'follower_count': followers, 'end_time': since});
        data.push({'end_time': date.start_date});
    } catch (e) {
        console.error("Error retrieving Instagram data");
    }

    return data;
}

const updatePages = async (req, res) => {
    let igData, pagesListMongo = [], pagesList = [], key, removedPages = [];

    try {
        key = await FbToken.findOne({where: {user_id: req.user.id}});

        (await InstagramApi.getPagesID(key.api_key))['data'].forEach(el =>
            el['instagram_business_account']
                ? pagesList.push(el['instagram_business_account']['id'])
                : null);

        igData = await MongoManager.getPagesMongo(req.user.id, D_TYPE.IG);
        igData.forEach(p => pagesListMongo.push(p.page_id));
        pagesListMongo = pagesListMongo.filter(function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        });
        pagesListMongo.forEach(p => pagesList.includes(p) !== true
            ? (removedPages.push(p), MongoManager.removePageMongo(req.user.id, p, D_TYPE.IG))
            : null
        );
        return res.status(HttpStatus.OK).send(removedPages);
    }
    catch (err) {
        console.error(err['message']);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem either with Facebook servers or with our database'
        })
    }
};

function online_Followers(data){
    let dTime;
    try {
        for (let e of data) {
            dTime = {};
            for (let i in e['value']) {
                dTime['' + (parseInt(i) + 9) % 24] = e['value'][i];
            }
            e['value'] = dTime;
        }
        for (const e of data) {
            for (let i = 0; i < 24; i++) {
                Object.keys(e['value']).length > 0 ?
                    e['value'][i.toString()] ? e['value'][i.toString()] = e['value'][i.toString()] : e['value'][i.toString()] = 0
                    : null;
            }
        }
    }catch (e) {
        console.log(e)
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
    ig_storeAllData,
    ig_storeAllDataDaily,
    updatePages
};
