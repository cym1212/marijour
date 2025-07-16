import React, { useState } from 'react';
import { CouponInfo } from '../types';

interface CouponSectionProps {
  coupons: CouponInfo[];
  selectedCouponId?: string;
  onCouponSelect: (couponId: string | null) => void;
}

export const CouponSection: React.FC<CouponSectionProps> = ({
  coupons,
  selectedCouponId,
  onCouponSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDiscount = (coupon: CouponInfo) => {
    if (coupon.discountType === 'percent') {
      return `${coupon.discountValue}%`;
    } else {
      return `${coupon.discountValue.toLocaleString('ko-KR')}원`;
    }
  };

  const selectedCoupon = coupons.find(c => c.id === selectedCouponId);

  return (
    <div className="coupon-section">
      <div className="section-header">
        <h3 className="section-title">쿠폰</h3>
        <button
          className="section-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '접기' : '펼치기'}
        </button>
      </div>
      
      {isOpen && (
        <div className="coupon-content">
          <div className="coupon-select">
            <select
              value={selectedCouponId || ''}
              onChange={(e) => onCouponSelect(e.target.value || null)}
              className="coupon-dropdown"
            >
              <option value="">쿠폰을 선택해주세요</option>
              {coupons.map((coupon) => (
                <option key={coupon.id} value={coupon.id}>
                  {coupon.name} - {formatDiscount(coupon)} 할인
                  {coupon.minOrderAmount && ` (${coupon.minOrderAmount.toLocaleString('ko-KR')}원 이상)`}
                </option>
              ))}
            </select>
          </div>
          
          {selectedCoupon && (
            <div className="selected-coupon">
              <span className="coupon-name">{selectedCoupon.name}</span>
              <span className="coupon-discount">{formatDiscount(selectedCoupon)} 할인 적용</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};