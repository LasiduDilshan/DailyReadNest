import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './ViewBlog.css'; // Import CSS file

const ViewBlog = () => {
  const [blogs, setBlogs] = useState([]);
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
        setBlogs(res.data.blogs);
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

  return (
    <div className="view-blog-container">
      {blogs.map((blog, index) => (
        <div key={blog._id} className="blog">
          <div className="blog-heading">Blog {index + 1}</div>
          <ReactMarkdown className="blog-content">{blog.content}</ReactMarkdown>
          <div className="comments-section">
            <h3>Comments:</h3>
            {blog.comments.map((comment, commentIndex) => (
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
            <button onClick={() => handleAddComment(blog._id)} className="add-comment-button">Add Comment</button>
          </div>
        </div>
      ))}
      <button onClick={() => navigate('/profile')} className="back-button">Back</button>
    </div>
  );
};

export default ViewBlog;