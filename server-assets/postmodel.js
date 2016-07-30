var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    likes: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now }

});


PostSchema.methods.addLikes = function(xy) {
    this.likes += 1;
    this.save(xy);
};


module.exports = mongoose.model('Post', PostSchema);
