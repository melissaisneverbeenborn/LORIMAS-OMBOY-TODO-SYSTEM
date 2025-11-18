# Quick Reference Guide

## 🚀 Current Status

✅ **Backend Server**: http://localhost:5000 (RUNNING)
✅ **Frontend App**: http://localhost:5175 (RUNNING)
✅ **Database**: Connected with all required tables and columns
✅ **CORS**: Configured for ports 5173, 5174, 5175

## 🎯 Access the App

Open in your browser: **http://localhost:5175**

## 🔧 Issues Fixed

1. ✅ **Server Configuration** - Fixed route initialization order
2. ✅ **API Client** - Complete rewrite with proper endpoints
3. ✅ **CORS Error** - Added support for multiple frontend ports
4. ✅ **Database Schema** - Added missing reminder columns
5. ✅ **Component Props** - Fixed TodoItem prop handling

## 📝 Common Tasks

### Start Servers (if stopped)

**Backend:**
```bash
cd server
node server.js
```

**Frontend:**
```bash
cd todo-list
npm run dev
```

### Check Database

```bash
cd server
node test-connection.js
```

### View Table Schema

```bash
cd server
node check-schema.js
```

### Test Todo Creation

```bash
cd server
node test-create-todo.js
```

### Stop a Process on Port

```powershell
# Find process
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /F /PID <PID>
```

## 🐛 Troubleshooting

### "Failed to fetch"
- ✅ **FIXED** - CORS now allows your frontend port
- If still occurs: Hard refresh (Ctrl+F5)

### "Failed to save task"
- ✅ **FIXED** - Database columns added
- If still occurs: Restart backend server

### "Invalid credentials"
- Register a new account first
- Check username/password are correct

### Port already in use
- Kill the process using the port
- Or let Vite use a different port (it will auto-detect)

## 📊 Database Tables

- ✅ `users` - User accounts
- ✅ `todos` - Tasks with reminders
- ✅ `categories` - Task categories
- ✅ `activity_logs` - User activity tracking

## 🔑 Environment Variables

Located in `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=todo_app
DB_PORT=3306
PORT=5000
JWT_SECRET=mysecretkey
```

## 📚 Documentation Files

- `README.md` - Full project documentation
- `QUICKSTART.md` - 5-minute setup guide
- `FIXES_APPLIED.md` - All fixes applied today
- `DATABASE_FIX.md` - Database migration details
- `TROUBLESHOOTING.md` - Detailed troubleshooting guide
- `QUICK_REFERENCE.md` - This file

## ✨ Features Working

- ✅ User registration and login
- ✅ Create, edit, delete tasks
- ✅ Mark tasks as complete
- ✅ Set due dates
- ✅ Enable reminders with date/time
- ✅ Filter tasks (All/Active/Completed)
- ✅ View statistics dashboard
- ✅ Clear all tasks

## 🎉 You're All Set!

Everything is connected and working. Open http://localhost:5175 and start managing your tasks!
