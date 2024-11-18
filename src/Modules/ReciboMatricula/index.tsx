import React from 'react';
import { TablaRecibo } from '../../Core';
import './Matricularecibo.css';
import { Table ,Button} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

export const ReciboMatricula: React.FC = () => {
  const columnas = [
    { title: 'Fecha pronto pago', dataIndex: 'fecha_pronto_pago', key: 'fecha_pronto_pago' },
    { title: 'Fecha ordinaria', dataIndex: 'Fecha_ordinaria', key: 'Fecha_ordinaria' },
    { title: 'Fecha extraordinaria', dataIndex: 'Fecha_extraordinaria', key: 'Fecha_extraordinaria' },
  ];
  const columnas3 = [
    {
      title: 'Recibo matrícula',
      children: [
        {
          title: 'Concepto',
          dataIndex: 'Concepto',
          key: 'Concepto',
          align:'center',
          onHeaderCell: () => ({
            style: {
              backgroundColor: 'white',
            
              textAlign: 'left',
              color:'black',
              width:'80%',
            },
          }),
        },
        {
          title: 'Valor',
          dataIndex: 'Valor',
          key: 'Valor',
          align: 'center',
          onHeaderCell: () => ({
            style: {
              backgroundColor: 'white',
              
              textAlign: 'center',
              color:'black'
            },
          }),
        },
      ],
    },
  ];
  
  

  const columnas2 = [
    { title: 'Recibo', dataIndex: 'Matricula', key: 'Matricula' },

  ];
  const columnas4 = [
    { title: 'Valor matrícula pronto pago', dataIndex: 'Valor_matrícula_pronto_pago', key: 'Valor_matrícula_pronto_pago' },
    { title: 'Valor matrícula ordinaria', dataIndex: 'Valor_matrícula_ordinaria', key: 'Valor_matrícula_ordinaria' },
    { title: 'Valor matrícula extraordinaria', dataIndex: 'Valor_matrícula_extraordinaria', key: 'Valor_matrícula_extraordinaria' },
  ];
  const columnas5 = [
    { title: 'Otros Servicios',
        children: [
            {
              title: 'Concepto',
              dataIndex: 'Concepto',
              key: 'Concepto',
              align:'center',
              onHeaderCell: () => ({
                style: {
                  backgroundColor: 'white',
                
                  textAlign: 'left',
                  color:'black',
                  width:'80%',
                },
              }),
            },
            {
              title: 'Valor',
              dataIndex: 'Valor',
              key: 'Valor',
              align: 'center',
              onHeaderCell: () => ({
                style: {
                  backgroundColor: 'white',
                  
                  textAlign: 'center',
                  color:'black'
                },
              }),
            },
          ], }
   
  ];
  const data = [
    {
      key: 1, // Siempre incluye un identificador único
      fecha_pronto_pago: '2022-01-13',
      Fecha_ordinaria: '2022-01-21',
      Fecha_extraordinaria: '2022-01-30',
      Matricula: 'Matricula',
      Valor_matrícula_pronto_pago:' 3.438.955,00',
      Valor_matrícula_ordinaria: '  3.617.900,00',
      Valor_matrícula_extraordinaria: '  3.887.840,00',
   
    }
  ];
  const data2=[
    {
        key: 1, 
        Concepto:'MATRICULA INGENIERIA DE SISTEMAS',
        Valor:'900.000'
      },
    {
        key: 2, // Siempre incluye un identificador único
        Concepto:'CONVENIO UDES-ENGINEERING',
        Valor:'- 920.100,00',
    },
    {
        key:3,
        Concepto:'ESTAMPILLA PROCULTURA',
        Valor:' 39.000,00',
    },
    {
        key:4,
        Concepto:'RECARGO MATRÍCULA EXTRAORDINARIA',
        Valor:'  269.940,00',
    }

  ];
  const data3 = [
    {
      key: 1, // Siempre incluye un identificador único
      Concepto:'CURSO DE INGLÉS',
      Valor:'  505.700,00',
   
    },
    {
        key: 2, // Siempre incluye un identificador único
        Concepto:'CURSO DE INFORMÁTICA',
        Valor:'  237.800,00',
        },
  ];

  return (
    <div>
      <div>
        <h3 >
          Recibo de matrícula
        </h3>
        <div className="TablaDerecha">
          
          <Table columns={columnas2} dataSource={data} className='informacionMatricula' pagination={false} />
          
          <TablaRecibo columns={columnas} data={data} />
        </div>
        <div className='tablaAbajo'>
          <TablaRecibo columns={columnas3} data={data2} />
        </div>
        <div className='tablaAbajo'>
          <TablaRecibo columns={columnas4} data={data} />
        </div>
        <div className='tablaAbajo'>
          <TablaRecibo columns={columnas5} data={data3} />
        </div>
        <div className='tablaAbajoEstado'>
          <h4>Estado:</h4><p>Activo</p>
          <Button><DownloadOutlined />Descargar recibo</Button>
        </div>
    
      </div>
    </div>
  );
};
