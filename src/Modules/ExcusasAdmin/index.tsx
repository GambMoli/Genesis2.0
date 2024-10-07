import React, { useState } from 'react';
import { Button, Typography, Card, Table, Modal, message, Space } from 'antd';
import { DownloadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import "./ExcusasAdStyle.css"

const { Title } = Typography;

type EstadoExcusa = 'Pendiente' | 'Aceptada' | 'Rechazada';

interface ExcusaMedica {
  id: number;
  estudiante: string;
  asignatura: string;
  tutor: string;
  razon: string;
  fecha: string;
  estado: EstadoExcusa;
  archivo: string;
}

export const ExcusasAdmin: React.FC = () => {
  const [excusas, setExcusas] = useState<ExcusaMedica[]>([
    { id: 1, estudiante: 'Juan Pérez', asignatura: 'Proyecto Integrador II', tutor: 'Profesor. García', razon: 'Gripe', fecha: '2024-03-15', estado: 'Pendiente', archivo: 'excusa1.pdf' },
    { id: 2, estudiante: 'María López', asignatura: 'Patrones de Diseño', tutor: 'Profesora. Rodríguez', razon: 'Cita médica', fecha: '2024-03-20', estado: 'Pendiente', archivo: 'excusa2.pdf' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExcusa, setSelectedExcusa] = useState<ExcusaMedica | null>(null);
  const [action, setAction] = useState<'aceptar' | 'rechazar' | null>(null);

  const showModal = (excusa: ExcusaMedica, action: 'aceptar' | 'rechazar') => {
    setSelectedExcusa(excusa);
    setAction(action);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedExcusa(null);
    setAction(null);
  };

  const handleConfirm = () => {
    if (selectedExcusa && action) {
      const updatedExcusas: ExcusaMedica[] = excusas.map(excusa =>
        excusa.id === selectedExcusa.id
          ? { ...excusa, estado: action === 'aceptar' ? 'Aceptada' : 'Rechazada' }
          : excusa
      );
      setExcusas(updatedExcusas);
      message.success(`Excusa médica ${action === 'aceptar' ? 'aceptada' : 'rechazada'} con éxito`);
      handleCancel();
    }
  };

  const handleDownload = () => {
    const driveLink = 'https://drive.google.com/file/d/1JHRyZIG6i4Zh3_mpaSVM7IAyXON9z4JT/view?usp=sharing';
    window.open(driveLink, '_blank');
  };

  const columns = [
    {
      title: 'Estudiante',
      dataIndex: 'estudiante',
      key: 'estudiante',
    },
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
      title: 'Acciones',
      key: 'acciones',
      render: (_: unknown, record: ExcusaMedica) => (
        <Space size="middle">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Ver PDF
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => showModal(record, 'aceptar')}
            disabled={record.estado !== 'Pendiente'}
          >
            Aceptar
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => showModal(record, 'rechazar')}
            disabled={record.estado !== 'Pendiente'}
          >
            Rechazar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="MainContainerAdminExcusas">
      <div className="ContainerAdminExcusas">
        <Card>
          <div className="header-container">
            <Title level={2}>Gestion de Excusas Médicas</Title>
          </div>
          <Table dataSource={excusas} columns={columns} rowKey="id" />
        </Card>
      </div>

      <Modal
        title={`Confirmar acción: ${action === 'aceptar' ? 'Aceptar' : 'Rechazar'} excusa médica`}
        visible={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>¿Está seguro que desea {action === 'aceptar' ? 'aceptar' : 'rechazar'} la excusa médica de {selectedExcusa?.estudiante}?</p>
      </Modal>
    </div>
  );
};