import React from 'react';
import { Table } from 'antd';
import { TableProps } from 'antd';

interface TablaReciboProps {
  columns: TableProps<any>['columns'];
  data: any[]; 
}

export const TablaRecibo: React.FC<TablaReciboProps> = ({ columns, data }) => {
  return (
    <Table 
      columns={columns} 
      dataSource={data} 
      className="customTable" 
      pagination={false} 
      style={{width:'60%' , textAlign:'center',padding:'20px'}}
    />
  );
};
