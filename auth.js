var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var server_config = new Server( 'localhost', 27017, {auto_reconnect: true, native_parser: true});
var db = new Db( 'authtest', server_config, {} );
var mongoStore = require( 'connect-mongodb');
var sessionStore = exports.sessionStore = new mongoStore({db: db});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yosumin');
var user = new mongoose.Schema({id: String, name: String, passwd: String});
mongoose.model('user', user);
user = mongoose.model('user');

user.count({}, function(err, count){
  if(count === 0){
    new user({id: 'testuser@example.com', name: 'testuser', passwd: 'hoge'}).save(function(err){
    });
  }
});



var signup = exports.signup = function(req, res, next) {
  user.findOne({id: req.body.id}, function(err, docs) {
    if(docs !== null) {
      res.redirect('/signup');
    } else if(req.body.pw !== req.body.pw2) {
      res.redirect('/signup');
    } else {
      new user({id: req.body.id, name: req.body.name, passwd: req.body.pw}).save(function(err) {
      });
      req.session.userid = req.body.id;
      next();
    }
  });
}

var isLogined = exports.isLogined = function(req, res, next) {
  sessionStore.get( req.session.id, function(err, sess) {
    if(sess && sess.userid) {
      next();
    } else {
      res.render('login', {
        title: 'login'
      });
    }
  });
}

var logout = exports.logout = function(req, res, next) {
 sessionStore.destroy(req.session.id, function(err) {
    req.session.destroy();
    next();
  });
}

var login = exports.login = function(req, res, next) {
  user.findOne({id: req.body.id}, function(err, docs) {
    if(docs !== null && docs.passwd === req.body.pw) {
      req.session.userid = req.body.id;
      next();
    } else {
      res.render('login', {
        title: 'login'
      });
    }
  });
}
