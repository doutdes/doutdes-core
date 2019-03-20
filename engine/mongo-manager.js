const gaMongo = require('../models/mongo/mongo-ga-model');

//store data in mongo db
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

//return the start date of a document in mongo
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
        throw new Error("getMongoItemDate - error doing the query");
    }
    return result[0] ? {
        start_date: new Date(result[0].start_date),
        end_date: new Date(result[0].end_date)
    } : {start_date: null, end_date: null};
}

//remove a mongo document
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

//update a mongo document
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

//get data from mongodb
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

module.exports = {storeGaMongoData, getGaMongoItemDate, removeGaMongoData, updateGaMongoData, getGaMongoData};