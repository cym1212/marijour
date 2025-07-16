import React from 'react';

interface CartHeaderProps {
  totalCount: number;
  selectedCount: number;
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onDeleteSelected: () => void;
}

export const CartHeader: React.FC<CartHeaderProps> = ({
  totalCount,
  selectedCount,
  isAllSelected,
  onSelectAll,
  onDeleteSelected
}) => {
  return (
    <div className="cart-header">
      <div className="cart-title-section">
        <h1 className="cart-title">장바구니 <span className="count">{totalCount}</span></h1>
        <div className="cart-steps">
          <span className="step active">장바구니</span>
          <span className="step-arrow">→</span>
          <span className="step">주문서 작성</span>
          <span className="step-arrow">→</span>
          <span className="step">주문 완료</span>
        </div>
      </div>
      
      <div className="cart-controls">
        <label className="select-all">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <span>전체선택 ({selectedCount}/{totalCount})</span>
        </label>
        <button 
          className="delete-selected"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
        >
          선택 삭제
        </button>
      </div>
    </div>
  );
};