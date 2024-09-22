import React from 'react';
import { Header } from '../../Core/Components';
import { Row, Col, Card, Badge,Typography } from 'antd';
import { ReadOutlined, MessageOutlined, ProductOutlined, BookOutlined, MedicineBoxOutlined, SearchOutlined } from '@ant-design/icons';
import './StylePrincipalPage.css';
import { BotonesModulos } from '../../Core/Components/BotonesModulos';
import { TablaInformacion } from '../../Core/Components/TablaPrincipalPage';
const{Paragraph} = Typography;
export const Home: React.FC = () => {
  return (
    <Row className="ContenedorPrincipal" gutter={[16, 16]}>
      

      {/* Sección de Botones */}
      <Row className="SeccionBotones" gutter={[8, 8]}> {/* Reduce el gutter para menos espacio */}
        <Row className="botonesSuperior" gutter={[8, 8]} justify="start"> {/* Gutter reducido */}
          <Col span={8}>
            <BotonesModulos icon={<MessageOutlined className="iconsCustom" />} text="Mensajeria" />
          </Col>
          <Col span={8}>
            <BotonesModulos icon={<ProductOutlined className="iconsCustom" />} text="Espacios" />
          </Col>
          <Col span={8}>
            <BotonesModulos icon={<BookOutlined className="iconsCustom" />} text="Biblioteca" />
          </Col>
        </Row>
        
        <Row className="botonesInferior" gutter={[8, 8]} justify="start"> {/* Gutter reducido */}
          <Col span={8}>
            <BotonesModulos icon={<MedicineBoxOutlined className="iconsCustom" />} text="Excusas médicas" />
          </Col>
          <Col span={8}>
            <BotonesModulos icon={<SearchOutlined className="iconsCustom" />} text="Pasantías" />
          </Col>
        </Row>
      </Row>

      {/* Sección de Tabla */}
      <Row className="SeccionContainer" gutter={[16, 16]}>
        <Col span={24} className="SeccionTabla">
          <Paragraph className='ParrafoTabla'>Información académica</Paragraph>
          <TablaInformacion />
        </Col>
      
        {/* Sección Noticias */}
        <Col span={24} className="SeccionNoticias">
          <Card
            title={
              <div className="CardTitleCustom">
                <ReadOutlined /> Noticias<Badge count={1} className="ContadorNoticias" />
              </div>
            }
          >
            <Paragraph className='Parrafos'>
              Se han agregado 5 nuevos módulos a Génesis para mejorar la experiencia del usuario. Estos incluyen: "Mensajería", que permite a los estudiantes comunicarse con profesores y personal administrativo; "Reserva de espacios", para gestionar la reserva de espacios dentro de la universidad; "Biblioteca", que facilita la reserva y préstamo de libros; "Excusas médicas", que permite enviar excusas médicas directamente a los responsables; y "Pasantías", que ofrece opciones para encontrar y gestionar pasantías.
            </Paragraph>
          </Card>
        </Col>
      </Row>
</Row>

    
  );
};
