import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Заметки</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/">Мои заметки</Nav.Link>
                <Nav.Link as={Link} to="/notes/new">Создать заметку</Nav.Link>
                <Nav.Link as={Link} to="/categories">Категории</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
              </>
            )}
          </Nav>
          {isAuthenticated && (
            <Nav>
              <Navbar.Text className="me-3">
                Пользователь: {user?.username}
              </Navbar.Text>
              <Nav.Link onClick={handleLogout}>Выход</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation; 