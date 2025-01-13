## Run the application in a single terminal

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
