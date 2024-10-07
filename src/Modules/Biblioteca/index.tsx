import React from 'react';
import { Input, Button, Typography, Row, Col, Card, Space, } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import './BibliotecaStyle.css';
import { Reserva } from '../../Core/Components/ModalReserva';

const { Search } = Input;
const { Title, Text,Link} = Typography;

export const Biblioteca: React.FC = () => {

  const books = [
    { id: 1, title: "Codigo Limpio", imageUrl: "https://image.cdn1.buscalibre.com/574bdd57a4da2bb0418b4567.__RS360x360__.jpg", isPdfAvailable: true ,url:'https://elhacker.info/manuales/Lenguajes%20de%20Programacion/Codigo%20limpio%20-%20Robert%20Cecil%20Martin.pdf'},
    { id: 2, title: "El limpador de codigo", imageUrl: "https://m.media-amazon.com/images/I/71pLkmX3xiL._SY466_.jpg", isPdfAvailable: false },
    { id: 3, title: "Curso de Programación", imageUrl: "https://m.media-amazon.com/images/I/41QZlp5HvaL._SY445_SX342_.jpg", isPdfAvailable: true ,url:'https://www.bibliadelprogramador.com/2016/07/fundamentos-de-programacion-para.html'},
    { id: 4, title: "Programación Python", imageUrl: "https://m.media-amazon.com/images/I/61IFdPA+sLL._SY466_.jpg", isPdfAvailable: false },
    { id: 5, title: "Curso de Java", imageUrl: "https://m.media-amazon.com/images/I/41sNkwAz+FL._SY445_SX342_.jpg", isPdfAvailable: true, url:'https://anayamultimedia.es/libro/manuales-imprescindibles/curso-de-programacion-java-mariona-nadal-9788441543249/' },
    { id: 6, title: "Curso React", imageUrl: "https://m.media-amazon.com/images/I/41iWaCDPICL._SX342_SY445_.jpg", isPdfAvailable: false },
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
            enterButton={<Button className="custom-search-button" style={{backgroundColor:'#28537e',color:'white',fontWeight:'bold'}}>Buscar</Button>}
            size="large"
        />
        </div>
        <div className='Reservas'>
          <Button type="primary" size="large" style={{ backgroundColor:'#28537e'}}>Ver Historial</Button>
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
                  <Reserva></Reserva>
                  <Text type="secondary" className="pdf-availability">
                    {book.isPdfAvailable ? (
                      <>
                       <Link href={book.url} target="_blank" rel="noopener noreferrer">
                        <FilePdfOutlined /> PDF disponible
                      </Link>

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