var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
username: {type: String, unique: true, required: true },
password: {type: String, required: true},
favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});


module.exports = mongoose.model('User', UserSchema);

