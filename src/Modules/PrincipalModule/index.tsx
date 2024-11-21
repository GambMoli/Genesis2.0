import React from 'react';
import { Row, Col, Card, Badge, Typography } from 'antd';
import {
  ReadOutlined,
  ProductOutlined,
  BookOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  FormOutlined,
} from '@ant-design/icons';
import './StylePrincipalPage.css';
import { BotonesModulos } from '../../Core/Components/BotonesModulos';
import { TablaInformacion } from '../../Core/Components/TablaPrincipalPage';
import { useNavigate } from 'react-router-dom';

const { Paragraph } = Typography;

// Función para obtener el rol del usuario desde localStorage
const getUserRoleFromLocalStorage = (): string | null => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    return user.role;
  }
  return null;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Obtener el rol del usuario usando la función
  const userRole = getUserRoleFromLocalStorage() || 'Estudiante';

  // Función para obtener los módulos según el rol
  const obtenerModulosPorRol = (role: string) => {
    switch (role) {
      case 'Estudiante':
        return [
          { icon: <ProductOutlined className="iconsCustom" />, text: 'Espacios', route: '/Espacios' },
          { icon: <BookOutlined className="iconsCustom" />, text: 'Biblioteca', route: '/Biblioteca' },
          { icon: <FileTextOutlined className="iconsCustom" />, text: 'Notas y Asistencias', route: '/Notasist' },
          { icon: <MedicineBoxOutlined className="iconsCustom" />, text: 'Excusas médicas', route: '/Excusas' },
          { icon: <SearchOutlined className="iconsCustom" />, text: 'Pasantías', route: '/Pasantias' },
          { icon: <ClockCircleOutlined className="iconsCustom" />, text: 'Horario', route: '/Horario' },
          { icon: <ScheduleOutlined className="iconsCustom" />, text: 'Plan de Estudio', route: '/PlanDeEstudio' },
          { icon: <FormOutlined className="iconsCustom" />, text: 'Matrícula', route: '/Matricular' },
        ];

      case 'Profesor':
        return [
          { icon: <BookOutlined className="iconsCustom" />, text: 'Biblioteca', route: '/Biblioteca' },
        ];

      case 'Administrativo':
        return [
          { icon: <BookOutlined className="iconsCustom" />, text: 'Biblioteca', route: '/Biblioteca' },
          { icon: <ProductOutlined className="iconsCustom" />, text: 'Espacios', route: '/Espacios' },
          { icon: <MedicineBoxOutlined className="iconsCustom" />, text: 'Excusas médicas', route: '/Excusas' },
        ];

      case 'Empresa':
        return [
          { icon: <SearchOutlined className="iconsCustom" />, text: 'Pasantías', route: '/Pasantias' },
        ];

      default:
        return [];
    }
  };

  // Obtener los módulos para el rol actual
  const modulosFiltrados = obtenerModulosPorRol(userRole);

  return (
    <div className="MainContainer">
      <Row className="ContenedorPrincipal">
        {/* Sección de Botones */}
        <Row className="SeccionBotones">
          {modulosFiltrados.map((modulo, index) => (
            <Col span={7} key={index}>
              <BotonesModulos
                icon={modulo.icon}
                text={modulo.text}
                onClick={() => navigate(modulo.route)}
              />
            </Col>
          ))}
        </Row>

        {/* Sección de Tabla */}
        <Row className="SeccionContainer">
          <Col span={24} className="SeccionTabla">
            <Paragraph className="ParrafoTabla">Información académica</Paragraph>
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
              <Paragraph className="Parrafos">
                Se han agregado 4 nuevos módulos a Génesis para mejorar la experiencia del usuario.
                Estos incluyen: "Mensajería", que permite a los estudiantes comunicarse con profesores
                y personal administrativo; "Reserva de espacios", para gestionar la reserva de espacios
                dentro de la universidad; "Biblioteca", que facilita la reserva y préstamo de libros;
                "Excusas médicas", que permite enviar excusas médicas directamente a los responsables; y
                "Pasantías", que ofrece opciones para encontrar y gestionar pasantías.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Row>
    </div>
  );
};
