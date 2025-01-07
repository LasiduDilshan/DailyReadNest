### Project Structure

1. **Backend**: Node.js with Express and MongoDB for data storage.
2. **Frontend**: React with Vite for the client-side application.

### Steps to Create the Application

1. **Set Up the Backend**:

   - Create a Node.js server using Express.
   - Connect to a MongoDB database.
   - Define routes for user registration, login, and profile management.
   - Use JWT (JSON Web Tokens) for authentication.

2. **Set Up the Frontend**:
   - Create a React application using Vite.
   - Define components for registration, login, profile view, and profile edit.
   - Use Axios or Fetch API to interact with the backend.

### Backend Setup

1. **Initialize the Project**:

   ```sh
   mkdir mern-profile-app
   cd mern-profile-app
   mkdir backend
   cd backend
   npm init -y
   npm install express mongoose dotenv bcryptjs jsonwebtoken
   npm install --save-dev nodemon
   ```

2. **Create Server and Routes**:

   - **server.js**:

     ```js
     const express = require("express");
     const mongoose = require("mongoose");
     const dotenv = require("dotenv");
     const userRoutes = require("./routes/userRoutes");

     dotenv.config();

     const app = express();
     app.use(express.json());

     mongoose
       .connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       })
       .then(() => console.log("MongoDB connected"))
       .catch((err) => console.log(err));

     app.use("/api/users", userRoutes);

     const PORT = process.env.PORT || 5000;
     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
     ```

   - **models/User.js**:

     ```js
     const mongoose = require("mongoose");

     const userSchema = new mongoose.Schema({
       name: { type: String, required: true },
       email: { type: String, required: true, unique: true },
       password: { type: String, required: true },
       bio: { type: String },
       photo: { type: String },
     });

     const User = mongoose.model("User", userSchema);
     module.exports = User;
     ```

   - **routes/userRoutes.js**:

     ```js
     const express = require("express");
     const bcrypt = require("bcryptjs");
     const jwt = require("jsonwebtoken");
     const User = require("../models/User");
     const authMiddleware = require("../middleware/authMiddleware");

     const router = express.Router();

     // Register a new user
     router.post("/register", async (req, res) => {
       const { name, email, password } = req.body;
       try {
         const userExists = await User.findOne({ email });
         if (userExists) {
           return res.status(400).json({ message: "User already exists" });
         }
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         const newUser = await User.create({
           name,
           email,
           password: hashedPassword,
         });
         res
           .status(201)
           .json({ message: "User created successfully", user: newUser });
       } catch (error) {
         res.status(500).json({ message: "Server error" });
       }
     });

     // Login user
     router.post("/login", async (req, res) => {
       const { email, password } = req.body;
       try {
         const user = await User.findOne({ email });
         if (!user) {
           return res.status(400).json({ message: "Invalid credentials" });
         }
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
           return res.status(400).json({ message: "Invalid credentials" });
         }
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
           expiresIn: "1h",
         });
         res.json({ token, user });
       } catch (error) {
         res.status(500).json({ message: "Server error" });
       }
     });

     // Get user profile
     router.get("/profile", authMiddleware, async (req, res) => {
       try {
         const user = await User.findById(req.user.id);
         res.json(user);
       } catch (error) {
         res.status(500).json({ message: "Server error" });
       }
     });

     // Edit user profile
     router.put("/profile", authMiddleware, async (req, res) => {
       const { name, bio, photo } = req.body;
       try {
         const user = await User.findById(req.user.id);
         if (user) {
           user.name = name || user.name;
           user.bio = bio || user.bio;
           user.photo = photo || user.photo;
           await user.save();
           res.json({ message: "Profile updated", user });
         } else {
           res.status(404).json({ message: "User not found" });
         }
       } catch (error) {
         res.status(500).json({ message: "Server error" });
       }
     });

     module.exports = router;
     ```

   - **middleware/authMiddleware.js**:

     ```js
     const jwt = require("jsonwebtoken");

     const authMiddleware = (req, res, next) => {
       const token = req.header("Authorization").replace("Bearer ", "");
       if (!token) {
         return res
           .status(401)
           .json({ message: "No token, authorization denied" });
       }
       try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;
         next();
       } catch (error) {
         res.status(401).json({ message: "Token is not valid" });
       }
     };

     module.exports = authMiddleware;
     ```

3. **Environment Variables**:

   - Create a `.env` file in your backend directory:
     ```
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. **Run the Backend**:
   - Add a `start` script to `package.json` for development:
     ```json
     "scripts": {
       "start": "nodemon server.js"
     }
     ```
   - Start the server:
     ```sh
     npm start
     ```

### Frontend Setup

1.  **Initialize the React App with Vite**:

    ```sh
    npm create vite@latest frontend --template react
    cd frontend
    npm install
    npm install axios react-router-dom
    ```

2.  **Create Components and Routes**:

    - **App.jsx**:
      ```jsx
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

      ```

    - **Register.jsx**:

      ```jsx
      import React, { useState } from "react";
      import axios from "axios";

      const Register = () => {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const res = await axios.post("/api/users/register", {
              name,
              email,
              password,
            });
            alert(res.data.message);
          } catch (err) {
            alert(err.response.data.message);
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Register</button>
          </form>
        );
      };

      export default Register;
      ```

    - **Login.jsx**:

      ```jsx
      import React, { useState } from "react";
      import axios from "axios";
      import { useNavigate } from "react-router-dom";

      const Login = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const res = await axios.post("/api/users/login", {
              email,
              password,
            });
            localStorage.setItem("token", res.data.token);
            navigate("/profile");
          } catch (err) {
            alert(err.response.data.message);
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
        );
      };

      export default Login;
      ```

    - **Profile.jsx**:

      ```jsx
      import React, { useEffect, useState } from "react";
      import axios from "axios";

      const Profile = () => {
        const [user, setUser] = useState({});

        useEffect(() => {
          const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/users/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setUser(res.data);
          };
          fetchProfile();
        }, []);

        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p>{user.bio}</p>
            {user.photo && <img src={user.photo} alt="Profile" />}
          </div>
        );
      };

      export default Profile;
      ```

    - **EditProfile.jsx**:

      ```jsx
      import React, { useState, useEffect } from "react";
      import axios from "axios";
      import { useNavigate } from "react-router-dom";

      const EditProfile = () => {
        const [name, setName] = useState("");
        const [bio, setBio] = useState("");
        const [photo, setPhoto] = useState("");
        const navigate = useNavigate();

        useEffect(() => {
          const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            const res = await axios.get("/api/users/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setName(res.data.name);
            setBio(res.data.bio);
            setPhoto(res.data.photo);
          };
          fetchProfile();
        }, []);

        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const token = localStorage.getItem("token");
            await axios.put(
              "/api/users/profile",
              { name, bio, photo },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            navigate("/profile");
          } catch (err) {
            alert(err.response.data.message);
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
            ></textarea>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="Photo URL"
            />
            <button type="submit">Save</button>
          </form>
        );
      };

      export default EditProfile;
      ```

3.  **Configure Vite**:

    - Add a proxy in `vite.config.js` to handle API requests to the backend:

      ```js
      import { defineConfig } from "vite";
      import react from "@vitejs/plugin-react";

      export default defineConfig({
        plugins: [react()],
        server: {
          proxy: {
            "/api": "http://localhost:5000",
          },
        },
      });
      ```

4.  **Run the Frontend**:
    ```sh
    npm run dev
    ```
