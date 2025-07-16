import React from 'react';

interface MobilePurchaseBarProps {
  totalPrice: number;
  selectedCount: number;
  onOrder: () => void;
  isVisible: boolean;
}

export const MobilePurchaseBar: React.FC<MobilePurchaseBarProps> = ({
  totalPrice,
  selectedCount,
  onOrder,
  isVisible
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className={`mobile-purchase-bar ${isVisible ? 'visible' : ''}`}>
      <div className="purchase-bar-content">
        <div className="total-info">
          <span className="label">총 결제금액</span>
          <span className="price">{formatPrice(totalPrice)}원</span>
        </div>
        <button
          className="order-button"
          onClick={onOrder}
          disabled={selectedCount === 0}
        >
          {selectedCount === 0 ? '상품을 선택해주세요' : `주문하기 (${selectedCount}개)`}
        </button>
      </div>
    </div>
  );
};