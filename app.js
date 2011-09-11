/**
 * define
 */

var server_port = 3001;
var server_host = 'localhost';

var mongodb_host = 'localhost';
var mongodb_port = 27017;
var mongodb_db_name = 'authtest';
var mongodb_user = null;
var mongodb_pwd = null;

var express = require('express');
var app = module.exports = express.createServer();
var models = require("./models");
var User = app.User = models.User;
var Auth = app.Auth = models.Auth;

/**
 * initialize
 */

User.count({}, function(err, count){
  if(count === 0){
    new User({id: 'testuser@example.com', name: 'testuser', passwd: 'hoge'}).save(function(err){
    });
  }
});

/**
 * configure
 */

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    cookie: {maxAge: 60000 * 20},
    secret: 'foo',
    store: Auth
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

/**
 * routing
 */
var routes = require("./routes");

/**
 * main
 */
app.listen(server_port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
