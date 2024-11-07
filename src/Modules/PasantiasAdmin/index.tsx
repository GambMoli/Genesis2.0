import React, { useState } from 'react';
import { Input, Button, Typography, Card, Table, Modal, Form, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface PasantiasI {
  id: number;
  titulo: string;
  descripcion: string;
  salario: string;
  empresa: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fecha_postulacion: string;
  nombre_usuario: string;
}

export const PasantiasAdmin: React.FC = () => {
  const [internships, setInternships] = useState<PasantiasI[]>([
    {
      id: 1,
      titulo: 'Desarrollador Backend',
      descripcion: 'Se requiere desarrollador backend con experiencia en Node.js',
      salario: '3000 USD',
      empresa: 'Acme Corp',
      estado: 'pendiente',
      fecha_postulacion: '2024-11-07',
      nombre_usuario: 'Juan Perez'
    },
    {
      id: 2,
      titulo: 'Diseñador UI/UX',
      descripcion: 'Buscamos diseñador UI/UX con conocimientos en Figma',
      salario: '2500 USD',
      empresa: 'Globex Inc',
      estado: 'aprobada',
      fecha_postulacion: '2024-11-06',
      nombre_usuario: 'Maria Gonzalez'
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa',
      key: 'empresa',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Fecha de Postulación',
      dataIndex: 'fecha_postulacion',
      key: 'fecha_postulacion',
    },
    {
      title: 'Usuario',
      dataIndex: 'nombre_usuario',
      key: 'nombre_usuario',
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    const newInternship: PasantiasI = {
      id: internships.length + 1,
      titulo: values.titulo,
      descripcion: values.descripcion,
      salario: values.salario,
      empresa: values.empresa,
      estado: 'pendiente',
      fecha_postulacion: new Date() .toLocaleDateString(),
      nombre_usuario: 'Luis Vergel', 
    };

    setInternships([...internships, newInternship]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Pasantia Agregada con satisfaccion');
  };

  return (
    <div className="MainContainerExcusas">
      <Card>
        <div className="header-container">
          <Title level={2}>Pasantias Para Aplicar</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Agregar Pasantia
          </Button>
        </div>
        <Table dataSource={internships} columns={columns} rowKey="id" />
      </Card>

      <Modal
        title="Agregar Pasantia"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="titulo"
            label="Titulo"
            rules={[{ required: true, message: 'Ingresar Titulo' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="descripcion"
            label="Descripcion"
            rules={[{ required: true, message: 'Ingresar Titulo' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="salario"
            label="Salario"
            rules={[{ required: true, message: 'Ingresar Titulo' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="empresa"
            label="Empresa"
            rules={[{ required: true, message: 'Ingresar Titulo' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};