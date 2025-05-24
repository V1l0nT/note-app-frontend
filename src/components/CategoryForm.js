import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function CategoryForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`/api/categories/${id}`);
      const category = response.data;
      setName(category.name);
      setDescription(category.description);
    } catch (error) {
      setError('Ошибка при загрузке категории');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const categoryData = {
        name,
        description
      };

      if (isEditing) {
        await axios.put(`/api/categories/${id}`, categoryData);
      } else {
        await axios.post('/api/categories', categoryData);
      }

      navigate('/categories');
    } catch (error) {
      setError('Ошибка при сохранении категории');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center">
      <Card style={{ width: '600px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">
            {isEditing ? 'Редактировать категорию' : 'Создать категорию'}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={() => navigate('/categories')}
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

export default CategoryForm; 