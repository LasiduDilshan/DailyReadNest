import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
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
        setName(res.data.name);
        setBio(res.data.bio);
        setPhoto(res.data.photo);
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
        { name, bio, photo },
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio"></textarea>
        <input type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo URL" />
        <button type="submit">Save</button>
      </form>
      <button onClick={handleLogout} style={{ marginTop: '1rem' }}>Logout</button>
    </div>
  );
};

export default EditProfile;