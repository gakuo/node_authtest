var app = module.parent.exports;
var Auth = app.Auth;
var User = app.User;

// Routes

var isLogin = function(req, res, next) {
  Auth.get( req.session.id, function(err, sess) {
    if(sess && sess.userid) {
      next();
    } else {
      res.render('login', {
        title: 'login'
      });
    }
  });
}

var logout = function(req, res, next) {
 Auth.destroy(req.session.id, function(err) {
    req.session.destroy();
    next();
  });
}

var login = function(req, res, next) {
  User.findOne({id: req.body.id}, function(err, docs) {
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

app.get('/', isLogin, function(req, res){
  res.render('index', {
    title: req.session.userid
  });
});

app.get('/logout', logout, function(req, res) {
  res.redirect('/');
});

app.post('/check', login, function(req, res) {
  res.redirect('/');
});
