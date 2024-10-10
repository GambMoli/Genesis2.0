/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, DatePicker, Typography, message, Space } from 'antd';
import { reserveBookService } from '../../Services/ModulesRequest/BibliotecaRequest';
import dayjs from 'dayjs';

const { Title } = Typography;

interface ReservaProps {
  bookId: number;
}

interface User {
  username: string;
  role: string;
  id: number;
}

interface ReserveResponse {
  success: boolean;
  message: string;
}

export const Reserva: React.FC<ReservaProps> = ({ bookId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user: User = JSON.parse(userString);
        setUserId(user.id);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: unknown) => {
    if (!userId) {
      message.error('User ID not found. Please log in again.');
      return;
    }

    try {
      console.log('Form values:', values); // Debugging line
      const formValues = values as { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs };
      const { startDate, endDate } = formValues;
      console.log('Start date:', startDate, 'End date:', endDate); // Debugging line

      const reserveData = {
        bookId: bookId,
        userId: userId,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD')
      };

      const response = await reserveBookService(reserveData);
      const reserveResponse = response as unknown as ReserveResponse;

      if (reserveResponse.success) {
        message.success('Libro reservado correctamente.');
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error(reserveResponse.message);
      }
    } catch (error) {

      message.error('Libro disponible para las fechas seleccionadas');

    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={{ backgroundColor: '#28537e' }}>
        Reserva
      </Button>
      <Modal
        title="Reserva"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Reservar"
        cancelText="Cancelar"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Title level={4}>Selecciona las fechas:</Title>
          <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Form.Item
              name="startDate"
              rules={[{ required: true, message: 'Por favor seleccione la fecha de inicio' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                placeholder="Fecha de inicio"
              />
            </Form.Item>
            <Form.Item
              name="endDate"
              rules={[{ required: true, message: 'Por favor seleccione la fecha de fin' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                placeholder="Fecha de fin"
              />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};