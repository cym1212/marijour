import React, { useState } from 'react';
import { PasswordChangeForm as PasswordChangeFormType, FormErrors, ProfileEditOptions } from '../types';

interface PasswordChangeFormProps {
  onSubmit: (formData: PasswordChangeFormType) => void;
  errors: FormErrors;
  isLoading: boolean;
  options: ProfileEditOptions;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSubmit,
  errors,
  isLoading,
  options
}) => {
  const [formData, setFormData] = useState<PasswordChangeFormType>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (field: keyof PasswordChangeFormType, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const getPasswordValidationMessage = () => {
    const { passwordPolicy } = options;
    const requirements = [];
    
    if (passwordPolicy.minLength) {
      requirements.push(`최소 ${passwordPolicy.minLength}자 이상`);
    }
    if (passwordPolicy.requireUppercase) {
      requirements.push('영문 대문자');
    }
    if (passwordPolicy.requireLowercase) {
      requirements.push('영문 소문자');
    }
    if (passwordPolicy.requireNumbers) {
      requirements.push('숫자');
    }
    if (passwordPolicy.requireSpecialChars) {
      requirements.push('특수문자');
    }

    return requirements.join(', ') + ' 포함';
  };

  const isPasswordValid = (password: string) => {
    const { passwordPolicy } = options;
    if (password.length < passwordPolicy.minLength) return false;
    if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) return false;
    if (passwordPolicy.requireNumbers && !/[0-9]/.test(password)) return false;
    if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
  };

  const isPasswordMatch = formData.newPassword !== '' && formData.newPassword === formData.confirmPassword;

  return (
    <div className="password-change-form">
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-section">
          <h3 className="section-title">비밀번호 변경</h3>
          <p className="section-description">
            보안을 위해 현재 비밀번호를 입력한 후 새로운 비밀번호를 설정해주세요.
          </p>

          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">
              현재 비밀번호 <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="현재 비밀번호를 입력해주세요"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('current')}
                aria-label={showPasswords.current ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPasswords.current ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="newPassword">
              새 비밀번호 <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="새 비밀번호를 입력해주세요"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
                aria-label={showPasswords.new ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.newPassword ? (
              <span className="error-message">{errors.newPassword}</span>
            ) : (
              <div className="password-requirements">
                <span className={`requirement ${isPasswordValid(formData.newPassword) ? 'valid' : 'invalid'}`}>
                  {getPasswordValidationMessage()}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              새 비밀번호 확인 <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="새 비밀번호를 다시 입력해주세요"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
                aria-label={showPasswords.confirm ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword ? (
              <span className="error-message">{errors.confirmPassword}</span>
            ) : formData.confirmPassword && (
              <span className={`password-match ${isPasswordMatch ? 'valid' : 'invalid'}`}>
                {isPasswordMatch ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
              </span>
            )}
          </div>
        </div>

        <div className="password-tips">
          <h4 className="tips-title">비밀번호 설정 시 주의사항</h4>
          <ul className="tips-list">
            <li>개인정보(이름, 생년월일, 전화번호 등)를 포함하지 마세요</li>
            <li>이전에 사용했던 비밀번호는 사용하지 마세요</li>
            <li>다른 사이트와 동일한 비밀번호는 사용하지 마세요</li>
            <li>정기적으로 비밀번호를 변경해주세요</li>
          </ul>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || !formData.currentPassword || !isPasswordValid(formData.newPassword) || !isPasswordMatch}
          >
            {isLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </div>
      </form>
    </div>
  );
};