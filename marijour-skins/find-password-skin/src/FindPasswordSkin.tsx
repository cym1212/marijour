import React, { useState } from 'react';
import { FindPasswordSkinProps } from './types';
import RequestReset from './components/RequestReset';
import VerifyCode from './components/VerifyCode';
import ResetPassword from './components/ResetPassword';
import ResetResult from './components/ResetResult';
import '../styles/find-password-skin.scss';

type Step = 'request' | 'verify' | 'reset' | 'result';

interface FindPasswordState {
  currentStep: Step;
  resetMethod: 'email' | 'phone';
  resetValue: string;
  userName?: string;
  resetToken?: string;
  resendCountdown: number;
  isResendDisabled: boolean;
  attempts: number;
  resendCount: number;
}

const FindPasswordSkin: React.FC<FindPasswordSkinProps> = ({
  data,
  actions,
  options,
  utils,
  mode
}) => {
  const [state, setState] = useState<FindPasswordState>({
    currentStep: 'request',
    resetMethod: options.defaultMethod || 'email',
    resetValue: '',
    userName: '',
    resetToken: '',
    resendCountdown: 0,
    isResendDisabled: false,
    attempts: data.attempts || 0,
    resendCount: data.resendCount || 0
  });

  // Handle step navigation
  const handleStepChange = (step: Step) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  // Handle request reset submission
  const handleRequestReset = async (method: 'email' | 'phone', value: string, name?: string) => {
    try {
      const result = await actions.requestPasswordReset(method, value, name);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          currentStep: 'verify',
          resetMethod: method,
          resetValue: value,
          userName: name,
          attempts: 0
        }));
        
        utils.showToast?.(result.message || '인증 코드가 발송되었습니다.', 'success');
      } else {
        utils.showToast?.(result.message || '요청 처리 중 오류가 발생했습니다.', 'error');
      }
    } catch (error) {
      utils.showToast?.('요청 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  // Handle code verification
  const handleVerifyCode = async (code: string) => {
    try {
      const newAttempts = state.attempts + 1;
      setState(prev => ({ ...prev, attempts: newAttempts }));
      
      const result = await actions.verifyResetCode(code);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          currentStep: 'reset',
          resetToken: result.token,
          attempts: 0
        }));
        
        utils.showToast?.(result.message || '인증이 완료되었습니다.', 'success');
      } else {
        if (newAttempts >= (options.maxAttempts || 5)) {
          utils.showToast?.('최대 시도 횟수를 초과했습니다. 처음부터 다시 시도해주세요.', 'error');
          handleStepChange('request');
        } else {
          utils.showToast?.(result.message || '잘못된 인증 코드입니다.', 'error');
        }
      }
    } catch (error) {
      utils.showToast?.('인증 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  // Handle password reset
  const handleResetPassword = async (newPassword: string) => {
    try {
      const result = await actions.resetPassword(newPassword, state.resetToken!);
      
      if (result.success) {
        setState(prev => ({ ...prev, currentStep: 'result' }));
        utils.showToast?.(result.message || '비밀번호가 재설정되었습니다.', 'success');
      } else {
        utils.showToast?.(result.message || '비밀번호 재설정에 실패했습니다.', 'error');
      }
    } catch (error) {
      utils.showToast?.('비밀번호 재설정 중 오류가 발생했습니다.', 'error');
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (state.isResendDisabled) return;
    
    try {
      const newResendCount = state.resendCount + 1;
      
      if (newResendCount > (options.maxResendCount || 3)) {
        utils.showToast?.('재발송 횟수를 초과했습니다. 처음부터 다시 시도해주세요.', 'error');
        handleStepChange('request');
        return;
      }
      
      setState(prev => ({
        ...prev,
        isResendDisabled: true,
        resendCount: newResendCount
      }));
      
      const result = await actions.resendResetCode();
      
      if (result.success) {
        utils.showToast?.(result.message || '인증 코드가 재발송되었습니다.', 'success');
        
        // Start countdown
        let countdown = options.resendDelaySeconds || 60;
        setState(prev => ({ ...prev, resendCountdown: countdown }));
        
        const timer = setInterval(() => {
          countdown -= 1;
          setState(prev => ({ ...prev, resendCountdown: countdown }));
          
          if (countdown <= 0) {
            clearInterval(timer);
            setState(prev => ({
              ...prev,
              isResendDisabled: false,
              resendCountdown: 0
            }));
          }
        }, 1000);
      } else {
        setState(prev => ({ ...prev, isResendDisabled: false }));
        utils.showToast?.(result.message || '재발송에 실패했습니다.', 'error');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isResendDisabled: false }));
      utils.showToast?.('재발송 중 오류가 발생했습니다.', 'error');
    }
  };

  // Handle navigation
  const handleNavigateToLogin = () => {
    utils.navigate('/login');
  };

  // Render current step
  const renderStep = () => {
    switch (state.currentStep) {
      case 'request':
        return (
          <RequestReset
            onSubmit={handleRequestReset}
            actions={actions}
            options={options}
            defaultMethod={state.resetMethod}
          />
        );
      
      case 'verify':
        return (
          <VerifyCode
            resetMethod={state.resetMethod}
            resetValue={state.resetValue}
            onVerify={handleVerifyCode}
            onResend={handleResendCode}
            onBack={() => handleStepChange('request')}
            isResendDisabled={state.isResendDisabled}
            resendCountdown={state.resendCountdown}
            attempts={state.attempts}
            maxAttempts={options.maxAttempts || 5}
            showAttemptsRemaining={options.showAttemptsRemaining}
          />
        );
      
      case 'reset':
        return (
          <ResetPassword
            onReset={handleResetPassword}
            onBack={() => handleStepChange('verify')}
            actions={actions}
            options={options}
          />
        );
      
      case 'result':
        return (
          <ResetResult
            onNavigateToLogin={handleNavigateToLogin}
            message={options.messages?.successMessage}
          />
        );
    }
  };

  return (
    <div className={`find-password-skin ${mode}`}>
      <div className="find-password-wrapper">
        {renderStep()}
      </div>
    </div>
  );
};

export default FindPasswordSkin;