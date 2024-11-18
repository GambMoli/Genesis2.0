/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Table, Typography, Pagination, message, Button, Form, Input, Modal, InputNumber } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { GoogleMap, Marker, Libraries, useLoadScript } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import { getAllInterships, createInternship, getAllPostulacionByPasantia, aceptarPostulacion, RechazarPostulacion } from '../../Core/Services/ModulesRequest/PasantiasRequest';
import { SpinnerApp } from '../../Core/Components/Spinner';


const { Title, Text } = Typography;
const libraries: Libraries = ['places'];

interface Internship {
  id: number;
  titulo: string;
  descripcion: string;
  salario: string;
  empresa: string;
  estado: string;
  created_at: string;
}

interface NewInternshipData {
  titulo: string;
  descripcion: string;
  salario: string;
  empresa: string;
  latitud: number;
  longitud: number;
}

interface PaginatedData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: Internship[];
}

interface Postulation {
  id: number;
  pasantia_id: number;
  usuario_id: number;
  estado: string;
  fecha_postulacion: string;
  created_at: string;
  updated_at: string;
  documento_postulacion_id: number;
  nombre_usuario: string;
}

interface PostulationPaginatedData {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  data: Postulation[];
}


interface ApiResponse {
  success: boolean;
  data: PaginatedData;
}

