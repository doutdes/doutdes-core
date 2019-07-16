const gaMongo = require('../models/mongo/mongo-ga-model');
const fbMongo = require('../models/mongo/mongo-fb-model');
const igMongo = require('../models/mongo/mongo-ig-model');
const ytMongo = require('../models/mongo/mongo-yt-model');

const D_TYPE = require('../engine/dashboard-manager').D_TYPE;

/**GOOGLE ANALYTICS**/
//remove all documents of a user by type
async function removeUserMongoData(userid, type) {
    try {
        switch (type) {
            case D_TYPE.GA:
                await gaMongo.deleteMany({
                    'userid': userid
                });
                break;
            case D_TYPE.FB:
                await fbMongo.deleteMany({
                    'userid': userid
                });
                break;
            case D_TYPE.IG:
                await igMongo.deleteMany({
                    'userid': userid
                });
                break;
        }
    }
    catch (e) {
        console.error(e);
        throw new Error("removeUserMongoData - error removing data");
    }
}

//store GA data in mongo db
async function storeGaMongoData(userid, view_id, metric, dimensions, start_date, end_date, file) {
    let data;
    try {
        data = await new gaMongo({
            userid: userid, view_id: view_id, metric: metric, dimensions: dimensions,
            start_date: start_date, end_date: end_date, data: file
        });
        data.save().then(() => {
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("storeMongoData - error doing the insert");
    }
}

//return the GA start date of a document in mongo
async function getGaMongoItemDate(userid, view_id, metric, dimensions) {
    let result;
    try {
        result = await gaMongo.find({
            'userid': userid,
            'view_id': view_id,
            'metric': metric,
            'dimensions': dimensions
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getMongoGaItemDate - error doing the query");
    }
    return result[0] ? {
        start_date: new Date(result[0].start_date),
        end_date: new Date(result[0].end_date)
    } : {start_date: null, end_date: null};
}

//remove a GA mongo document
async function removeGaMongoData(userid, view_id, metric, dimensions) {
    try {
        await gaMongo.findOneAndDelete({
            'userid': userid,
            'view_id': view_id,
            'metric': metric,
            'dimensions': dimensions
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removeMongoData - error removing data");
    }
}

//update a GA mongo document
async function updateGaMongoData(userid, view_id, metric, dimensions, start_date, end_date, data) {

    try {
        if (data) {
            await gaMongo.findOneAndUpdate({
                'userid': userid,
                'view_id': view_id,
                'metric': metric,
                'dimensions': dimensions
            }, {
                'end_date': end_date,
                $push: {
                    'data': {$each: data}
                }
            });
        }
        else {
            await gaMongo.findOneAndUpdate({
                'userid': userid,
                'view_id': view_id,
                'metric': metric,
                'dimensions': dimensions
            }, {
                'end_date': end_date
            });
        }
    } catch (e) {
        console.error(e);
        throw new Error("updateMongoData - error updating data");
    }
}

//get GA data from mongodb
async function getGaMongoData(userid, view_id, metric, dimensions) {
    let result;
    try {
        result = await gaMongo.findOne({
            'userid': userid,
            'metric': metric,
            'dimensions': dimensions
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getMongodata - error retrieving data");
    }
    return result.data;
}

/** FACEBOOK INSIGHTS **/

//store FB data in mongo db
async function storeFbMongoData(userid, page_id, metric, start_date, end_date, file) {
    let data;
    try {
        // data = await new fbMongo({
        //     userid: userid, page_id: page_id, metric: metric, start_date: start_date, end_date: end_date, data: file
        // });
        // data.save().then(() => {
        // });
        await fbMongo.create({
            userid: userid, page_id: page_id, metric: metric, start_date: start_date, end_date: end_date, data: file
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("storeFbMongoData - error doing the insert");
    }
}

//return the FB start date of a document in mongo
async function getFbMongoItemDate(userid, page_id, metric) {
    let result;
    try {
        result = await fbMongo.find({
            'userid': userid,
            'page_id': page_id,
            'metric': metric
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getMongofbItemDate - error doing the query");
    }
    return result[0] ? {
        start_date: new Date(result[0].start_date),
        end_date: new Date(result[0].end_date)
    } : {start_date: null, end_date: null};
}

//remove a FB mongo document
async function removeFbMongoData(userid, page_id, metric) {
    try {
        await fbMongo.findOneAndDelete({
            'userid': userid,
            'page_id': page_id,
            'metric': metric,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removefbMongoData - error removing data");
    }
}

//update a FB mongo document
async function updateFbMongoData(userid, page_id, metric, start_date, end_date, data) {
    try {
        if (data) {
            await fbMongo.findOneAndUpdate({
                'userid': userid,
                'page_id': page_id,
                'metric': metric,
            }, {
                'end_date': end_date,
                $push: {
                    'data': {$each: data}
                }
            });
        } else {
            await fbMongo.findOneAndUpdate({
                'userid': userid,
                'page_id': page_id,
                'metric': metric,
            }, {
                'end_date': end_date
            });
        }
    } catch (e) {
        console.error(e);
        throw new Error("updatefbMongoData - error updating data");
    }
}

//get FB data from mongodb
async function getFbMongoData(userid, page_id, metric) {
    let result;
    try {
        result = await fbMongo.findOne({
            'userid': userid,
            'page_id': page_id,
            'metric': metric,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getfbMongodata - error retrieving data");
    }
    return result.data;
}

/**INSTAGRAM INSIGHTS**/

//store IG data in mongo db
async function storeIgMongoData(userid, page_id, metric, start_date, end_date, file) {
    let data;
    try {
        data = await new igMongo({
            userid: userid, page_id: page_id, metric: [metric], start_date: start_date, end_date: end_date, data: file
        });
        data.save().then(() => {
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("storeIgMongoData - error doing the insert");
    }
}

//return the IG start date of a document in mongo
async function getIgMongoItemDate(userid, page_id, metric) {
    let result;
    try {
        result = await igMongo.find({
            'userid': userid,
            'page_id': page_id,
            'metric': [metric]
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getIgMongoItemDate - error doing the query");
    }
    return result[0] ? {
        start_date: new Date(result[0].start_date),
        end_date: new Date(result[0].end_date)
    } : {start_date: null, end_date: null};
}

//remove a IG mongo document
async function removeIgMongoData(userid, page_id, metric) {
    try {
        await igMongo.findOneAndDelete({
            'userid': userid,
            'page_id': page_id,
            'metric': [metric],
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removeigMongoData - error removing data");
    }
}

//update a IG mongo document
async function updateIgMongoData(userid, page_id, metric, end_date, data) {
    try {
        if (data) {
            await igMongo.findOneAndUpdate({
                'userid': userid,
                'page_id': page_id,
                'metric': [metric],
            }, {
                'end_date': end_date,
                $addToSet: {
                    'data': {$each: data}
                }
            });
        } else {
            await igMongo.findOneAndUpdate({
                'userid': userid,
                'page_id': page_id,
                'metric': [metric],
            }, {
                'end_date': end_date
            });
        }
    } catch (e) {
        console.error(e);
        throw new Error("updateigMongoData - error updating data");
    }
}

//get IG data from mongodb
async function getIgMongoData(userid, page_id, metric) {
    let result;
    try {
        result = await igMongo.findOne({
            'userid': userid,
            'page_id': page_id,
            'metric': [metric],
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getigMongodata - error retrieving data");
    }
    return result.data;
}

/**YOUTUBE ANALYTICS**/

//store Yt data in mongo db
async function storeYtMongoData(userid, channel_id, metric, start_date, end_date, file) {
    try {
        await ytMongo.create({
            userid: userid, channel_id: channel_id, metric: metric,
            start_date: start_date, end_date: end_date, data: file
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("storeYtMongoData - error doing the insert");
    }
}

async function getYtMongoItemDate(userid, channel_id, metric) {
    let result;
    try {
        result = await ytMongo.find({
            'userid': userid,
            'channel_id': channel_id,
            'metric': metric,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getMongoYtItemDate - error doing the query");
    }
    return result[0] ? {
        start_date: new Date(result[0].start_date),
        end_date: new Date(result[0].end_date)
    } : {start_date: null, end_date: null};
}

async function removeYtMongoData(userid, channel_id, metric) {
    try {
        await gaMongo.findOneAndDelete({
            'userid': userid,
            'channel_id': channel_id,
            'metric': metric
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removeYtMongoData - error removing data");
    }
}


module.exports = {
    storeGaMongoData, getGaMongoItemDate, removeGaMongoData, updateGaMongoData, getGaMongoData,
    storeFbMongoData, getFbMongoItemDate, removeFbMongoData, updateFbMongoData, getFbMongoData,
    storeIgMongoData, getIgMongoItemDate, removeIgMongoData, updateIgMongoData, getIgMongoData,
    storeYtMongoData, getYtMongoItemDate, removeYtMongoData,
    removeUserMongoData
};