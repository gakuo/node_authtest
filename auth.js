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


/*var isLogined = exports.isLogined = function(req, res, next) {
  sessionStore.get( req.session.id, function(err, sess) {
    if(sess && sess.userid) {
      next();
    } else {
      res.render('login', {
        title: 'login'
      });
    }
  });
}*/

var isLogined = exports.isLogined = function(req, res, logined, notlogined) {
  sessionStore.get( req.session.id, function(err, sess) {
    if(sess && sess.userid) {
      logined(req, res);
    } else {
      notlogined(req, res);
    }
  });
}

var deleteSession = exports.deleteSession = function(req, res, next) {
 sessionStore.destroy(req.session.id, function(err) {
    req.session.destroy();
    next();
  });
}

var checkUser = exports.checkUser = function(req, res, next) {
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

var addUser = exports.addUser = function(req, res, next) {
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
