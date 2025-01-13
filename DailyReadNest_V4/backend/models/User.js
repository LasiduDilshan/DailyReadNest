const mongoose = require('mongoose');

// Define the comment schema to include user information
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who added the comment
  createdAt: { type: Date, default: Date.now }
});

// Define the blog schema to include comments
const blogSchema = new mongoose.Schema({
  content: { type: String, required: true },
  comments: [commentSchema], // Embed the comment schema
  createdAt: { type: Date, default: Date.now }
});

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, maxlength: 100 },
  photo: { type: String },
  profileBackground: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blogs: [blogSchema] // Store multiple blogs
});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;