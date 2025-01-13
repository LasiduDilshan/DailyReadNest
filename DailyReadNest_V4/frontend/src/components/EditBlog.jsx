import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './EditBlog.css';

const EditBlog = () => {
  const [blogs, setBlogs] = useState(Array(5).fill({ content: '', _id: null, comments: [] }));
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0); // Track the current blog index
  const [previewIndex, setPreviewIndex] = useState(null); // Track the preview state
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

  const handleNextBlog = () => {
    if (currentBlogIndex < blogs.length - 1) {
      setCurrentBlogIndex(currentBlogIndex + 1);
    }
  };

  const handlePreviousBlog = () => {
    if (currentBlogIndex > 0) {
      setCurrentBlogIndex(currentBlogIndex - 1);
    }
  };

  const currentBlog = blogs[currentBlogIndex];

  return (
    <div className="edit-blog-container">
      <div className="blog-navigation">
        <button onClick={handlePreviousBlog} disabled={currentBlogIndex === 0}>Previous</button>
        <span>Blog {currentBlogIndex + 1} of {blogs.length}</span>
        <button onClick={handleNextBlog} disabled={currentBlogIndex === blogs.length - 1}>Next</button>
      </div>
      {currentBlog && (
        <div className="blog-item">
          {previewIndex === currentBlogIndex ? (
            <div className="blog-preview">
              <ReactMarkdown>{currentBlog.content}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={currentBlog.content}
              onChange={(e) => {
                const newBlogs = [...blogs];
                newBlogs[currentBlogIndex].content = e.target.value;
                setBlogs(newBlogs);
              }}
              className="blog-textarea"
              placeholder={`Write your blog ${currentBlogIndex + 1} in Markdown style...`}
            />
          )}
          <button onClick={() => handleSave(currentBlogIndex)} className="save-blog-button">Save</button>
          {currentBlog._id && (
            <button onClick={() => handleDelete(currentBlogIndex)} className="delete-blog-button">
              Delete
            </button>
          )}
          <button onClick={() => handlePreviewToggle(currentBlogIndex)} className="preview-blog-button">
            {previewIndex === currentBlogIndex ? 'Edit' : 'Preview'}
          </button>
          <div className="comments-section">
            <h3>Comments:</h3>
            {currentBlog.comments.map((comment, commentIndex) => (
              <div key={commentIndex} className="comment">
                <strong>{comment.user.name}:</strong>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => navigate('/profile')} className="back-button">Back</button>
    </div>
  );
};

export default EditBlog;