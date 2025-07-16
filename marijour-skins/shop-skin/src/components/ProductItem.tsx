import React from 'react';
import { Product } from '../types';

interface ProductItemProps {
  product: Product;
  utils: any;
  actions: any;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product, utils, actions }) => {
  const {
    id,
    name,
    discountRate,
    price,
    originalPrice,
    rating,
    reviewCount,
    thumbnailUrl,
    badge,
    link
  } = product;

  const handleNavigate = () => {
    if (utils?.navigate) {
      utils.navigate(link || `/products/${id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (actions?.addToCart) {
      actions.addToCart(id);
    }
  };

  return (
    <div className="product-item group" onClick={handleNavigate}>
      {/* 썸네일 */}
      <div className="product-thumbnail">
        <div className="thumbnail-wrapper">
          <img
            src={thumbnailUrl}
            alt={name}
            className="product-image"
          />
        </div>
        <button 
          className="cart-button"
          onClick={handleAddToCart}
          aria-label="장바구니에 담기"
        >
          <svg className="cart-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 13V17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 제품 정보 */}
      <div className="product-info">
        <h4 className="product-name">{name}</h4>
        
        {/* 가격 정보 */}
        <div className="price-info">
          {discountRate > 0 && (
            <span className="discount-rate">{discountRate}%</span>
          )}
          <p className="price">{price.toLocaleString()}원</p>
          {originalPrice && (
            <del className="original-price">{originalPrice.toLocaleString()}원</del>
          )}
        </div>

        {/* 리뷰 정보 */}
        {reviewCount > 0 && (
          <div className="review-info">
            <svg className="star-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p className="review-rating">{rating}</p>
            <p className="review-count">({reviewCount})</p>
          </div>
        )}

        {/* 배지 */}
        {badge && (
          <div className="product-badges">
            <span className="badge">{badge.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};