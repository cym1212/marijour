import React, { useState } from 'react';

interface ResetPasswordProps {
  onReset: (password: string) => void;
  onBack: () => void;
  actions: any;
  options: any;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  onReset,
  onBack,
  actions,
  options
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));

    // Check password strength
    if (value && options.showPasswordStrength) {
      const strength = actions.validatePassword(value);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }

    // Clear confirm password error if passwords match
    if (confirmPassword && value === confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setErrors(prev => ({ ...prev, confirmPassword: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate password
    if (!password) {
      newErrors.password = '새 비밀번호를 입력해주세요.';
    } else {
      const validation = actions.validatePassword(password);
      if (!validation.isValid) {
        newErrors.password = validation.messages[0] || '비밀번호가 정책을 충족하지 않습니다.';
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onReset(password);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    if (!passwordStrength) return '';
    if (passwordStrength.score >= 80) return 'strong';
    if (passwordStrength.score >= 50) return 'medium';
    return 'weak';
  };

  const isFormValid = password.length > 0 && confirmPassword.length > 0;

  return (
    <div className="reset-password-step">
      <div className="step-header">
        <h2 className="step-title">{options.messages?.resetTitle || '새 비밀번호 설정'}</h2>
        <p className="step-description">
          새로운 비밀번호를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="reset-form">
        {/* New Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            새 비밀번호 <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="새 비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {showPassword ? '숨기기' : '표시'}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
          
          {/* Password Strength Indicator */}
          {options.showPasswordStrength && passwordStrength && (
            <div className="password-strength">
              <div className={`strength-bar ${getPasswordStrengthClass()}`}>
                <div className="strength-fill" style={{ width: `${passwordStrength.score}%` }} />
              </div>
              <p className="strength-text">
                {passwordStrength.score >= 80 && '강함'}
                {passwordStrength.score >= 50 && passwordStrength.score < 80 && '보통'}
                {passwordStrength.score < 50 && '약함'}
              </p>
              {passwordStrength.suggestions?.map((suggestion: string, index: number) => (
                <p key={index} className="strength-suggestion">{suggestion}</p>
              ))}
            </div>
          )}
          
          {/* Password Policy */}
          {options.passwordPolicy && (
            <ul className="password-policy">
              {options.passwordPolicy.minLength && (
                <li className={password.length >= options.passwordPolicy.minLength ? 'valid' : ''}>
                  {options.passwordPolicy.minLength}자 이상
                </li>
              )}
              {options.passwordPolicy.requireUppercase && (
                <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                  대문자 포함
                </li>
              )}
              {options.passwordPolicy.requireLowercase && (
                <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                  소문자 포함
                </li>
              )}
              {options.passwordPolicy.requireNumbers && (
                <li className={/[0-9]/.test(password) ? 'valid' : ''}>
                  숫자 포함
                </li>
              )}
              {options.passwordPolicy.requireSpecialChars && (
                <li className={/[^A-Za-z0-9]/.test(password) ? 'valid' : ''}>
                  특수문자 포함
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            새 비밀번호 확인 <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="새 비밀번호를 다시 입력해주세요"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {showConfirmPassword ? '숨기기' : '표시'}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          {!errors.confirmPassword && confirmPassword && password === confirmPassword && (
            <span className="success-message">비밀번호가 일치합니다</span>
          )}
        </div>

        {/* Form Buttons */}
        <div className="form-buttons">
          <button
            type="button"
            className="submit-button secondary"
            onClick={onBack}
            disabled={isLoading}
          >
            이전
          </button>
          <button
            type="submit"
            className="submit-button primary"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? '처리중...' : '비밀번호 재설정'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;