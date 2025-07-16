import React, { useState } from 'react';
import { WithdrawalForm as WithdrawalFormType, FormErrors } from '../types';

interface AccountWithdrawalProps {
  withdrawalReasons: string[];
  onSubmit: (formData: WithdrawalFormType) => void;
  errors: FormErrors;
  isLoading: boolean;
  utils: {
    showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
  };
}

export const AccountWithdrawal: React.FC<AccountWithdrawalProps> = ({
  withdrawalReasons,
  onSubmit,
  errors,
  isLoading,
  utils
}) => {
  const [formData, setFormData] = useState<WithdrawalFormType>({
    reason: '',
    detail: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: keyof WithdrawalFormType, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    onSubmit(formData);
  };

  const handleCancel = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
      return;
    }
    
    // Reset form
    setFormData({
      reason: '',
      detail: '',
      confirmPassword: '',
      agreeToTerms: false
    });
  };

  if (showConfirmation) {
    return (
      <div className="account-withdrawal-form">
        <div className="withdrawal-confirmation">
          <div className="confirmation-content">
            <h3 className="confirmation-title">정말로 회원탈퇴를 진행하시겠습니까?</h3>
            
            <div className="withdrawal-warnings">
              <div className="warning-item">
                <h4>⚠️ 회원탈퇴 시 주의사항</h4>
                <ul>
                  <li>탈퇴 시 회원정보는 즉시 삭제되며 복구할 수 없습니다</li>
                  <li>주문 내역, 적립금, 쿠폰 등 모든 혜택이 삭제됩니다</li>
                  <li>동일한 이메일로 재가입 시 기존 정보는 복구되지 않습니다</li>
                  <li>진행 중인 주문이 있는 경우 탈퇴가 제한될 수 있습니다</li>
                </ul>
              </div>

              <div className="withdrawal-summary">
                <h4>탈퇴 사유</h4>
                <p><strong>{formData.reason}</strong></p>
                {formData.detail && (
                  <>
                    <h4>상세 사유</h4>
                    <p>{formData.detail}</p>
                  </>
                )}
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="button"
                className="confirm-button danger"
                onClick={() => onSubmit(formData)}
                disabled={isLoading}
              >
                {isLoading ? '탈퇴 진행 중...' : '탈퇴 진행'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-withdrawal-form">
      <form onSubmit={handleSubmit} className="withdrawal-form">
        <div className="form-section">
          <h3 className="section-title">회원탈퇴</h3>
          <p className="section-description">
            회원탈퇴를 진행하기 전에 아래 내용을 확인해주세요.
          </p>

          <div className="withdrawal-notice">
            <h4 className="notice-title">📋 탈퇴 전 확인사항</h4>
            <ul className="notice-list">
              <li>진행 중인 주문이 있는지 확인해주세요</li>
              <li>보유 중인 적립금이나 쿠폰을 사용해주세요</li>
              <li>필요한 주문 내역은 미리 저장해주세요</li>
              <li>탈퇴 후에는 모든 정보가 삭제되어 복구할 수 없습니다</li>
            </ul>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reason">
              탈퇴 사유 <span className="required">*</span>
            </label>
            <select
              id="reason"
              className={`form-select ${errors.reason ? 'error' : ''}`}
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              required
            >
              <option value="">탈퇴 사유를 선택해주세요</option>
              {withdrawalReasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
            {errors.reason && <span className="error-message">{errors.reason}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="detail">
              상세 사유 (선택사항)
            </label>
            <textarea
              id="detail"
              className="form-textarea"
              value={formData.detail}
              onChange={(e) => handleInputChange('detail', e.target.value)}
              placeholder="탈퇴 사유에 대한 상세한 내용을 입력해주세요 (선택사항)"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              비밀번호 확인 <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="현재 비밀번호를 입력해주세요"
              required
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="checkbox-input"
                required
              />
              <span className="checkbox-text">
                위 탈퇴 안내사항을 모두 확인했으며, 회원탈퇴를 진행하는 것에 동의합니다.
              </span>
            </label>
            {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
          </div>
        </div>

        <div className="withdrawal-warning">
          <div className="warning-box">
            <h4 className="warning-title">⚠️ 중요 안내</h4>
            <p>
              회원탈퇴 시 모든 개인정보가 삭제되며, 동일한 이메일로 재가입하더라도 
              기존 정보는 복구되지 않습니다. 신중히 결정해주세요.
            </p>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            type="submit"
            className="submit-button danger"
            disabled={isLoading || !formData.reason || !formData.confirmPassword || !formData.agreeToTerms}
          >
            {isLoading ? '처리 중...' : '회원탈퇴 신청'}
          </button>
        </div>
      </form>
    </div>
  );
};