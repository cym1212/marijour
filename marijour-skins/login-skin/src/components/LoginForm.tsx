import React from 'react';
import { LoginFormData, FormErrors, LoginState, LoginOptions } from '../types';

interface LoginFormProps {
  formData: LoginFormData;
  errors: FormErrors;
  loginState: LoginState;
  options: LoginOptions;
  onInputChange: (field: keyof LoginFormData, value: any) => void;
  onSubmit: (event: React.FormEvent) => void;
  onPasswordReset: () => void;
  onTogglePasswordVisibility: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  errors,
  loginState,
  options,
  onInputChange,
  onSubmit,
  onPasswordReset,
  onTogglePasswordVisibility
}) => {
  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  return (
    <form onSubmit={onSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          이메일
        </label>
        <input
          type="email"
          id="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          disabled={loginState.isLoading || loginState.isLocked}
          autoComplete="email"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          비밀번호
        </label>
        <div className="password-input-wrapper">
          <input
            type={loginState.showPassword ? 'text' : 'password'}
            id="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={(e) => onInputChange('password', e.target.value)}
            disabled={loginState.isLoading || loginState.isLocked}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={onTogglePasswordVisibility}
            disabled={loginState.isLoading || loginState.isLocked}
            aria-label={loginState.showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {loginState.showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      {options.allowRememberMe && (
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => onInputChange('rememberMe', e.target.checked)}
              disabled={loginState.isLoading || loginState.isLocked}
              className="checkbox-input"
            />
            <span className="checkbox-text">로그인 상태 유지</span>
          </label>
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid || loginState.isLoading || loginState.isLocked}
          style={{ 
            backgroundColor: options.theme?.primaryColor || '#667eea',
            borderColor: options.theme?.primaryColor || '#667eea'
          }}
        >
          {loginState.isLoading ? '로그인 중...' : '로그인'}
        </button>
      </div>

      <div className="form-links">
        {options.allowPasswordReset && (
          <button
            type="button"
            className="link-button"
            onClick={onPasswordReset}
            disabled={loginState.isLoading || loginState.isLocked}
            style={{ color: options.theme?.primaryColor || '#667eea' }}
          >
            비밀번호 찾기
          </button>
        )}
        
        {options.allowGuestOrderLookup && (
          <>
            <span className="link-divider">|</span>
            <button
              type="button"
              className="link-button"
              onClick={() => window.location.href = '/guest-order-lookup'}
              disabled={loginState.isLoading || loginState.isLocked}
              style={{ color: options.theme?.primaryColor || '#667eea' }}
            >
              비회원 주문 조회
            </button>
          </>
        )}
      </div>

      {options.showSignupLink && (
        <div className="signup-section">
          <p className="signup-text">
            계정이 없으신가요?
            <button
              type="button"
              className="signup-link"
              onClick={() => window.location.href = '/signup'}
              disabled={loginState.isLoading || loginState.isLocked}
              style={{ color: options.theme?.primaryColor || '#667eea' }}
            >
              회원가입
            </button>
          </p>
        </div>
      )}

      {loginState.attempts > 0 && options.maxLoginAttempts && (
        <div className="attempts-warning">
          <span className="attempts-text">
            로그인 시도 {loginState.attempts}/{options.maxLoginAttempts}
          </span>
        </div>
      )}
    </form>
  );
};