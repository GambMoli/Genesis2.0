import React, { ReactNode } from 'react';
import './StyleBoton.css';
import { Button } from 'antd';

interface BotonesModulosProps {
  icon: ReactNode;
  text: string;
}

export const BotonesModulos: React.FC<BotonesModulosProps> = ({ icon, text }) => {
  return (
    <Button className="customButton">
      <div className="iconTextContainer">
        {icon}
        {text}
      </div>
    </Button>
  );
};
