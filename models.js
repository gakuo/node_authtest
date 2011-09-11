

var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var server_config = new Server( 'localhost', 27017, {auto_reconnect: true, native_parser: true});
var db = new Db( 'authtest', server_config, {} );
var mongoStore = require( 'connect-mongodb');
var Auth;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yosumin');
var User = new mongoose.Schema({id: String, name: String, passwd: String});
mongoose.model('User', User);
User = mongoose.model('User');
