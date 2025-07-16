import React from 'react';
import { PaymentMethod, Bank } from '../types';

interface PaymentMethodSectionProps {
  paymentMethods: PaymentMethod[];
  selectedMethodId: string;
  selectedBank?: string;
  banks: Bank[];
  onMethodChange: (methodId: string) => void;
  onBankChange: (bankCode: string) => void;
}

export const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  paymentMethods,
  selectedMethodId,
  selectedBank,
  banks,
  onMethodChange,
  onBankChange
}) => {
  const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId);
  
  return (
    <div className="section payment-method-section">
      <h2 className="section-title">결제 수단</h2>
      
      <div className="payment-methods">
        {paymentMethods.map((method) => (
          <label key={method.id} className="payment-method-option">
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethodId === method.id}
              onChange={() => onMethodChange(method.id)}
              disabled={!method.enabled}
            />
            <span className={`method-label ${!method.enabled ? 'disabled' : ''}`}>
              {method.name}
            </span>
          </label>
        ))}
      </div>
      
      {selectedMethod?.type === 'bank' && (
        <div className="bank-transfer-info">
          <div className="form-group">
            <label className="form-label">입금 은행</label>
            <select
              className="form-select"
              value={selectedBank}
              onChange={(e) => onBankChange(e.target.value)}
            >
              <option value="">은행을 선택해주세요</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div className="transfer-notice">
            <p>• 주문 후 24시간 이내에 입금해주세요.</p>
            <p>• 입금자명과 주문자명이 다를 경우 고객센터로 연락해주세요.</p>
          </div>
        </div>
      )}
    </div>
  );
};