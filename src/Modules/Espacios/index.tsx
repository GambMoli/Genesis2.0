import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Button, Modal, Typography, Select, DatePicker, Input, Form, message } from "antd";
import './StyleEspacios.css';
import { InformacionReserva } from '../../Core/Components/InformacionReservas';
import { getEspacios, postReserva } from '../../Core/Services/ModulesRequest/LoginRequest';

const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

type Espacio = {
  id: string;
  nombre: string;
};

export const Espacios: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({ espacioId: '', reason: '', startDate: '', endDate: '' });
  const [espacios, setEspacios] = useState<Espacio[]>([]);

 
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
        }
      } catch (error) {
        console.error("Error al hacer la reserva", error);
        message.error("Error al hacer la reserva. Inténtalo de nuevo.");
      }
    } else {
      message.error("No se ha encontrado el usuario.");
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
      <div className='ModulosDeInformacion'>
        <Paragraph className='Titulodelmodulo'>Historial de Reservas</Paragraph>
        <InformacionReserva />
      </div>

      <Form layout="vertical" >
        <div className='BotonAgregar'>
          <Paragraph className='TituloDeReserva'>Reservar: </Paragraph>
          <Button className='Boton' onClick={showModal}>
            <PlusOutlined />
          </Button>
        </div>

        <Modal title="Nueva Reserva" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <div className='ModalContent'>
            <div className='ModalItem'>
              <Paragraph className='TituloDeReserva'>Seleccionar espacio: </Paragraph>
              <Form.Item
                name="spaceId"
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
            </div>

            <div className='ModalItem'>
              <Paragraph className='TituloDeReserva'>Razón: </Paragraph>
              <Form.Item
                name="reason"
                rules={[{ required: true, message: 'Por favor, ingrese la razón de la reserva' }]}
              >
                <Input
                  placeholder="Escribe la razón de la reserva"
                  value={data.reason}
                  onChange={handleReasonChange}
                />
              </Form.Item>
            </div>

            <div className='ModalItem'>
              <Paragraph className='TituloDeReserva'>Rango de tiempo:</Paragraph>
              <Form.Item
                name="RangoTiempo"
                rules={[{ required: true, message: 'Por favor, seleccione un rango de tiempo' }]}
              >
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  onChange={handleDateChange}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block onClick={onFinish}>
                Reservar
              </Button>
            </Form.Item>
          </div>
        </Modal>
      </Form>
    </div>
  );
};
