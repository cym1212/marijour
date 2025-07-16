import React from 'react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  onDelete: (id: number) => void;
}

const DeleteIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 5H17M8 5V3C8 2.44772 8.44772 2 9 2H11C11.5523 2 12 2.44772 12 3V5M10 9V14M6 9V14M14 9V14M5 5L6 17C6 17.5523 6.44772 18 7 18H13C13.5523 18 14 17.5523 14 17L15 5H5Z"/>
  </svg>
);

export const CartItem: React.FC<CartItemProps> = ({
  item,
  isSelected,
  onSelect,
  onQuantityChange,
  onDelete
}) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && (!item.stock || newQuantity <= item.stock)) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  const itemTotalPrice = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(item.id, e.target.checked)}
        />
      </div>
      
      <div className="cart-item-image">
        <img src={item.thumbnailUrl} alt={item.name} />
      </div>
      
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        {item.options && item.options.length > 0 && (
          <div className="cart-item-options">
            {item.options.map((option, index) => (
              <span key={index} className="option">
                {option.name}: {option.value}
              </span>
            ))}
          </div>
        )}
        <div className="cart-item-price">
          {item.discountRate && (
            <span className="discount-rate">{item.discountRate}%</span>
          )}
          <span className="current-price">{formatPrice(item.price)}원</span>
          {item.originalPrice && (
            <span className="original-price">{formatPrice(item.originalPrice)}원</span>
          )}
        </div>
      </div>
      
      <div className="cart-item-quantity">
        <div className="quantity-controls">
          <button
            className="quantity-button minus"
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
          >
            −
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button
            className="quantity-button plus"
            onClick={() => handleQuantityChange(1)}
            disabled={item.stock ? item.quantity >= item.stock : false}
          >
            +
          </button>
        </div>
        <div className="item-total-price">
          {formatPrice(itemTotalPrice)}원
        </div>
      </div>
      
      <button
        className="cart-item-delete"
        onClick={() => onDelete(item.id)}
        aria-label="삭제"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};