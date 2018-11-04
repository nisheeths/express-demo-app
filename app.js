var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/UPP-DB');

var indexRouter = require('./routes/index');
var caseRouter = require('./routes/cases');
var abscondRouter = require('./routes/absconders');
var propertyRouter = require('./routes/property');
var caseDelayRouter = require('./routes/casedelay');
var captureDelayRouter = require('./routes/capturedelay');
var complaintsRouter = require('./routes/complaints');
var contribsRouter = require('./routes/contribs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', indexRouter);
app.use('/cases', caseRouter);
app.use('/absconders', abscondRouter);
app.use('/property', propertyRouter);
app.use('/casedelay', caseDelayRouter);
app.use('/capturedelay', captureDelayRouter);
app.use('/complaints', complaintsRouter);
app.use('/contribs', contribsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
