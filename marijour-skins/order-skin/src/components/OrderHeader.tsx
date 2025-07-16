import React from 'react';

export const OrderHeader: React.FC = () => {
  return (
    <div className="order-header">
      <h1 className="order-title">주문서 작성</h1>
      <div className="order-steps">
        <span className="step completed">장바구니</span>
        <span className="step-arrow">→</span>
        <span className="step active">주문서 작성</span>
        <span className="step-arrow">→</span>
        <span className="step">주문 완료</span>
      </div>
    </div>
  );
};