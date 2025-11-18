# Troubleshooting "Failed to Fetch" Error

## Issue Fixed
The CORS configuration was set to only allow `http://localhost:5173`, but the frontend was running on `http://localhost:5175`.

## Solution Applied
Updated `server/server.js` to allow multiple origins:
```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}));
```

## Current Status
✅ Backend: http://localhost:5000 (running)
✅ Frontend: http://localhost:5175 (running)
✅ CORS: Configured for ports 5173, 5174, 5175
✅ Database: Connected

## How to Verify

### 1. Check Backend is Running
Open http://localhost:5000 in your browser
- Should see: "API is running..."

### 2. Test API Endpoint
Open the test page: http://localhost:5175/test-api.html
- Click "Test API Connection"
- Should see JSON response (even if error, it means connection works)

### 3. Check Browser Console
1. Open http://localhost:5175
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for any errors

## Common Issues

### "Failed to fetch" Error
**Cause**: CORS mismatch or backend not running
**Solution**: 
1. Verify backend is running: `cd server && node server.js`
2. Check CORS allows your frontend port
3. Clear browser cache (Ctrl+Shift+Delete)

### "Invalid credentials" Error
**Cause**: User doesn't exist in database
**Solution**: Register a new account first

### Port Already in Use
**Cause**: Another process is using the port
**Solution**:
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>
```

### Database Connection Failed
**Cause**: MySQL not running or wrong credentials
**Solution**:
1. Start XAMPP MySQL
2. Verify database exists: `todo_app`
3. Check `.env` file credentials
4. Run: `cd server && node test-connection.js`

## Manual Testing

### Test Backend Directly
```powershell
# Test root endpoint
curl http://localhost:5000/

# Test login endpoint
curl -Method POST -Uri "http://localhost:5000/api/auth/login" -ContentType "application/json" -Body '{"username":"test","password":"test"}'
```

### Check Running Processes
```bash
# List all Kiro processes
Get-Process | Where-Object {$_.ProcessName -like "*node*"}

# Check what's on port 5000
netstat -ano | findstr :5000
```

## If Still Not Working

1. **Restart Both Servers**
   - Stop backend: Ctrl+C in server terminal
   - Stop frontend: Ctrl+C in frontend terminal
   - Start backend: `cd server && node server.js`
   - Start frontend: `cd todo-list && npm run dev`

2. **Clear Browser Cache**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Reload page (Ctrl+F5)

3. **Check Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Try to login
   - Look at the request to `/api/auth/login`
   - Check if it's reaching the server

4. **Verify API URL**
   - Check `src/api.js`
   - Ensure `API_URL` is `http://localhost:5000/api`

## Success Indicators

When everything is working:
- ✅ No CORS errors in console
- ✅ Network tab shows 200/201 responses (or 400/401 for invalid credentials)
- ✅ Can register a new account
- ✅ Can login with registered account
- ✅ Can see todos list after login
