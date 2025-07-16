import React from 'react';
import { SignUpOptions } from '../types';

interface SignUpFooterProps {
  options: SignUpOptions;
  utils: {
    navigate: (path: string) => void;
  };
}

export const SignUpFooter: React.FC<SignUpFooterProps> = ({ options, utils }) => {
  return (
    <div className="signup-footer">
      <div className="login-section">
        <p className="login-text">
          이미 계정이 있으신가요?
          <button
            type="button"
            className="login-link"
            onClick={() => utils.navigate('/login')}
            style={{ color: options.theme.primaryColor }}
          >
            로그인
          </button>
        </p>
      </div>
      
      <div className="footer-links">
        <button
          type="button"
          className="footer-link"
          onClick={() => utils.navigate('/terms')}
          style={{ color: options.theme.secondaryColor }}
        >
          이용약관
        </button>
        <span className="footer-divider">|</span>
        <button
          type="button"
          className="footer-link"
          onClick={() => utils.navigate('/privacy')}
          style={{ color: options.theme.secondaryColor }}
        >
          개인정보처리방침
        </button>
        <span className="footer-divider">|</span>
        <button
          type="button"
          className="footer-link"
          onClick={() => utils.navigate('/support')}
          style={{ color: options.theme.secondaryColor }}
        >
          고객지원
        </button>
      </div>
      
      <div className="footer-copyright">
        <p style={{ color: options.theme.secondaryColor }}>
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
};