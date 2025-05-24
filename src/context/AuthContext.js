import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      // Здесь можно добавить запрос для получения информации о пользователе
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/auth/login', { username, password });
      const { token, username: user, roles } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ username: user, roles });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Ошибка входа:', error);
      return false;
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post('/auth/register', { username, password });
      const { token, username: user, roles } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ username: user, roles });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 