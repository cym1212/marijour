import React from 'react';
import { CartSummaryData, DeliveryInfo } from '../types';

interface CartSummaryProps {
  summary: CartSummaryData;
  deliveryInfo?: DeliveryInfo;
  onOrder: () => void;
  showCoupon?: boolean;
  showPoints?: boolean;
}

const InfoIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 7V11M8 5V5.5" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const CartSummary: React.FC<CartSummaryProps> = ({
  summary,
  deliveryInfo,
  onOrder,
  showCoupon = false,
  showPoints = false
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const totalDiscounts = summary.totalDiscountAmount + summary.couponDiscountAmount + summary.pointsDiscountAmount;

  return (
    <div className="cart-summary">
      <h2 className="summary-title">주문 요약</h2>
      
      <div className="summary-details">
        <div className="summary-row">
          <span className="label">상품 ({summary.selectedCount}개)</span>
          <span className="value">{formatPrice(summary.totalOriginalPrice)}원</span>
        </div>
        
        {summary.totalDiscountAmount > 0 && (
          <div className="summary-row discount">
            <span className="label">상품 할인</span>
            <span className="value">-{formatPrice(summary.totalDiscountAmount)}원</span>
          </div>
        )}
        
        {showCoupon && summary.couponDiscountAmount > 0 && (
          <div className="summary-row discount">
            <span className="label">쿠폰 할인</span>
            <span className="value">-{formatPrice(summary.couponDiscountAmount)}원</span>
          </div>
        )}
        
        {showPoints && summary.pointsDiscountAmount > 0 && (
          <div className="summary-row discount">
            <span className="label">포인트 사용</span>
            <span className="value">-{formatPrice(summary.pointsDiscountAmount)}원</span>
          </div>
        )}
        
        <div className="summary-row">
          <span className="label">
            배송비
            {deliveryInfo && (
              <button className="info-button" aria-label="배송비 정보">
                <InfoIcon />
              </button>
            )}
          </span>
          <span className="value">
            {summary.deliveryFee === 0 ? '무료' : `${formatPrice(summary.deliveryFee)}원`}
          </span>
        </div>
        
        {deliveryInfo?.freeShippingThreshold && summary.deliveryFee > 0 && (
          <div className="delivery-info">
            <p>{formatPrice(deliveryInfo.freeShippingThreshold)}원 이상 구매 시 무료배송</p>
          </div>
        )}
      </div>
      
      <div className="summary-total">
        <span className="label">총 결제금액</span>
        <div className="total-price">
          {totalDiscounts > 0 && (
            <span className="discount-badge">
              {formatPrice(totalDiscounts)}원 할인
            </span>
          )}
          <span className="amount">{formatPrice(summary.totalPrice)}원</span>
        </div>
      </div>
      
      <button 
        className="order-button"
        onClick={onOrder}
        disabled={summary.selectedCount === 0}
      >
        {summary.selectedCount === 0 ? '상품을 선택해주세요' : `${summary.selectedCount}개 상품 주문하기`}
      </button>
    </div>
  );
};