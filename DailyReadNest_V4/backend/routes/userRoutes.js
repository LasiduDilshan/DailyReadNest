const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users except the current user
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('name bio photo profileBackground');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's blogs with pagination
router.get('/blogs', authMiddleware, async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'blogs.comments.user',
      select: 'name',
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBlogs = user.blogs.slice(startIndex, endIndex);
    res.json({ blogs: paginatedBlogs, totalBlogs: user.blogs.length });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend's blogs with pagination
router.get('/blogs/:id', authMiddleware, async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id).populate('blogs.comments.user', 'name');
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.friends.includes(friend._id)) {
      return res.status(403).json({ message: 'Not friends' });
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBlogs = friend.blogs.slice(startIndex, endIndex);
    res.json({ blogs: paginatedBlogs, totalBlogs: friend.blogs.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit user profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, bio, photo, profileBackground } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = name || user.name;
      user.bio = bio || user.bio;
      user.photo = photo || user.photo;
      user.profileBackground = profileBackground || user.profileBackground; // Update profile background
      await user.save();
      res.json({ message: 'Profile updated', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user blog
router.put('/blog', authMiddleware, async (req, res) => {
  const { blog } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.blog = blog || user.blog;
      await user.save();
      res.json({ message: 'Blog updated', user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send friend request
router.post('/friend-request/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.friends.includes(friend._id) || user.friendRequestsSent.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend request already sent or already friends' });
    }
    user.friendRequestsSent.push(friend._id);
    friend.friendRequestsReceived.push(user._id);
    await user.save();
    await friend.save();
    res.json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept friend request
router.post('/accept-friend-request/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.friendRequestsReceived.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend request not received' });
    }
    user.friends.push(friend._id);
    friend.friends.push(user._id);
    user.friendRequestsReceived.pull(friend._id);
    friend.friendRequestsSent.pull(user._id);
    await user.save();
    await friend.save();
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove friend
router.post('/remove-friend/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Not friends' });
    }
    user.friends.pull(friend._id);
    friend.friends.pull(user._id);
    await user.save();
    await friend.save();
    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's blogs
router.get('/blogs', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ blogs: user.blogs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get friend's blogs
router.get('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id).populate('blogs.comments.user', 'name'); // Populate user details in comments
    if (!friend) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.friends.includes(friend._id)) {
      return res.status(403).json({ message: 'Not friends' });
    }
    res.json({ blogs: friend.blogs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new blog
router.post('/blogs', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.blogs.length >= 5) {
      return res.status(400).json({ message: 'Maximum number of blogs reached' });
    }
    user.blogs.push({ content, comments: [] });
    await user.save();
    res.json({ message: 'Blog added', blogs: user.blogs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a blog
router.delete('/blogs/:blogId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const blog = user.blogs.id(req.params.blogId);
    if (!blog) {
      console.error('Blog not found');
      return res.status(404).json({ message: 'Blog not found' });
    }
    user.blogs.pull({ _id: req.params.blogId }); // Use pull to remove the blog
    await user.save();
    res.json({ message: 'Blog deleted', blogs: user.blogs });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a blog
router.put('/blogs/:blogId', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const blog = user.blogs.id(req.params.blogId);
    if (blog) {
      blog.content = content;
      await user.save();
      res.json({ message: 'Blog updated', blogs: user.blogs });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a blog
router.post('/blogs/:friendId/:blogId/comments', authMiddleware, async (req, res) => {
  const { comment } = req.body;
  try {
    const user = await User.findById(req.user.id); // Authenticated user
    const friend = await User.findById(req.params.friendId); // Friend whose blog is being commented on

    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    const blog = friend.blogs.id(req.params.blogId); // Find the specific blog

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Push the new comment into the blog's comments array
    blog.comments.push({ text: comment, user: req.user.id });
    await friend.save();

    res.json({ message: 'Comment added', blogs: friend.blogs });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;