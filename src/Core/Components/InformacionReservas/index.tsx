import React, { useEffect, useState } from "react";
import { getReserva, ReservaResponse, ApiResponse } from "../../Services/ModulesRequest/LoginRequest";
import { format } from 'date-fns';
import { Typography } from "antd";
import './styleInformacion.css'
const { Text } = Typography;

export const InformacionReserva: React.FC = () => {
  const [reservaciones, setReservaciones] = useState<ReservaResponse[]>([]);

  useEffect(() => {
    const fetchReserva = async () => {
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
        }
      } else {
        console.log('No se encontró el usuario en localStorage');
      }
    };

    fetchReserva();
  }, []);

  return (
    <>
      <div className="reservaciones-container">
        {reservaciones.map((reserva) => (
          <div key={reserva.details.reservaId} className="reservacion-item">
            <br />
            <Text className="textoInfo"> {reserva.details.spaceName}</Text>
            <br />
            <Text><strong>Razón: </strong> {reserva.details.reason}</Text>
            <br />
            <Text><strong>Fecha de inicio: </strong> {format(new Date(reserva.details.startDate), "MM/dd/yyyy")}</Text>
            <br />
            <Text><strong>Fecha de fin: </strong> {format(new Date(reserva.details.endDate), "MM/dd/yyyy")}</Text>
          </div>
        ))}
      </div>
    </>
    
  );
};