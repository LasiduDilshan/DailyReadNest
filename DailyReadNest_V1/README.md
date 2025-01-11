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
   mkdir profile-app
   cd profile-app
   mkdir backend
   cd backend
   npm init -y
   npm install express mongoose dotenv bcryptjs jsonwebtoken
   npm install --save-dev nodemon
   ```

2. **Create Server and Routes**:

   - **server.js**:

     ```js
     Find the code
     ```

   - **models/User.js**:

     ```js
     Find the code
     ```

   - **routes/userRoutes.js**:

     ```js
     Find the code
     ```

   - **middleware/authMiddleware.js**:

     ```js
     Find the code
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
      Find the code
      ```

    - **Register.jsx**:

      ```jsx
      Find the code
      ```

    - **Login.jsx**:

      ```jsx
      Find the code
      ```

    - **Profile.jsx**:

      ```jsx
      Find the code
      ```

    - **EditProfile.jsx**:

      ```jsx
      Find the code
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
