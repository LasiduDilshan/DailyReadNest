import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; // Import CSS file

const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + '...' : str;
};

const Profile = () => {
  const [user, setUser] = useState({});
  const [otherUsers, setOtherUsers] = useState([]);
  const [showFullName, setShowFullName] = useState(null);
  const [showFullBio, setShowFullBio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        alert('Failed to load profile');
      }
    };

    const fetchOtherUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOtherUsers(res.data);
      } catch (err) {
        alert('Failed to load other users');
      }
    };

    fetchProfile();
    fetchOtherUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sendFriendRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/friend-request/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Friend request sent');
      updateUserStatus(id, 'requestSent');
    } catch (err) {
      alert('Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/accept-friend-request/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Friend request accepted');
      updateUserStatus(id, 'friend');
    } catch (err) {
      alert('Failed to accept friend request');
    }
  };

  const removeFriend = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/remove-friend/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Friend removed');
      updateUserStatus(id, 'notFriend');
    } catch (err) {
      alert('Failed to remove friend');
    }
  };

  const fetchFriendBlog = (id) => {
    navigate(`/view-blog/${id}`);
  };

  const updateUserStatus = (id, status) => {
    setOtherUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, status } : user
      )
    );

    setUser((prevUser) => {
      const updatedUser = { ...prevUser };
      if (status === 'friend') {
        updatedUser.friends = [...prevUser.friends, id];
        updatedUser.friendRequestsReceived = prevUser.friendRequestsReceived.filter(
          (reqId) => reqId !== id
        );
      } else if (status === 'requestSent') {
        updatedUser.friendRequestsSent = [...prevUser.friendRequestsSent, id];
      } else if (status === 'notFriend') {
        updatedUser.friends = prevUser.friends.filter((friendId) => friendId !== id);
        updatedUser.friendRequestsSent = prevUser.friendRequestsSent.filter(
          (reqId) => reqId !== id
        );
      }
      return updatedUser;
    });
  };

  const isFriend = (id) => user.friends && user.friends.includes(id);
  const hasSentRequest = (id) => user.friendRequestsSent && user.friendRequestsSent.includes(id);
  const hasReceivedRequest = (id) => user.friendRequestsReceived && user.friendRequestsReceived.includes(id);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <div className="profile-container">
      <div className="main-user" style={{ backgroundImage: `url(${user.profileBackground || 'default-background.jpg'})` }}>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <p>{user.bio}</p>
        {user.photo ? (
          <img src={user.photo} alt="Profile" className="profile-photo" />
        ) : (
          <div className="profile-photo-placeholder">
            {getInitials(user.name)}
          </div>
        )}
        <button onClick={handleLogout} className="logout-button">Logout</button>

        <h2>Personal Blog</h2>
        <button onClick={() => navigate('/edit-blog')} className="edit-blog-button">Edit Blog</button>
      </div>

      <h2>Other Users</h2>
      <div className="other-users">
        {otherUsers.map((otherUser) => (
          <div key={otherUser._id} className="other-user" style={{ backgroundImage: `url(${otherUser.profileBackground || 'default-background.jpg'})` }}>
            <p>
              {showFullName === otherUser._id ? otherUser.name : truncate(otherUser.name, 16)}
              {otherUser.name.length > 16 && (
                <span onClick={() => setShowFullName(showFullName === otherUser._id ? null : otherUser._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                  {showFullName === otherUser._id ? ' (less)' : '... (more)'}
                </span>
              )}
            </p>
            <p>
              {showFullBio === otherUser._id ? otherUser.bio : truncate(otherUser.bio, 30)}
              {otherUser.bio.length > 30 && (
                <span onClick={() => setShowFullBio(showFullBio === otherUser._id ? null : otherUser._id)} style={{ cursor: 'pointer', color: 'blue' }}>
                  {showFullBio === otherUser._id ? ' (less)' : '... (more)'}
                </span>
              )}
            </p>
            {otherUser.photo ? (
              <img src={otherUser.photo} alt="Profile" className="profile-photo-small" />
            ) : (
              <div className="profile-photo-placeholder-small">
                {getInitials(otherUser.name)}
              </div>
            )}
            {isFriend(otherUser._id) ? (
              <div>
                <button className="friend-status-button" disabled>Friend</button>
                <button onClick={() => removeFriend(otherUser._id)} className="remove-friend-button">Remove Friend</button>
                <button onClick={() => fetchFriendBlog(otherUser._id)} className="view-blog-button">View Blog</button>
              </div>
            ) : hasSentRequest(otherUser._id) ? (
              <button className="friend-status-button" disabled>Friend Request Sent</button>
            ) : hasReceivedRequest(otherUser._id) ? (
              <button onClick={() => acceptFriendRequest(otherUser._id)} className="accept-friend-request-button">Accept Friend Request</button>
            ) : (
              <button onClick={() => sendFriendRequest(otherUser._id)} className="send-friend-request-button">Send Friend Request</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;