import React, { useState, useEffect } from 'react'; 
import { Table, Button, message, Typography, Pagination } from 'antd';
import { CheckOutlined, StopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { SpinnerApp } from '../../../Core/Components/Spinner';
import { ModalMessage } from '../../../Core/Components/ModalMessage';
import { getallReservations,updateReserveStatus} from '../../../Core/Services/ModulesRequest/BibliotecaRequest';
getallReservations
const { Title } = Typography;

interface Reserva {
  reservaId: number;
  libro_nombre: string;
  libro_autor: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  status?: string;
}

interface PaginatedData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: Reserva[];
}




export const BibliotecaHistorialAdmin: React.FC = () => {
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
      const response = await getallReservations(page, pageSize);
  
      if (response.success) {
        const formattedReservations = response.data.reservations.map((reservation: any) => ({
          reservaId: reservation.reservaId,
          libro_nombre: reservation.book.bookName,
          libro_autor: reservation.book.bookAuthor,
          fecha_inicio: reservation.startDate,
          fecha_fin: reservation.endDate,
          estado: reservation.status
        }));
  
        setReservas({
          currentPage: page, 
          pageSize: pageSize, 
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
          data: formattedReservations
        });
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
        await updateReserveStatus(selectedReserva.reservaId, { status: modalConfig.newStatus });
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

  const showModal = (reserva: Reserva, status: 'activa' | 'finalizada') => {
    const config = {
      activa: {
        title: "Confirmar activación",
        message: "¿Estás seguro de activar esta reserva?",
        icon: <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
        newStatus: 'activa',  
      },
      finalizada: {
        title: "Confirmar finalización",
        message: "¿Estás seguro de finalizar esta reserva?",
        icon: <CloseCircleOutlined style={{ fontSize: '48px', color: '#f5222d' }} />,
        newStatus: 'finalizada',  
      }
    }[status];
  
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
    {
      title: 'Libro',
      dataIndex: 'libro_nombre',
      key: 'libro_nombre',
      render: (text: string) => text, 
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
      render: (text: string) => formatDate(text),
    },
    {
      title: 'Fecha de Fin',
      dataIndex: 'fecha_fin',
      key: 'fecha_fin',
      render: (text: string) => formatDate(text),
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
      render: (record: Reserva) => (
        <>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => showModal(record, 'activa')}
            disabled={record.estado !== 'pendiente'}
            style={{ marginRight: 8 }}
          />
          <Button
            danger
            icon={<StopOutlined />}
            onClick={() => showModal(record, 'finalizada')}
            disabled={record.estado !== 'pendiente'}
          />
        </>
      ),
    },
  ];
  const rowClassName = (record: Reserva) => {
    switch (record.estado.toLowerCase()) {  // Asegúrate de usar 'estado'
      case 'activa':
        return 'row-aceptado';
      case 'pendiente':
        return 'row-pendiente';
      case 'finalizada':
        return 'row-rechazado';
      case 'cancelada':
        return 'row-cancelado';
      case 'rechazado':
        return 'row-rechazado';
      default:
        return '';
    }
  };
  
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
        Reservas de Libros
      </Title>
      <>
        <Table
          columns={columns}
          dataSource={reservas.data}
          rowKey={(record) => record.reservaId}
          rowClassName={rowClassName} 
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
