const gaMongo = require('../models/mongo/mongo-ga-model');
const fbMongo = require('../models/mongo/mongo-fb-model');
const fbmMongo = require('../models/mongo/mongo-fbm-model');
const fbcMongo = require('../models/mongo/mongo-fbc-model');
const igMongo = require('../models/mongo/mongo-ig-model');
const ytMongo = require('../models/mongo/mongo-yt-model');
const logMongo =require('../models/mongo/mongo-log-model');

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

async function storeMongoData(type, userid, page_id, metric, start_date, end_date, file, dimensions = null, domain = null, breakdown = null, id = null) {
    try {
        switch (type) {
            case D_TYPE.GA:
                await gaMongo.create({
                    userid: userid, view_id: page_id, metric: metric, dimensions: dimensions,
                    start_date: start_date, end_date: end_date, data: file
                });
                break;
            case D_TYPE.FBM:
                await fbmMongo.create({
                    userid: userid,
                    act_id: page_id,
                    metric: metric,
                    domain: domain,
                    breakdowns: breakdown,
                    start_date: start_date,
                    end_date: end_date,
                    data: file
                });
                break;
            case D_TYPE.FBC:
                /*await fbcMongo.create({
                    userid: userid,
                    act_id: page_id,
                    domain: domain,
                    start_date: start_date,
                    end_date: end_date,
                    data: file
                });*/
                await fbcMongo.update({
                    userid: userid,
                    act_id: page_id,
                    domain: domain,
                    campaign_id: id
                }, {
                    start_date: start_date,
                    end_date: end_date,
                    data: file
                }, {
                    upsert: true
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
                    metric: metric, // [metric] -> metric errore cast string
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

async function getMongoItemDate(type, userid, page_id, metric, dimensions = null, domain = null, breakdown = null, id = null) {
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
            case D_TYPE.FBM:
                result = await fbmMongo.find({
                    'userid': userid,
                    'act_id': page_id,
                    'metric': metric,
                    'domain': domain,
                    'breakdowns': breakdown
                });
                return result[0] ? {
                    start_date: new Date(result[0].start_date),
                    end_date: new Date(result[0].end_date)
                } : {start_date: null, end_date: null};
            case D_TYPE.FBC:
                result = await fbcMongo.find({
                    'userid': userid,
                    'act_id': page_id,
                    'domain': domain,
                    'campaign_id': id
                });
                return result[0] ? {
                    start_date: new Date(result[0].start_date),
                    end_date: new Date(result[0].end_date)
                } : {start_date: null, end_date: null};
            case D_TYPE.IG:
                result = await igMongo.find({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': metric
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

async function removeMongoData (type, userid, page_id, metric, dimensions = null , domain = null, breakdown = null, id = null) {
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
            case D_TYPE.FBM:
                await fbmMongo.findOneAndDelete({
                    'userid': userid,
                    'act_id': page_id,
                    'metric': metric,
                    'domain': domain,
                    'breakdowns': breakdown
                });
                break;
            case D_TYPE.FBC:
                await fbcMongo.findOneAndDelete({
                    'userid': userid,
                    'act_id': page_id,
                    'domain': domain,
                    'campaign_id': id
                });
                break;
            case D_TYPE.IG:
                await igMongo.findOneAndDelete({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': metric,
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

async function updateMongoData (type, userid, page_id, metric, start_date, end_date, data, dimensions = null, domain = null, breakdown = null, id = null){
    try {
        switch (type) {
            case D_TYPE.GA:
                if (data) {
                    for (const e of data){ //check on data modified by google API
                            await igMongo.updateOne({'userid': userid,
                                    'page_id': page_id,
                                    'metric': metric,
                                    'data': {$elemMatch:{'0': e[0]}}},
                                {$set: {'data.$.1': e[1]}});
                        }
                    await gaMongo.findOneAndUpdate({
                        'userid': userid,
                        'view_id': page_id,
                        'metric': metric,
                        'dimensions': dimensions
                    }, {
                        'end_date': end_date,
                        $addToSet: {
                            'data': {$each: data}
                        }
                    });//change push in addtoset StefanoU
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
            case D_TYPE.FBM:
                if (data) {
                    await fbmMongo.findOneAndUpdate({
                        'userid': userid,
                        'act_id': page_id,
                        'metric': metric,
                        'domain': domain,
                        'breakdowns': breakdown
                    }, {
                        'end_date': end_date,
                        $push: {
                            'data': data
                        }
                    });
                } else {
                    await fbmMongo.findOneAndUpdate({
                        'userid': userid,
                        'act_id': page_id,
                        'metric': metric,
                        'domain': domain,
                        'breakdowns': breakdown
                    }, {
                        'end_date': end_date
                    });
                }
                break;
            case D_TYPE.FBC:
                if (data) {
                    await fbcMongo.findOneAndUpdate({
                        'userid': userid,
                        'act_id': page_id,
                        'domain': domain,
                        'campaign_id': id
                    }, {
                        'end_date': end_date,
                        $push: {
                            'data': data
                        }
                    });
                } else {
                    await fbcMongo.findOneAndUpdate({
                        'userid': userid,
                        'act_id': page_id,
                        'domain': domain,
                        'campaign_id': id
                    }, {
                        'end_date': end_date
                    });
                }
                break;
            case D_TYPE.IG:
                if (data) {
                        for (const e of data){ //check on data modified by instagram API
                            if(e["end_time"] && e['value']){
                            await igMongo.updateOne({'userid': userid,
                                    'page_id': page_id,
                                    'metric': metric,
                                    'data.end_time': e["end_time"]},
                                {$set: {'data.$.value': e['value']}});
                        }
                    }
                    await igMongo.findOneAndUpdate({
                        'userid': userid,
                        'page_id': page_id,
                        'metric': metric,
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
                        'metric': metric,
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
async function getMongoData (type, userid, page_id, metric, dimensions = null, domain = null, breakdown = null, id = null){
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
            case D_TYPE.FBM:
                result = await fbmMongo.findOne({
                    'userid': userid,
                    'act_id': page_id,
                    'metric': metric,
                    'domain': domain,
                    'breakdowns': breakdown
                });
                return result.data;
            case D_TYPE.FBC:
                result = await fbcMongo.findOne({
                    'userid': userid,
                    'act_id': page_id,
                    'domain': domain,
                    'campaign_id': id
                });
                return result.data;
            case D_TYPE.IG:
                result = await igMongo.findOne({
                    'userid': userid,
                    'page_id': page_id,
                    'metric': metric,
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

async function getPagesMongo(userid, type) {
    let result;
    try {
        switch (type) {
            case D_TYPE.FB:
                result = await fbMongo.find({
                    'userid': userid,
                });
                break;
            case D_TYPE.IG:
                result = await igMongo.find({
                    'userid': userid,
                });
                break;
        }
    }
    catch (e) {
        console.error(e);
        throw new Error("getPagesMongo - error retrieving pages");
    }
    return result;
}

async function removePageMongo(userid, page_id, type) {
    try {
        switch (type) {
            case D_TYPE.FB:
                await fbMongo.deleteMany({
                    'userid': userid,
                    'page_id': page_id,
                });
                break;
            case D_TYPE.IG:
                await igMongo.deleteMany({
                    'userid': userid,
                    'page_id': page_id,
                });
                break;
        }
    }
    catch (e) {
        console.error(e);
        throw new Error("removePageMongo - error removing page");
    }
}

///////// LOG MANAGER //////////

async function userLogManager(req, res){
    let date = new Date();
    const userid = req.body.user;
    const type = parseInt(req.body.type);
    const username = req.body.username;
    try{
        if( (await logMongo.find({userid: userid })).length != 0){
            const length = (await logMongo.find({userid: userid }))[0][returnDashboardTypeLog(type)].length;
            const t = returnDashboardTypeLog(type);
            const last = new Date((await logMongo.find({userid: userid }))[0][t][length-1]['date']).getTime();
            const now = new Date().getTime();
            const difference = Math.round( (now -last) /60000 );
             if(difference >= 30 || !difference) {
                 await userLogUpdate(type, userid, date);
             }
        }else{
             await userLogCreate(userid, username, date);
            await userLogUpdate(type, userid, date);
        }
        return res.send({message: "logger ok"});
    }catch (e) {
        console.log(e);
        throw new Error("error userlog")

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            name: 'Internal Server Error',
            message: 'There is a problem with Logger '
        })
    }
}

async function userLogUpdate(type, userid, date){
    let key = returnDashboardTypeLog(type);
    try{
        await logMongo.updateOne(
                {userid: userid},
                {$set: {last_log: date}});
        await logMongo.update(
            {userid:userid},
            {$push:{[key]:{date : date }}});
        } catch (e) {
        console.log(e);
        throw new Error("error userlog")
    }
}

async function userLogCreate(userid, username, date){

    try{
        await logMongo.create({
            userid: userid,
            username: username,
            dash_custom:{},
            dash_fb:{},
            dash_fbc:{},
            dash_fbm:{},
            dash_ga:{},
            dash_ig:{},
            dash_yt:{},
            last_log: date
        });

    }catch (e) {
        console.log(e);
        throw new Error("error userlog")
    }
}

function returnDashboardTypeLog(type){
    switch (type) {

        case 0:
            return "dash_custom";
            break;
        case 1:
            return "dash_fb";
            break;
        case 6:
            return "dash_fbc";
            break;
        case 5:
            return "dash_fbm";
            break;
        case 2:
            return "dash_ga";
            break;
        case 3:
            return "dash_ig";
            break;
        case 4:
            return "dash_yt";
            break;
    }
}
 async function createCsv(req, res) {
    let result
     console.log('################### WROOOOMMMM ###########################');
     console.log('ci arrivo')
    try{
        result = await logMongo.find({})

        return res.send(result)
        console.log(res)
    }catch (e) {
        console.log(e)
        throw new Error("error logcsv")
    }
    return res;
 }
// async function createCsv(req, res, next) {
//
//     try{
//     if (req.params.id === '25') {
//         head = 'id,username,ultimo accesso ,dashboard Custom ,totale entrate Custom,dashboard FB ,totale entrate FB,dashboard FBC,totale entrate FBC,dashboard FBM,totale entrate FBM,dashboard IG,totale entrate IG,dashboard GA,totale entrare GA,dashboard YT,totale entrate YT\n'
//         res.write(head);
//         for (const el of (await logMongo.find({}))) {
//             const username = el.username;
//             const id = el.userid;
//             const lastlog = new Date(el.last_log).toLocaleString().replace(/,/g, '.');
//
//             const count_custom = el.dash_custom.length - 1 ? el.dash_custom.length - 1 : 0;
//             const date_custom = el.dash_custom.length >= 2 ? el.dash_custom[count_custom].date.toLocaleDateString().replace(/,/g, '.') : 'Nan';
//
//             const count_fb = el.dash_fb.length - 1 ? el.dash_fb.length - 1 : 0;
//             const date_fb = el.dash_fb.length >= 2 ? el.dash_fb[count_fb].date.toLocaleDateString().replace(/,/g, '.') : 'Nan';
//
//             const count_fbc = el.dash_fbc.length - 1 ? el.dash_fbc.length - 1 : 0;
//             const date_fbc = el.dash_fbc.length >= 2 ? el.dash_fbc[count_fbc].date.toLocaleDateString().replace(/,/g, '.') : 'NaN';
//
//             const count_fbm = el.dash_fbm.length - 1 ? el.dash_fbm.length - 1 : 0;
//             const date_fbm = el.dash_fbm.length >= 2 ? el.dash_fbm[count_fbm].date.toLocaleDateString().replace(/,/g, '.') : 'NaN';
//
//             const count_ig = el.dash_ig.length - 1 ? el.dash_ig.length - 1 : 0;
//             const date_ig = el.dash_ig.length >= 2 ? el.dash_ig[count_ig].date.toLocaleDateString().replace(/,/g, '.') : 'NaN';
//
//             const count_ga = el.dash_ga.length - 1 ? el.dash_ga.length - 1 : 0;
//             const date_ga = el.dash_ga.length >= 2 ? el.dash_ga[count_ga].date.toLocaleDateString().replace(/,/g, '.') : 'NaN';
//
//             const count_yt = el.dash_yt.length - 1 ? el.dash_yt.length - 1 : 0;
//             const date_yt = el.dash_ga.length >= 2 ? el.dash_ga[count_yt].date.toLocaleDateString().replace(/,/g, '.') : 'NaN';
//
//             res.write(`${id},${username},${lastlog},${date_custom},${count_custom},${date_fb},${count_fb},${date_fbc},${count_fbc},${date_fbm},${count_fbm},${date_ig},${count_ig},${date_ga},${count_ga},${date_yt},${count_yt}\n`)
//         }
//         res.end()
//
//     }
//     }catch (e) {
//         console.log(e)
//         throw new Error("error logcsv")
//     }
//
//
// }

module.exports = {
    removeUserMongoData, storeMongoData, getMongoItemDate, removeMongoData, updateMongoData, getMongoData, getPagesMongo, removePageMongo, userLogManager, createCsv
};
