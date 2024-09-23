import { HomeFilled, CalendarFilled, BellOutlined, UserOutlined } from '@ant-design/icons';
import './StyleHeader.css';
import Logo from '../../../assets/logo_udes.png';
import { Col, Row, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem('user');

  const handleNavigation = () => {
    navigate('/home');
  }

  return (
    <Row className='container'>
      <Col>
        <img src={Logo} alt="Logo udes" className="LogoUdes" />
      </Col>

      <Row className='navBar'>
        <Col className='EspacioIzquierdo'>

          <Col><Button className='BotonHome' onClick={handleNavigation}><HomeFilled className='iconHome' /></Button></Col>
          <Col>Inicio</Col>
          <Col>Documentación</Col>
          <Col>Tutoriales</Col>


          {user && (
            <>
              <Col>Trámites académicos</Col>
              <Col>Record de notas</Col>
              <Col>Plan de estudio</Col>
              <Col>Matrícula</Col>
              <Col>Horario</Col>
              <Col>Notas</Col>
            </>
          )}
        </Col>


        {user && (
          <Col className='EspacioDerecho'>
            <Col>Tutoriales</Col>
            <Col><CalendarFilled className='iconCalendar' /></Col>
            <Col><BellOutlined className='iconBell' /></Col>
            <Col><UserOutlined className='iconUser' />Sesión de la persona</Col>
          </Col>
        )}
      </Row>
    </Row>
  );
};
