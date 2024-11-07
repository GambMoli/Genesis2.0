import React from 'react';
import { Card, Table, Typography, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import "./HorarioStyle.css";

const { Title } = Typography;

interface Class {
  code: string;
  name: string;
  classroom: string;
}

interface TimeSlot {
  time: string;
  lunes?: Class;
  martes?: Class;
  miercoles?: Class;
  jueves?: Class;
  viernes?: Class;
  sabado?: Class;
}

export const Horario: React.FC = () => {
  const timeSlots: TimeSlot[] = [
    { time: '06:00 - 06:50' },
    { time: '06:50 - 07:40' },
    { 
      time: '07:40 - 08:30',
      viernes: { 
        code: '06008-P', 
        name: 'SEMINARIO DE INVESTIGACION II',
        classroom: 'AULA B-304'
      }
    },
    { 
      time: '08:30 - 09:20',
      viernes: { 
        code: '06008-P', 
        name: 'SEMINARIO DE INVESTIGACION II',
        classroom: 'AULA B-304'
      }
    },
    { time: '09:20 - 10:10' },
    { 
      time: '10:10 - 11:00',
      jueves: {
        code: '99818-H',
        name: 'INGLES VIII',
        classroom: 'SIN AULA'
      }
    },
    { 
      time: '11:00 - 11:50',
      jueves: {
        code: '99818-H',
        name: 'INGLES VIII',
        classroom: 'SIN AULA'
      }
    },
    { 
      time: '11:50 - 12:40',
      jueves: {
        code: '99818-H',
        name: 'INGLES VIII',
        classroom: 'SIN AULA'
      }
    },
    { 
      time: '12:40 - 01:30',
      jueves: {
        code: '99818-H',
        name: 'INGLES VIII',
        classroom: 'SIN AULA'
      }
    },
    { 
      time: '01:30 - 02:20',
      lunes: {
        code: '13674-P',
        name: 'GESTION CONTABLE Y FINANCIERA',
        classroom: 'AULA D-304'
      }
    },
    { 
      time: '02:20 - 03:10',
      lunes: {
        code: '13674-P',
        name: 'GESTION CONTABLE Y FINANCIERA',
        classroom: 'AULA D-304'
      },
      jueves: {
        code: '13674-P',
        name: 'GESTION CONTABLE Y FINANCIERA',
        classroom: 'AULA B-306'
      },
      viernes: {
        code: '09088-E',
        name: 'CINECLUB',
        classroom: 'SIN AULA'
      }
    },
    { 
      time: '03:10 - 04:00',
      jueves: {
        code: '13674-P',
        name: 'GESTION CONTABLE Y FINANCIERA',
        classroom: 'AULA B-306'
      },
      viernes: {
        code: '09088-E',
        name: 'CINECLUB',
        classroom: 'SIN AULA'
      }
    }
  ];

  const columns = [
    {
      title: 'Hora/Día',
      dataIndex: 'time',
      key: 'time',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: 'Lunes',
      dataIndex: 'lunes',
      key: 'lunes',
      render: (class_: Class) => renderClass(class_),
    },
    {
      title: 'Martes',
      dataIndex: 'martes',
      key: 'martes',
      render: (class_: Class) => renderClass(class_),
    },
    {
      title: 'Miércoles',
      dataIndex: 'miercoles',
      key: 'miercoles',
      render: (class_: Class) => renderClass(class_),
    },
    {
      title: 'Jueves',
      dataIndex: 'jueves',
      key: 'jueves',
      render: (class_: Class) => renderClass(class_),
    },
    {
      title: 'Viernes',
      dataIndex: 'viernes',
      key: 'viernes',
      render: (class_: Class) => renderClass(class_),
    },
    {
      title: 'Sábado',
      dataIndex: 'sabado',
      key: 'sabado',
      render: (class_: Class) => renderClass(class_),
    },
  ];

  const renderClass = (class_?: Class) => {
    if (!class_) return null;
    return (
      <div style={{ fontSize: '12px' }}>
        <div><strong>{class_.code}:</strong> {class_.name}</div>
        <div><strong>Aula:</strong> {class_.classroom}</div>
      </div>
    );
  };

  return (
    <div className='main-container-horario'>
        <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={2}>Horario de clases</Title>
            <Button icon={<PrinterOutlined />}>
            Imprimir
            </Button>
        </div>
        <Table
            columns={columns}
            dataSource={timeSlots}
            pagination={false}
            bordered
            size="small"
            scroll={{ x: true }}
            rowKey="time"
        />
        </Card>
    </div>
  );
};