const mongoose = require('mongoose');

module.exports = mongoose.model('YtData', new mongoose.Schema({
    userid: Number,
    channel_id: String,
    metric: String,
    start_date: String,
    end_date: String,
    data: Array
}, {
    versionKey: false
}));
