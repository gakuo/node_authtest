var app = module.parent.exports;


// Routes
app.get('/', app.auth.isLogined, function(req, res){
  res.render('index', {
    title: req.session.userid
  });
});

app.get('/logout', app.auth.logout, function(req, res) {
  res.redirect('/');
});

app.get('/signup', function(req, res) {
  res.render('signup', {
    title: 'Sinup Now !'
  });
});

app.post('/check', app.auth.login, function(req, res) {
  res.redirect('/');
});

app.post('/adduser', app.auth.signup, function(req, res) {
  res.redirect('/');
});
