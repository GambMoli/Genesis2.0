/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactEcharts from 'echarts-for-react'; // Importa ReactEcharts para usar ECharts
import { getStadisticsReservation } from "../../Services/ModulesRequest/BibliotecaRequest";
import { SpinnerApp } from '../Spinner';
import { BookStats } from '../../Services/ModulesRequest/BibliotecaRequest';
import { Typography } from 'antd';


export const Dashboard = () => {
  const [bookStats, setBookStats] = useState<BookStats | null>(null);

  const location = useLocation();

  const { Text } = Typography

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const bookId = searchParams.get('bookId');

    if (bookId) {
      getStadisticsReservation(Number(bookId)).then(data => {
        //@ts-ignore
        setBookStats(data);
      });
    }
  }, [location]);

  if (!bookStats) {
    return <><SpinnerApp /></>;
  }

  const reservationData = [
    //@ts-ignore
    { name: 'Reservas', value: bookStats.reservationCount },
    //@ts-ignore
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
      text: 'Reservas y Usuarios Únicos',
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

  return (
    <div style={{ width: "80%", margin: "0 auto", marginTop: "30px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>{bookStats.nombre}</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>

        <div style={{ width: '40%', marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
          <h2>Información del Libro</h2>
          <img src={bookStats.imagen} alt={bookStats.nombre} style={{ maxWidth: '150px', marginBottom: '10px' }} />

          <Text>
            {bookStats.autor}
          </Text>

          <Text>
            {bookStats.descripcion}
          </Text>

          <Text>
            {bookStats.availability}
          </Text>

          <Text>
            {formatDate(bookStats.createdAt)}
          </Text>

        </div>

        <div style={{ width: '40%', marginBottom: '20px', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2>Reservas y Usuarios Únicos</h2>
          <ReactEcharts option={pieChartOptions} style={{ height: '300px', width: '100%' }} />
        </div>

        <div style={{ width: '40%', marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
          <h2>Estadísticas de Reserva</h2>
          <Text>
            {formatDate(bookStats.lastReservation)}
          </Text>

          <Text>
            {bookStats.lastReservationUser}
          </Text>

          <Text>
            {bookStats.currentReservation ? 'Sí' : 'No'}
          </Text>

          {renderStatistic('Reservas Futuras', bookStats.upcomingReservationsCount)}
          {renderStatistic('Duración Promedio de Reserva', bookStats.averageReservationDurationHours, ' horas')}
        </div>

        <div style={{ width: '40%', marginBottom: '20px', padding: '15px', borderRadius: '8px' }}>
          <h2>Usuario Más Frecuente</h2>
          {bookStats.mostFrequentUser.userId ? (
            <>
              <Text>
                {bookStats.mostFrequentUser.name}
              </Text>
              {renderStatistic('Número de Reservas', bookStats.mostFrequentUser.reservationCount)}
            </>
          ) : (
            <p>No hay datos disponibles para el usuario más frecuente</p>
          )}
        </div>
      </div>
    </div>
  );
};
