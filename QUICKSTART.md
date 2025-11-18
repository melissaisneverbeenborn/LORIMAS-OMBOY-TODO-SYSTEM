# Quick Start Guide

## Prerequisites Checklist
- [ ] XAMPP installed and MySQL running
- [ ] Node.js installed
- [ ] npm installed

## 5-Minute Setup

### 1. Database Setup (2 minutes)
```bash
# Start XAMPP MySQL
# Open phpMyAdmin: http://localhost/phpmyadmin
# Import: server/database.sql
```

### 2. Backend Setup (2 minutes)
```bash
cd server
npm install

# Create .env file with:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=todo_app
# JWT_SECRET=my-secret-key-123
# PORT=5000

npm start
```

### 3. Frontend Setup (1 minute)
```bash
cd ..  # Go back to todo-list directory
npm install
npm run dev
```

### 4. Open Browser
- Go to: `http://localhost:5173` (or the URL shown in terminal)
- Register a new account
- Start using the app!

## Need Help?
See `SETUP.md` for detailed instructions and troubleshooting.

