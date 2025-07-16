import React from 'react';
import { OrderItem } from '../types';

interface OrderItemsSectionProps {
  items: OrderItem[];
}

export const OrderItemsSection: React.FC<OrderItemsSectionProps> = ({ items }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="section order-items-section">
      <h2 className="section-title">주문 상품 ({items.length}개)</h2>
      
      <div className="order-items">
        {items.map((item) => (
          <div key={item.id} className="order-item">
            <div className="item-image">
              <img src={item.thumbnailUrl} alt={item.name} />
            </div>
            <div className="item-info">
              <h3 className="item-name">{item.name}</h3>
              {item.options && item.options.length > 0 && (
                <div className="item-options">
                  {item.options.map((option, index) => (
                    <span key={index} className="option">
                      {option.name}: {option.value}
                    </span>
                  ))}
                </div>
              )}
              <div className="item-quantity">수량: {item.quantity}개</div>
            </div>
            <div className="item-price">
              {formatPrice(item.price * item.quantity)}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};