import React from 'react';
import { RefundAccount, Bank } from '../types';

interface RefundAccountSectionProps {
  refundAccount: RefundAccount;
  banks: Bank[];
  errors: Partial<Record<keyof RefundAccount, string>>;
  onChange: (field: keyof RefundAccount, value: string) => void;
}

export const RefundAccountSection: React.FC<RefundAccountSectionProps> = ({
  refundAccount,
  banks,
  errors,
  onChange
}) => {
  return (
    <div className="section refund-account-section">
      <h2 className="section-title">환불 계좌</h2>
      
      <div className="form-group">
        <label htmlFor="holderName" className="form-label required">
          예금주
        </label>
        <input
          type="text"
          id="holderName"
          className={`form-input ${errors.holderName ? 'error' : ''}`}
          value={refundAccount.holderName}
          onChange={(e) => onChange('holderName', e.target.value)}
          placeholder="예금주명을 입력해주세요"
        />
        {errors.holderName && (
          <span className="error-message">{errors.holderName}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="bankCode" className="form-label required">
          은행
        </label>
        <select
          id="bankCode"
          className={`form-select ${errors.bankCode ? 'error' : ''}`}
          value={refundAccount.bankCode}
          onChange={(e) => onChange('bankCode', e.target.value)}
        >
          <option value="">은행을 선택해주세요</option>
          {banks.map((bank) => (
            <option key={bank.code} value={bank.code}>
              {bank.name}
            </option>
          ))}
        </select>
        {errors.bankCode && (
          <span className="error-message">{errors.bankCode}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="accountNumber" className="form-label required">
          계좌번호
        </label>
        <input
          type="text"
          id="accountNumber"
          className={`form-input ${errors.accountNumber ? 'error' : ''}`}
          value={refundAccount.accountNumber}
          onChange={(e) => onChange('accountNumber', e.target.value)}
          placeholder="계좌번호를 입력해주세요 (- 제외)"
        />
        {errors.accountNumber && (
          <span className="error-message">{errors.accountNumber}</span>
        )}
      </div>
    </div>
  );
};