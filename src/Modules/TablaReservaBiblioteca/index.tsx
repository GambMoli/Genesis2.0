import React from 'react';
import { HistorialReservacionesBiblioteca } from '../../Core';

export const TablaHistorialBiblioteca: React.FC = () => {
  const handleEdit = (reservaId: number) => {
    // Aquí defines lo que quieres que pase cuando se edite una reserva
    console.log("Editando reserva con ID:", reservaId);
  };

  return (
    <div className="container" >
      <HistorialReservacionesBiblioteca onEdit={handleEdit} />
    </div>
  );
};
