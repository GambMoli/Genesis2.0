import React from 'react';
import logo_udes from '../../../assets/logo_udes.png';
import './SpinnerApp.css'

export const SpinnerApp: React.FC = () => {
  return (
    <div className="spinner-container">
      <img src={logo_udes} alt="UDES Logo" className="spinner-logo" />
    </div>
  );
}