import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Пароли не совпадают');
    }

    try {
      setError('');
      setLoading(true);
      const success = await register(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Не удалось создать аккаунт. Возможно, имя пользователя уже занято.');
      }
    } catch (error) {
      setError('Произошла ошибка при регистрации.');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Регистрация</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button
              className="w-100"
              type="submit"
              disabled={loading}
            >
              Зарегистрироваться
            </Button>
          </Form>
          <div className="text-center mt-3">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Register; 