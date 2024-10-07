/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Select, DatePicker, Input, Form, message, Spin } from "antd";
import moment from 'moment';
import './StyleEspacios.css';
import { InformacionReserva } from '../../../Core/Components/InformacionReservas';
import { getEspacios, postReserva } from '../../../Core/Services/ModulesRequest/LoginRequest';
import { detailsReserve, editReserva } from '../../../Core/Services/ModulesRequest/EspaciosRequest';

const { RangePicker } = DatePicker;
const { Title } = Typography;

type Espacio = {
  id: string;
  nombre: string;
};

interface ReservaDetail {
  reservaId: number;
  space: {
    spaceId: number;
    spaceName: string;
  };
  userName: string;
  userId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export const EspaciosStudent: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({ espacioId: '', reason: '', startDate: '', endDate: '' });
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchEspacios = async () => {
      try {
        const response = await getEspacios();
        setEspacios(response);
      } catch (error) {
        console.error("Error al obtener espacios:", error);
      }
    };
    fetchEspacios();
  }, []);

  const onFinish = async () => {
    setLoading(true);
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.id;

      const reservaData = {
        spaceId: data.espacioId,
        userId,
        startDate: moment(data.startDate).format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment(data.endDate).format('YYYY-MM-DDTHH:mm:ss'),
        reason: data.reason,
      };

      try {
        let response;
        if (isEditing && editingId) {
          response = await editReserva(editingId, {
            userId,
            newSpaceId: parseInt(data.espacioId),
            newStartDate: moment(data.startDate).format('YYYY-MM-DDTHH:mm:ss'),
            newEndDate: moment(data.endDate).format('YYYY-MM-DDTHH:mm:ss'),
            newReason: data.reason
          });
        } else {
          response = await postReserva(reservaData);
        }

        if (response) {
          message.success(isEditing ? "Reserva actualizada con éxito" : "Reserva creada con éxito");
          setModalOpen(false);

          // Esperar 1 segundo antes de recargar la página
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Retraso de 1 segundo
        }
      } catch (error) {
        console.error(isEditing ? "Error al actualizar la reserva" : "Error al hacer la reserva", error);
        message.error(isEditing ? "Error al actualizar la reserva. Inténtalo de nuevo." : "Error al hacer la reserva. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    } else {
      message.error("No se ha encontrado el usuario.");
      setLoading(false);
    }
  };

  const showModal = (reservaId?: number) => {
    if (reservaId) {
      setIsEditing(true);
      setEditingId(reservaId);
      fetchReservaDetails(reservaId);
    } else {
      setIsEditing(false);
      setEditingId(null);
      form.resetFields();
    }
    setModalOpen(true);
  };

  const fetchReservaDetails = async (reservaId: number) => {
    try {
      const response = await detailsReserve(reservaId);
      if (response.data) {
        //@ts-expect-error
        const reservaDetail: ReservaDetail = response.data;
        setData({
          espacioId: reservaDetail.space.spaceId.toString(),
          reason: reservaDetail.reason,
          startDate: reservaDetail.startDate,
          endDate: reservaDetail.endDate
        });


        const espacioExiste = espacios.some(
          espacio => espacio.id === reservaDetail.space.spaceId.toString()
        );

        if (!espacioExiste) {
          setEspacios(prevEspacios => [...prevEspacios, {
            id: reservaDetail.space.spaceId.toString(),
            nombre: reservaDetail.space.spaceName
          }]);
        }


        form.setFieldsValue({
          spaceId: reservaDetail.space.spaceId.toString(),
          reason: reservaDetail.reason,
          dateRange: [
            moment(reservaDetail.startDate),
            moment(reservaDetail.endDate)
          ]
        });
      }
    } catch (error) {
      console.error("Error al obtener detalles de la reserva:", error);
      message.error("Error al cargar los detalles de la reserva");
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const handleSpaceChange = (value: string) => {
    setData({ ...data, espacioId: value });
  };

  const handleDateChange = (dates: unknown, dateStrings: [string, string]) => {
    if (dates) {
      setData({
        ...data,
        startDate: moment(dateStrings[0]).format('YYYY-MM-DDTHH:mm:ss'),
        endDate: moment(dateStrings[1]).format('YYYY-MM-DDTHH:mm:ss'),
      });
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, reason: e.target.value });
  };

  return (
    <div className='MainContainer'>
      <div className='ContenedorPrincipalEspaciosStudent'>
        <div className='ModulosDeInformacion'>
          <div className='BotonAgregarContainer'>
            <Title level={2} className='Titulodelmodulo'>Historial de Reservas</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              className='BotonAgregar'
              style={{ backgroundColor: '#28537e', color: 'white', fontWeight: 'bold' }}
            >
              Reservar
            </Button>
          </div>
          <div className='ReservacionesContainer'>
            <InformacionReserva onEdit={showModal} />
          </div>
        </div>

        <Modal
          title={isEditing ? "Editar Reserva" : "Nueva Reserva"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="spaceId"
              label="Seleccionar espacio"
              rules={[{ required: true, message: 'Por favor, seleccione un espacio' }]}
            >
              <Select
                placeholder="Seleccione un espacio"
                onChange={handleSpaceChange}
                optionFilterProp="children"
              >
                {espacios.map((espacio) => (
                  <Select.Option key={espacio.id} value={espacio.id}>
                    {espacio.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="reason"
              label="Razón"
              rules={[{ required: true, message: 'Por favor, ingrese la razón de la reserva' }]}
            >
              <Input
                placeholder="Escribe la razón de la reserva"
                onChange={handleReasonChange}
              />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Rango de tiempo"
              rules={[{ required: true, message: 'Por favor, seleccione un rango de tiempo' }]}
            >
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                onChange={handleDateChange}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={loading}>
                {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : (isEditing ? 'Actualizar' : 'Reservar')}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};