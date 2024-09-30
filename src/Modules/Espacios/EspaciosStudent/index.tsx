import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Select, DatePicker, Input, Form, message, Spin } from "antd";
import './StyleEspacios.css';
import { InformacionReserva } from '../../../Core/Components/InformacionReservas';
import { getEspacios, postReserva } from '../../../Core/Services/ModulesRequest/LoginRequest';

const { RangePicker } = DatePicker;
const { Title } = Typography;

type Espacio = {
  id: string;
  nombre: string;
};

export const EspaciosStudent: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({ espacioId: '', reason: '', startDate: '', endDate: '' });
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(false);

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
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      };

      try {
        const response = await postReserva(reservaData);
        if (response) {
          message.success("Reserva creada con éxito");
          localStorage.setItem('fecha', JSON.stringify(response));
          setModalOpen(false);
          // Reload the page
          window.location.reload();
        }
      } catch (error) {
        console.error("Error al hacer la reserva", error);
        message.error("Error al hacer la reserva. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    } else {
      message.error("No se ha encontrado el usuario.");
      setLoading(false);
    }
  };

  const showModal = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleSpaceChange = (value: string) => {
    setData({ ...data, espacioId: value });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setData({
        ...data,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
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
          <Title level={2} className='Titulodelmodulo'>Historial de Reservas</Title>
          <div className='ReservacionesContainer'>
            <InformacionReserva />
          </div>
        </div>

        <div className='BotonAgregarContainer'>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal} className='BotonAgregar'>
            Reservar
          </Button>
        </div>

        <Modal title="Nueva Reserva" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="spaceId"
              label="Seleccionar espacio"
              rules={[{ required: true, message: 'Por favor, seleccione un espacio' }]}
            >
              <Select placeholder="Seleccione un espacio" onChange={handleSpaceChange}>
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
                value={data.reason}
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
                {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : 'Reservar'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};