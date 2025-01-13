import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ViewBlog.css';

const ViewBlog = () => {
  const [blogs, setBlogs] = useState([]); // All blogs
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0); // Index of the currently displayed blog
  const [comment, setComment] = useState('');
  const { friendId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/users/blogs/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(res.data.blogs); // Set all blogs
      } catch (err) {
        alert('Failed to load blogs');
      }
    };
    fetchBlogs();
  }, [friendId]);

  const handleAddComment = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/blogs/${friendId}/${blogId}/comments`, { comment }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Comment added');
      setComment('');
      const updatedBlogs = blogs.map(blog => blog._id === blogId ? { ...blog, comments: [...blog.comments, { text: comment, user: { name: 'You' } }] } : blog);
      setBlogs(updatedBlogs);
    } catch (err) {
      alert('Failed to add comment');
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
    <div className="view-blog-container">
      {currentBlog && (
        <div className="blog">
          <div className="blog-heading">Blog {currentBlogIndex + 1}</div>
          <ReactMarkdown className="blog-content">{currentBlog.content}</ReactMarkdown>
          <div className="comments-section">
            <h3>Comments:</h3>
            {currentBlog.comments.map((comment, commentIndex) => (
              <div key={commentIndex} className="comment">
                <strong>{comment.user.name}:</strong>
                <p>{comment.text}</p>
              </div>
            ))}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={() => handleAddComment(currentBlog._id)} className="add-comment-button">Add Comment</button>
          </div>
        </div>
      )}
      <div className="blog-navigation">
        <button onClick={handlePreviousBlog} disabled={currentBlogIndex === 0}>Previous</button>
        <span>Blog {currentBlogIndex + 1} of {blogs.length}</span>
        <button onClick={handleNextBlog} disabled={currentBlogIndex === blogs.length - 1}>Next</button>
      </div>
      <button onClick={() => navigate('/profile')} className="back-button">Back</button>
    </div>
  );
};

export default ViewBlog;