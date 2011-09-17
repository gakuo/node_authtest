var app = module.parent.exports;

// Routes
app.get('/', function(req, res) {
  app.auth.isLogined(req, res, function(req, res) {
    res.render('index', {
      title: req.session.userid
    });
  }, function(req, res) {
    res.redirect('/login');
  });
});

app.get('/login', function(req, res) {
  app.auth.isLogined(req, res, function(req, res) {
    res.redirect('/');
  }, function(req, res) {
    res.render('login', {
      title: 'login'
    });   
  });
});

app.get('/signup', function(req, res) {
  app.auth.isLogined(req, res, function(req, res) {
    res.redirect('/');
  }, function(req, res) {
    res.render('signup', {
      title: 'Sinup Now !'
    });
  });
});

app.get('/logout', app.auth.deleteSession, function(req, res) {
  res.redirect('/');
});

app.post('/checkUser', app.auth.checkUser, function(req, res) {
  res.redirect('/');
});

app.post('/addUser', app.auth.addUser, function(req, res) {
  res.redirect('/');
});
