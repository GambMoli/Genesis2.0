import React, { useEffect, useState } from "react";
import { Table, Button, message, Tooltip,  Modal, Form, DatePicker } from "antd";
import { EditOutlined, StopOutlined } from '@ant-design/icons';
import './styleHistorial.css';
import { SpinnerApp } from "../Spinner";
import { GetHistorialReservaciones, DetailsReserva, updateReserveStatus, modifyReserve } from "../../Services/ModulesRequest/BibliotecaRequest";
import { format } from 'date-fns';
import { ModalMessage } from "../ModalMessage";

interface PaginatedData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: DetailsReserva[];
}


export const HistorialReservacionesBiblioteca: React.FC<{ onEdit: (reservaId: number) => void }> = () => {
  const [reservaciones, setReservaciones] = useState<PaginatedData>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    data: []
  });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // Nuevo estado para el modal de edición
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(null);
  const [editForm] = Form.useForm(); // Formulario de edición

  const fetchReserva = async (page: number, pageSize: number) => {
    setLoading(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userId = user.id;

        if (userId) {
          const response = await GetHistorialReservaciones(userId, page, pageSize);

          if (response.success) {
            setReservaciones({
              totalItems: response.data.totalItems,
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

  const handleDelete = (reservaId: number) => {
    setSelectedReservaId(reservaId); 
    setModalVisible(true); 
  };

  const confirmDelete = async () => {
    if (selectedReservaId) {
      try {
        const response = await updateReserveStatus(selectedReservaId, { status: "cancelada" });
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

  const handleEdit = (reservaId: number) => {
    setSelectedReservaId(reservaId); 
    setEditModalVisible(true); 
  };

  const editConfirm = async () => {
    try {
      const values = await editForm.validateFields();
      if (selectedReservaId) {
        const response = await modifyReserve(selectedReservaId, {
          userId: JSON.parse(localStorage.getItem('user') || '{}').id,
          newStartDate: values.newStartDate.format('YYYY-MM-DD'),
          newEndDate: values.newEndDate.format('YYYY-MM-DD'),
        });
        if (response) {
          message.success('Reserva modificada correctamente');
          fetchReserva(reservaciones.currentPage, reservaciones.pageSize);
        } else {
          throw new Error('Error al modificar la reserva');
        }
      }
    } catch (error) {
      console.error('Error al modificar la reserva:', error);
      message.error('Error al modificar la reserva');
    } finally {
      setEditModalVisible(false); 
      setSelectedReservaId(null); 
    }
  };

  const cancelEdit = () => {
    setEditModalVisible(false); 
    setSelectedReservaId(null); 
  };

  const rowClassName = (record: DetailsReserva) => {
    const estado = record.estado.toLowerCase();
    switch (estado) {
      case 'activa':
        return 'row-aceptado';
      case 'pendiente':
        return 'row-pendiente';
      case 'finalizada':
        return 'row-rechazado';
      case 'cancelada':
        return 'row-cancelada';
      default:
        return '';
    }
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
      render: (_: any, record: DetailsReserva) => {
        const isEditDisabled = record.estado.toLowerCase() !== 'pendiente';
        const isCancelDisabled = record.estado.toLowerCase() === 'cancelada'; 
        return (
          <div>
            <Tooltip title={isEditDisabled ? "No se puede editar" : "Editar"}>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record.reserva_id)}
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
                icon={<StopOutlined /> }
                onClick={() => handleDelete(record.reserva_id)}
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
          rowClassName={rowClassName}
          style={{ width: '100%', margin: '0 auto', marginTop: '30px' }}
        />
      )}

      <ModalMessage
        visible={modalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        title="Confirmar cancelación"
        message="¿Estás seguro de que deseas cancelar esta reserva?"
      />

<Modal
  visible={editModalVisible}
  onOk={editConfirm}
  onCancel={cancelEdit}
  title="Modificar Reserva"
  okText="Guardar"
  cancelText="Cancelar"
>
  <Form form={editForm}>
    <Form.Item
      name="newStartDate"
      label="Nueva Fecha de Inicio"
      rules={[{ required: true, message: 'Selecciona la nueva fecha de inicio' }]}
    >
      <DatePicker />
    </Form.Item>
    <Form.Item
      name="newEndDate"
      label="Nueva Fecha de Fin"
      rules={[{ required: true, message: 'Selecciona la nueva fecha de fin' }]}
    >
      <DatePicker />
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};
