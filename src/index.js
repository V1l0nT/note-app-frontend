import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Обработка ошибок
const handleError = (error) => {
  console.error('Application Error:', error);
  root.render(
    <div className="container mt-5">
      <h1>Что-то пошло не так</h1>
      <p>Пожалуйста, обновите страницу или попробуйте позже.</p>
    </div>
  );
};

// Запуск приложения с обработкой ошибок
try {
  renderApp();
} catch (error) {
  handleError(error);
}

// Обработка необработанных ошибок
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global Error:', { message, source, lineno, colno, error });
  handleError(error);
}; 