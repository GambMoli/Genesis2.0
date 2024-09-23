import React from 'react';
import { Form, Input, Button, Typography, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

export const FormLogin: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: { username: string; password: string }) => {
    localStorage.setItem('user', values.username);
    message.success('Inicio de sesión exitoso');
    navigate('/home');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        label="Usuario"
        name="username"
        rules={[{ required: true, message: 'Por favor ingrese su usuario' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
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
