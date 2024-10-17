/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Input, Button, Typography, Row, Col, Card, Space, Pagination, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import './BibliotecaStyle.css';
import { Reserva } from '../../../Core/Components/ModalReserva';
import { getBooks } from '../../../Core/Services/ModulesRequest/BibliotecaRequest';
import { SpinnerApp } from '../../../Core/Components/Spinner';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Title, Text, Link } = Typography;

interface Book {
  id: number;
  nombre: string;
  autor: string;
  imagen: string;
  pdf_blob: string;
  descripcion: string;
  disponible: number;
}

interface User {
  username: string;
  role: string;
  id: number;
}

export const Biblioteca: React.FC = () => {
  const navigate = useNavigate(); // Hook de navegación
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>(''); // Almacenar el rol del usuario
  const pageSize = 8;

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user: User = JSON.parse(userString);
        setUserRole(user.role); // Guardar el rol del usuario
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks(currentPage, pageSize);
      //@ts-ignore
      setBooks(response.books);
      //@ts-ignore
      setTotalBooks(response.total);
    } catch (error) {
      message.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const navigateHistorial = () => {
    navigate('/HistorialBiblioteca');
  };

  const handleStatisticsClick = (bookId: number) => {
    navigate(`/dashboard?bookId=${bookId}`);
  };

  return (
    <div className='MainContainerBiblioteca'>
      <div className='ContenedorBiblioteca'>
        <div className='SearchBox'>
          <Search
            placeholder="Buscar en la biblioteca"
            allowClear
            enterButton={<Button className="custom-search-button" style={{ backgroundColor: '#28537e', color: 'white', fontWeight: 'bold' }}>Buscar</Button>}
            size="large"
          />
        </div>
        <div className='Reservas'>
          {userRole === 'Profesor' ? (
            <div></div>
          ) : (
            <Button type="primary" size="large" style={{ backgroundColor: '#28537e' }} onClick={navigateHistorial}>Ver Historial</Button>
          )}

        </div>
      </div>
      <div className='Libros'>
        <Title>Libros disponibles en Biblioteca</Title>
        <br />
        {loading ? (
          <SpinnerApp />
        ) : (
          <>
            <Row gutter={[40, 40]} justify="center">
              {books.map(book => (
                <Col key={book.id}>
                  <Card
                    hoverable
                    className="book-card"
                    cover={<img alt={book.nombre} src={book.imagen} className="book-image" />}
                  >
                    <Space direction="vertical" size="small" className="book-content">
                      <Title level={4}>{book.nombre}</Title>
                      <Text>{book.autor}</Text>

                      {userRole === 'Profesor' ? (
                        <Button onClick={() => handleStatisticsClick(book.id)} type="primary">
                          Ver Estadísticas
                        </Button>
                      ) : (
                        <Reserva bookId={book.id} />
                      )}
                      <Text type="secondary" className="pdf-availability">
                        {book.pdf_blob ? (
                          <Link href={book.pdf_blob} target="_blank" rel="noopener noreferrer">
                            <FilePdfOutlined /> PDF disponible
                          </Link>
                        ) : (
                          'PDF no disponible'
                        )}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              total={totalBooks}
              pageSize={pageSize}
              onChange={handlePageChange}
              style={{ marginTop: '20px', textAlign: 'center' }}
            />
          </>
        )}
      </div>
    </div>
  );
};
