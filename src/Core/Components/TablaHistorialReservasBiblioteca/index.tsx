import React, { useEffect, useState } from "react";
import { Table, Button, message, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './styleHistorial.css';
import { SpinnerApp } from "../Spinner";
import { GetHistorialReservaciones, DetailsReserva } from "../../Services/ModulesRequest/BibliotecaRequest";
import { format } from 'date-fns';

interface PaginatedData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: DetailsReserva[];
}

export const HistorialReservacionesBiblioteca: React.FC<{ onEdit: (reservaId: number) => void }> = ({ onEdit }) => {
  const [reservaciones, setReservaciones] = useState<PaginatedData>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    data: []
  });
  const [loading, setLoading] = useState(true);

  const fetchReserva = async (page: number, pageSize: number) => {
    setLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userId = user.id;

        if (userId) {
          const response = await GetHistorialReservaciones(userId, page, pageSize);
          
          // Verifica la respuesta de la API
          console.log('Response:', response); // Agregado para depurar
  
          if (response.success) {
            // Asegúrate de que los datos tienen la estructura correcta
            console.log('Datos de la reserva:', response.data); // Verifica aquí que response.data sea el objeto correcto
            
            // Asegúrate de que totalItems y totalPages son correctos
            setReservaciones({
              totalItems: response.data.totalItems, // Usar el total que devuelve la API
              currentPage: page,
              pageSize,
              totalPages: response.data.totalPages,
              data: response.data.reservations.map((item) => ({
                libro_nombre: item.libro_nombre,
                libro_autor: item.libro_autor,
                fecha_inicio: item.fecha_inicio,
                fecha_fin: item.fecha_fin,
                estado: item.estado,
                reserva_id: item.reserva_id,
              }))
            });
          } else {
            throw new Error('Datos no válidos o no es un array');
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

  const handleTableChange = (pagination: any) => {
    fetchReserva(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Libro',
      dataIndex: 'libro_nombre',
      key: 'libro_nombre',
      render: (text: string) => text, // Simplemente devolver el texto
    },
    {
      title: 'Autor',
      dataIndex: 'libro_autor',
      key: 'libro_autor',
      render: (text: string) => text,
    },
    {
      title: 'Fecha de Inicio',
      dataIndex: 'fecha_inicio',
      key: 'fecha_inicio',
      render: (text: string) => format(new Date(text), 'dd/MM/yyyy'),
    },
    {
      title: 'Fecha de Fin',
      dataIndex: 'fecha_fin',
      key: 'fecha_fin',
      render: (text: string) => format(new Date(text), 'dd/MM/yyyy'),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (text: string) => text,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: DetailsReserva) => (
        <div>
          <Tooltip title="Editar">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record.reserva_id)} 
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button icon={<DeleteOutlined />} danger />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="historial-reservaciones">
      {loading ? (
        <SpinnerApp />
      ) : (
        <Table
          columns={columns}
          dataSource={reservaciones.data}
          pagination={{
            current: reservaciones.currentPage,
            pageSize: reservaciones.pageSize,
            total: reservaciones.totalItems,
          }}
          onChange={handleTableChange}
          rowKey="reserva_id"
          style={{ width: '100%', margin: '0 auto' ,marginTop:'30px'}}      
        />
      )}
    </div>
  );
};
