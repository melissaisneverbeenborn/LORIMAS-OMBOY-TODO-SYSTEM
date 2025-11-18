# Todo List App with MySQL Database

A full-stack todo list application with user authentication, built with React, Express, and MySQL (XAMPP).

## Features

- User authentication (Login/Register)
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Filter todos (All, Active, Completed)
- User-specific todo lists (each user sees only their todos)
- Secure password hashing with bcrypt
- JWT-based authentication
- Persistent storage in MySQL
- Clear-all action that wipes only the signed-in user’s tasks
- Responsive Bootstrap UI with stats cards and filter controls
- Reminder scheduling with countdown timers and upcoming reminder panel

## Tech Stack

| Layer        | Technology                               | Notes                                                  |
|--------------|-------------------------------------------|--------------------------------------------------------|
| Frontend     | React 19, Vite, Bootstrap 5, Bootstrap Icons | Component-driven UI with hooks and modular styling     |
| API Layer    | Express 4, cors, jsonwebtoken, bcryptjs   | RESTful API with JWT-protected todo endpoints          |
| Database     | MySQL (via XAMPP) with mysql2/promise     | Connection pooling and referential integrity enforced  |
| Tooling      | npm scripts, dotenv, ESLint               | Fast dev server, typed env config, lint-ready project  |

## Architecture Overview

1. **React App** – Manages authentication state, renders login/register or the todo dashboard, and calls the API through `src/api.js`.
2. **API Client (`src/api.js`)** – Centralizes fetch requests, automatically attaches the JWT token stored in `localStorage`, and normalizes responses for components.
3. **Express Server** – Hosts `/api/auth` and `/api/todos` routes, validates input, hashes passwords, verifies tokens, and talks to MySQL.
4. **MySQL Database** – Persists `users` and `todos` tables with timestamps, foreign keys, and useful indexes for lookups.

```
React UI → API helper → Express routes → MySQL connection pool → Database
```

## Prerequisites

- Node.js (v14 or higher)
- XAMPP (for MySQL database)
- npm or yarn

## Setup Instructions

### 1. Database Setup (XAMPP)

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin (usually at `http://localhost/phpmyadmin`)
3. Import the database schema:
   - Click on "Import" tab
   - Choose file: `server/database.sql`
   - Click "Go" to import
   
   OR manually run the SQL commands from `server/database.sql` in phpMyAdmin

   > The schema now includes `reminder_enabled` and `reminder_at` columns so reminders persist per user.

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=todo_app
   JWT_SECRET=your-secret-key-change-this-in-production
   PORT=5000
   ```

   **Note:** If your MySQL has a password, update `DB_PASSWORD` in the `.env` file.

4. Start the backend server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the todo-list directory (if not already there):
   ```bash
   cd ..
   cd todo-list
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)
2. Register a new account or login with existing credentials
3. Start adding and managing your todos!

### Power User Tips

- **Keyboard navigation**: The browser’s native focus order lets you TAB quickly between title, description, due date, and submit.
- **Editing flow**: Selecting “Edit” auto-fills the form; choosing “Cancel” restores the form to “Add Task” mode without losing the current list.
- **Filters + stats**: Use the button group to slice tasks while the stat cards (Total/Active/Completed) update in real time.
- **Clear All**: Clicking “Clear All Tasks” calls the DELETE `/api/todos` endpoint and wipes only your own records (after confirmation).
- **Reminders**: Flip the “Enable Reminder” switch, pick a date/time, and see it show up in the Upcoming Reminders card plus each task card.
- **Timers**: Every todo displays a live countdown badge that flips to “Overdue” once the deadline passes; reminders get their own timer too.

### Reminder & Timer Experience

| UI Element                      | What it does                                                                   |
|---------------------------------|---------------------------------------------------------------------------------|
| Enable Reminder switch          | Stores `reminder_enabled` + `reminder_at` in MySQL for that todo               |
| Reminder date & time picker     | Uses the browser’s native `datetime-local` control                             |
| Upcoming Reminders card         | Shows the next 3 reminders with countdown pills (auto-refreshes every minute)  |
| Todo card timer badges          | One badge tracks time until due date, another (optional) tracks reminder time  |
| Reminder state                  | Badge flips to “Reminder sent” once the reminder moment passes                 |

