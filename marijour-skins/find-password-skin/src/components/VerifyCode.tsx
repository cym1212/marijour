import React, { useState, useRef, useEffect } from 'react';

interface VerifyCodeProps {
  resetMethod: 'email' | 'phone';
  resetValue: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  isResendDisabled: boolean;
  resendCountdown: number;
  attempts: number;
  maxAttempts: number;
  showAttemptsRemaining?: boolean;
}

const VerifyCode: React.FC<VerifyCodeProps> = ({
  resetMethod,
  resetValue,
  onVerify,
  onResend,
  onBack,
  isResendDisabled,
  resendCountdown,
  attempts,
  maxAttempts,
  showAttemptsRemaining = true
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5 && newCode.every(c => c !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Move to previous input if current is empty
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedData[i] || '';
      }
      setCode(newCode);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newCode.findIndex(c => c === '');
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      
      // Auto-submit if all filled
      if (pastedData.length === 6) {
        handleSubmit(pastedData);
      }
    }
  };

  const handleSubmit = async (codeString?: string) => {
    const verificationCode = codeString || code.join('');
    
    if (verificationCode.length !== 6) {
      setError('6자리 인증 코드를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await onVerify(verificationCode);
    } finally {
      setIsLoading(false);
    }
  };

  const isCodeComplete = code.every(c => c !== '');
  const remainingAttempts = maxAttempts - attempts;

  // Format the reset value for display
  const formatResetValue = () => {
    if (resetMethod === 'email') {
      const [username, domain] = resetValue.split('@');
      if (username.length > 3) {
        return `${username.substring(0, 3)}***@${domain}`;
      }
      return resetValue;
    } else {
      // Phone number
      if (resetValue.length >= 11) {
        return `${resetValue.substring(0, 3)}-****-${resetValue.substring(7)}`;
      }
      return resetValue;
    }
  };

  return (
    <div className="verify-code-step">
      <div className="step-header">
        <h2 className="step-title">인증 코드 입력</h2>
        <p className="step-description">
          {resetMethod === 'email' ? '이메일' : '휴대폰'}으로 발송된 6자리 인증 코드를 입력해주세요.
        </p>
        <p className="reset-value">
          {formatResetValue()}
        </p>
      </div>

      <div className="code-input-container">
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`code-input ${error ? 'error' : ''}`}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isLoading}
              autoComplete="off"
            />
          ))}
        </div>
        
        {error && <span className="error-message">{error}</span>}
        
        {showAttemptsRemaining && attempts > 0 && (
          <p className="attempts-info">
            남은 시도 횟수: {remainingAttempts}회
          </p>
        )}
      </div>

      <div className="verify-actions">
        <button
          type="button"
          className="resend-button"
          onClick={onResend}
          disabled={isResendDisabled || isLoading}
        >
          {isResendDisabled ? `재발송 ${resendCountdown}초` : '인증 코드 재발송'}
        </button>
      </div>

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
          type="button"
          className="submit-button primary"
          onClick={() => handleSubmit()}
          disabled={!isCodeComplete || isLoading}
        >
          {isLoading ? '확인중...' : '확인'}
        </button>
      </div>
    </div>
  );
};

export default VerifyCode;