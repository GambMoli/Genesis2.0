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
import { Col, Row, Button, Drawer } from 'antd';
import { useNavigate, Link } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const user = localStorage.getItem('user');

  const handleNavigation = () => {
    navigate('/home');
  }

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <Row className='container'>
      <Col>
        <img src={Logo} alt="Logo udes" className="LogoUdes" />
      </Col>

      <Row className='navBar'>
        <Col className='EspacioIzquierdo'>
          <Col><Button className='BotonHome' onClick={handleNavigation}><HomeFilled className='iconHome' /></Button></Col>
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
            <Col> Sesión de la persona <UserOutlined className='iconUser' /></Col>
          </>
        )}
      </Drawer>
    </Row>
  );
};