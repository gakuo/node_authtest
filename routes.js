var app = module.parent.exports;
var Auth = app.Auth;
var User = app.User;

// Routes

app.get('/', function(req, res){
  Auth.get(req.session.id, function(err, sess) {
    if(sess && sess.userid) {
      console.log(sess);
      res.render('index', {
        title: req.session.userid
      });
    } else {
      res.redirect('/login');
    }
  });
});


var isLogin = function(req, res, next) {
  Auth.get( req.session.id, function(err, sess) {
    if(sess && sess.userid) {
      res.redirect('/');
    } else {
      next();
    }
  });
}

app.get('/login', isLogin, function(req, res) {
    res.render('login', {
      title: 'login'
    });
  }
);

app.get('/logout', function(req, res) {
  Auth.destroy(req.session.id, function(err) {
    req.session.destroy();
    console.log('deleted sesstion');
    res.redirect('/');
  });
  /*Auth.get(req.session.id, function(err, sess) {
    if(sess && sess.userid) {
      Auth.destroy(sess.id, function(err) {
        sess.destroy();
        console.log('deleted session');
        res.redirect('/');
      });
    } else {
      console.log('not deleted session');
      res.redirect('/');
    }
  });*/
});

app.post('/check', function(req, res) {
  User.findOne({id: req.body.id}, function(err, docs) {
    if(docs !== null && docs.passwd === req.body.pw) {
      //ここでOKならnextを実行して次でuseridをセット,でなければログインurlにリダイレクト
      console.log('pass');
      req.session.userid = req.body.id;
      res.redirect('/');
    } else {
      res.render('login', {
        title: 'login'
      });
    }
  });
});
