import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './EditBlog.css';

const EditBlog = () => {
  const [blogs, setBlogs] = useState(Array(5).fill({ content: '', _id: null, comments: [] }));
  const [previewIndex, setPreviewIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const res = await axios.get('/api/users/blogs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedBlogs = res.data.blogs;
        const updatedBlogs = blogs.map((blog, index) => fetchedBlogs[index] || blog);
        setBlogs(updatedBlogs);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        alert('Failed to load blogs');
      }
    };
    fetchBlogs();
  }, []);

  const handleSave = async (index) => {
    try {
      const token = localStorage.getItem('token');
      const blog = blogs[index];
      if (blog._id) {
        await axios.put(`/api/users/blogs/${blog._id}`, { content: blog.content }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Blog updated');
      } else {
        const res = await axios.post('/api/users/blogs', { content: blog.content }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const newBlogs = [...blogs];
        newBlogs[index] = res.data.blogs[res.data.blogs.length - 1]; // Update the blog with the new ID
        setBlogs(newBlogs);
        alert('Blog added');
      }
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Failed to update blog');
    }
  };

  const handleDelete = async (index) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/blogs/${blogs[index]._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Blog deleted');
      const newBlogs = blogs.map((blog, i) => (i === index ? { content: '', _id: null, comments: [] } : blog));
      setBlogs(newBlogs);
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
    }
  };

  const handlePreviewToggle = (index) => {
    if (previewIndex === index) {
      setPreviewIndex(null);
    } else {
      setPreviewIndex(index);
    }
  };

  return (
    <div className="edit-blog-container">
      {blogs.map((blog, index) => (
        <div key={index} className="blog-item">
          {previewIndex === index ? (
            <div className="blog-preview">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={blog.content}
              onChange={(e) => {
                const newBlogs = [...blogs];
                newBlogs[index].content = e.target.value;
                setBlogs(newBlogs);
              }}
              className="blog-textarea"
              placeholder={`Write your blog ${index + 1} in Markdown style...`}
            />
          )}
          <button onClick={() => handleSave(index)} className="save-blog-button">Save</button>
          {blog._id && (
            <button onClick={() => handleDelete(index)} className="delete-blog-button">
              Delete
            </button>
          )}
          <button onClick={() => handlePreviewToggle(index)} className="preview-blog-button">
            {previewIndex === index ? 'Edit' : 'Preview'}
          </button>
          {/* Display comments for each blog */}
          <div className="comments-section">
            <h3>Comments:</h3>
            {blog.comments.map((comment, commentIndex) => (
              <p key={commentIndex}>{comment}</p>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => navigate('/profile')} className="back-button">Back</button>
    </div>
  );
};

export default EditBlog;