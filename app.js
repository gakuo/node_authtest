/**
 * define
 */
var server_port = 3001;
var server_host = 'localhost';
var config = require('./config');
var models = require('./models');
var express = require('express');
var app = module.exports = express.createServer();
app.auth = new (require('./auth'))({
  mongo_info: config.mongo_info,
  user_model: models.user,
  //user_modelにIDとパスワードがどこに定義されているか
  id: 'id',
  pw: 'passwd'
});
var sockets = require('./sockets');


/**
 * configure
 */
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    cookie: {maxAge: 60000 * 20},
    secret: 'foo',
    store: app.auth.sessionStore
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
