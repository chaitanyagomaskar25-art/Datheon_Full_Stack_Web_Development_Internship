import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/services/api';

const TOKEN_KEY = 'tasker_auth_token';
const USER_KEY = 'tasker_auth_user';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Validate session on mount via cookie or token
  useEffect(() => {
    async function verifySession() {
      try {
        const response = await authApi.getMe();
        if (response && response.success && response.data) {
          setUser(response.data);
          localStorage.setItem(USER_KEY, JSON.stringify(response.data));
          setToken(localStorage.getItem(TOKEN_KEY) || 'cookie_authenticated');
        } else {
          setUser(null);
          setToken(null);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      if (response && response.success && response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        setToken(response.token);
        setUser(response.data);
        return { success: true, user: response.data };
      }
      throw new Error(response.message || 'Login failed.');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await authApi.register({ name, email, password });
      if (response && response.success && response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        setToken(response.token);
        setUser(response.data);
        return { success: true, user: response.data };
      }
      throw new Error(response.message || 'Registration failed.');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // non-fatal
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    isSubmitting,
    error,
    login,
    register,
    logout,
  };
}
