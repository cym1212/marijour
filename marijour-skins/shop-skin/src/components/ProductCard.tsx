import React from 'react';
import { ProductItem } from '../types';

interface ProductCardProps {
  product: ProductItem;
  onNavigate: (link: string) => void;
  onAddToCart?: (productId: number) => void;
}

const StarIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M6 0L7.36 4.14H11.7L8.18 6.86L9.54 11L6 8.28L2.46 11L3.82 6.86L0.3 4.14H4.64L6 0Z"/>
  </svg>
);

const CartIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M5 1L2 5V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H16C16.5304 19 17.0391 18.7893 17.4142 18.4142C17.7893 18.0391 18 17.5304 18 17V5L15 1H5Z"/>
    <path d="M2 5H18"/>
    <path d="M14 8C14 9.06087 13.5786 10.0783 12.8284 10.8284C12.0783 11.5786 11.0609 12 10 12C8.93913 12 7.92172 11.5786 7.17157 10.8284C6.42143 10.0783 6 9.06087 6 8"/>
  </svg>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate, onAddToCart }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(product.link);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <article className="product-card">
      <a href={product.link} onClick={handleClick} className="product-card-link">
        <div className="product-card-image-wrapper">
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="product-card-image"
          />
          {product.badge && (
            <span className={`product-badge badge-${product.badge.type}`}>
              {product.badge.label}
            </span>
          )}
          <button
            className="product-cart-button"
            onClick={handleCartClick}
            aria-label="장바구니에 담기"
          >
            <CartIcon />
          </button>
        </div>
        <div className="product-card-info">
          <h3 className="product-card-name">{product.name}</h3>
          <div className="product-card-rating">
            <span className="rating-stars">
              <StarIcon />
            </span>
            <span className="rating-score">{product.rating.toFixed(1)}</span>
            <span className="review-count">({product.reviewCount})</span>
          </div>
          <div className="product-card-price">
            {product.discountRate && (
              <span className="discount-rate">{product.discountRate}%</span>
            )}
            <span className="current-price">{formatPrice(product.price)}원</span>
            {product.originalPrice && (
              <span className="original-price">{formatPrice(product.originalPrice)}원</span>
            )}
          </div>
        </div>
      </a>
    </article>
  );
};