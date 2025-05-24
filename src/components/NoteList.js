import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/notes');
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      setError('Ошибка при загрузке заметок');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
      try {
        await axios.delete(`/notes/${id}`);
        setNotes(notes.filter(note => note.id !== id));
      } catch (error) {
        setError('Ошибка при удалении заметки');
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/notes/search?query=${searchQuery}`);
      setNotes(response.data);
    } catch (error) {
      setError('Ошибка при поиске заметок');
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Мои заметки</h2>
        <Button as={Link} to="/notes/new" variant="primary">
          Создать заметку
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Поиск заметок..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="outline-secondary">
                Поиск
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {notes.length === 0 ? (
        <div className="text-center">
          <p>У вас пока нет заметок</p>
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Заголовок</th>
              <th>Категория</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id}>
                <td>{note.title}</td>
                <td>{note.category?.name || 'Без категории'}</td>
                <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/notes/${note.id}/edit`)}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default NoteList; 