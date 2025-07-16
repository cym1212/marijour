import React from 'react';
import { RelatedProduct } from '../types';

interface RelatedProductsProps {
  products: RelatedProduct[];
  onProductClick: (link: string) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, onProductClick }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="related-products">
      <h2 className="related-title">함께 보면 좋은 상품</h2>
      <div className="related-grid">
        {products.map((product) => (
          <article key={product.id} className="related-item">
            <a 
              href={product.link}
              onClick={(e) => {
                e.preventDefault();
                onProductClick(product.link);
              }}
              className="related-link"
            >
              <div className="related-image">
                <img src={product.thumbnailUrl} alt={product.name} />
              </div>
              <div className="related-info">
                <h3 className="related-name">{product.name}</h3>
                <div className="related-price">
                  {product.discountRate && (
                    <span className="discount-rate">{product.discountRate}%</span>
                  )}
                  <span className="current-price">{formatPrice(product.price)}원</span>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};