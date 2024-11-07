/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Input, Button, Typography, Card, Table, Modal, Form, DatePicker, Upload, message } from 'antd';
import { FilePdfOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import "./ExcusasStyle.css";
import { PostDocuments, getAllExcusasByStudent, createExcusa } from '../../Core/Services/ModulesRequest/ExcusasRequest';
import { SpinnerApp } from '../../Core/Components/Spinner';

const { Title } = Typography;

interface ExcusaMedica {
  id?: number;
  id_estudiante: number;
  razon_falta: string;
  fecha_falta: string;
  id_documento: number;
  estado: 'Validada' | 'Rechazada' | 'En espera';
}

interface PaginatedResponse {
  data: {
    totalItems: number;
    currentPage: string;
    pageSize: string;
    totalPages: number;
    data: ExcusaMedica[];
  };
}

export const Excusas: React.FC = () => {
  const [excusas, setExcusas] = useState<ExcusaMedica[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);

  const storedUser = localStorage.getItem('user');
  //@ts-ignore
  const user = JSON.parse(storedUser);
  const userId = user.id;

  // Función para transformar el estado numérico a string
  const getEstadoText = (estado: number): string => {
    switch (estado) {
      case 0:
        return 'En espera';
      case 1:
        return 'Validada';
      case 2:
        return 'Rechazada';
      default:
        return 'En espera';
    }
  };

  const columns = [
    {
      title: 'Razón',
      dataIndex: 'razon_falta',
      key: 'razon_falta',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha_falta',
      key: 'fecha_falta',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: number) => getEstadoText(estado),
    },
    {
      title: 'Archivo',
      dataIndex: 'id_documento',
      key: 'id_documento',
      render: (id: number) => (
        <Button icon={<FilePdfOutlined />} type="link" onClick={() => handleDownloadDocument(id)}>
          Ver Documento
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedFile(null);
  };

  const handleDownloadDocument = async (id: number) => {
    try {
      const response = await fetch(`https://genesis20backend-production.up.railway.app/api/documentos/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'excusa.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        message.error('Error al descargar el documento');
      }
    } catch (error) {
      message.error('Error al descargar el documento');
      console.error(error);
    }
  };

  const onFinish = async (values: any) => {
    if (!selectedFile) {
      message.error('Por favor, suba la excusa médica en PDF antes de enviar');
      return;
    }

    try {
      const uploadResponse = await PostDocuments(selectedFile);
      const documentId = uploadResponse.documentoId;

      const newExcusa: ExcusaMedica = {
        id_estudiante: userId,
        razon_falta: values.razon,
        fecha_falta: values.fecha.format('YYYY-MM-DD'),
        id_documento: documentId,
        estado: 'En espera',
      };

      await createExcusa(newExcusa);
      message.success('Excusa médica agregada con éxito');
      setIsModalVisible(false);
      form.resetFields();
      setSelectedFile(null);
      fetchExcusasByStudent(currentPage);
    } catch (error) {
      message.error('Error al crear la excusa médica');
      console.error(error);
    }
  };

  const fetchExcusasByStudent = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllExcusasByStudent(userId, page, pageSize);
      const paginatedResponse = response as PaginatedResponse;

      setExcusas(paginatedResponse.data.data);
      setTotalItems(paginatedResponse.data.totalItems);
    } catch (error) {
      message.error('Error al obtener las excusas médicas');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExcusasByStudent(currentPage);
  }, [currentPage]);

  return (
    <div className="MainContainerExcusas">
      <div className="ContainerExcusas">
        <Card>
          <div className="header-container">
            <Title level={2}>Excusas Médicas</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Agregar Excusa Médica
            </Button>
          </div>
          {isLoading ? (
            <SpinnerApp />
          ) : (
            <Table
              dataSource={excusas}
              columns={columns}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false, // Deshabilitamos el cambio de tamaño de página
                showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} items`,
              }}
            />
          )}
        </Card>
      </div>

      <Modal
        title="Agregar Excusa Médica"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="razon"
            label="Razón de la falta"
            rules={[{ required: true, message: 'Por favor ingrese la razón de la falta' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="fecha"
            label="Fecha de la falta"
            rules={[{ required: true, message: 'Por favor seleccione la fecha de la falta' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="archivo"
            label="Excusa médica (PDF)"
            rules={[{ required: true, message: 'Por favor suba la excusa médica en PDF' }]}
          >
            <Upload
              accept=".pdf"
              maxCount={1}
              beforeUpload={(file) => {
                const isValidPdf = file.type === 'application/pdf';
                if (!isValidPdf) {
                  message.error('Solo se permiten archivos PDF');
                }
                setSelectedFile(isValidPdf ? file : null);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Subir PDF</Button>
            </Upload>
          </Form.Item>

          <Form.Item style={{ alignSelf: 'end' }}>
            <Button type="primary" htmlType="submit">
              Enviar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};