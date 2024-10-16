import React, { useEffect, useState } from "react";
import { Table, Button, message, Tooltip } from "antd";
import { getReserva, ReservaResponse, ApiResponse } from "../../Services/ModulesRequest/LoginRequest";
import { format } from 'date-fns';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './styleInformacion.css';
import { SpinnerApp } from "../Spinner";
import { changeStatus } from "../../Services/ModulesRequest/EspaciosRequest";
import { ModalMessage } from '../ModalMessage';

interface PaginatedData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: ReservaResponse[];
}

export const InformacionReserva: React.FC<{ onEdit: (reservaId: number) => void }> = ({ onEdit }) => {
  const [reservaciones, setReservaciones] = useState<PaginatedData>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    data: []
  });
  const [loading, setLoading] = useState(true);
  
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(null);

  const fetchReserva = async (page: number, pageSize: number) => {
    setLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userId = user.id;

        if (userId) {
          const response: ApiResponse = await getReserva(userId, page, pageSize);
          if (response.success && response.data) {
            setReservaciones(response.data as unknown as PaginatedData);
          } else {
            throw new Error('Respuesta del servidor no válida');
          }
        } else {
          console.log('El usuario no tiene un ID');
        }
      } catch (error) {
        console.error('Error al obtener la reserva:', error);
        message.error('Error al cargar las reservas');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('No se encontró el usuario en localStorage');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReserva(1, 10);
  }, []);

  const handleModify = (reservaId: number) => {
    onEdit(reservaId);
  };

  const handleDelete = (reservaId: number) => {
    setSelectedReservaId(reservaId); 
    setModalVisible(true); 
  };

 
  const confirmDelete = async () => {
    if (selectedReservaId) {
      try {
        const response = await changeStatus(selectedReservaId, { newStatus: "cancelado" });
        if (response) {
          message.success('Reserva cancelada correctamente');
          fetchReserva(reservaciones.currentPage, reservaciones.pageSize); 
        } else {
          throw new Error('Error al cancelar la reserva');
        }
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        message.error('Error al cancelar la reserva');
      } finally {
        setModalVisible(false); 
        setSelectedReservaId(null); 
      }
    }
  };

  const cancelDelete = () => {
    setModalVisible(false); 
    setSelectedReservaId(null); 
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const rowClassName = (record: ReservaResponse) => {
    switch (record.status.toLowerCase()) {
      case 'aceptado':
        return 'row-aceptado';
      case 'pendiente':
        return 'row-pendiente';
      case 'rechazado':
        return 'row-rechazado';
      case 'cancelado':
        return 'row-cancelado';
      default:
        return '';
    }
  };

  const columns = [
    { title: 'Espacio', dataIndex: 'spaceName', key: 'spaceName' },
    { title: 'Razón', dataIndex: 'reason', key: 'reason' },
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
    { title: 'Estado', dataIndex: 'status', key: 'status' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record: ReservaResponse) => {
        const isEditDisabled = record.status.toLowerCase() !== 'pendiente';
        const isCancelDisabled = record.status.toLowerCase() === 'cancelado'; 
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Tooltip title={isEditDisabled ? "No se puede editar" : "Editar"}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleModify(record.reservaId)}
                disabled={isEditDisabled}
                style={{
                  backgroundColor: isEditDisabled ? '#d9d9d9' : '#28537e',
                  color: isEditDisabled ? 'rgba(0, 0, 0, 0.25)' : 'white',
                  border: 'none',
                }}
              />
            </Tooltip>
            <Tooltip title={isCancelDisabled ? "No se puede cancelar" : "Cancelar"}>
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.reservaId)}
                disabled={isCancelDisabled}
                danger
                style={{
                  backgroundColor: isCancelDisabled ? '#d9d9d9' : '#ff4d4f',
                  color: isCancelDisabled ? 'rgba(0, 0, 0, 0.25)' : 'white',
                  border: 'none',
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <SpinnerApp />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <Table
        columns={columns}
        dataSource={reservaciones.data}
        rowKey={(record) => record.reservaId}
        pagination={{
          total: reservaciones.totalItems,
          current: reservaciones.currentPage,
          pageSize: reservaciones.pageSize,
          onChange: (page, pageSize) => fetchReserva(page, pageSize),
        }}
        rowClassName={rowClassName}
      />

      
      <ModalMessage
        visible={modalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        title="Confirmar cancelación"
        message="¿Estás seguro de que deseas cancelar esta reserva?"
      />
    </div>
  );
};
