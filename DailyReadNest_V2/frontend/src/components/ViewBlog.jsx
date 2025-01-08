import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ViewBlog.css'; // Import CSS file

const ViewBlog = () => {
  const [blog, setBlog] = useState('');
  const { friendId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriendBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/blog/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(res.data.blog);
      } catch (err) {
        alert('Failed to load blog');
      }
    };
    fetchFriendBlog();
  }, [friendId]);

  return (
    <div className="view-blog-container">
      <ReactMarkdown className="blog-content">{blog}</ReactMarkdown>
      <button onClick={() => navigate('/profile')} className="back-button">Back</button>
    </div>
  );
};

export default ViewBlog;