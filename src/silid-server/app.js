require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const serverless = require("serverless-http");

var indexRouter = require('./routes/index');
var agentRouter = require('./routes/agent');
var organizationRouter = require('./routes/organization');
var teamRouter = require('./routes/team');

const jwt = require('express-jwt');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Access Token verification
 */
app.use(jwt({ secret: process.env.CLIENT_SECRET, requestProperty: 'agent' }));

/**
 * Routes
 */
app.use('/', indexRouter);
app.use('/agent', agentRouter);
app.use('/organization', organizationRouter);
app.use('/team', teamRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json(err);

//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
});

//module.exports.handler = serverless(app);
module.exports = app;
