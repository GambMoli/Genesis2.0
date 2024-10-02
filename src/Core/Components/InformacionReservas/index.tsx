import React, { useEffect, useState } from "react";
import { Table, Button, message, Spin } from "antd";
import { getReserva, ReservaResponse, ApiResponse } from "../../Services/ModulesRequest/LoginRequest";
import { format } from 'date-fns';
import { LoadingOutlined } from '@ant-design/icons';
import './styleInformacion.css';



export const InformacionReserva: React.FC = () => {
  const [reservaciones, setReservaciones] = useState<ReservaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReserva = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const userId = user.id;

          if (userId) {
            const response: ApiResponse = await getReserva(userId);
            setReservaciones(response.data);
          } else {
            console.log('El usuario no tiene un ID');
          }
        } catch (error) {
          console.error('Error al obtener la reserva:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No se encontró el usuario en localStorage');
        setLoading(false);
      }
    };

    fetchReserva();
  }, []);

  const handleModify = (reservaId: number) => {
    message.info(`Modificar reserva con ID: ${reservaId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  const rowClassName = (record: ReservaResponse) => {
    switch (record.details.status.toLowerCase()) {
      case 'aceptado':
        return 'row-aceptado';
      case 'pendiente':
        return 'row-pendiente';
      case 'rechazado':
        return 'row-rechazado';
      default:
        return '';
    }
  };

  const columns = [
    { title: 'Espacio', dataIndex: ['details', 'spaceName'], key: 'spaceName' },
    { title: 'Razón', dataIndex: ['details', 'reason'], key: 'reason' },
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
    { title: 'Estado', dataIndex: ['details', 'status'], key: 'status' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record: ReservaResponse) => (
        <Button
          type="primary"
          onClick={() => handleModify(record.details.reservaId)}
          disabled={record.details.status.toLowerCase() !== 'pendiente'}
          style={{backgroundColor:'#28537e',color:'white',fontWeight:'bold'}}
        >
          Modificar
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', padding: '20px' }}>  
     
      <Table
        columns={columns}
        dataSource={reservaciones}
        rowKey={(record) => record.details.reservaId}
        pagination={{ pageSize: 4 }}
        rowClassName={rowClassName}
        
        
      />
    </div>
  );
};
