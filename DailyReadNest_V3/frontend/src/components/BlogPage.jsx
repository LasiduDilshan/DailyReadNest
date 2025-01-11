import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './BlogPage.css'; // Import CSS file

const BlogPage = () => {
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/blog/${blogId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(res.data.blog);
      } catch (err) {
        alert('Failed to load blog');
      }
    };

    const fetchAllBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(res.data.blogs);
      } catch (err) {
        alert('Failed to load all blogs');
      }
    };

    fetchBlog();
    fetchAllBlogs();
  }, [blogId]);

  const handleNext = () => {
    const currentIndex = blogs.findIndex(b => b._id === blogId);
    if (currentIndex < blogs.length - 1) {
      navigate(`/blog/${blogs[currentIndex + 1]._id}`);
    }
  };

  const handlePrev = () => {
    const currentIndex = blogs.findIndex(b => b._id === blogId);
    if (currentIndex > 0) {
      navigate(`/blog/${blogs[currentIndex - 1]._id}`);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-page-container">
      <div className="blog-heading">Blog</div>
      <ReactMarkdown className="blog-content">{blog.content}</ReactMarkdown>
      <div className="comments-section">
        <h3>Comments:</h3>
        {blog.comments.map((comment, index) => (
          <div key={index} className="comment">
            <strong>{comment.user.name}:</strong>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
      <button onClick={handlePrev} className="nav-button">Previous</button>
      <button onClick={handleNext} className="nav-button">Next</button>
      <button onClick={() => navigate('/profile')} className="back-button">Back</button>
    </div>
  );
};

export default BlogPage;