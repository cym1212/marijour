import React, { useEffect } from 'react';

interface ResetResultProps {
  onNavigateToLogin: () => void;
  message?: string;
}

const ResetResult: React.FC<ResetResultProps> = ({
  onNavigateToLogin,
  message
}) => {
  useEffect(() => {
    // Add entrance animation
    const timer = setTimeout(() => {
      const element = document.querySelector('.reset-result-step');
      if (element) {
        element.classList.add('animate-in');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="reset-result-step">
      <div className="result-content">
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <div className="success-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="result-message">
          <h2 className="result-title">재설정 완료</h2>
          <p className="result-description">
            {message || '비밀번호가 성공적으로 재설정되었습니다.'}
            <br />
            새로운 비밀번호로 로그인해주세요.
          </p>
        </div>

        {/* Login Button */}
        <button
          type="button"
          className="submit-button primary full-width"
          onClick={onNavigateToLogin}
        >
          로그인하기
        </button>
      </div>
    </div>
  );
};

export default ResetResult;