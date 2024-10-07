import React, { useState } from 'react';
import { Card, Button, Typography, Modal, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import "./PasantiasStyle.css";

const { Title, Text } = Typography;

interface Pasantia {
  id: number;
  titulo: string;
  empresa: string;
  fechaLimite: string;
  descripcion: string;
}

interface PasantiaAplicada extends Pasantia {
  estado: 'En espera' | 'Aceptada' | 'Rechazada';
}

export const Pasantias: React.FC = () => {
  const [pasantias, setPasantias] = useState<Pasantia[]>([
    { id: 1, titulo: 'Desarrollador Web', empresa: 'TechCorp', fechaLimite: '2024-10-15', descripcion: 'Desarrollo de aplicaciones web usando React.' },
    { id: 2, titulo: 'Analista de Datos', empresa: 'Data Solutions', fechaLimite: '2024-11-01', descripcion: 'Análisis y visualización de datos con Python y R.' },
    { id: 3, titulo: 'Analista de Datos', empresa: 'Data Solutions', fechaLimite: '2024-11-01', descripcion: 'Análisis y visualización de datos con Python y R.' },
    { id: 4, titulo: 'Analista de Datos', empresa: 'Data Solutions', fechaLimite: '2024-11-01', descripcion: 'Análisis y visualización de datos con Python y R.' },
    { id: 5, titulo: 'Analista de Datos', empresa: 'Data Solutions', fechaLimite: '2024-11-01', descripcion: 'Análisis y visualización de datos con Python y R.' },
    { id: 6, titulo: 'Analista de Datos', empresa: 'Data Solutions', fechaLimite: '2024-11-01', descripcion: 'Análisis y visualización de datos con Python y R.' },
    { id: 7, titulo: 'Analista de Datos', empresa: 'Data Solutions', fechaLimite: '2024-11-01', descripcion: 'Análisis y visualización de datos con Python y R.' },

  ]);

  const [pasantiasAplicadas, setPasantiasAplicadas] = useState<PasantiaAplicada[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPasantia, setSelectedPasantia] = useState<Pasantia | null>(null);

  const applyForPasantia = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsModalVisible(true);
  };

  const confirmApply = () => {
    if (selectedPasantia) {
      setPasantias((prev) => prev.filter((p) => p.id !== selectedPasantia.id));
      setPasantiasAplicadas((prev) => [...prev, { ...selectedPasantia, estado: 'En espera' }]);
      message.success('Aplicaste a la pasantía con éxito');
      setIsModalVisible(false);
      setSelectedPasantia(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPasantia(null);
  };

  return (
    <div className="main-container-pasantias">
      <div className="cards-container">
        <Card className="pasantia-card" title={<Title level={3}>Listado de Pasantías</Title>}>
          {pasantias.map((pasantia) => (
            <Card key={pasantia.id} className="pasantia-item" hoverable>
              <Title level={4}>{pasantia.titulo}</Title>
              <Text strong>Empresa:</Text> <Text>{pasantia.empresa}</Text>
              <br />
              <Text strong>Fecha Límite:</Text> <Text>{pasantia.fechaLimite}</Text>
              <p>{pasantia.descripcion}</p>
              <Button type="primary" onClick={() => applyForPasantia(pasantia)} icon={<InfoCircleOutlined />}>
                Aplicar
              </Button>
            </Card>
          ))}
        </Card>

        <Card className="pasantia-card" title={<Title level={3}>Pasantías Aplicadas</Title>}>
          {pasantiasAplicadas.map((pasantia) => (
            <Card key={pasantia.id} className="pasantia-item" hoverable>
              <Title level={4}>{pasantia.titulo}</Title>
              <Text strong>Empresa:</Text> <Text>{pasantia.empresa}</Text>
              <br />
              <Text strong>Estado:</Text> <Text>{pasantia.estado}</Text>
            </Card>
          ))}
        </Card>
      </div>

      <Modal
        title="Confirmar Aplicación"
        visible={isModalVisible}
        onOk={confirmApply}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro que deseas aplicar a la pasantía {selectedPasantia?.titulo} en {selectedPasantia?.empresa}?</p>
      </Modal>
    </div>
  );
};