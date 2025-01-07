const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 30 }, // Limit name to 30 characters
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, maxlength: 100 }, // Limit bio to 100 characters
  photo: { type: String },
  blog: { type: String },
  profileBackground: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
