import React from 'react';
import { Card, Table, Typography, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import "./NotaStyle.css";

const { Title } = Typography;

export const Notasist: React.FC = () => {
  const grades = [
    {
      grupo: '06008-P',
      materia: 'SEMINARIO DE INVESTIGACION II',
      semestre: 5,
      creditos: 2,
      inasistencias: 0,
      p1: 3.7,
      p2: 3.9,
      examen: null,
      acumulado: 2.28,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '13671-P',
      materia: 'PATRONES DISEÑO DE SOFTWARE',
      semestre: 6,
      creditos: 3,
      inasistencias: 0,
      p1: 3.7,
      p2: 4.0,
      examen: null,
      acumulado: 2.31,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '13672-A',
      materia: 'GESTION INTEGRAL DE ALCANCE - TIEMPO Y COSTO DE PROYECTOS INFORMATICOS',
      semestre: 6,
      creditos: 3,
      inasistencias: 0,
      p1: 2.7,
      p2: 3.0,
      examen: null,
      acumulado: 1.71,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '13673-P',
      materia: 'TRANSMISION DE DATOS',
      semestre: 6,
      creditos: 3,
      inasistencias: 0,
      p1: 4.6,
      p2: 3.2,
      examen: null,
      acumulado: 2.34,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '13674-P',
      materia: 'GESTION CONTABLE Y FINANCIERA',
      semestre: 6,
      creditos: 3,
      inasistencias: 4,
      p1: 3.7,
      p2: 4.0,
      examen: null,
      acumulado: 2.31,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '13675-A',
      materia: 'PROYECTO INTEGRADOR II',
      semestre: 6,
      creditos: 2,
      inasistencias: 2,
      p1: 4.5,
      p2: 4.3,
      examen: null,
      acumulado: 2.64,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '07098-E',
      materia: 'INTELIGENCIA DE NEGOCIOS POWER BI',
      semestre: null,
      creditos: null,
      inasistencias: 4,
      p1: 4.0,
      p2: 3.4,
      examen: null,
      acumulado: 2.22,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '09088-E',
      materia: 'CINECLUB',
      semestre: null,
      creditos: null,
      inasistencias: 1,
      p1: 2.4,
      p2: 4.8,
      examen: null,
      acumulado: 2.16,
      habilitacion: null,
      definitiva: null
    },
    {
      grupo: '99818-H',
      materia: 'INGLES VIII',
      semestre: null,
      creditos: null,
      inasistencias: 8,
      p1: 4.3,
      p2: 2.7,
      examen: null,
      acumulado: 2.10,
      habilitacion: null,
      definitiva: null
    }
  ];

  const columns = [
    {
      title: 'Grupo',
      dataIndex: 'grupo',
      key: 'grupo',
      width: 100,
      fixed: 'left' as const,
    },
    {
      title: 'Materia',
      dataIndex: 'materia',
      key: 'materia',
      width: 700,
    },
    {
      title: 'Semestre',
      dataIndex: 'semestre',
      key: 'semestre',
      width: 100,
      render: (value: number | null) => value || '-'
    },
    {
      title: 'Créditos',
      dataIndex: 'creditos',
      key: 'creditos',
      width: 100,
      render: (value: number | null) => value || '-'
    },
    {
      title: 'Inasistencias',
      dataIndex: 'inasistencias',
      key: 'inasistencias',
      width: 80, 
    },
    {
      title: 'P1',
      dataIndex: 'p1',
      key: 'p1',
      width: 100,
      render: (value: number) => value?.toFixed(1) || '-'
    },
    {
      title: 'P2',
      dataIndex: 'p2',
      key: 'p2',
      width: 100,
      render: (value: number) => value?.toFixed(1) || '-'
    },
    {
      title: 'P3',
      dataIndex: 'examen',
      key: 'examen',
      width: 100,
      render: (value: number | null) => value?.toFixed(1) || '-'
    },
    {
      title: 'Acumulado',
      dataIndex: 'acumulado',
      key: 'acumulado',
      width: 100,
      render: (value: number) => value?.toFixed(2) || '-'
    },
    {
      title: 'Habilitación',
      dataIndex: 'habilitacion',
      key: 'habilitacion',
      width: 120,
      render: (value: number | null) => value?.toFixed(1) || '-'
    },
    {
      title: 'Final',
      dataIndex: 'definitiva',
      key: 'definitiva',
      width: 100,
      render: (value: number | null) => value?.toFixed(1) || '-'
    }
  ];

  return (
    <div className='main-container-notas'>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2}>Notas y Asistencias</Title>
          <Button icon={<PrinterOutlined />}>
            Imprimir  
          </Button>
        </div>
        <div className="recordatorio">
          <p>Recuerde:</p>
          <p>La definitiva es un valor aproximado hasta que no se haya digitado el 100% de las notas del grupo.</p>
        </div>
        <Table
          columns={columns}
          dataSource={grades}
          pagination={false}
          bordered
          size="small"
          scroll={{ x: true }}
          rowKey="grupo"
          className="custom-table"
        />
      </Card>
    </div>
  );
};

export default Notasist;