import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react';
import { getStadisticsReservation } from "../../Services/ModulesRequest/BibliotecaRequest";
import { SpinnerApp } from '../Spinner';
import { BookStats } from '../../Services/ModulesRequest/BibliotecaRequest';
import { Typography } from 'antd';
import './grafico.css'; 

export const Dashboard = () => {
  const [bookStats, setBookStats] = useState<BookStats | null>(null);
  const location = useLocation();
  const { Text } = Typography;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const bookId = searchParams.get('bookId');

    if (bookId) {
      getStadisticsReservation(Number(bookId)).then(data => {
        setBookStats(data);
      });
    }
  }, [location]);

  if (!bookStats) {
    return <><SpinnerApp /></>;
  }

  const reservationData = [
    { name: 'Reservas', value: bookStats.reservationCount },
    { name: 'Usuarios Únicos', value: bookStats.uniqueUsers },
  ];

  const formatDate = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'No hay datos disponibles';
  };

  const renderStatistic = (label: string, value: number, unit = '') => (
    <p>{label}: {value || value === 0 ? `${value}${unit}` : 'No hay datos disponibles'}</p>
  );

  const pieChartOptions = {
    title: {
      text: '',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Estadísticas',
        type: 'pie',
        radius: '50%',
        data: reservationData.map(item => ({
          value: item.value,
          name: item.name,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const formatAverageDuration = (duration: number) => {
    return Math.round(duration); 
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">{bookStats.nombre}</h1>

      <div className="dashboard-container2">

      <div className="dashboard-content ">
        <div className="dashboard-section">
          <h2 style={{textAlign: "center"}}>Información del Libro</h2>
          <img src={bookStats.imagen} alt={bookStats.nombre} className="book-image" />
          <div className="text-content">
            <Text strong>Autor: </Text><Text>{bookStats.autor}</Text>
            <Text strong>Descripcion: </Text><Text>{bookStats.descripcion}</Text>
            <Text strong>Estado: </Text><Text>{bookStats.availability}</Text>
            <Text strong>Disponible desde: </Text><Text>{formatDate(bookStats.createdAt)}</Text>
        </div>
      </div>

        <div className="dashboard-section" >
          <h2 style={{textAlign: "center"}}>Reservas y Usuarios Únicos</h2>
          <ReactEcharts option={pieChartOptions} className="chart-container" />
        </div>

        <div className="dashboard-section">
          <h2 style={{textAlign: "center"}}>Estadísticas de Reserva</h2>
          <div className="text-content">
            <Text strong>Ultima Reserva: </Text><Text>{formatDate(bookStats.lastReservation)}</Text>
            <Text strong>Ultimo en Reservar: </Text><Text>{bookStats.lastReservationUser}</Text>
            <Text strong>Estado Actual: </Text><Text>{bookStats.currentReservation ? 'Sí' : 'No'}</Text>
            <Text strong>Reservaciones en camino: </Text><Text>{bookStats.upcomingReservationsCount}</Text>
            <Text strong>Duracion promedio: </Text><Text>{formatAverageDuration(bookStats.averageReservationDurationHours)} horas</Text>
          </div>
        
        </div>

        <div className="dashboard-section">
          <h2 style={{textAlign: "center"}}>Usuario Más Frecuente</h2>
          {bookStats.mostFrequentUser.userId ? (
            <>
              <div className="text-content">
              <Text strong>{bookStats.mostFrequentUser.name}</Text>
              <Text>Número de Reservas: {bookStats.mostFrequentUser.reservationCount}</Text>
              </div>
            </>
          ) : (
            <p>No hay datos disponibles para el usuario más frecuente</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};