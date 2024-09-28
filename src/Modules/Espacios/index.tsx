import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { Button,Modal, Typography } from "antd";
import './StyleEspacios.css'
const {Title,Paragraph}=Typography;

export const Espacios: React.FC = () => {
  const[isModalOpen,SetModalOpen]=useState(false);
  const showModal = () => {
    SetModalOpen(true);
  };

  const handleOk = () => {
    SetModalOpen(false);
  };

  const handleCancel = () => {
    SetModalOpen(false);
  };

  return (
    <>
      <div className='MainContainer'>
        <div className='ModulosDeInformacion'>
          <Title>PEPEPEP</Title>
        </div>

      
      <div className='BotonAgregar'>
        <Paragraph className='TituloDeReserva'>Reservar: </Paragraph><Button className='Boton' onClick={showModal}>
        <PlusOutlined />
        </Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      </div>
      </div>
    </>
  );
};
