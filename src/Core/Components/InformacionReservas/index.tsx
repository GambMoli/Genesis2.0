import React, { useEffect, useState } from "react";
import { getReserva, ReservaResponse, ApiResponse } from "../../Services/ModulesRequest/LoginRequest";
import { format } from 'date-fns';
import { Typography, Pagination, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import './styleInformacion.css'

const { Text } = Typography;

export const InformacionReserva: React.FC = () => {
  const [reservaciones, setReservaciones] = useState<ReservaResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const reservationsPerPage = 4;

  useEffect(() => {
    const fetchReserva = async () => {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      console.log('Usuario almacenado:', storedUser);
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

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aceptado':
        return { backgroundColor: '#e6ffed', borderColor: '#b7eb8f' };
      case 'pendiente':
        return { backgroundColor: '#fffbe6', borderColor: '#ffe58f' };
      case 'rechazado':
        return { backgroundColor: '#fff1f0', borderColor: '#ffa39e' };
      default:
        return {};
    }
  };

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = reservaciones.slice(indexOfFirstReservation, indexOfLastReservation);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }

  return (
    <>
      <div className="reservaciones-container">
        {currentReservations.map((reserva) => (
          <div
            key={reserva.details.reservaId}
            className="reservacion-item"
            style={{
              ...getStatusStyle(reserva.details.status),
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '10px'
            }}
          >
            <br />
            <Text className="textoInfo"> {reserva.details.spaceName}</Text>
            <br />
            <Text><strong>Razón: </strong> {reserva.details.reason}</Text>
            <br />
            <Text><strong>Fecha de inicio: </strong> {format(new Date(reserva.details.startDate), "dd/MM/yyyy")}</Text>
            <br />
            <Text><strong>Fecha de fin: </strong> {format(new Date(reserva.details.endDate), "dd/MM/yyyy")}</Text>
            <br />
            <Text><strong>Estado: </strong> {reserva.details.status}</Text>
          </div>
        ))}
      </div>
      {reservaciones.length > 0 && (
        <Pagination
          current={currentPage}
          total={reservaciones.length}
          pageSize={reservationsPerPage}
          onChange={onPageChange}
          style={{ marginTop: '20px', textAlign: 'center' }}
        />
      )}
    </>
  );
};