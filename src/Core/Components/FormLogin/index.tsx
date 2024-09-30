import React, { useState } from 'react';
import { Form, Input, Button, Typography, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postUsers } from '../../Services/ModulesRequest/LoginRequest';

const { Title, Text, Link } = Typography;

export const FormLogin: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: '', password: '' });
 
  const onFinish = async () => {
    try {
      const response = await postUsers(data);
      
      // Guarda los datos del usuario en el localStorage
      localStorage.setItem('user', JSON.stringify(response));
  
      if (!response.error) {
        navigate('/home');
      } else {
        message.error('Ocurrió un error al intentar iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Ocurrió un error al intentar iniciar sesión');
    }
  };
  

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      style={{ maxWidth: 400, margin: '0 auto', padding: 20, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', backgroundColor: '#fff' }}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Title level={3}>Ingreso de estudiantes</Title>

      <Form.Item
        label="Correo electrónico"
        name="email"
        rules={[
          { required: true, message: 'Por favor ingrese su correo electrónico' },
          { type: 'email', message: 'Por favor ingrese un correo electrónico válido' }
        ]}
      >
        <Input
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
      >
        <Input.Password
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block >
          Ingresar
        </Button>
        <Link href="#" style={{ float: 'right', marginTop: '10px' }}>
          Restaurar contraseña
        </Link>
      </Form.Item>

      <Divider />

      <Text type="secondary">
        <span style={{ fontSize: '16px', marginRight: '5px' }}>ℹ️</span>
        Para obtener la última versión de Génesis, recomendamos borrar caché de su navegador o presione Ctrl+R.
      </Text>

      <Divider />

      <Link href="#" style={{ display: 'block', marginTop: '10px' }}>
        📂 Tutoriales 📘 Manuales
      </Link>
    </Form>
  );
};
