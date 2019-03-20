const mongoose = require('mongoose');

module.exports = mongoose.model('FbData', new mongoose.Schema({
    userid: Number,
    metric: String,
    start_date: String,
    end_date: String,
    data: Array
},{
    versionKey: false
}));