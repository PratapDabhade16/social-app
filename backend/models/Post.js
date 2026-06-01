const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  username:  { type: String, required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  content:  { type: String, default: '' },
  image:    { type: String, default: '' },
  likes:    { type: [String], default: [] },   // array of usernames
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);