import React, { useState, useEffect } from 'react';
import { Table, Button, message, Typography, Pagination } from 'antd';
import { CheckOutlined, CloseOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { changeStatus, getListReservas } from "../../../Core/Services/ModulesRequest/EspaciosRequest";
import { SpinnerApp } from '../../../Core/Components/Spinner';
import { ModalMessage } from '../../../Core/Components/ModalMessage';

const { Title } = Typography;

interface Reserva {
  reservaId: number;
  spaceName: string;
  userName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface PaginatedData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: Reserva[];
}

interface ApiResponse {
  success: boolean;
  data: PaginatedData;
}

export const EspaciosAdmin: React.FC = () => {
  const [reservas, setReservas] = useState<PaginatedData>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    data: []
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [modalConfig, setModalConfig] = useState<{ title: string; message: string; icon: React.ReactNode; newStatus: string } | null>(null);

  useEffect(() => {
    fetchReservas(1, 10);
  }, []);

  const fetchReservas = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getListReservas(page, pageSize);
      const typedResponse = response as ApiResponse;
      if (typedResponse.success) {
        setReservas(typedResponse.data);
      }
    } catch (error) {
      console.error("Error fetching reservas:", error);
      message.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (selectedReserva && modalConfig) {
      try {
        await changeStatus(selectedReserva.reservaId, { newStatus: modalConfig.newStatus });
        message.success(`Reservación ${modalConfig.newStatus.toLowerCase()}`);
        fetchReservas(reservas.currentPage, reservas.pageSize);
      } catch (error) {
        console.error("Error changing status:", error);
        message.error("Failed to change reservation status");
      } finally {
        setModalVisible(false);
      }
    }
  };

  const showModal = (reserva: Reserva, newStatus: 'Aceptado' | 'Rechazado') => {
    const config = {
      Aceptado: {
        title: "Confirmar aceptación",
        message: "¿Estás seguro de aceptar esta reserva?",
        icon: <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
        newStatus: 'Aceptado',
      },
      Rechazado: {
        title: "Confirmar rechazo",
        message: "¿Estás seguro de rechazar esta reserva?",
        icon: <CloseCircleOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
        newStatus: 'Rechazado por admin'
      }
    }[newStatus];

    setModalConfig(config);
    setSelectedReserva(reserva);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const columns = [
    { title: 'Espacio', dataIndex: 'spaceName', key: 'spaceName' },
    { title: 'Nombre reservador', dataIndex: 'userName', key: 'userName' },
    {
      title: 'Fecha de inicio',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Fecha fin',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => formatDate(date)
    },
    { title: 'Razon', dataIndex: 'reason', key: 'reason' },
    { title: 'Estado', dataIndex: 'status', key: 'status' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record: Reserva) => (
        <>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => showModal(record, 'Aceptado')}
            disabled={record.status !== 'pendiente'}
            style={{ marginRight: 8 }}
          />
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => showModal(record, 'Rechazado')}
            disabled={record.status !== 'pendiente'}
          />
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <SpinnerApp />
      </div>
    );
  }

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <Title style={{ fontSize: "24px" }}>
        Reservas de espacios
      </Title>
      <>
        <Table
          columns={columns}
          dataSource={reservas.data}
          rowKey={(record) => record.reservaId}
          pagination={false}
        />
        <Pagination
          total={reservas.totalItems}
          current={reservas.currentPage}
          pageSize={reservas.pageSize}
          onChange={(page, pageSize) => fetchReservas(page, pageSize)}
          style={{ marginTop: '20px', textAlign: 'right' }}
        />
      </>
      {modalConfig && (
        <ModalMessage
          visible={modalVisible}
          onOk={handleStatusChange}
          onCancel={() => setModalVisible(false)}
          icon={modalConfig.icon}
          title={modalConfig.title}
          message={modalConfig.message}
        />
      )}
    </div>
  );
};
