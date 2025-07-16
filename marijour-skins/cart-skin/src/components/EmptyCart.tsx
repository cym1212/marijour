import React from 'react';

interface EmptyCartProps {
  message?: string;
  subMessage?: string;
  buttonText?: string;
  onButtonClick: () => void;
}

const CartIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 4L6 12V40C6 41.0609 6.42143 42.0783 7.17157 42.8284C7.92172 43.5786 8.93913 44 10 44H38C39.0609 44 40.0783 43.5786 40.8284 42.8284C41.5786 42.0783 42 41.0609 42 40V12L36 4H12Z"/>
    <path d="M6 12H42"/>
    <path d="M32 20C32 22.1217 31.1571 24.1566 29.6569 25.6569C28.1566 27.1571 26.1217 28 24 28C21.8783 28 19.8434 27.1571 18.3431 25.6569C16.8429 24.1566 16 22.1217 16 20"/>
  </svg>
);

export const EmptyCart: React.FC<EmptyCartProps> = ({
  message = '장바구니가 비어있어요',
  subMessage = '고객님의 취향에 맞는 상품을 담아 쇼핑을 즐겨보세요!',
  buttonText = '상품 채우러가기',
  onButtonClick
}) => {
  return (
    <div className="empty-cart">
      <div className="empty-cart-content">
        <div className="empty-cart-icon">
          <CartIcon />
        </div>
        <h2 className="empty-cart-message">{message}</h2>
        <p className="empty-cart-sub-message">{subMessage}</p>
        <button 
          className="empty-cart-button"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};