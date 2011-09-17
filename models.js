var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.mongo_info.domain + ':' + config.mongo_info.port + '/' + config.mongo_info.dbname);

//TODO:スキーマのラベル名を設計に合わせる
var user = new mongoose.Schema({id: String, name: String, passwd: String});
mongoose.model('user', user);

module.exports = {
  user: mongoose.model('user')
}
