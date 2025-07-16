import React from 'react';
import { OrdererInfo } from '../types';

interface OrdererInfoSectionProps {
  ordererInfo: OrdererInfo;
  errors: Partial<Record<keyof OrdererInfo, string>>;
  showSameAsOrderer: boolean;
  sameAsOrderer: boolean;
  onChange: (field: keyof OrdererInfo, value: string) => void;
  onSameAsOrdererChange: (checked: boolean) => void;
}

export const OrdererInfoSection: React.FC<OrdererInfoSectionProps> = ({
  ordererInfo,
  errors,
  showSameAsOrderer,
  sameAsOrderer,
  onChange,
  onSameAsOrdererChange
}) => {
  return (
    <div className="section orderer-info-section">
      <div className="section-header">
        <h2 className="section-title">주문자 정보</h2>
        {showSameAsOrderer && (
          <label className="same-as-orderer">
            <input
              type="checkbox"
              checked={sameAsOrderer}
              onChange={(e) => onSameAsOrdererChange(e.target.checked)}
            />
            <span>주문자 정보와 동일</span>
          </label>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="ordererName" className="form-label required">
          이름
        </label>
        <input
          type="text"
          id="ordererName"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={ordererInfo.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="주문자 이름을 입력해주세요"
        />
        {errors.name && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="ordererEmail" className="form-label required">
          이메일
        </label>
        <input
          type="email"
          id="ordererEmail"
          className={`form-input ${errors.email ? 'error' : ''}`}
          value={ordererInfo.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="example@email.com"
        />
        {errors.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="ordererPhone" className="form-label required">
          연락처
        </label>
        <input
          type="tel"
          id="ordererPhone"
          className={`form-input ${errors.phone ? 'error' : ''}`}
          value={ordererInfo.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="010-0000-0000"
        />
        {errors.phone && (
          <span className="error-message">{errors.phone}</span>
        )}
      </div>
    </div>
  );
};