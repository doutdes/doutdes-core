const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

/* Building system constants */
const app = express();
const passport = require('passport');

module.exports = { app, passport };

/* Various config */
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);
