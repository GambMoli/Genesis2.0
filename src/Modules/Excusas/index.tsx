import React, { useState } from 'react';
import { Input, Button, Typography, Row, Col, Card, Space, Table, Modal, Form, Select, DatePicker, Upload, message} from 'antd';
import { FilePdfOutlined, PlusOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import "./ExcusasStyle.css"

const { Title } = Typography;
const { Option } = Select;

interface ExcusaMedica {
  id: number;
  asignatura: string;
  tutor: string;
  razon: string;
  fecha: string;
  estado: 'Validada' | 'Rechazada' | 'En espera';
  archivo: string;
}

export const Excusas: React.FC = () => {
  const [excusas, setExcusas] = useState<ExcusaMedica[]>([
    { id: 1, asignatura: 'Proyecto Integrador II', tutor: 'Juan Pérez', razon: 'Gripe', fecha: '2024-03-15', estado: 'Validada', archivo: 'excusa1.pdf' },
    { id: 2, asignatura: 'Gestion Contable', tutor: 'María López', razon: 'Cita médica', fecha: '2024-03-20', estado: 'En espera', archivo: 'excusa2.pdf' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Asignatura',
      dataIndex: 'asignatura',
      key: 'asignatura',
    },
    {
      title: 'Tutor',
      dataIndex: 'tutor',
      key: 'tutor',
    },
    {
      title: 'Razón',
      dataIndex: 'razon',
      key: 'razon',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Archivo',
      dataIndex: 'archivo',
      key: 'archivo',
      render: (text: string) => (
        <Button icon={<FilePdfOutlined />} type="link">
          {text}
        </Button>
      ),
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
    const newExcusa: ExcusaMedica = {
      id: excusas.length + 1,
      asignatura: values.asignatura,
      tutor: values.tutor,
      razon: values.razon,
      fecha: values.fecha.format('YYYY-MM-DD'),
      estado: 'En espera',
      archivo: values.archivo.file.name,
    };

    setExcusas([...excusas, newExcusa]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('Excusa médica agregada con éxito');
  };

  return (
    <div className="MainContainerExcusas">
      <div className="ContainerExcusas">
        <Card>
          <div className="header-container">
            <Title level={2}>Excusas Médicas</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Agregar Excusa Médica</Button>
          </div>
          <Table dataSource={excusas} columns={columns} rowKey="id" />
        </Card>
      </div>
      

      <Modal
        title="Agregar Excusa Médica"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="asignatura"
            label="Asignatura"
            rules={[{ required: true, message: 'Por favor seleccione la asignatura' }]}
          >
            <Select placeholder="Seleccione la asignatura">
              <Option value="Matemáticas">Matemáticas</Option>
              <Option value="Física">Física</Option>
              <Option value="Química">Química</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="tutor"
            label="Tutor"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del tutor' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="razon"
            label="Razón de la falta"
            rules={[{ required: true, message: 'Por favor ingrese la razón de la falta' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="fecha"
            label="Fecha de la falta"
            rules={[{ required: true, message: 'Por favor seleccione la fecha de la falta' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="archivo"
            label="Excusa médica (PDF)"
            rules={[{ required: true, message: 'Por favor suba la excusa médica en PDF' }]}
          >
            <Upload accept=".pdf" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Subir PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};