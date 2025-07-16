import React, { useState } from 'react';
import { OrderFilter as FilterType, OrderStatus } from '../types';

interface OrderFilterProps {
  filter: FilterType;
  onChange: (filter: FilterType) => void;
  statusLabels: { [key in OrderStatus]?: string };
}

export const OrderFilter: React.FC<OrderFilterProps> = ({
  filter,
  onChange,
  statusLabels
}) => {
  const [tempFilter, setTempFilter] = useState<FilterType>(filter);
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions: OrderStatus[] = [
    'pending_payment',
    'payment_complete',
    'preparing',
    'shipping',
    'delivered',
    'cancelled'
  ];

  const periodOptions = [
    { label: '전체', value: null },
    { label: '최근 1개월', value: 30 },
    { label: '최근 3개월', value: 90 },
    { label: '최근 6개월', value: 180 },
    { label: '최근 1년', value: 365 }
  ];

  const handlePeriodChange = (days: number | null) => {
    const newFilter = { ...tempFilter };
    
    if (days === null) {
      delete newFilter.startDate;
      delete newFilter.endDate;
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      
      newFilter.startDate = startDate.toISOString().split('T')[0];
      newFilter.endDate = endDate.toISOString().split('T')[0];
    }
    
    setTempFilter(newFilter);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilter = { ...tempFilter };
    if (value) {
      newFilter[field] = value;
    } else {
      delete newFilter[field];
    }
    setTempFilter(newFilter);
  };

  const handleStatusChange = (status: OrderStatus, checked: boolean) => {
    const newFilter = { ...tempFilter };
    const currentStatuses = newFilter.status || [];
    
    if (checked) {
      newFilter.status = [...currentStatuses, status];
    } else {
      newFilter.status = currentStatuses.filter(s => s !== status);
    }
    
    if (newFilter.status.length === 0) {
      delete newFilter.status;
    }
    
    setTempFilter(newFilter);
  };

  const handleKeywordChange = (keyword: string) => {
    const newFilter = { ...tempFilter };
    if (keyword.trim()) {
      newFilter.searchKeyword = keyword.trim();
    } else {
      delete newFilter.searchKeyword;
    }
    setTempFilter(newFilter);
  };

  const handleApplyFilter = () => {
    onChange(tempFilter);
    setIsExpanded(false);
  };

  const handleResetFilter = () => {
    const resetFilter = {};
    setTempFilter(resetFilter);
    onChange(resetFilter);
  };

  return (
    <div className="order-filter">
      <div className="filter-header">
        <h3>주문 조회</h3>
        <button 
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '접기' : '상세 검색'}
        </button>
      </div>

      <div className={`filter-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filter-section">
          <label className="filter-label">조회 기간</label>
          <div className="period-buttons">
            {periodOptions.map((option) => (
              <button
                key={option.label}
                className={`period-button ${!tempFilter.startDate && !tempFilter.endDate && option.value === null ? 'active' : ''}`}
                onClick={() => handlePeriodChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="date-inputs">
            <input
              type="date"
              value={tempFilter.startDate || ''}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="date-input"
            />
            <span>~</span>
            <input
              type="date"
              value={tempFilter.endDate || ''}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">주문 상태</label>
          <div className="status-checkboxes">
            {statusOptions.map((status) => (
              <label key={status} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={tempFilter.status?.includes(status) || false}
                  onChange={(e) => handleStatusChange(status, e.target.checked)}
                />
                <span>{statusLabels[status] || status}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">주문번호/상품명</label>
          <input
            type="text"
            value={tempFilter.searchKeyword || ''}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="주문번호 또는 상품명으로 검색"
            className="search-input"
          />
        </div>

        <div className="filter-actions">
          <button className="reset-button" onClick={handleResetFilter}>
            초기화
          </button>
          <button className="apply-button" onClick={handleApplyFilter}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
};