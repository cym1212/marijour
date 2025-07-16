import React from 'react';
import { ProductDetailData } from '../types';

interface PurchaseBarProps {
  product: ProductDetailData;
  isVisible: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const CartIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 1L2 5V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H16C16.5304 19 17.0391 18.7893 17.4142 18.4142C17.7893 18.0391 18 17.5304 18 17V5L15 1H5Z"/>
    <path d="M2 5H18"/>
    <path d="M14 8C14 9.06087 13.5786 10.0783 12.8284 10.8284C12.0783 11.5786 11.0609 12 10 12C8.93913 12 7.92172 11.5786 7.17157 10.8284C6.42143 10.0783 6 9.06087 6 8"/>
  </svg>
);

export const PurchaseBar: React.FC<PurchaseBarProps> = ({ product, isVisible, onAddToCart, onBuyNow }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className={`purchase-bar ${isVisible ? 'visible' : ''}`}>
      <div className="purchase-bar-container">
        <div className="purchase-bar-info">
          <img 
            src={product.images[0]?.url} 
            alt={product.name} 
            className="purchase-bar-image"
          />
          <div className="purchase-bar-details">
            <h3 className="purchase-bar-name">{product.name}</h3>
            <div className="purchase-bar-price">
              {product.discountRate && (
                <span className="discount-rate">{product.discountRate}%</span>
              )}
              <span className="current-price">{formatPrice(product.price)}원</span>
            </div>
          </div>
        </div>
        <div className="purchase-bar-actions">
          <button 
            className="purchase-bar-cart"
            onClick={onAddToCart}
            aria-label="장바구니에 담기"
          >
            <CartIcon />
          </button>
          <button 
            className="purchase-bar-buy"
            onClick={onBuyNow}
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
};