export const PasantiasEmpresa: React.FC = () => {
  const [internships, setInternships] = useState<PaginatedData>({
    totalItems: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    data: []
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 4.7110, lng: -74.0721 });
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const [postulationsModalVisible, setPostulationsModalVisible] = useState(false);
  //@ts-ignore
  const [selectedInternshipId, setSelectedInternshipId] = useState<number | null>(null);
  const [postulations, setPostulations] = useState<PostulationPaginatedData | null>(null);
  const [downloadingFiles, setDownloadingFiles] = useState<Record<number, boolean>>({});
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmationType, setConfirmationType] = useState<'accept' | 'reject' | null>(null);
  const [selectedPostulationId, setSelectedPostulationId] = useState<number | null>(null);

  const [form] = Form.useForm();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCwyOPDPD931ibAiele3EbrAzUucPmCx4c",
    libraries: libraries
  });

  useEffect(() => {
    fetchInternships(1, 10);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(currentLocation);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, []);

  const onPlacesChanged = () => {
    if (searchBox) {
      const place = searchBox.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location?.lat() || 0,
          lng: place.geometry.location?.lng() || 0
        };
        setMapCenter(location);
        setSelectedLocation(location);
        setSelectedAddress(place.formatted_address || '');
        form.setFieldsValue({
          latitud: location.lat,
          longitud: location.lng,
          direccion: place.formatted_address
        });
      }
    }
  };

  const showConfirmModal = (type: 'accept' | 'reject', postulationId: number) => {
    setConfirmationType(type);
    setSelectedPostulationId(postulationId);
    setConfirmModalVisible(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedPostulationId || !confirmationType) return;

    try {
      if (confirmationType === 'accept') {
        await aceptarPostulacion(selectedPostulationId);
        message.success('Postulación aceptada exitosamente');
      } else {
        await RechazarPostulacion(selectedPostulationId);
        message.success('Postulación rechazada exitosamente');
      }

      // Refresh postulations list if there's a selected internship
      if (selectedInternshipId) {
        const response = await getAllPostulacionByPasantia(selectedInternshipId);
        //@ts-ignore
        if (response) setPostulations(response);
      }
    } catch (error) {
      message.error(`Error al ${confirmationType === 'accept' ? 'aceptar' : 'rechazar'} la postulación`);
      console.error(error);
    } finally {
      setConfirmModalVisible(false);
      setSelectedPostulationId(null);
      setConfirmationType(null);
    }
  }

  const handleViewPostulations = async (internshipId: number) => {
    try {
      setPostulationsModalVisible(true);
      setSelectedInternshipId(internshipId);
      setPostulations(null); // Reset previous postulations while loading

      const response = await getAllPostulacionByPasantia(internshipId);
      console.log('Postulations response:', response); // For debugging

      if (response) {
        //@ts-ignore
        setPostulations(response);
        console.log('====================================');
        console.log(postulations);
        console.log('====================================');
      } else {
        message.error("No se pudieron cargar las postulaciones");
      }
    } catch (error) {
      console.error("Error fetching postulations:", error);
      message.error("Error al cargar las postulaciones");
    }
  };


  const handleDownloadCV = async (documentId: number) => {
    setDownloadingFiles(prev => ({ ...prev, [documentId]: true }));
    try {
      const response = await fetch(`https://genesis20backend-production.up.railway.app/api/pasantias/documentos/${documentId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'CV.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        message.error('Error al descargar el documento');
      }
    } catch (error) {
      message.error('Error al descargar el documento');
      console.error(error);
    } finally {
      setDownloadingFiles(prev => ({ ...prev, [documentId]: false }));
    }
  };

  const postulationsColumns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre_usuario',
      key: 'nombre_usuario',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (status: string) => (
        <span style={{
          color: status === 'pendiente' ? 'orange' : status === 'seleccionado' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      title: 'Fecha Postulación',
      dataIndex: 'fecha_postulacion',
      key: 'fecha_postulacion',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'CV',
      key: 'cv',
      render: (_: any, record: Postulation) => (
        <Button
          icon={<FileTextOutlined />}
          onClick={() => handleDownloadCV(record.documento_postulacion_id)}
          loading={downloadingFiles[record.documento_postulacion_id]}
        >
          Ver CV
        </Button>
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Postulation) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {record.estado === 'pendiente' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => showConfirmModal('accept', record.id)}
              >
                Aceptar
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => showConfirmModal('reject', record.id)}
              >
                Rechazar
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchBox(autocomplete);
  };

  const fetchInternships = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getAllInterships(page, pageSize);
      const typedResponse = response as unknown as ApiResponse;
      if (typedResponse.success) {
        setInternships(typedResponse.data);
      }
    } catch (error) {
      console.error("Error fetching internships:", error);
      message.error("Failed to fetch internships");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });
      form.setFieldsValue({ latitud: lat, longitud: lng });

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setSelectedAddress(results[0].formatted_address);
          form.setFieldsValue({ direccion: results[0].formatted_address });
        }
      });
    }
  };

  const handleCreateInternship = async () => {
    try {
      const values = await form.validateFields();

      if (!selectedLocation) {
        message.error("Por favor seleccione una ubicación en el mapa");
        return;
      }

      const newInternshipData: NewInternshipData = {
        titulo: values.titulo,
        descripcion: values.descripcion,
        salario: values.salario.toString(),
        empresa: values.empresa,
        //@ts-ignore
        direccion: selectedAddress,
        latitud: selectedLocation.lat,
        longitud: selectedLocation.lng
      };

      const response = await createInternship(newInternshipData);
      //@ts-ignore
      if (response.success) {
        message.success("Pasantía creada exitosamente");
        setModalVisible(false);
        form.resetFields();
        fetchInternships(internships.currentPage, internships.pageSize);
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo'
    },
    {
      title: 'Salario',
      dataIndex: 'salario',
      key: 'salario',
      render: (salary: string) => `$${parseFloat(salary).toLocaleString()}`
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (status: string) => (
        <span style={{
          color: status === 'abierta' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      )
    },
    {
      title: 'Fecha Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (record: Internship) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewPostulations(record.id)}
        >
          Ver Postulaciones
        </Button>
      )
    }

  ];

  const rowClassName = (record: Internship) => {
    return record.estado.toLowerCase() === 'abierta' ? 'row-abierta' : 'row-cerrada';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <SpinnerApp />
      </div>
    );
  }

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>

      <Modal
        title="Postulaciones"
        visible={postulationsModalVisible}
        onCancel={() => {
          setPostulationsModalVisible(false);
          setPostulations(null);
        }}
        footer={null}
        width={800}
      >
        {postulations ? (
          <Table
            columns={postulationsColumns}
            dataSource={postulations.data}
            rowKey={(record) => record.id}
            pagination={false}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <SpinnerApp />
          </div>
        )}
      </Modal>

      <Modal
        title={confirmationType === 'accept' ? "Confirmar Aceptación" : "Confirmar Rechazo"}
        visible={confirmModalVisible}
        onOk={handleConfirmAction}
        onCancel={() => {
          setConfirmModalVisible(false);
          setSelectedPostulationId(null);
          setConfirmationType(null);
        }}
        okText={confirmationType === 'accept' ? "Aceptar" : "Rechazar"}
        cancelText="Cancelar"
        okButtonProps={{
          style: confirmationType === 'accept'
            ? { backgroundColor: '#52c41a', borderColor: '#52c41a' }
            : { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
        }}
      >
        <p>
          {confirmationType === 'accept'
            ? "¿Está seguro que desea aceptar esta postulación?"
            : "¿Está seguro que desea rechazar esta postulación?"}
        </p>
      </Modal>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title style={{ fontSize: "24px", margin: 0 }}>
          Pasantías
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Agregar Pasantía
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={internships.data}
        rowKey={(record) => record.id}
        pagination={false}
        rowClassName={rowClassName}
      />
      <Pagination
        total={internships.totalItems}
        current={internships.currentPage}
        pageSize={internships.pageSize}
        onChange={(page, pageSize) => fetchInternships(page, pageSize)}
        style={{ marginTop: '20px', textAlign: 'right' }}
      />

      <Modal
        title="Crear Nueva Pasantía"
        visible={modalVisible}
        onOk={handleCreateInternship}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="titulo"
            label="Título"
            rules={[{ required: true, message: 'Por favor ingrese el título' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="salario"
            label="Salario"
            rules={[{ required: true, message: 'Por favor ingrese el salario' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
            />
          </Form.Item>
          <Form.Item
            name="empresa"
            label="Empresa"
            rules={[{ required: true, message: 'Por favor ingrese el nombre de la empresa' }]}
          >
            <Input />
          </Form.Item>

          {isLoaded && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={onPlacesChanged}
                >
                  <Input
                    placeholder="Buscar ubicación..."
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                </Autocomplete>
              </div>

              {selectedAddress && (
                <Text strong style={{ display: 'block', marginBottom: '10px' }}>
                  Dirección seleccionada: {selectedAddress}
                </Text>
              )}

              <div style={{ height: '300px', width: '100%' }}>
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={mapCenter}
                  zoom={15}
                  onClick={handleMapClick}
                >
                  {selectedLocation && (
                    <Marker
                      position={selectedLocation}
                    />
                  )}
                </GoogleMap>
              </div>
            </>
          )}

          <Form.Item name="latitud" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="longitud" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};