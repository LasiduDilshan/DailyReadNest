import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BlogSummaries.css';

const BlogSummaries = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogSummaries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const res = await axios.get('/api/users/blog-summaries', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error('Error fetching blog summaries:', err);
        alert('Failed to load blog summaries');
      }
    };
    fetchBlogSummaries();
  }, []);

  const handleViewMore = (blogId) => {
    navigate(`/view-blog/${blogId}`);
  };

  return (
    <div className="blog-summaries-container">
      {blogs.map((blog) => (
        <div key={blog._id} className="blog-summary">
          <h3>{blog.author}</h3>
          <p>{blog.content}</p>
          <button onClick={() => handleViewMore(blog._id)} className="view-more-button">View More...</button>
        </div>
      ))}
      <button onClick={() => navigate('/profile')} className="back-button">Back to Profile</button>
    </div>
  );
};

export default BlogSummaries;