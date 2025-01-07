import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditBlog.css'; // Import CSS file

const EditBlog = () => {
  const [blog, setBlog] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const res = await axios.get('/api/users/blog', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(res.data.blog); // Preload the previous blog content
      } catch (err) {
        console.error('Error fetching blog:', err); // Log the error
        alert('Failed to load blog');
      }
    };
    fetchBlog();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/blog', { blog }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Blog updated');
      navigate('/profile');
    } catch (err) {
      console.error('Error saving blog:', err); // Log the error
      alert('Failed to update blog');
    }
  };

  return (
    <div className="edit-blog-container">
      <textarea
        value={blog}
        onChange={(e) => setBlog(e.target.value)}
        className="blog-textarea"
        placeholder="Write your blog in Markdown style..."
      />
      <button onClick={handleSave} className="save-blog-button">Save</button>
      <button onClick={() => navigate('/profile')} className="back-button">Back</button>
    </div>
  );
};

export default EditBlog;