import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import EditBlog from './components/EditBlog';
import ViewBlog from './components/ViewBlog';

const Navbar = () => (
  <nav className="navbar">
    <Link to="/" className="nav-link">Login</Link>
    <Link to="/register" className="nav-link">Register</Link>
    <Link to="/profile" className="nav-link">Profile</Link>
    <Link to="/edit-profile" className="nav-link">Edit Profile</Link>
  </nav>
);

const Layout = ({ children }) => (
  <div>
    <Navbar />
    <main className="main-content">{children}</main>
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
          <Route path="/edit-blog" element={<EditBlog />} />
          <Route path="/view-blog/:friendId" element={<ViewBlog />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;