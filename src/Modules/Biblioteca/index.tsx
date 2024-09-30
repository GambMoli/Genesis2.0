import React from 'react';
import { Input, Button, Typography, Row, Col, Card, Space } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import './BibliotecaStyle.css';

const { Search } = Input;
const { Title, Text } = Typography;

export const Biblioteca: React.FC = () => {

  const books = [
    { id: 1, title: "Libro 1", imageUrl: "https://m.media-amazon.com/images/I/61tXxIFVJuL._SY445_SX342_.jpg", isPdfAvailable: true },
    { id: 2, title: "Libro 2", imageUrl: "https://m.media-amazon.com/images/I/41eXGpjXJ5L._SY445_SX342_.jpg", isPdfAvailable: false },
    { id: 3, title: "Libro 3", imageUrl: "https://m.media-amazon.com/images/I/61tXxIFVJuL._SY445_SX342_.jpg", isPdfAvailable: true },
    { id: 4, title: "Libro 4", imageUrl: "https://m.media-amazon.com/images/I/41eXGpjXJ5L._SY445_SX342_.jpg", isPdfAvailable: false },
    { id: 5, title: "Libro 1", imageUrl: "https://m.media-amazon.com/images/I/61tXxIFVJuL._SY445_SX342_.jpg", isPdfAvailable: true },
    { id: 6, title: "Libro 2", imageUrl: "https://m.media-amazon.com/images/I/41eXGpjXJ5L._SY445_SX342_.jpg", isPdfAvailable: false },
    { id: 7, title: "Libro 3", imageUrl: "https://m.media-amazon.com/images/I/61tXxIFVJuL._SY445_SX342_.jpg", isPdfAvailable: true },
    { id: 8, title: "Libro 4", imageUrl: "https://m.media-amazon.com/images/I/41eXGpjXJ5L._SY445_SX342_.jpg", isPdfAvailable: false },
    
  ];

  return (
    <div className='MainContainerBiblioteca'>
      <div className='ContenedorBiblioteca'>
        <div className='SearchBox'>
          <Search 
            placeholder="Buscar en la biblioteca" 
            allowClear 
            enterButton="Buscar" 
            size="large"
          />
        </div>
        <div className='Reservas'>
          <Button type="primary" size="large">Ver Historial</Button>
        </div>
      </div>
      <div className='Libros'>
        <Title>Libros disponibles en Biblioteca</Title>
        <br></br>
        <Row gutter={[40, 40]} justify="center">
          {books.map(book => (
            <Col key={book.id}>
              <Card
                hoverable
                className="book-card"
                cover={<img alt={book.title} src={book.imageUrl} className="book-image" />}
              >
                <Space direction="vertical" size="small" className="book-content">
                  <Title level={4}>{book.title}</Title>
                  <Button type="primary" block>
                    RESERVAR
                  </Button>
                  <Text type="secondary" className="pdf-availability">
                    {book.isPdfAvailable ? (
                      <>
                        <FilePdfOutlined /> PDF disponible
                      </>
                    ) : (
                      'PDF no disponible'
                    )}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};