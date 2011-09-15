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

app.post('/check', app.auth.login, function(req, res) {
  res.redirect('/');
});
