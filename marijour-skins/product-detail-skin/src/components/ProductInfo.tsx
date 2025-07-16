import React, { useState } from 'react';
import { ProductDetailData, ProductOption } from '../types';

interface ProductInfoProps {
  product: ProductDetailData;
  onAddToCart: (quantity: number, options: Record<string, string>) => void;
  onBuyNow: (quantity: number, options: Record<string, string>) => void;
}

const StarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0L9.79 5.52H15.6L10.9 8.97L12.69 14.5L8 11.05L3.31 14.5L5.1 8.97L0.4 5.52H6.21L8 0Z"/>
  </svg>
);

const CartIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 1L2 5V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H16C16.5304 19 17.0391 18.7893 17.4142 18.4142C17.7893 18.0391 18 17.5304 18 17V5L15 1H5Z"/>
    <path d="M2 5H18"/>
    <path d="M14 8C14 9.06087 13.5786 10.0783 12.8284 10.8284C12.0783 11.5786 11.0609 12 10 12C8.93913 12 7.92172 11.5786 7.17157 10.8284C6.42143 10.0783 6 9.06087 6 8"/>
  </svg>
);

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState(product.minQuantity || 1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const min = product.minQuantity || 1;
    const max = product.maxQuantity || 999;
    
    if (newQuantity >= min && newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };

  const handleOptionChange = (optionId: string, valueId: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionId]: valueId
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const totalPrice = product.price * quantity;

  return (
    <div className="product-info">
      <h1 className="product-name">{product.name}</h1>
      
      <div className="product-rating">
        <div className="rating-stars">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.floor(product.rating) ? 'filled' : 'empty'}>
              <StarIcon />
            </span>
          ))}
        </div>
        <span className="rating-score">{product.rating.toFixed(1)}</span>
        <span className="review-count">({product.reviewCount}개 리뷰)</span>
      </div>

      <div className="product-price">
        {product.discountRate && (
          <span className="discount-rate">{product.discountRate}%</span>
        )}
        <span className="current-price">{formatPrice(product.price)}원</span>
        {product.originalPrice && (
          <span className="original-price">{formatPrice(product.originalPrice)}원</span>
        )}
      </div>

      {product.shippingInfo && (
        <div className="shipping-info">
          <span className="shipping-label">배송정보</span>
          <span className="shipping-text">{product.shippingInfo}</span>
        </div>
      )}

      {product.options && product.options.length > 0 && (
        <div className="product-options">
          {product.options.map((option) => (
            <div key={option.id} className="option-group">
              <label className="option-label">{option.name}</label>
              <div className="option-values">
                {option.values.map((value) => (
                  <button
                    key={value.id}
                    className={`option-value ${selectedOptions[option.id] === value.id ? 'selected' : ''} ${!value.available ? 'disabled' : ''}`}
                    onClick={() => value.available && handleOptionChange(option.id, value.id)}
                    disabled={!value.available}
                  >
                    {value.label}
                    {value.price && value.price > 0 && (
                      <span className="option-price">+{formatPrice(value.price)}원</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="purchase-section">
        <div className="quantity-selector">
          <label className="quantity-label">수량</label>
          <div className="quantity-controls">
            <button 
              className="quantity-button minus"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= (product.minQuantity || 1)}
            >
              −
            </button>
            <span className="quantity-value">{quantity}</span>
            <button 
              className="quantity-button plus"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= (product.maxQuantity || 999)}
            >
              +
            </button>
          </div>
        </div>

        <div className="total-price">
          <span className="total-label">총 상품금액</span>
          <span className="total-amount">{formatPrice(totalPrice)}원</span>
        </div>

        <div className="purchase-buttons">
          <button 
            className="cart-button"
            onClick={() => onAddToCart(quantity, selectedOptions)}
          >
            <CartIcon />
            <span>장바구니</span>
          </button>
          <button 
            className="buy-button"
            onClick={() => onBuyNow(quantity, selectedOptions)}
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
};