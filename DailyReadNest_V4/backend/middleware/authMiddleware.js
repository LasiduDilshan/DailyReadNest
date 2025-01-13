const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    console.error('No Authorization header found'); // Add logging
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Token received:', token); // Add logging

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded); // Add logging
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message); // Add logging
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;