## Project Structure

```
todo-list/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx      # Login form component
│   │   ├── RegisterForm.jsx   # Registration form component
│   │   ├── todoform.jsx       # Todo form component
│   │   └── todoitem.jsx       # Todo item component
│   ├── api.js                 # API client functions
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── server/
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── todos.js           # Todo CRUD routes
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── db.js                  # Database connection
│   ├── server.js              # Express server
│   ├── database.sql           # Database schema
│   └── package.json           # Backend dependencies
└── package.json               # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Todos (Requires Authentication)
- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `DELETE /api/todos` - Delete all todos for authenticated user

## Testing & Verification

| Area              | Command / Action                         | Expected Result                            |
|-------------------|-------------------------------------------|--------------------------------------------|
| Backend health    | `curl http://localhost:5000/api/health`   | `{"message":"Server is running"}`          |
| Auth flow         | Register in UI or via Postman             | Receives `{ token, user }` JSON payload    |
| Todo CRUD         | Use UI buttons/forms                      | List updates instantly without refresh     |
| Lint check        | `npm run lint` (frontend)                 | No ESLint errors                           |
| Manual DB check   | `SELECT * FROM todos;` in phpMyAdmin      | Rows scoped to the current user IDs        |

## Advanced Configuration

- **Environment overrides**: Add `DB_PORT`, `CORS_ORIGIN`, `TOKEN_EXPIRES_IN` to `.env` when deploying beyond localhost.
- **Custom API URL**: Change `API_URL` in `src/api.js` if you host the backend elsewhere (e.g., Render, Railway, EC2).
- **HTTPS / certificates**: Proxy the Express server through nginx/Apache, or use a service like Caddy/LetsEncrypt for TLS.
- **Session persistence**: Tokens are stored in `localStorage`; switch to HTTP-only cookies if you need stricter security.

## Deployment Ideas

1. **Local LAN demo** – Keep MySQL on the same PC, expose Vite build via `npm run build && npm run preview`.
2. **Split hosting** – Deploy Express/MySQL on a VPS or managed host; serve the React build from Netlify/Vercel as long as CORS is configured.
3. **Dockerize** – Create Dockerfiles for `server/` and `todo-list/`, plus a `docker-compose.yml` with a MySQL service for reproducible setups.

## Roadmap / Future Enhancements

- Attachments or sub-tasks per todo
- Reminder emails or push notifications
- Shared lists / team collaboration with role-based access
- Dark mode toggle and theme customization
- Pagination or infinite scroll for large task lists
- Automated test suites (Jest/React Testing Library + supertest)

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running in XAMPP
- Check that the database `todo_app` exists
- Verify database credentials in `server/.env`

### CORS Issues
- Make sure the backend server is running on port 5000
- Check that the frontend API URL in `src/api.js` matches your backend URL

### Port Already in Use
- Change the PORT in `server/.env` if 5000 is taken
- Update the API_URL in `src/api.js` to match the new port

### “Failed to fetch”
- Ensure the backend is running and reachable at the URL in `src/api.js`.
- Check the browser’s console → Network tab for blocked requests or CORS errors.
- Match the protocol (http/https) between frontend and backend.

## Security Notes

- Change the `JWT_SECRET` in production
- Use environment variables for sensitive data
- Consider adding rate limiting for production
- Use HTTPS in production

## FAQ

**Q: Can I import existing tasks?**  
A: Yes—insert rows directly into the `todos` table with the correct `user_id`. They’ll appear next load.

**Q: How do I reset my password?**  
A: Manually update the `users` table with a new bcrypt hash (or build a “Forgot Password” API—see roadmap).

**Q: Why do todos disappear when I sign out?**  
A: Todos are scoped to each account. Log back in with the same credentials to see your personal list.

**Q: Can I run MySQL outside XAMPP?**  
A: Absolutely. Point the `.env` values to any reachable MySQL server (local or cloud) and import `database.sql` there.
