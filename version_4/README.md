### Register Page
![FireShot Capture 001 - Vite + React - localhost](https://github.com/user-attachments/assets/2b5622a1-3b3d-4c79-85c6-d8bb80562bbf)
***
### Login Page
![FireShot Capture 002 - Vite + React - localhost](https://github.com/user-attachments/assets/0ca0e149-8291-494e-88e7-9808519252ac) 
***
### Your Profile
![FireShot Capture 003 - Vite + React - localhost](https://github.com/user-attachments/assets/3e8df9ec-41b8-4817-aded-da8919d5f31b) 
***
### Edit Your Profile
![FireShot Capture 004 - Vite + React - localhost](https://github.com/user-attachments/assets/eb6ac03a-c118-4ba3-8a75-ddd678fecb53) 
***
### Edit Your Blog
![FireShot Capture 005 - Vite + React - localhost](https://github.com/user-attachments/assets/9c6f3d9b-7217-4ded-bb91-be91d902274c) 
***
### See Your Friend's Blogs
![FireShot Capture 006 - Vite + React - localhost](https://github.com/user-attachments/assets/603002ee-40f8-4af6-8602-dd64c9a205ee)

***
## Run the application in a single terminal (Here in the repository already has been done)

1. **Create a new `package.json` in the root directory:**

Navigate to the root directory and run the following command to initialize a new `package.json` file:

```sh
npm init -y
```

2. **Install `concurrently` package:**

Install `concurrently` to run multiple commands concurrently:

```sh
npm install concurrently --save-dev
```

3. **Update the root `package.json`:**

Edit the root `package.json` file to include scripts for running both the frontend and backend. Here’s an example:

```json
{
  "name": "root",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^8.0.1"
  }
}
```

4. **Run the combined script:**

Now, you can start both the frontend and backend servers with a single command from the root directory:

```sh
npm start
```

Visit http://localhost:5173/ in your web browser to access the application.
