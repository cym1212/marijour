import React, { useState } from 'react';
import { CouponInfo } from '../types';

interface CouponPointsSectionProps {
  coupons: CouponInfo[];
  availablePoints: number;
  selectedCouponId?: string;
  usedPoints: number;
  showCoupon: boolean;
  showPoints: boolean;
  onCouponSelect: (couponId: string | undefined) => void;
  onPointsChange: (points: number) => void;
}

export const CouponPointsSection: React.FC<CouponPointsSectionProps> = ({
  coupons,
  availablePoints,
  selectedCouponId,
  usedPoints,
  showCoupon,
  showPoints,
  onCouponSelect,
  onPointsChange
}) => {
  const [pointsInput, setPointsInput] = useState(usedPoints.toString());
  
  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue <= availablePoints) {
      setPointsInput(value);
      onPointsChange(numValue);
    }
  };
  
  const handleUseAllPoints = () => {
    setPointsInput(availablePoints.toString());
    onPointsChange(availablePoints);
  };
  
  const formatDiscount = (coupon: CouponInfo) => {
    if (coupon.discountType === 'percent') {
      return `${coupon.discountValue}%`;
    } else {
      return `${coupon.discountValue.toLocaleString('ko-KR')}원`;
    }
  };
  
  if (!showCoupon && !showPoints) {
    return null;
  }
  
  return (
    <div className="section coupon-points-section">
      <h2 className="section-title">할인 적용</h2>
      
      {showCoupon && (
        <div className="subsection coupon-subsection">
          <h3 className="subsection-title">쿠폰</h3>
          <div className="form-group">
            <select
              className="form-select"
              value={selectedCouponId || ''}
              onChange={(e) => onCouponSelect(e.target.value || undefined)}
            >
              <option value="">쿠폰을 선택해주세요</option>
              {coupons.filter(c => !c.isUsed).map((coupon) => (
                <option key={coupon.id} value={coupon.id}>
                  {coupon.name} - {formatDiscount(coupon)} 할인
                  {coupon.minOrderAmount && ` (${coupon.minOrderAmount.toLocaleString('ko-KR')}원 이상)`}
                </option>
              ))}
            </select>
            <div className="coupon-info">
              보유 쿠폰: {coupons.filter(c => !c.isUsed).length}장
            </div>
          </div>
        </div>
      )}
      
      {showPoints && (
        <div className="subsection points-subsection">
          <h3 className="subsection-title">포인트</h3>
          <div className="form-group">
            <div className="points-input-group">
              <input
                type="number"
                className="form-input"
                value={pointsInput}
                onChange={(e) => handlePointsChange(e.target.value)}
                placeholder="0"
                min="0"
                max={availablePoints}
              />
              <button
                type="button"
                className="use-all-button"
                onClick={handleUseAllPoints}
              >
                모두 사용
              </button>
            </div>
            <div className="points-info">
              보유 포인트: {availablePoints.toLocaleString('ko-KR')}P
            </div>
          </div>
        </div>
      )}
    </div>
  );
};