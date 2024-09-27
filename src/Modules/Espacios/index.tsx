import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { Button } from "antd";
import './StyleEspacios.css'
export const Espacios: React.FC = () => (
  <>
    <div className='MainContainer'>
      <div className='infoReserva'>
        <h1>PEPEPEP</h1>
        <div className='BotonAgregar'>
          <Button><PlusOutlined /></Button>
        </div>
      </div>
    </div>

  </>
);
