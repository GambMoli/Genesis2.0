import { useState } from 'react';
import {
  HomeFilled,
  CalendarFilled,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  FileTextOutlined,
  BookOutlined,
  FormOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  ReadOutlined
} from '@ant-design/icons';
import './StyleHeader.css';
import Logo from '../../../assets/logo_udes.png';
import { Col, Row, Button, Drawer, Modal } from 'antd';
import { useNavigate, Link } from 'react-router-dom';

interface User {
  username: string;
  id: number
  role: string
}

export const Header = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  const handleNavigation = () => {
    navigate('/home');
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  }

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleLogout();
    setIsModalVisible(false);
    setDrawerVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Row className='container'>
      <Col>
        <img src={Logo} alt="Logo udes" className="LogoUdes" />
      </Col>

      <Row className='navBar'>
        <Col className='EspacioIzquierdo'>
          <Col>
            <Button className='BotonHome' onClick={handleNavigation}>
              <HomeFilled className='iconHome' />
            </Button>
          </Col>
          {user && <Col>Bienvenido, {user.username}</Col>}
          <Col><Link to="/inicio">Inicio</Link></Col>
          <Col><Link to="/documentacion">Documentación</Link></Col>
          <Col><Link to="/tutoriales">Tutoriales</Link></Col>
        </Col>

        <Col className='EspacioDerecho'>
          <Button className="hamburger-button" onClick={showDrawer} icon={<MenuOutlined />} />
        </Col>
      </Row>

      <Drawer
        title="Menu"
        placement="right"
        onClose={onClose}
        visible={drawerVisible}
      >
        <Col>Trámites académicos <FileTextOutlined /> </Col>
        <Col> Record de notas <BarChartOutlined /></Col>
        <Col> Plan de estudio <BookOutlined /></Col>
        <Col> Matrícula <FormOutlined /></Col>
        <Col> Horario <ClockCircleOutlined /></Col>
        <Col> Notas <BarChartOutlined /></Col>
        {user && (
          <>
            <Col> Tutoriales <ReadOutlined /></Col>
            <Col>Calendario <CalendarFilled className='iconCalendar' /> </Col>
            <Col> Notificaciones <BellOutlined className='iconBell' /></Col>
            <Col onClick={showModal} style={{ cursor: 'pointer' }}>
              Cerrar Sesión <UserOutlined className='iconUser' />
            </Col>
          </>
        )}
      </Drawer>

      <Modal
        title="Confirmación de Cerrar Sesión"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Aceptar"
        cancelText="Cancelar"
      >
        <p>¿Está seguro que desea cerrar sesión?</p>
      </Modal>
    </Row>
  );
};
