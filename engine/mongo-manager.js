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

async function storeMongoData(type, userid, page_id, metric, start_date, end_date, file, dimensions = null) {
    try {
        switch (type) {
            case D_TYPE.GA:
                await gaMongo.create({
                    userid: userid, view_id: page_id, metric: metric, dimensions: dimensions,
                    start_date: start_date, end_date: end_date, data: file
                });
                break;
            case D_TYPE.FB:
                await fbMongo.create({
                    userid: userid,
                    page_id: page_id,
                    metric: metric,
                    start_date: start_date,
                    end_date: end_date,
                    data: file
                });
                break;
            case D_TYPE.IG:
                await igMongo.create({
                    userid: userid,
                    page_id: page_id,
                    metric: [metric],
                    start_date: start_date,
                    end_date: end_date,
                    data: file
                });
                break;
            case D_TYPE.YT:
                await ytMongo.create({
                    userid: userid,
                    channel_id: page_id,
                    metric: metric,
                    start_date: start_date,
                    end_date: end_date,
                    data: file
                });
                break;
        }
    } catch (e) {
        console.warn("Errore con il tipo ", type);
        console.error(e);
        throw new Error("storeMongoData - error storing data")
    }
}

async function getMongoItemDate(type, userid, page_id, metric, dimensions = null) {
    let result;
    try {
        switch (type) {
            case D_TYPE.GA:
                result = await gaMongo.find({
                    'userid': userid,
                    'view_id': page_id,
                    'metric': metric,
                    'dimensions': dimensions
                });
                return result[0] ? {
                    start_date: new Date(result[0].start_date),
                    end_date: new Date(result[0].end_date)
                } : {start_date: null, end_date: null};
            case D_TYPE.FB:
                result = await fbMongo.find({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': metric
                });
                return result[0] ? {
                    start_date: new Date(result[0].start_date),
                    end_date: new Date(result[0].end_date)
                } : {start_date: null, end_date: null};
            case D_TYPE.IG:
                result = await igMongo.find({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': [metric]
                });
                return result[0] ? {
                    start_date: new Date(result[0].start_date),
                    end_date: new Date(result[0].end_date)
                } : {start_date: null, end_date: null};
            case D_TYPE.YT:
                result = await ytMongo.find({
                    'userid': userid,
                    'channel_id': page_id,
                    'metric': metric,
                });
                return result[0] ? {
                    start_date: new Date(result[0].start_date),
                    end_date: new Date(result[0].end_date),
                    last_date: result[0].data[result[0].data.length - 1] ? new Date(result[0].data[result[0].data.length - 1].date) : new Date(result[0].end_date)
                } : {start_date: null, end_date: null, last_date: null};
        }
    } catch (e) {
        console.warn("Errore con il tipo ", type);
        console.error(e);
        throw new Error("getMongoItemData - error doing the query")
    }
}

async function removeMongoData (type, userid, page_id, metric, dimensions = null) {
    try {
        switch (type) {
            case D_TYPE.GA:
                await gaMongo.findOneAndDelete({
                    'userid': userid,
                    'view_id': page_id,
                    'metric': metric,
                    'dimensions': dimensions
                });
                break;
            case D_TYPE.FB:
                await fbMongo.findOneAndDelete({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': metric,
                });
                break;
            case D_TYPE.IG:
                await igMongo.findOneAndDelete({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': [metric],
                });
                break;
            case D_TYPE.YT:
                await gaMongo.findOneAndDelete({
                    'userid': userid,
                    'channel_id': page_id,
                    'metric': metric
                });
                break;
        }
    } catch (e) {
        console.warn("Errore con il tipo ", type);
        console.error(e);
        throw new Error("RemoveMongoDocument - error removing data")
    }
}

async function updateMongoData (type, userid, page_id, metric, start_date, end_date, data, dimensions = null){
    try {
        switch (type) {
            case D_TYPE.GA:
                if (data) {
                    await gaMongo.findOneAndUpdate({
                        'userid': userid,
                        'view_id': page_id,
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
                        'view_id': page_id,
                        'metric': metric,
                        'dimensions': dimensions
                    }, {
                        'end_date': end_date
                    });
                }
                break;
            case D_TYPE.FB:
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
                break;
            case D_TYPE.IG:
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
                break;
            case D_TYPE.YT:
                if (data) {
                    await ytMongo.findOneAndUpdate({
                        'userid': userid,
                        'channel_id': page_id,
                        'metric': metric,
                    }, {
                        'end_date': end_date,
                        $push: {
                            'data': {$each: data}
                        }
                    });
                }
                else {
                    await ytMongo.findOneAndUpdate({
                        'userid': userid,
                        'channel_id': page_id,
                        'metric': metric,
                    }, {
                        'end_date': end_date
                    });
                }
                break;
        }
    } catch (e) {
        console.warn("Errore con il tipo ", type);
        console.error(e);
        throw new Error("UpdateMongoData - error updating data")
    }
}

async function getMongoData (type, userid, page_id, metric, dimensions = null){
    let result;
    try {
        switch (type) {
            case D_TYPE.GA:
                result = await gaMongo.findOne({
                    'userid': userid,
                    'view_id': page_id,
                    'metric': metric,
                    'dimensions': dimensions
                });
                return result.data;
            case D_TYPE.FB:
                result = await fbMongo.findOne({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': metric,
                });
                return result.data;
            case D_TYPE.IG:
                result = await igMongo.findOne({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': [metric],
                });
                return result.data;
            case D_TYPE.YT:
                result = await ytMongo.findOne({
                    'userid': userid,
                    'channel_id': page_id,
                    'metric': metric,
                });
                return result.data;
        }

    } catch (e) {
        console.warn("Errore con il tipo ", type);
        console.error(e);
        throw new Error("getMongoData - error retrieving data")
    }
}

async function getFbPagesMongo(userid) {
    let result;
    try {
        result = await fbMongo.find({
            'userid': userid,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("getfbPagesMongo - error retrieving pages");
    }
    return result;
}

async function removeFbPageMongo(userid, page_id) {
    try {
        await fbMongo.deleteMany({
            'userid': userid,
            'page_id': page_id,
        });
    }
    catch (e) {
        console.error(e);
        throw new Error("removefbPageMongo - error removing page");
    }
}

module.exports = {
    removeUserMongoData, storeMongoData, getMongoItemDate, removeMongoData, updateMongoData, getMongoData, getFbPagesMongo, removeFbPageMongo
};
