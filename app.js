/**
 * Params.
 */

var server_port = 8080;
var server_host = 'localhost';

var mongodb_host = 'localhost';
var mongodb_port = 27017;
var mongodb_db_name = 'authtest';
var mongodb_user = null;
var mongodb_pwd = null;


/**
 * Module dependencies.
 */

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var server_config = new Server( 'localhost', 27017, {auto_reconnect: true, native_parser: true});
var db = new Db( 'authtest', server_config, {} );
var mongoStore = require( 'connect-mongodb');
var auth;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yosumin');
var User = new mongoose.Schema({id: String, name: String, passwd: String});
mongoose.model('User', User);
User = mongoose.model('User');

var express = require('express');
var app = module.exports = express.createServer();

User.count({}, function(err, count){
  if(count === 0){
    new User({id: 'testuser@example.com', name: 'testuser', passwd: 'hoge'}).save(function(err){
    });
  }
});


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    cookie: {maxAge: 60000 * 20},
    secret: 'foo',
    store: auth = new mongoStore({db: db})
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  auth.get(req.session.id, function(err, sess) {
    if(sess && sess.views) {
      res.render('index', {
        title: req.session.userid
      });
    } else {
      res.redirect('/login');
    }
  });
});

app.get('/login', function(req, res, next) {
    auth.get( req.session.id, function(err, sess) {
      if(sess && sess.views) {
        res.redirect('/');
      } else {
        next();
      }
    });
  },
  function(req, res) {
    res.render('login', {
      title: 'login',
      message: 'login form'
  });
});

app.post('/check', function(req, res) {
  User.findOne({id: req.body.id}, function(err, docs){
    if(docs !== null && docs.passwd === req.body.pw) {
      req.session.userid = req.body.id;
      req.session.views = 1;
      res.redirect('/');
    } else {
      res.render('login', {
        title: 'login',
        message: 'login form',
        error_message: 'password faild'
      });
    }
  });
});

app.listen(server_port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);