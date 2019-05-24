const mongoose = require('mongoose');

module.exports = mongoose.model('GaData', new mongoose.Schema({
    userid: Number,
    view_id: Number,
    metric: String,
    dimensions: String,
    start_date: String,
    end_date: String,
    data: Array
},{
    versionKey: false
}));

//    data: [[String, String, String]]