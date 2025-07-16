import React from 'react';
import { SignUpOptions } from '../types';

interface SignUpHeaderProps {
  options: SignUpOptions;
  utils: {
    navigate: (path: string) => void;
  };
}

export const SignUpHeader: React.FC<SignUpHeaderProps> = ({ options, utils }) => {
  return (
    <div className="signup-header">
      {options.customLogo && (
        <div className="signup-logo">
          <img src={options.customLogo} alt="Logo" className="logo-image" />
        </div>
      )}
      
      <div className="signup-title-section">
        <h1 className="signup-title" style={{ color: options.theme.textColor }}>
          {options.customTitle || '회원가입'}
        </h1>
        
        {options.customSubtitle && (
          <p className="signup-subtitle" style={{ color: options.theme.secondaryColor }}>
            {options.customSubtitle}
          </p>
        )}
      </div>
    </div>
  );
};