const gaMongo = require('../models/mongo/mongo-ga-model');
const fbMongo = require('../models/mongo/mongo-fb-model');
const igMongo = require('../models/mongo/mongo-ig-model');

/**GOOGLE ANALYTICS**/

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
        data = await new fbMongo({
            userid: userid, page_id: page_id, metric: metric, start_date: start_date, end_date: end_date, data: file
        });
        data.save().then(() => {
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
async function storeIgMongoData(userid, metric, start_date, end_date, file) {
    let data;
    try {
        data = await new igMongo({
            userid: userid, metric: [metric], start_date: start_date, end_date: end_date, data: file
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
async function getIgMongoItemDate(userid, metric) {
    let result;
    try {
        result = await igMongo.find({
            'userid': userid,
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
async function removeIgMongoData(userid, metric) {
    try {
        await igMongo.findOneAndDelete({
            'userid': userid,
            'metric': [metric],
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removeigMongoData - error removing data");
    }
}

//update a IG mongo document
async function updateIgMongoData(userid, metric, end_date, data) {
    console.log ("Metrica: ", metric);
    try {
        if (data) {
            await igMongo.findOneAndUpdate({
                'userid': userid,
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
async function getIgMongoData(userid, metric) {
    let result;
    try {
        result = await igMongo.findOne({
            'userid': userid,
            'metric': [metric],
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getigMongodata - error retrieving data");
    }
    return result.data;
}

module.exports = {
    storeGaMongoData, getGaMongoItemDate, removeGaMongoData, updateGaMongoData, getGaMongoData,
    storeFbMongoData, getFbMongoItemDate, removeFbMongoData, updateFbMongoData, getFbMongoData,
    storeIgMongoData, getIgMongoItemDate, removeIgMongoData, updateIgMongoData, getIgMongoData
};