import React, { useState } from 'react';

interface RequestResetProps {
  onSubmit: (method: 'email' | 'phone', value: string, name?: string) => void;
  actions: any;
  options: any;
  defaultMethod?: 'email' | 'phone';
}

const RequestReset: React.FC<RequestResetProps> = ({
  onSubmit,
  actions,
  options,
  defaultMethod = 'email'
}) => {
  const [method, setMethod] = useState<'email' | 'phone'>(defaultMethod);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const clearErrors = () => {
    setErrors({});
  };

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);

    try {
      // Validate name if required
      if (!name.trim()) {
        setFieldError('name', '이름을 입력해주세요.');
        setIsLoading(false);
        return;
      }

      // Validate based on method
      if (method === 'email') {
        if (!email.trim()) {
          setFieldError('email', '이메일을 입력해주세요.');
          setIsLoading(false);
          return;
        }
        if (!actions.validateEmail(email)) {
          setFieldError('email', '올바른 이메일 형식을 입력해주세요.');
          setIsLoading(false);
          return;
        }
        
        // Check if user exists
        const userCheck = await actions.checkUserExists('email', email);
        if (!userCheck.exists) {
          setFieldError('email', '등록되지 않은 이메일입니다.');
          setIsLoading(false);
          return;
        }
        
        onSubmit('email', email, name);
      } else {
        if (!phone.trim()) {
          setFieldError('phone', '휴대폰 번호를 입력해주세요.');
          setIsLoading(false);
          return;
        }
        if (!actions.validatePhoneNumber(phone)) {
          setFieldError('phone', '올바른 휴대폰 번호 형식을 입력해주세요.');
          setIsLoading(false);
          return;
        }
        
        // Check if user exists
        const userCheck = await actions.checkUserExists('phone', phone);
        if (!userCheck.exists) {
          setFieldError('phone', '등록되지 않은 휴대폰 번호입니다.');
          setIsLoading(false);
          return;
        }
        
        onSubmit('phone', phone, name);
      }
    } catch (error) {
      setFieldError('general', '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const hasName = name.trim() !== '';
    const hasValue = method === 'email' ? email.trim() !== '' : phone.trim() !== '';
    return hasName && hasValue;
  };

  return (
    <div className="request-reset-step">
      <div className="step-header">
        <h2 className="step-title">{options.messages?.requestTitle || '비밀번호 찾기'}</h2>
        <p className="step-description">
          가입 시 사용한 정보를 입력해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="reset-form">
        {/* Name Input */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            이름 <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Method Selection */}
        {options.allowEmailReset && options.allowPhoneReset && (
          <div className="method-selection">
            <button
              type="button"
              className={`method-tab ${method === 'email' ? 'active' : ''}`}
              onClick={() => {
                setMethod('email');
                clearErrors();
              }}
              disabled={isLoading}
            >
              이메일로 찾기
            </button>
            <button
              type="button"
              className={`method-tab ${method === 'phone' ? 'active' : ''}`}
              onClick={() => {
                setMethod('phone');
                clearErrors();
              }}
              disabled={isLoading}
            >
              휴대폰 번호로 찾기
            </button>
          </div>
        )}

        {/* Email or Phone Input */}
        {method === 'email' ? (
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              이메일 <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="가입 시 사용한 이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              휴대폰 번호 <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="가입 시 사용한 휴대폰 번호를 입력해주세요"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="error-message general-error">{errors.general}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-button primary"
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? '처리중...' : '재설정 코드 받기'}
        </button>
      </form>
    </div>
  );
};

export default RequestReset;