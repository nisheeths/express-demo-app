var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/UPP-DB');
var userdb = require('./db');

var indexRouter = require('./routes/index');
var caseRouter = require('./routes/cases');
var abscondRouter = require('./routes/absconders');
var propertyRouter = require('./routes/property');
var caseDelayRouter = require('./routes/casedelay');
var captureDelayRouter = require('./routes/capturedelay');
var complaintsRouter = require('./routes/complaints');
var contribsRouter = require('./routes/contribs');
var timeseriesRouter = require('./routes/timeseries');


// passport strategy setup

passport.use(new Strategy(
  function(username, password, cb) {
    userdb.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  userdb.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// passport setup ends

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

/*
app.get('/',
  function(req, res) {
    res.render('login', { user: req.user });
  });
*/

app.get('/login',  function(req, res){ res.render('login');  });
  
app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/cases', failureRedirect: '/login' }));
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

/*
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
});
*/

//app.use(ensureLoggedIn('/login'));

app.get('/favicon.ico', (req, res) => res.status(204));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

 

 // all the other routes
app.use('/', ensureLoggedIn('login'), indexRouter);
app.use('/cases', ensureLoggedIn('login'), caseRouter);
app.use('/absconders', ensureLoggedIn('login'), abscondRouter);
app.use('/property', ensureLoggedIn('login'), propertyRouter);
app.use('/casedelay', ensureLoggedIn('login'), caseDelayRouter);
app.use('/capturedelay', ensureLoggedIn('login'), captureDelayRouter);
app.use('/complaints', ensureLoggedIn('login'), complaintsRouter);
app.use('/contribs', ensureLoggedIn('login'), contribsRouter);
app.use('/timeseries', ensureLoggedIn('login'), timeseriesRouter);

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
