import React from 'react';
import { HomeFilled, CalendarFilled, BellOutlined, UserOutlined } from '@ant-design/icons';
import './StyleHeader.css';
import Logo from '../../../assets/logo_udes.png';
import { Col, Row, Button} from 'antd';

import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  
  const handleNavigation = () => {
    navigate('../../../Modules/PrincipalModules/index');
  }
  
  return (
    /*<div className='container'>*/
      <Row className='container'>
        <Col>
          <img src={Logo} alt="Logo udes" className="LogoUdes" />
        </Col>
       
        
          <Row className='navBar' >
            <Col className='EspacioIzquuierdo'>
            <Col><Button className='BotonHome' onClick={handleNavigation}><HomeFilled className='iconHome' /></Button></Col>
            <Col>Tramites academicos</Col>
            <Col>Record de notas</Col>
            <Col>Plan de estudio</Col>
            <Col>Matrícula</Col>
            <Col>Horario</Col>
            <Col>Notas</Col>
            </Col>
            <Col className='EspacioDerecho'>
            <Col>Tutoriales</Col>
            <Col><CalendarFilled className='iconCalendar' /></Col>
            <Col><BellOutlined className='iconBell' /></Col>
            <Col><UserOutlined className='iconUser' />Sesion de la persona</Col>
            </Col>
          </Row>
          
      </Row>
    //</div>
  );
}