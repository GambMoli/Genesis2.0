import React from 'react';
import { Card, Progress, Table, Typography, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import "./PlanStyle.css";

const { Title } = Typography;
const { Panel } = Collapse;

interface Course {
  code: string;
  name: string;
  credits: number;
  ht: number;
  hp: number;
}

interface Semester {
  number: number;
  credits: number;
  courses: Course[];
}

const PlanDeEstudio: React.FC = () => {
  const creditStats = {
    approved: 75,
    total: 160,
    electivesApproved: 0,
    electivesRequired: 16,
    computerCoursesApproved: 5,
    computerCoursesRequired: 8,
    languageCoursesApproved: 7,
    languageCoursesRequired: 8,
    wellnessHoursApproved: 98,
    wellnessHoursRequired: 160
  };

  const semesters: Semester[] = [
    {
      number: 1,
      credits: 16,
      courses: [
        { code: '13142', name: 'FUNDAMENTOS DE PROGRAMACION', credits: 3, ht: 2, hp: 2 },
        { code: '13144', name: 'INTRODUCCION A LA ADMINISTRACION DE PROYECTOS INFORMATICOS', credits: 3, ht: 3, hp: 0 },
        { code: '16174', name: 'CALCULO DIFERENCIAL', credits: 3, ht: 3, hp: 0 },
        { code: '16111', name: 'ALGEBRA SUPERIOR', credits: 3, ht: 3, hp: 0 },
        { code: '13327', name: 'INT A LA INGENIERIA', credits: 2, ht: 2, hp: 0 },
        { code: '11131', name: 'COMPETENCIAS COMUNICATIVAS', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 2,
      credits: 16,
      courses: [
        { code: '13270', name: 'PROGRAMACION I', credits: 3, ht: 1, hp: 4 },
        { code: '16175', name: 'CALCULO INTEGRAL', credits: 3, ht: 3, hp: 0 },
        { code: '16176', name: 'LOGICA MATEMATICA', credits: 3, ht: 3, hp: 0 },
        { code: '16177', name: 'FISICA MECANICA', credits: 3, ht: 2, hp: 2 },
        { code: '06217', name: 'SEMINARIO DE INVESTIGACION I', credits: 2, ht: 2, hp: 0 },
        { code: '23335', name: 'SOCIOANTROPOLOGIA', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 3,
      credits: 16,
      courses: [
        { code: '13271', name: 'PROGRAMACION II', credits: 3, ht: 1, hp: 4 },
        { code: '13272', name: 'TEORIA GENERAL DE LOS SISTEMAS', credits: 2, ht: 2, hp: 0 },
        { code: '16178', name: 'CALCULO MULTIVARIABLE', credits: 3, ht: 3, hp: 0 },
        { code: '16179', name: 'ESTADISTICA', credits: 3, ht: 3, hp: 0 },
        { code: '16180', name: 'FISICA ELECTROMAGNETICA', credits: 3, ht: 2, hp: 2 },
        { code: '13273', name: 'PROYECTO INTEGRADOR I', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 4,
      credits: 16,
      courses: [
        { code: '13274', name: 'ESTRUCTURA DE DATOS', credits: 3, ht: 1, hp: 4 },
        { code: '13413', name: 'BASE DE DATOS', credits: 3, ht: 2, hp: 2 },
        { code: '16185', name: 'ECUACIONES DIFERENCIALES', credits: 3, ht: 3, hp: 0 },
        { code: '26606', name: 'ELECTRONICA', credits: 2, ht: 1, hp: 2 },
        { code: '13275', name: 'INVESTIGACION DE OPERACIONES I', credits: 3, ht: 2, hp: 2 },
        { code: '23380', name: 'ETICA PROFESIONAL', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 5,
      credits: 16,
      courses: [
        { code: '13276', name: 'ANALISIS DE SISTEMAS', credits: 3, ht: 2, hp: 2 },
        { code: '13183', name: 'PLANEACION ESTRATEGICA', credits: 2, ht: 2, hp: 0 },
        { code: '13277', name: 'SISTEMA GESTION BASE DE DATOS', credits: 3, ht: 0, hp: 6 },
        { code: '13182', name: 'METODOS NUMERICOS', credits: 3, ht: 3, hp: 0 },
        { code: '26499', name: 'ARQUITECTURA DE COMPUTADORES', credits: 3, ht: 2, hp: 2 },
        { code: '06008', name: 'SEMINARIO DE INVESTIGACION II', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 6,
      credits: 16,
      courses: [
        { code: '13671', name: 'PATRONES DISEÑO DE SOFTWARE', credits: 3, ht: 1, hp: 4 },
        { code: '13672', name: 'GESTION INTEGRAL DE ALCANCE - TIEMPO Y COSTO DE PROYECTOS INFORMATICOS', credits: 3, ht: 2, hp: 2 },
        { code: '13674', name: 'GESTION CONTABLE Y FINANCIERA', credits: 3, ht: 2, hp: 2 },
        { code: '13675', name: 'PROYECTO INTEGRADOR II', credits: 2, ht: 2, hp: 0 },
        { code: '13673', name: 'TRANSMISION DE DATOS', credits: 3, ht: 2, hp: 2 }
      ]
    },
    {
      number: 7,
      credits: 16,
      courses: [
        { code: '13701', name: 'PROGRAMACION WEB', credits: 3, ht: 2, hp: 2 },
        { code: '13702', name: 'GESTION DE RECURSOS HUMANOS Y COMUNICACION', credits: 3, ht: 2, hp: 2 },
        { code: '13703', name: 'REDES DE COMPUTADORES', credits: 3, ht: 1, hp: 4 },
        { code: '13704', name: 'GESTION RIESGOS DEL PROYECTO', credits: 2, ht: 2, hp: 0 },
        { code: '29322', name: 'CONSTITUCIÓN POLÍTICA', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 8,
      credits: 16,
      courses: [
        { code: '13801', name: 'SISTEMAS OPERATIVOS', credits: 3, ht: 2, hp: 2 },
        { code: '13802', name: 'GESTION DE LA CALIDAD DEL PROYECTO', credits: 3, ht: 2, hp: 2 },
        { code: '13803', name: 'TELEMATICA', credits: 3, ht: 1, hp: 4 },
        { code: '13804', name: 'MODELOS MATEMATICOS', credits: 3, ht: 2, hp: 2 },
        { code: '13805', name: 'SEMINARIO DE INVESTIGACION III', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 9,
      credits: 16,
      courses: [
        { code: '13930', name: 'AUDITORIA INFORMATICA', credits: 3, ht: 2, hp: 2 },
        { code: '13931', name: 'ASEGURAMIENTO DE CALIDAD DEL PRODUCTO', credits: 3, ht: 2, hp: 2 },
        { code: '13932', name: 'FORMA PARA EMPRENDIMIENTO', credits: 2, ht: 2, hp: 0 },
        { code: '13933', name: 'INGENIERIA ECONOMICA', credits: 3, ht: 2, hp: 2 },
        { code: '13917', name: 'PROYECTO INTEGRADOR III', credits: 2, ht: 2, hp: 0 }
      ]
    },
    {
      number: 10,
      credits: 16,
      courses: [
        { code: '13935', name: 'GESTION DE ADQUISICION E INTEGRACION DE TECNOLOGIA', credits: 3, ht: 3, hp: 0 },
        { code: '13919', name: 'FORMACION PARA EMPRENDIMIENTO II', credits: 3, ht: 3, hp: 0 }
      ]
    }
  ]

  const creditColumns = [
    {
      title: 'Créditos',
      children: [
        { title: 'Aprob.', dataIndex: 'approved', key: 'approved', align: 'center' },
        { title: 'Req.', dataIndex: 'required', key: 'required', align: 'center' }
      ]
    },
    {
      title: 'Créditos electivas',
      children: [
        { title: 'Aprob.', dataIndex: 'electivesApproved', key: 'electivesApproved', align: 'center' },
        { title: 'Req.', dataIndex: 'electivesRequired', key: 'electivesRequired', align: 'center' }
      ]
    },
    {
      title: 'Número cursos informática',
      children: [
        { title: 'Aprob.', dataIndex: 'computerApproved', key: 'computerApproved', align: 'center' },
        { title: 'Req.', dataIndex: 'computerRequired', key: 'computerRequired', align: 'center' }
      ]
    },
    {
      title: 'Niveles cursos idiomas',
      children: [
        { title: 'Aprob.', dataIndex: 'languageApproved', key: 'languageApproved', align: 'center' },
        { title: 'Req.', dataIndex: 'languageRequired', key: 'languageRequired', align: 'center' }
      ]
    },
    {
      title: 'Número horas bienestar',
      children: [
        { title: 'Aprob.', dataIndex: 'wellnessApproved', key: 'wellnessApproved', align: 'center' },
        { title: 'Req.', dataIndex: 'wellnessRequired', key: 'wellnessRequired', align: 'center' }
      ]
    }
  ];

  const creditData = [{
    approved: creditStats.approved,
    required: creditStats.total,
    electivesApproved: creditStats.electivesApproved,
    electivesRequired: creditStats.electivesRequired,
    computerApproved: creditStats.computerCoursesApproved,
    computerRequired: creditStats.computerCoursesRequired,
    languageApproved: creditStats.languageCoursesApproved,
    languageRequired: creditStats.languageCoursesRequired,
    wellnessApproved: creditStats.wellnessHoursApproved,
    wellnessRequired: creditStats.wellnessHoursRequired
  }];

  const courseColumns = [
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Materia',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Créd.',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center' as const,
    },
    {
      title: 'HT',
      dataIndex: 'ht',
      key: 'ht',
      align: 'center' as const,
    },
    {
      title: 'HP',
      dataIndex: 'hp',
      key: 'hp',
      align: 'center' as const,
    },
  ];

  const progressPercentage = (creditStats.approved / creditStats.total) * 100;

  return (
    <div className="main-container-plan">
      <Card>
        <Title level={2}>Plan de estudio</Title>

        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>Progreso: </span>
            <span>Créditos aprobados: {creditStats.approved} | </span>
            <span>Créditos totales: {creditStats.total} ({progressPercentage.toFixed(1)}%)</span>
          </div>
          <Progress percent={progressPercentage} showInfo={false} strokeColor="#1890ff" />
        </div>

        <Table
          columns={creditColumns}
          dataSource={creditData}
          pagination={false}
          bordered
          style={{ marginBottom: 24 }}
        />

        <Collapse
          accordion
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        >
          {semesters.map((semester) => (
            <Panel
              header={`Semestre ${semester.number}, Créditos ${semester.credits}`}
              key={semester.number}
            >
              <Table
                className="custom-table"
                columns={courseColumns}
                dataSource={semester.courses}
                pagination={false}
                bordered
                rowKey="code"
              />
            </Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  );
};

export default PlanDeEstudio;