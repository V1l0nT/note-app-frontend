import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const instance = axios.create({
  baseURL: 'https://noteapp-backend-xyqq.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для добавления токена к запросам
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик для обработки ошибок
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 