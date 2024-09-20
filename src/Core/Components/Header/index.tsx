import React from 'react'
import { HomeFilled,CalendarFilled,BellOutlined,UserOutlined  } from '@ant-design/icons';
import './StyleHeader.css'
import Logo from '../../../assets/logo_udes.png'
import  { Col, Row,Flex,Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate= useNavigate();
  const handlenavigation=()=> {
  navigate('../../../Modules/PrincipalModules/index')
}
  return (
    <div className='container'>
      <img src={Logo} alt="Logo udes" className="LogoUdes" />
      <Row className='navBar'>
        <Flex gap={"large"} className='EspacioIzquierdo'>
          <Col><Button className='BotonHome' onClick={handlenavigation}><HomeFilled className='iconHome' /></Button></Col>
          <Col>Tramites academicos</Col>
          <Col>Record de notas</Col>
          <Col>Plan de estudio</Col>
          <Col>Matrícula</Col>
          <Col>Horario</Col>
          <Col>Notas</Col>
        </Flex>
        <Flex gap={"large"}>
          <Col>Tutoriales</Col>
          <Col> <CalendarFilled className='iconCalendar' /></Col>
          <Col><BellOutlined className='iconBell' /></Col>
          <Col><UserOutlined className='iconUser' />Sesion de la persona</Col>
        </Flex>
      </Row>

    </div>
  );
}
