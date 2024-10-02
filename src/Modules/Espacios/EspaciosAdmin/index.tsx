import React, { useState, useEffect } from 'react';
import { Table, Button, message, Typography, Pagination } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { changeStatus, getListReservas } from "../../../Core/Services/ModulesRequest/EspaciosRequest";
import { SpinnerApp } from '../../../Core/Components/Spinner';

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

  const handleStatusChange = async (reservaId: number, newStatus: 'Aceptado' | 'Rechazado') => {
    try {
      await changeStatus(reservaId, { newStatus });
      message.success(`Reservacion ${newStatus.toLowerCase()}`);
      fetchReservas(reservas.currentPage, reservas.pageSize);
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
            onClick={() => handleStatusChange(record.reservaId, 'Aceptado')}
            disabled={record.status !== 'pendiente'}
            style={{ marginRight: 8 }}
          />
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => handleStatusChange(record.reservaId, 'Rechazado')}
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
    </div>
  );
};