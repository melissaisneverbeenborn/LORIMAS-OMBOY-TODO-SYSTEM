const API_URL = 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (username, email, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },
  login: async (username, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// Todos API
export const todosAPI = {
  getAll: async () => {
    return apiRequest('/todos');
  },
  create: async (todo) => {
    return apiRequest('/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
    });
  },
  update: async (id, todo) => {
    return apiRequest(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
    });
  },
  delete: async (id) => {
    return apiRequest(`/todos/${id}`, {
      method: 'DELETE',
    });
  },
  deleteAll: async () => {
    return apiRequest('/todos', {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    return apiRequest('/categories');
  },
  create: async (category) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: category.name,
        color: category.color
      })
    });
  },
  delete: async (id) => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
};

// Activity Logs API
export const activityAPI = {
  getLogs: async (limit = 50) => {
    return apiRequest(`/activity?limit=${limit}`);
  },
  addLog: async (log) => {
    return apiRequest('/activity', {
      method: 'POST',
      body: JSON.stringify(log)
    });
  }
};

// Reports API
export const reportsAPI = {
  getReport: async () => {
    return apiRequest('/reports');
  }
};
