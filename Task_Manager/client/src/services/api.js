import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tasker_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to normalize error handling & handle 401 unauthorized
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Network request failed';
    if (error.response?.data?.message) {
      message = error.response.data.message;
      if (error.response.data.errors && error.response.data.errors.length > 0) {
        message = `${message}: ${error.response.data.errors.join(', ')}`;
      }
    } else if (error.message) {
      message = error.message;
    }

    // Auto-detect unauthorized status
    if (error.response?.status === 401) {
      console.warn('[Auth Notice] Unauthorized response (401). Token may be expired.');
    }

    return Promise.reject(new Error(message));
  }
);

// Auth API services
export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

// Task API services
export const taskApi = {
  getAll: (params = {}) => apiClient.get('/tasks', { params }),
  getById: (id) => apiClient.get(`/tasks/${id}`),
  create: (data) => apiClient.post('/tasks', data),
  update: (id, data) => apiClient.put(`/tasks/${id}`, data),
  toggle: (id) => apiClient.patch(`/tasks/${id}/toggle`),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
  reorder: (taskIds) => apiClient.post('/tasks/reorder', { taskIds }),
  clearAll: () => apiClient.delete('/tasks'),
};

// Notification API services
export const notificationApi = {
  getAll: (sync = false) => apiClient.get(`/notifications${sync ? '?sync=true' : ''}`),
  markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
  clearAll: () => apiClient.delete('/notifications'),
  checkReminders: () => apiClient.post('/notifications/check'),
};

// User API services
export const userApi = {
  getMe: () => apiClient.get('/users/me'),
  updatePreferences: (data) => apiClient.put('/users/preferences', data),
  checkHealth: () => apiClient.get('/health'),
};
