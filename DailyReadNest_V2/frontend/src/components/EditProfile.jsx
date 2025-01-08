import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProfile.css'; // Import CSS file

const EditProfile = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [profileBackground, setProfileBackground] = useState('');
  const navigate = useNavigate();
  const bioRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(res.data.name);
        setBio(res.data.bio);
        setPhoto(res.data.photo);
        setProfileBackground(res.data.profileBackground);
      } catch (err) {
        alert('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/users/profile',
        { name, bio, photo, profileBackground },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/profile');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
    adjustTextareaHeight(bioRef.current);
  };

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight(bioRef.current);
  }, [bio]);

  return (
    <div className="edit-profile-container">
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label htmlFor="name">Name</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          maxLength="30" // Limit name to 30 characters
        />
        
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          ref={bioRef}
          value={bio}
          onChange={handleBioChange}
          placeholder="Bio"
          rows="1"
          maxLength="100" // Limit bio to 100 characters
        ></textarea>
        
        <label htmlFor="photo">Photo URL</label>
        <input 
          type="text" 
          id="photo" 
          value={photo} 
          onChange={(e) => setPhoto(e.target.value)} 
          placeholder="Photo URL" 
        />
        
        <label htmlFor="profileBackground">Profile Background URL</label>
        <input 
          type="text" 
          id="profileBackground" 
          value={profileBackground} 
          onChange={(e) => setProfileBackground(e.target.value)} 
          placeholder="Profile Background URL" 
        />
        
        <button type="submit">Save</button>
      </form>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default EditProfile;
