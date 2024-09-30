import React, { useState, useEffect } from 'react';
import { Table, Button, message, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { changeStatus, getListReservas } from "../../../Core/Services/ModulesRequest/EspaciosRequest";

const { Title } = Typography;

interface Reserva {
  details: {
    reservaId: number;
    spaceName: string;
    userName: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Reserva[];
}

export const EspaciosAdmin: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    setLoading(true);
    try {
      const response = await getListReservas();
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

  const handleStatusChange = async (reservaId: number, newStatus: 'Aceptado' | 'Rechazado') => {
    try {
      await changeStatus(reservaId, { newStatus });
      message.success(`Reservacion ${newStatus.toLowerCase()}`);
      fetchReservas();
    } catch (error) {
      console.error("Error changing status:", error);
      message.error("Failed to change reservation status");
    }
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
    { title: 'Espacio', dataIndex: ['details', 'spaceName'], key: 'spaceName' },
    { title: 'Nombre reservador', dataIndex: ['details', 'userName'], key: 'userName' },
    {
      title: 'Fecha de inicio',
      dataIndex: ['details', 'startDate'],
      key: 'startDate',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Fecha fin',
      dataIndex: ['details', 'endDate'],
      key: 'endDate',
      render: (date: string) => formatDate(date)
    },
    { title: 'Razon', dataIndex: ['details', 'reason'], key: 'reason' },
    { title: 'Estado', dataIndex: ['details', 'status'], key: 'status' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record: Reserva) => (
        <>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleStatusChange(record.details.reservaId, 'Aceptado')}
            disabled={record.details.status !== 'pendiente'}
            style={{ marginRight: 8 }}
          />
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleStatusChange(record.details.reservaId, 'Rechazado')}
            disabled={record.details.status !== 'pendiente'}
          />
        </>
      ),
    },
  ];

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <Title style={{ fontSize: "24px" }}>
        Reservas de espacios
      </Title>
      <Table
        columns={columns}
        dataSource={reservas}
        rowKey={(record) => record.details.reservaId}
        loading={loading}
      />
    </div>
  );
};