import React from 'react';
import { SignUpFormData, FormErrors, SignUpState, SignUpOptions } from '../types';

interface SignUpFormProps {
  formData: SignUpFormData;
  errors: FormErrors;
  signUpState: SignUpState;
  options: SignUpOptions;
  onInputChange: (field: keyof SignUpFormData, value: any) => void;
  onSubmit: (event: React.FormEvent) => void;
  onTogglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
  onSendEmailVerification: () => void;
  onSendSMSVerification: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  formData,
  errors,
  signUpState,
  options,
  onInputChange,
  onSubmit,
  onTogglePasswordVisibility,
  onSendEmailVerification,
  onSendSMSVerification
}) => {
  const getPasswordStrengthColor = (score: number = 0) => {
    if (score < 30) return '#dc3545';
    if (score < 60) return '#ffc107';
    if (score < 80) return '#17a2b8';
    return '#28a745';
  };

  const getPasswordStrengthText = (score: number = 0) => {
    if (score < 30) return '약함';
    if (score < 60) return '보통';
    if (score < 80) return '강함';
    return '매우 강함';
  };

  const isFormValid = () => {
    const requiredFields = ['email', 'name', 'password', 'confirmPassword'];
    const requiredFieldsValid = requiredFields.every(field => formData[field as keyof SignUpFormData]?.toString().trim());
    const passwordMatch = formData.password === formData.confirmPassword;
    const passwordValid = signUpState.passwordStrength.isValid;
    const agreementsValid = formData.agreements.age && formData.agreements.terms && formData.agreements.privacy;
    
    return requiredFieldsValid && passwordMatch && passwordValid && agreementsValid;
  };

  return (
    <form onSubmit={onSubmit} className="signup-form">
      <div className="form-section">
        <h3 className="section-title">기본 정보</h3>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            이메일 <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'error' : ''} ${signUpState.emailAvailable ? 'success' : ''}`}
              placeholder="이메일을 입력하세요"
              value={formData.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              disabled={signUpState.isLoading}
              autoComplete="email"
            />
            {options.requireEmailVerification && formData.email && signUpState.emailAvailable && (
              <button
                type="button"
                className="verify-button"
                onClick={onSendEmailVerification}
                disabled={signUpState.isLoading || signUpState.emailVerificationSent}
              >
                {signUpState.emailVerificationSent ? '발송완료' : '인증'}
              </button>
            )}
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
          {options.validation.showEmailSuggestions && formData.email && !signUpState.emailAvailable && (
            <span className="warning-message">이미 사용 중인 이메일입니다.</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            이름 <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="이름을 입력하세요"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            disabled={signUpState.isLoading}
            autoComplete="name"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {options.allowNicknameSignUp && options.fieldsConfig.nickname.visible && (
          <div className="form-group">
            <label htmlFor="nickname" className="form-label">
              닉네임 {options.fieldsConfig.nickname.required && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id="nickname"
              className={`form-input ${errors.nickname ? 'error' : ''} ${signUpState.nicknameAvailable ? 'success' : ''}`}
              placeholder={options.fieldsConfig.nickname.placeholder || "닉네임을 입력하세요"}
              value={formData.nickname}
              onChange={(e) => onInputChange('nickname', e.target.value)}
              disabled={signUpState.isLoading}
              autoComplete="nickname"
            />
            {errors.nickname && <span className="error-message">{errors.nickname}</span>}
            {options.validation.showNicknameAvailability && formData.nickname && !signUpState.nicknameAvailable && (
              <span className="warning-message">이미 사용 중인 닉네임입니다.</span>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            비밀번호 <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={signUpState.showPassword ? 'text' : 'password'}
              id="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => onInputChange('password', e.target.value)}
              disabled={signUpState.isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => onTogglePasswordVisibility('password')}
              disabled={signUpState.isLoading}
              aria-label={signUpState.showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {signUpState.showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
          {options.validation.showPasswordStrength && formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div 
                  className="strength-fill"
                  style={{ 
                    width: `${signUpState.passwordStrength.score || 0}%`,
                    backgroundColor: getPasswordStrengthColor(signUpState.passwordStrength.score)
                  }}
                />
              </div>
              <span 
                className="strength-text"
                style={{ color: getPasswordStrengthColor(signUpState.passwordStrength.score) }}
              >
                {getPasswordStrengthText(signUpState.passwordStrength.score)}
              </span>
            </div>
          )}
          {signUpState.passwordStrength.suggestions && signUpState.passwordStrength.suggestions.length > 0 && (
            <div className="password-suggestions">
              {signUpState.passwordStrength.suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            비밀번호 확인 <span className="required">*</span>
          </label>
          <div className="password-input-wrapper">
            <input
              type={signUpState.showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={(e) => onInputChange('confirmPassword', e.target.value)}
              disabled={signUpState.isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => onTogglePasswordVisibility('confirmPassword')}
              disabled={signUpState.isLoading}
              aria-label={signUpState.showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {signUpState.showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          {formData.confirmPassword && (
            <span className={`password-match ${formData.password === formData.confirmPassword ? 'valid' : 'invalid'}`}>
              {formData.password === formData.confirmPassword ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
            </span>
          )}
        </div>
      </div>

      {options.allowOptionalFields && (
        <div className="form-section">
          <h3 className="section-title">추가 정보</h3>
          
          {options.fieldsConfig.phoneNumber.visible && (
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">
                휴대폰 번호 {options.fieldsConfig.phoneNumber.required && <span className="required">*</span>}
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="phoneNumber"
                  className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                  placeholder="휴대폰 번호를 입력하세요"
                  value={formData.phoneNumber}
                  onChange={(e) => onInputChange('phoneNumber', e.target.value)}
                  disabled={signUpState.isLoading}
                  autoComplete="tel"
                />
                {options.requirePhoneVerification && formData.phoneNumber && (
                  <button
                    type="button"
                    className="verify-button"
                    onClick={onSendSMSVerification}
                    disabled={signUpState.isLoading || signUpState.phoneVerificationSent}
                  >
                    {signUpState.phoneVerificationSent ? '발송완료' : '인증'}
                  </button>
                )}
              </div>
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
          )}

          {options.fieldsConfig.birthDate.visible && (
            <div className="form-group">
              <label htmlFor="birthDate" className="form-label">
                생년월일 {options.fieldsConfig.birthDate.required && <span className="required">*</span>}
              </label>
              <input
                type="date"
                id="birthDate"
                className={`form-input ${errors.birthDate ? 'error' : ''}`}
                value={formData.birthDate}
                onChange={(e) => onInputChange('birthDate', e.target.value)}
                disabled={signUpState.isLoading}
                autoComplete="bday"
              />
              {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
            </div>
          )}

          {options.fieldsConfig.gender.visible && (
            <div className="form-group">
              <label className="form-label">
                성별 {options.fieldsConfig.gender.required && <span className="required">*</span>}
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => onInputChange('gender', e.target.value)}
                    disabled={signUpState.isLoading}
                    className="radio-input"
                  />
                  <span className="radio-text">남성</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => onInputChange('gender', e.target.value)}
                    disabled={signUpState.isLoading}
                    className="radio-input"
                  />
                  <span className="radio-text">여성</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={(e) => onInputChange('gender', e.target.value)}
                    disabled={signUpState.isLoading}
                    className="radio-input"
                  />
                  <span className="radio-text">기타</span>
                </label>
              </div>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          )}

          {options.allowReferralCode && options.fieldsConfig.referralCode.visible && (
            <div className="form-group">
              <label htmlFor="referralCode" className="form-label">
                추천인 코드 {options.fieldsConfig.referralCode.required && <span className="required">*</span>}
              </label>
              <input
                type="text"
                id="referralCode"
                className={`form-input ${errors.referralCode ? 'error' : ''}`}
                placeholder="추천인 코드를 입력하세요"
                value={formData.referralCode}
                onChange={(e) => onInputChange('referralCode', e.target.value)}
                disabled={signUpState.isLoading}
              />
              {errors.referralCode && <span className="error-message">{errors.referralCode}</span>}
            </div>
          )}

          {options.fieldsConfig.invitationCode.visible && (
            <div className="form-group">
              <label htmlFor="invitationCode" className="form-label">
                초대 코드 {options.fieldsConfig.invitationCode.required && <span className="required">*</span>}
              </label>
              <input
                type="text"
                id="invitationCode"
                className={`form-input ${errors.invitationCode ? 'error' : ''}`}
                placeholder="초대 코드를 입력하세요"
                value={formData.invitationCode}
                onChange={(e) => onInputChange('invitationCode', e.target.value)}
                disabled={signUpState.isLoading}
              />
              {errors.invitationCode && <span className="error-message">{errors.invitationCode}</span>}
            </div>
          )}
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid() || signUpState.isLoading}
          style={{ 
            backgroundColor: options.theme.primaryColor,
            borderColor: options.theme.primaryColor
          }}
        >
          {signUpState.isLoading ? '가입 중...' : '회원가입'}
        </button>
      </div>
    </form>
  );
};