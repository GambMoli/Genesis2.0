import React, { useState } from 'react';
import { Button, Form, Modal,DatePicker,Typography } from 'antd';
const { RangePicker } = DatePicker;
const {Title}=Typography;
export const Reserva: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} style={{backgroundColor:'#28537e'}}>
        Reserva
      </Button>
      <Modal title="Reserva" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={false} >
        <Form layout="vertical">
            <Form.Item>
                <Title level={4}>Selecciona la fecha:</Title>
            <RangePicker style={{width:'100%'}} />
            <div className='BotonReserva'>
            <Button style={{width:'100%', marginTop:'12px', backgroundColor:'#28537e' , color:'white', fontWeight:'bold'}}>Reservar</Button>
            </div>
            </Form.Item>
        </Form>
      </Modal>
    </>
  );
};