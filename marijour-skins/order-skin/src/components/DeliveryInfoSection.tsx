import React from 'react';
import { DeliveryInfo, DeliveryRequest } from '../types';

interface DeliveryInfoSectionProps {
  deliveryInfo: DeliveryInfo;
  deliveryRequests: DeliveryRequest[];
  errors: Partial<Record<keyof DeliveryInfo, string>>;
  onChange: (field: keyof DeliveryInfo, value: string) => void;
  onAddressSearch: () => void;
}

export const DeliveryInfoSection: React.FC<DeliveryInfoSectionProps> = ({
  deliveryInfo,
  deliveryRequests,
  errors,
  onChange,
  onAddressSearch
}) => {
  return (
    <div className="section delivery-info-section">
      <h2 className="section-title">배송지 정보</h2>
      
      <div className="form-group">
        <label htmlFor="recipientName" className="form-label required">
          받는 분
        </label>
        <input
          type="text"
          id="recipientName"
          className={`form-input ${errors.recipientName ? 'error' : ''}`}
          value={deliveryInfo.recipientName}
          onChange={(e) => onChange('recipientName', e.target.value)}
          placeholder="받는 분 성함을 입력해주세요"
        />
        {errors.recipientName && (
          <span className="error-message">{errors.recipientName}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="recipientPhone" className="form-label required">
          연락처
        </label>
        <input
          type="tel"
          id="recipientPhone"
          className={`form-input ${errors.recipientPhone ? 'error' : ''}`}
          value={deliveryInfo.recipientPhone}
          onChange={(e) => onChange('recipientPhone', e.target.value)}
          placeholder="010-0000-0000"
        />
        {errors.recipientPhone && (
          <span className="error-message">{errors.recipientPhone}</span>
        )}
      </div>
      
      <div className="form-group">
        <label className="form-label required">주소</label>
        <div className="address-group">
          <div className="postal-code-group">
            <input
              type="text"
              className={`form-input ${errors.postalCode ? 'error' : ''}`}
              value={deliveryInfo.postalCode}
              readOnly
              placeholder="우편번호"
            />
            <button
              type="button"
              className="address-search-button"
              onClick={onAddressSearch}
            >
              주소 검색
            </button>
          </div>
          <input
            type="text"
            className={`form-input ${errors.roadAddress ? 'error' : ''}`}
            value={deliveryInfo.roadAddress}
            readOnly
            placeholder="도로명 주소"
          />
          <input
            type="text"
            className={`form-input ${errors.detailAddress ? 'error' : ''}`}
            value={deliveryInfo.detailAddress}
            onChange={(e) => onChange('detailAddress', e.target.value)}
            placeholder="상세주소를 입력해주세요"
          />
          {(errors.postalCode || errors.roadAddress || errors.detailAddress) && (
            <span className="error-message">
              {errors.postalCode || errors.roadAddress || errors.detailAddress}
            </span>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="deliveryRequest" className="form-label">
          배송 요청사항
        </label>
        <select
          id="deliveryRequest"
          className="form-select"
          value={deliveryInfo.deliveryRequest}
          onChange={(e) => onChange('deliveryRequest', e.target.value)}
        >
          {deliveryRequests.map((request) => (
            <option key={request.value} value={request.value}>
              {request.label}
            </option>
          ))}
        </select>
        {deliveryInfo.deliveryRequest === 'custom' && (
          <input
            type="text"
            className="form-input mt-2"
            value={deliveryInfo.customRequest || ''}
            onChange={(e) => onChange('customRequest', e.target.value)}
            placeholder="요청사항을 입력해주세요"
          />
        )}
      </div>
    </div>
  );
};