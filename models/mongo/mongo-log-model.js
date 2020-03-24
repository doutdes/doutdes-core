const mongoose = require('mongoose');

module.exports = mongoose.model('logUser', new mongoose.Schema({
    userid: Number,
    username:String,
    dash_custom:Array,
    dash_fb:Array,
    dash_fbc:Array,
    dash_fbm:Array,
    dash_ga:Array,
    dash_ig:Array,
    dash_yt:Array,
    last_log: String
},{
    versionKey: false
}));
