import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import TodoForm from './components/todoform';
import TodoItem from './components/todoitem';
import { authAPI, todosAPI } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editTodo, setEditTodo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await todosAPI.getAll();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const data = await authAPI.login(credentials.username, credentials.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setError('');
      fetchTodos();
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const data = await authAPI.register(userData.username, userData.email, userData.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setError('');
      setShowRegister(false);
      fetchTodos();
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTodos([]);
    setError('');
  };

  const handleAddTodo = async (todoData) => {
    try {
      if (editTodo) {
        const updated = await todosAPI.update(editTodo.id, todoData);
        setTodos(todos.map(t => t.id === editTodo.id ? updated : t));
        setEditTodo(null);
      } else {
        const newTodo = await todosAPI.create(todoData);
        setTodos([newTodo, ...todos]);
      }
    } catch (err) {
      console.error('Error saving todo:', err);
      alert('Failed to save task');
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      const updated = await todosAPI.update(id, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todosAPI.delete(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const handleEditTodo = (todo) => {
    setEditTodo(todo);
  };

  const handleCancelEdit = () => {
    setEditTodo(null);
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      try {
        await todosAPI.deleteAll();
        setTodos([]);
      } catch (err) {
        console.error('Error clearing todos:', err);
      }
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  };

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  if (!user) {
    return showRegister ? (
      <RegisterForm
        onRegister={handleRegister}
        onSwitchToLogin={() => setShowRegister(false)}
        error={error}
      />
    ) : (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setShowRegister(true)}
        error={error}
      />
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4">
          <i className="bi bi-check2-square"></i> My Tasks
        </h1>
        <div>
          <span className="me-3">Welcome, {user.username}!</span>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="display-6">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Active</h5>
              <p className="display-6 text-warning">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="display-6 text-success">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      <TodoForm
        onSubmit={handleAddTodo}
        editTodo={editTodo}
        onCancel={handleCancelEdit}
      />

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Tasks</h4>
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              type="button"
              className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
        <div className="card-body">
          {getFilteredTodos().length === 0 ? (
            <p className="text-center text-muted">No tasks found</p>
          ) : (
            <div className="list-group">
              {getFilteredTodos().map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                />
              ))}
            </div>
          )}
          {todos.length > 0 && (
            <div className="mt-3 text-center">
              <button className="btn btn-danger" onClick={handleClearAll}>
                <i className="bi bi-trash"></i> Clear All Tasks
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
