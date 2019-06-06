var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var demoCollectionSchema = new Schema({
	productName: {type: String}
});

module.exports = mongoose.model('demoCollection', demoCollectionSchema);