/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Modal, message, Pagination } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './PasantiasStyle.css';
import {
  getAllPasantiasUser,
  PostularPasantia,
  getAllPostulacionesByUser
} from '../../Core/Services/ModulesRequest/PasantiasRequest';
import { SpinnerApp } from '../../Core/Components/Spinner';

const { Title, Text } = Typography;

interface Pasantia {
  id: number;
  titulo: string;
  empresa: string;
  descripcion: string;
  salario: string;
  estado: string;
  is_postulado: number;
  created_at: string;
  updated_at: string;
}

interface Postulacion {
  id: number;
  pasantia_id: number;
  titulo: string;
  empresa: string;
  descripcion: string;
  salario: string;
  estado_postulacion: string;
  fecha_postulacion: string;
}

export const Pasantias: React.FC = () => {
  const [pasantias, setPasantias] = useState<Pasantia[]>([]);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPasantia, setSelectedPasantia] = useState<Pasantia | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePostulaciones, setCurrentPagePostulaciones] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsPostulaciones, setTotalItemsPostulaciones] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        message.error('No se encontró el usuario en el localStorage');
        return;
      }

      const user = JSON.parse(storedUser);

      // Cargar pasantías disponibles
      const pasantiasResponse = await getAllPasantiasUser(user.id, currentPage, 10);
      if (pasantiasResponse && pasantiasResponse.success && pasantiasResponse.data) {
        const availablePasantias = pasantiasResponse.data.data.filter(
          //@ts-ignore
          (pasantia: Pasantia) => pasantia.is_postulado === 0
        );
        //@ts-ignore
        setPasantias(availablePasantias);
        setTotalItems(pasantiasResponse.data.totalItems);
      }

      // Cargar postulaciones
      const postulacionesResponse = await getAllPostulacionesByUser(user.id, currentPagePostulaciones, 10);
      //@ts-ignore
      if (postulacionesResponse && postulacionesResponse.success && postulacionesResponse.data) {
        //@ts-ignore
        setPostulaciones(postulacionesResponse.data.data);
        //@ts-ignore
        setTotalItemsPostulaciones(postulacionesResponse.data.totalItems);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, currentPagePostulaciones]);

  const applyForPasantia = (pasantia: Pasantia) => {
    setSelectedPasantia(pasantia);
    setIsModalVisible(true);
  };

  const confirmApply = async () => {
    if (selectedPasantia) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        try {
          const response = await PostularPasantia(selectedPasantia.id, user.id);
          if (response && response.success) {
            message.success('Aplicaste a la pasantía con éxito');
            // Recargar la página
            window.location.reload();
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

  const handlePageChangePostulaciones = (page: number) => {
    setCurrentPagePostulaciones(page);
  };

  if (loading) {
    return <SpinnerApp />;
  }

  return (
    <div className="main-container-pasantias">
      <div className="cards-container">
        <Card className="pasantia-card" title={<Title level={3}>Pasantías Disponibles</Title>}>
          {pasantias.length === 0 ? (
            <p>No hay pasantías disponibles.</p>
          ) : (
            pasantias.map((pasantia) => (
              <Card key={pasantia.id} className="pasantia-item" hoverable>
                <Title level={4}>{pasantia.titulo}</Title>
                <Text strong>Empresa:</Text> <Text>{pasantia.empresa}</Text>
                <br />
                <Text strong>Salario:</Text> <Text>${pasantia.salario}</Text>
                <br />
                <Text strong>Estado:</Text> <Text>{pasantia.estado}</Text>
                <p>{pasantia.descripcion}</p>
                <Button
                  type="primary"
                  onClick={() => applyForPasantia(pasantia)}
                  icon={<InfoCircleOutlined />}
                >
                  Aplicar
                </Button>
              </Card>
            ))
          )}
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={10}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </Card>

        <Card className="pasantia-card" title={<Title level={3}>Pasantías Aplicadas</Title>}>
          {postulaciones.length === 0 ? (
            <p>No has aplicado a ninguna pasantía.</p>
          ) : (
            postulaciones.map((postulacion) => (
              <Card key={postulacion.id} className="pasantia-item" hoverable>
                <Title level={4}>{postulacion.titulo}</Title>
                <Text strong>Empresa:</Text> <Text>{postulacion.empresa}</Text>
                <br />
                <Text strong>Salario:</Text> <Text>${postulacion.salario}</Text>
                <br />
                <Text strong>Estado:</Text> <Text>{postulacion.estado_postulacion}</Text>
                <br />
                <Text strong>Fecha de postulación:</Text>
                <Text>{new Date(postulacion.fecha_postulacion).toLocaleDateString()}</Text>
                <p>{postulacion.descripcion}</p>
              </Card>
            ))
          )}
          <Pagination
            current={currentPagePostulaciones}
            total={totalItemsPostulaciones}
            pageSize={10}
            onChange={handlePageChangePostulaciones}
            showSizeChanger={false}
          />
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
        <p>
          ¿Estás seguro que deseas aplicar a la pasantía {selectedPasantia?.titulo} en {selectedPasantia?.empresa}?
        </p>
      </Modal>

    </div>
  );
};