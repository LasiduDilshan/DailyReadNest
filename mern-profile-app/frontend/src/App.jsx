import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

const Navbar = () => (
  <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
    <Link to="/" style={{ textDecoration: 'none' }}>Login</Link>
    <Link to="/register" style={{ textDecoration: 'none' }}>Register</Link>
    <Link to="/profile" style={{ textDecoration: 'none' }}>Profile</Link>
    <Link to="/edit-profile" style={{ textDecoration: 'none' }}>Edit Profile</Link>
  </nav>
);

const Layout = ({ children }) => (
  <div>
    <Navbar />
    <main style={{ padding: '1rem' }}>{children}</main>
  </div>
);

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;