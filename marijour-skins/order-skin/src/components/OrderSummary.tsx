import React from 'react';
import { OrderSummary as OrderSummaryType } from '../types';

interface OrderSummaryProps {
  summary: OrderSummaryType;
  onSubmit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  summary,
  onSubmit,
  isValid,
  isSubmitting
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };
  
  return (
    <div className="order-summary">
      <h2 className="summary-title">결제 정보</h2>
      
      <div className="summary-details">
        <div className="summary-row">
          <span className="label">상품 금액</span>
          <span className="value">{formatPrice(summary.totalProductAmount)}원</span>
        </div>
        
        {summary.productDiscountAmount > 0 && (
          <div className="summary-row discount">
            <span className="label">상품 할인</span>
            <span className="value">-{formatPrice(summary.productDiscountAmount)}원</span>
          </div>
        )}
        
        {summary.couponDiscountAmount > 0 && (
          <div className="summary-row discount">
            <span className="label">쿠폰 할인</span>
            <span className="value">-{formatPrice(summary.couponDiscountAmount)}원</span>
          </div>
        )}
        
        {summary.pointsDiscountAmount > 0 && (
          <div className="summary-row discount">
            <span className="label">포인트 사용</span>
            <span className="value">-{formatPrice(summary.pointsDiscountAmount)}원</span>
          </div>
        )}
        
        <div className="summary-row">
          <span className="label">배송비</span>
          <span className="value">
            {summary.deliveryFee === 0 ? '무료' : `${formatPrice(summary.deliveryFee)}원`}
          </span>
        </div>
      </div>
      
      <div className="summary-total">
        <span className="label">최종 결제금액</span>
        <span className="amount">{formatPrice(summary.totalPaymentAmount)}원</span>
      </div>
      
      <button
        className="submit-button"
        onClick={onSubmit}
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? '처리중...' : `${formatPrice(summary.totalPaymentAmount)}원 결제하기`}
      </button>
    </div>
  );
};