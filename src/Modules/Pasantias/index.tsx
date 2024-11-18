/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Modal, message, Pagination, Upload } from 'antd';
import { InfoCircleOutlined, EnvironmentOutlined, UploadOutlined } from '@ant-design/icons';
import { GoogleMap, Libraries, Marker, useLoadScript } from '@react-google-maps/api';
import './PasantiasStyle.css';
import {
  getAllPasantiasUser,
  PostularPasantia,
  getAllPostulacionesByUser,
  getIntershipsById,
  PostDocuments
} from '../../Core/Services/ModulesRequest/PasantiasRequest';
import { SpinnerApp } from '../../Core/Components/Spinner';

const { Title, Text } = Typography;
const libraries: Libraries = ['places'];

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

interface PasantiaDetalle extends Pasantia {
  direccion: string;
  latitud: string;
  longitud: string;
  estudiante_seleccionado_id: number | null;
  usuario_id: number | null;
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

interface PostularRequest {
  usuarioId: number;
  documento_postulacion_id: number;
}

export const Pasantias: React.FC = () => {
  const [pasantias, setPasantias] = useState<Pasantia[]>([]);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPasantia, setSelectedPasantia] = useState<PasantiaDetalle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPagePostulaciones, setCurrentPagePostulaciones] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalItemsPostulaciones, setTotalItemsPostulaciones] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCwyOPDPD931ibAiele3EbrAzUucPmCx4c",
    libraries
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        message.error('No se encontró el usuario en el localStorage');
        return;
      }

      const user = JSON.parse(storedUser);

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

  const applyForPasantia = async (pasantia: Pasantia) => {
    setLoadingDetails(true);
    try {
      const response = await getIntershipsById(pasantia.id);
      if (response) {
        //@ts-ignore
        setSelectedPasantia(response);
        setIsModalVisible(true);
      } else {
        message.error('Error al cargar los detalles de la pasantía');
      }
    } catch (error) {
      console.error('Error loading internship details:', error);
      message.error('Error al cargar los detalles de la pasantía');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      setSelectedFile(info.file.originFileObj);
    }
  };

  const confirmApply = async () => {
    if (!selectedFile) {
      message.error('Por favor, suba su CV en PDF antes de aplicar');
      return;
    }

    if (selectedPasantia) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUploading(true);
        try {
          // First upload the document
          const uploadResponse = await PostDocuments(selectedFile);
          if (!uploadResponse || !uploadResponse.documentoId) {
            throw new Error('Error al subir el documento');
          }

          // Then submit the application with the document ID
          const postularData: PostularRequest = {
            usuarioId: user.id,
            documento_postulacion_id: uploadResponse.documentoId
          };

          const response = await PostularPasantia(selectedPasantia.id, postularData);
          if (response && response.success) {
            message.success('Aplicaste a la pasantía con éxito');
            window.location.reload();
          } else {
            message.error('Error al aplicar a la pasantía');
          }
        } catch (error) {
          console.error('Error applying for internship:', error);
          message.error('Error al aplicar a la pasantía');
        } finally {
          setUploading(false);
          setIsModalVisible(false);
          setSelectedPasantia(null);
          setSelectedFile(null);
        }
      } else {
        message.error('No se encontró el usuario en el localStorage');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPasantia(null);
    setSelectedFile(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageChangePostulaciones = (page: number) => {
    setCurrentPagePostulaciones(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <SpinnerApp />;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return '#FFB800'; // Yellow
      case 'seleccionado':
        return '#52C41A'; // Green
      case 'rechazado':
        return '#FF4D4F'; // Red
      default:
        return 'inherit';
    }
  };

  const renderStatus = (status: string) => (
    <Text strong style={{ color: getStatusColor(status) }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Text>
  );


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
                  Ver Detalles y Aplicar
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
                <Text strong>Estado:</Text> <Text>{renderStatus(postulacion.estado_postulacion)}</Text>
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
        title={<Title level={3}>Detalles de la Pasantía</Title>}
        visible={isModalVisible}
        onOk={confirmApply}
        onCancel={handleCancel}
        okText="Aplicar"
        cancelText="Cancelar"
        width={800}
        confirmLoading={uploading || loadingDetails}
      >
        {loadingDetails ? (
          <SpinnerApp />
        ) : selectedPasantia && (
          <div>
            <Title level={4}>{selectedPasantia.titulo}</Title>

            <div style={{ marginBottom: '20px' }}>
              <Text strong>Empresa: </Text>
              <Text>{selectedPasantia.empresa}</Text>
              <br />
              <Text strong>Salario: </Text>
              <Text>${parseFloat(selectedPasantia.salario).toLocaleString('es-CO')}</Text>
              <br />
              <Text strong>Estado: </Text>
              <Text>{selectedPasantia.estado}</Text>
              <br />
              <Text strong>Fecha de publicación: </Text>
              <Text>{formatDate(selectedPasantia.created_at)}</Text>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Text strong>Descripción:</Text>
              <p>{selectedPasantia.descripcion}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <Text strong>
                <EnvironmentOutlined /> Ubicación:
              </Text>
              <p>{selectedPasantia.direccion}</p>
            </div>

            {isLoaded && (
              <div style={{ height: '300px', width: '100%', marginBottom: '20px' }}>
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={{
                    lat: parseFloat(selectedPasantia.latitud),
                    lng: parseFloat(selectedPasantia.longitud)
                  }}
                  zoom={15}
                >
                  <Marker
                    position={{
                      lat: parseFloat(selectedPasantia.latitud),
                      lng: parseFloat(selectedPasantia.longitud)
                    }}
                  />
                </GoogleMap>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <Text strong>Subir CV (PDF):</Text>
              <Upload
                accept=".pdf"
                maxCount={1}
                onChange={handleFileChange}
                customRequest={({ onSuccess }) => onSuccess && onSuccess('ok')}
                showUploadList={{ showRemoveIcon: true }}
              >
                <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
              </Upload>
              <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
                Por favor, suba su CV en formato PDF antes de aplicar a la pasantía.
              </Text>
            </div>

            <Text type="secondary">
              ¿Estás seguro que deseas aplicar a esta pasantía? Una vez confirmada tu aplicación,
              podrás hacer seguimiento en la sección de "Pasantías Aplicadas".
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};