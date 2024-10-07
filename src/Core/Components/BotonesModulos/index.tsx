import React, { ReactNode } from 'react';
import './StyleBoton.css';
import { Button } from 'antd';

interface BotonesModulosProps {
  icon: ReactNode;
  text: string;
  onClick: () => void; // Nuevo prop para el callback de clic
}

export const BotonesModulos: React.FC<BotonesModulosProps> = ({ icon, text, onClick }) => {
  return (
    <Button className="customButton" onClick={onClick}> {/* Agrega onClick aquí */}
      <div className="iconTextContainer">
        {icon}
        {text}
      </div>
    </Button>
  );
};
