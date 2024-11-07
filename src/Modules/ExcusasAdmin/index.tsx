/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Table, Modal, message } from 'antd';
import { DownloadOutlined, CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { getAllExcusas, ChangeStatusExcusa } from '../../Core/Services/ModulesRequest/ExcusasRequest';
import './ExcusasAdStyle.css'

const { Title } = Typography;

interface ExcusaData {
  id: number;
  id_estudiante: number;
  razon_falta: string;
  fecha_falta: string;
  id_documento: number;
  estado: number;
  created_at: string;
  updated_at: string;
  nombre: string;
  apellido: string;
  numero_documento: string;
  nombre_completo: string;
}

interface PaginationData {
  totalItems: number;
  currentPage: string;
  pageSize: string;
  totalPages: number;
  data: ExcusaData[];
}

export const ExcusasAdmin: React.FC = () => {
  const [excusas, setExcusas] = useState<ExcusaData[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<{ [key: number]: boolean }>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExcusa, setSelectedExcusa] = useState<ExcusaData | null>(null);
  const [action, setAction] = useState<'aceptar' | 'rechazar' | null>(null);

  const fetchExcusas = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const response = await getAllExcusas(page, pageSize);
      //@ts-ignore
      if (response.success) {
        //@ts-ignore
        const paginationData: PaginationData = response.data;
        setExcusas(paginationData.data);
        setPagination({
          current: parseInt(paginationData.currentPage),
          pageSize: parseInt(paginationData.pageSize),
          total: paginationData.totalItems,
        });
      }
    } catch (error) {
      message.error('Error al cargar las excusas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExcusas(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (newPagination: any) => {
    const { current, pageSize } = newPagination;
    fetchExcusas(current, pageSize);
  };

  const handleDownloadDocument = async (id: number) => {
    setDownloadingFiles(prev => ({ ...prev, [id]: true }));
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
    } finally {
      setDownloadingFiles(prev => ({ ...prev, [id]: false }));
    }
  };

  const showModal = (excusa: ExcusaData, action: 'aceptar' | 'rechazar') => {
    setSelectedExcusa(excusa);
    setAction(action);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedExcusa(null);
    setAction(null);
  };

  const handleConfirm = async () => {
    if (selectedExcusa && action) {
      try {
        const newStatus = action === 'aceptar' ? 2 : 1;
        await ChangeStatusExcusa(selectedExcusa.id, { estado: newStatus.toString() });
        message.success(`Excusa médica ${action === 'aceptar' ? 'aceptada' : 'rechazada'} con éxito`);
        fetchExcusas(pagination.current, pagination.pageSize);
        handleCancel();
      } catch (error) {
        message.error('Error al actualizar el estado de la excusa');
        console.error(error);
      }
    }
  };

  const getEstadoText = (estado: number) => {
    switch (estado) {
      case 0:
        return 'Pendiente';
      case 1:
        return 'Rechazada';
      case 2:
        return 'Aprobada';
      default:
        return 'Desconocido';
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre_completo',
      key: 'nombre_completo',
    },
    {
      title: 'Documento',
      dataIndex: 'documento',
      key: 'documento',
    },
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
      title: 'Acciones',
      key: 'acciones',
      render: (_: unknown, record: ExcusaData) => (
        <>
          <Button
            icon={downloadingFiles[record.id_documento] ? <LoadingOutlined /> : <DownloadOutlined />}
            loading={downloadingFiles[record.id_documento]}
            onClick={() => handleDownloadDocument(record.id_documento)}
            disabled={downloadingFiles[record.id_documento]}
          >
            {downloadingFiles[record.id_documento] ? 'Descargando...' : 'Ver PDF'}
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => showModal(record, 'aceptar')}
            disabled={record.estado !== 0}
          >
            Aceptar
          </Button>
          <Button
            danger
            icon={<CloseOutlined />}
            onClick={() => showModal(record, 'rechazar')}
            disabled={record.estado !== 0}
          >
            Rechazar
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="MainContainerAdminExcusas">
      <div className="ContainerAdminExcusas">
        <Card>
          <div className="header-container">
            <Title level={2}>Gestión de Excusas Médicas</Title>
          </div>
          <Table
            dataSource={excusas}
            columns={columns}
            rowKey="id"
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </Card>
      </div>

      <Modal
        title={`Confirmar acción: ${action === 'aceptar' ? 'Aceptar' : 'Rechazar'} excusa médica`}
        open={isModalVisible}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <p>¿Está seguro que desea {action === 'aceptar' ? 'aceptar' : 'rechazar'} la excusa médica {selectedExcusa?.id}?</p>
      </Modal>
    </div>
  );
};