import React from 'react';
import './StyleTablaInformacion.css';
import { Table  } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export const TablaInformacion = () => {
    const columns = [
        {
          title: "Concepto",
          dataIndex: "concepto",
          key: "concepto",
        },
        {
          title: "Valor",
          dataIndex: "valor",
          key: "valor",
        }
      ];
    
      const data = [
        {
          key: 1,
          concepto: "Promedio",
          valor: 4.0,
        },
        {
          key: 2,
          concepto: "Semestre",
          valor: 6,
        },
        {
          key: 3,
          concepto: "Activo académico",
          valor: <CheckOutlined />,
        }
      ];
    
  return (
    
          <Table columns={columns} dataSource={data} className="customTable" />
  );
}
