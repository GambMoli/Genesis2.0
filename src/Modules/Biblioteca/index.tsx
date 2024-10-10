/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Input, Button, Typography, Row, Col, Card, Space, Pagination, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import './BibliotecaStyle.css';
import { Reserva } from '../../Core/Components/ModalReserva';
import { getBooks } from '../../Core/Services/ModulesRequest/BibliotecaRequest';
import { SpinnerApp } from '../../Core/Components/Spinner';
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

export const Biblioteca: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 8;

  useEffect(() => {
    fetchBooks();
  }, [currentPage]);

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
    navigate('/HistorialBiblioteca')
  }

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
          <Button type="primary" size="large" style={{ backgroundColor: '#28537e' }} onClick={navigateHistorial}>Ver Historial</Button>
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
                      <Reserva bookId={book.id} />
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