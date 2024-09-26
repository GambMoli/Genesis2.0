import React, { useEffect } from 'react';
import { Typography, Row, Col } from 'antd';
import { loginTexts } from '../Strings/Login';
import { FormLogin } from '../../Core/Components';
import { Footer } from '../../Core/Components';
import './Login.css';
const { Title, Paragraph } = Typography;
import { getUsers } from '../../Core/Services/ModulesRequest/LoginRequest';

export const Login: React.FC = () => {

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="login-container">
        <Row gutter={[16, 16]} className="login-wrapper">
          <Col xs={24} md={14} className="login-info">
            <Title>{loginTexts.title}</Title>
            <Paragraph>{loginTexts.paragraph1}</Paragraph>
            <Paragraph>{loginTexts.paragraph2}</Paragraph>
            <div className="extra-link">
              <Paragraph>Para inscribirse como aspirante haga <a href="#">clic aquí</a></Paragraph>
            </div>
          </Col>
          <Col xs={24} md={10} className="login-form">
            <FormLogin />
          </Col>
        </Row>
      </div>
      <Footer />

    </>

  );
};
