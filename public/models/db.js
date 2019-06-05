var mongoose = require('mongoose');

module.exports = mongoose.model('demoCollection', {
   productName: {type: String},
});