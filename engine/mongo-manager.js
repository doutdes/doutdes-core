const gaMongo = require('../models/mongo/mongo-ga-model');
const fbMongo = require('../models/mongo/mongo-fb-model');
const igMongo = require('../models/mongo/mongo-ig-model');

//store GA data in mongo db
async function storeGaMongoData(userid, metric, dimensions, start_date, end_date, file) {
    let data;
    try {
        data = await new gaMongo({
            userid: userid, metric: metric, dimensions: dimensions,
            start_date: start_date, end_date: end_date, data: file
        });
        data.save().then(() => {});
    }
    catch (e) {
        console.error(e);
        throw new Error("storeMongoData - error doing the insert");
    }
}

//return the GA start date of a document in mongo
async function getGaMongoItemDate(userid, metric, dimensions) {
    let result;
    try {
        result = await gaMongo.find({
            'userid': userid,
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
async function removeGaMongoData(userid, metric, dimensions) {
    try {
        await gaMongo.findOneAndDelete({
            'userid': userid,
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
async function updateGaMongoData(userid, metric, dimensions, start_date, end_date, data) {

    try {
        await gaMongo.findOneAndUpdate({
            'userid': userid,
            'metric': metric,
            'dimensions': dimensions
        }, {
            'start_date': start_date,
            'end_date': end_date,
            $push: {
                'data': {$each: data}
            }
        });
    } catch (e) {
        console.error(e);
        throw new Error("updateMongoData - error updating data");
    }
}

//get GA data from mongodb
async function getGaMongoData(userid, metric, dimensions) {
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

//store FB data in mongo db
async function storeFbMongoData(userid, metric, start_date, end_date, file) {
    let data;
    try {
        data = await new fbMongo({
            userid: userid, metric: metric, start_date: start_date, end_date: end_date, data: file
        });
        data.save().then(() => {});
    }
    catch (e) {
        console.error(e);
        throw new Error("storeFbMongoData - error doing the insert");
    }
}

//return the FB start date of a document in mongo
async function getFbMongoItemDate(userid, metric) {
    let result;
    try {
        result = await fbMongo.find({
            'userid': userid,
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
async function removeFbMongoData(userid, metric) {
    try {
        await fbMongo.findOneAndDelete({
            'userid': userid,
            'metric': metric,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removefbMongoData - error removing data");
    }
}

//update a FB mongo document
async function updateFbMongoData(userid, metric, start_date, end_date, data) {
    try {
        await fbMongo.findOneAndUpdate({
            'userid': userid,
            'metric': metric,
        }, {
            'start_date': start_date,
            'end_date': end_date,
            $push: {
                'data': {$each: data}
            }
        });
    } catch (e) {
        console.error(e);
        throw new Error("updatefbMongoData - error updating data");
    }
}

//get FB data from mongodb
async function getFbMongoData(userid, metric) {
    let result;
    try {
        result = await fbMongo.findOne({
            'userid': userid,
            'metric': metric,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getfbMongodata - error retrieving data");
    }
    return result.data;
}

async function storeIgMongoData(userid, metric, start_date, end_date, file) {
    let data;

    console.log ("FILE ", file);

    try {
        data = await new igMongo({
            userid: userid, metric: metric, start_date: start_date, end_date: end_date, data: file
        });
        data.save().then(() => {});
    }
    catch (e) {
        console.error(e);
        throw new Error("storeIgMongoData - error doing the insert");
    }
}

module.exports = {storeGaMongoData, getGaMongoItemDate, removeGaMongoData, updateGaMongoData, getGaMongoData,
                  storeFbMongoData, getFbMongoItemDate, removeFbMongoData, updateFbMongoData, getFbMongoData,
                  storeIgMongoData  };