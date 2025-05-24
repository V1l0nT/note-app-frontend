import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';

function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchNote();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/categories');
      setCategories(response.data);
    } catch (error) {
      setError('Ошибка при загрузке категорий');
    }
  };

  const fetchNote = async () => {
    try {
      const response = await axios.get(`/notes/${id}`);
      const note = response.data;
      setTitle(note.title);
      setContent(note.content);
      setCategoryId(note.category?.id || '');
    } catch (error) {
      setError('Ошибка при загрузке заметки');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const noteData = {
        title,
        content,
        category: categoryId ? { id: categoryId } : null
      };

      if (isEditing) {
        await axios.put(`/notes/${id}`, noteData);
      } else {
        await axios.post('/notes', noteData);
      }

      navigate('/');
    } catch (error) {
      setError('Ошибка при сохранении заметки');
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '800px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">
            {isEditing ? 'Редактировать заметку' : 'Создать заметку'}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Заголовок</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Категория</Form.Label>
              <Form.Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Без категории</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Содержание</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                {isEditing ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NoteForm; 