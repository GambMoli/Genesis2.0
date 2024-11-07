import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Modal, message, Pagination } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './PasantiasStyle.css';
import { getAllInterships, PostularPasantia } from '../../Core/Services/ModulesRequest/PasantiasRequest';

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
  const [pasantias, setPasantias] = useState<Pasantia[]>([]);
  const [pasantiasAplicadas, setPasantiasAplicadas] = useState<PasantiaAplicada[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPasantia, setSelectedPasantia] = useState<Pasantia | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Cargar pasantías de la API
  useEffect(() => {
    const fetchPasantias = async (page: number, pageSize: number) => {
      try {
        const response = await getAllInterships(page, pageSize);
        if (response && response.success && response.data && response.data.data) {
          setPasantias(response.data.data);
          setTotalItems(response.data.totalItems);
        } else {
          message.error('Error al cargar las pasantías');
          setPasantias([]);
        }
      } catch (error) {
        console.error('Error fetching internships:', error);
        message.error('Error al cargar las pasantías');
        setPasantias([]);
      }
    };
    fetchPasantias(currentPage, 10);
  }, [currentPage]);

  const applyForPasantia = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsModalVisible(true);
  };

  const confirmApply = async () => {
    if (selectedPasantia) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userId = user.id;

        try {
          const response = await PostularPasantia(selectedPasantia.id, userId);
          if (response && response.success) {
            setPasantias((prev) => prev.filter((p) => p.id !== selectedPasantia.id));
            setPasantiasAplicadas((prev) => [...prev, { ...selectedPasantia, estado: 'En espera' }]);
            message.success('Aplicaste a la pasantía con éxito');
          } else {
            message.error('Error al aplicar a la pasantía');
          }
        } catch (error) {
          console.error('Error applying for internship:', error);
          message.error('Error al aplicar a la pasantía');
        } finally {
          setIsModalVisible(false);
          setSelectedPasantia(null);
        }
      } else {
        message.error('No se encontró el usuario en el localStorage');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPasantia(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="main-container-pasantias">
      <div className="cards-container">
        <Card className="pasantia-card" title={<Title level={3}>Listado de Pasantías</Title>}>
          {pasantias.length === 0 ? (
            <p>No hay pasantías disponibles.</p>
          ) : (
            pasantias.map((pasantia) => (
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
            ))
          )}
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

      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={10}
        onChange={handlePageChange}
        showSizeChanger={false}
      />

      <Modal
        title="Confirmar Aplicación"
        visible={isModalVisible}
        onOk={confirmApply}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro que deseas aplicar a la pasantía {selectedPasantia?.titulo} en {selectedPasantia?.empresa}?
        </p>
      </Modal>
    </div>
  );
};