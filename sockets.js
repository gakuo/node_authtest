var app = module.parent.exports;

var io = require('socket.io').listen(app);
var connect = require('connect');
var parseCookie = connect.utils.parseCookie;
var Session = connect.middleware.session.Session;

io.configure(function() {
  io.set('authorization', function(handshakeData, callback) {
    if(handshakeData.headers.cookie) {
      var cookie = handshakeData.headers.cookie;
      var sessionID = parseCookie(cookie)['connect.sid'];

      handshakeData.cookie = cookie;
      handshakeData.sessionID = sessionID;
      handshakeData.sessionStore = app.auth.sesssionStore;

      app.auth.sessionStore.get(sessionID, function(err, session) {
        if(err) {
          callback(err.message, false);
        } else {
          handshakeData.session = new Session(handshakeData, session);
          callback(null, true);
        }
      });
    } else {
      return callback('Cookieが見つかりません', false);
    }
  });
});

io.sockets.on('connection', function(socket) {
  var handshake = socket.handshake;
  socket.on('user message', function(message) {
    socket.emit('user message', handshake.session.userid + ': ' + message);
    socket.broadcast.emit('user message', handshake.session.userid + ': ' + message);
  });

  var intervalID = setInterval(function() {
    handshake.session.req.sessionStore = app.auth.sessionStore;
    handshake.session.reload(function() {
      handshake.session.touch().save();
    });
  }, 1000*2);
  
  socket.on('disconnect', function() {
    clearInterval(intervalID);
  });
});
