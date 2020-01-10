const mongoose = require('mongoose');

module.exports = mongoose.model('FbcData', new mongoose.Schema({
    userid: Number,
    act_id: String,
    domain: String,
    start_date: String,
    end_date: String,
    campaign_id: String,
    data: Array
},{
    versionKey: false
}));
