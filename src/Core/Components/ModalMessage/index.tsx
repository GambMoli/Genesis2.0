import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './ModalMessage.css';

interface ModalMessageProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  icon?: React.ReactNode;
  title: string;
  message: string;
}

export const ModalMessage: React.FC<ModalMessageProps> = ({
  visible,
  onOk,
  onCancel,
  icon = <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#faad14' }} />,
  title,
  message,
}) => {
  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      onCancel={onCancel}
      bodyStyle={{ textAlign: 'center' }}
    >
      <div className="modal-content">
        <div className="modal-icon">{icon}</div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <Button key="cancel" onClick={onCancel} style={{ marginRight: '10px' }}>
            Cancelar
          </Button>
          <Button key="ok" type="primary" onClick={onOk}>
            Aceptar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
