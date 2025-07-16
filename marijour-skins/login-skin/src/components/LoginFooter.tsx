import React from 'react';
import { LoginOptions } from '../types';

interface LoginFooterProps {
  options: LoginOptions;
  utils: {
    navigate: (path: string) => void;
  };
}

export const LoginFooter: React.FC<LoginFooterProps> = ({ options, utils }) => {
  return (
    <div className="login-footer">
      <div className="footer-links">
        <button
          type="button"
          className="footer-link"
          onClick={() => utils.navigate('/terms')}
          style={{ color: options.theme?.secondaryColor || '#666666' }}
        >
          이용약관
        </button>
        <span className="footer-divider">|</span>
        <button
          type="button"
          className="footer-link"
          onClick={() => utils.navigate('/privacy')}
          style={{ color: options.theme?.secondaryColor || '#666666' }}
        >
          개인정보처리방침
        </button>
        <span className="footer-divider">|</span>
        <button
          type="button"
          className="footer-link"
          onClick={() => utils.navigate('/support')}
          style={{ color: options.theme?.secondaryColor || '#666666' }}
        >
          고객지원
        </button>
      </div>
      
      <div className="footer-copyright">
        <p style={{ color: options.theme?.secondaryColor || '#666666' }}>
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
};