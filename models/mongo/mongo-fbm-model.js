const mongoose = require('mongoose');

module.exports = mongoose.model('FbmData', new mongoose.Schema({
    userid: Number,
    act_id: String,
    metric: String,
    domain: String,
    breakdowns: String,
    start_date: String,
    end_date: String,
    data: Array
},{
    versionKey: false
}));
