var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var request = require('request');
var parse = require('xml-parser');
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

//Added for NLP search ********************/
var cons = require('consolidate')
var exphbs  = require('express-handlebars')
var hbs = exphbs.create();
var search = require('./routes/search');
//**************************************** */

// passport strategy setup

passport.use(new Strategy(
  function (username, password, cb) {
    var urlbody = 'http://164.100.181.132/CASLoginService/CASLoginDetails.asmx/UserDetails';
    var reqbody = {
      strLoginID: username,
      strPassword: password,
      strClintIP: '10.234.2.34',
      strMACAddress: 'fg:5d:d8:e5:e8',
      strServerIP: '172.27.21.213'
    }
    console.log("hi");
    request.post({ url: urlbody, form: reqbody }, function (error, response, body) {
      var obj = parse(body);
      var loginFlag = Number(obj.root.content);
      console.log("hi again");
      if (loginFlag == 1) {
        console.log('Happy days');
        console.log(username);
        console.log(password);
        username = 'zyxq#sew324Tdf';
        password = 'derjfgd@dtos37';
      }
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', Number(obj.root.content)); // Print the HTML for the Google homepage.      
      userdb.users.findByUsername(username, function (err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    });
  }));

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  userdb.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

// passport setup ends

var app = express();

//Added for NLP search ********************
app.engine('jade', cons.jade);
app.engine('html', hbs.engine);
//**************************************** */
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

app.get('/login', function (req, res) { res.render('login'); });

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

app.get('/logout',
  function (req, res) {
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
app.use(function (req, res, next) {
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
//Added for NLP search ********************
app.use('/search',ensureLoggedIn('login'), search);
//**************************************** */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
