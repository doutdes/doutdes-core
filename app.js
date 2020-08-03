const express = require('express');
const mongoose = require('mongoose');

/** Building system constants **/
const app = express();
const passport = require('passport');

/** Configuration load according to the environment**/
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

/** Export of app, passport and the right configuration **/
module.exports = { app, passport, config };

/** Configuration of express, routes and passport **/
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport, config);

/* Connection to Mongo */
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/doutdes-core', {  useNewUrlParser: true, promiseLibrary: require('bluebird') })
    .then(() =>  console.log('Engine connected successfully to the mongo database'))
    .catch((err) => console.error(err));
