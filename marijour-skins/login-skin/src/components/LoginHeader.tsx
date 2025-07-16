import React from 'react';
import { LoginOptions } from '../types';

interface LoginHeaderProps {
  options: LoginOptions;
  utils: {
    navigate: (path: string) => void;
  };
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ options, utils }) => {
  return (
    <div className="login-header">
      {options.customLogo && (
        <div className="login-logo">
          <img src={options.customLogo} alt="Logo" className="logo-image" />
        </div>
      )}
      
      <div className="login-title-section">
        <h1 className="login-title" style={{ color: options.theme?.textColor || '#333333' }}>
          {options.customTitle || '로그인'}
        </h1>
        
        {options.customSubtitle && (
          <p className="login-subtitle" style={{ color: options.theme?.secondaryColor || '#666666' }}>
            {options.customSubtitle}
          </p>
        )}
      </div>
    </div>
  );
};