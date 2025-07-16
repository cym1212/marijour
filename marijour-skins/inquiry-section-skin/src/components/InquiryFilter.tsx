import React, { useState } from 'react';
import { InquiryFilter as FilterType, InquiryCategory, InquiryStatus } from '../types';

interface InquiryFilterProps {
  filter: FilterType;
  onChange: (filter: FilterType) => void;
  categoryLabels: { [key in InquiryCategory]?: string };
  statusLabels: { [key in InquiryStatus]?: string };
}

export const InquiryFilter: React.FC<InquiryFilterProps> = ({
  filter,
  onChange,
  categoryLabels,
  statusLabels
}) => {
  const [tempFilter, setTempFilter] = useState<FilterType>(filter);
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions: InquiryCategory[] = ['product', 'order_payment', 'delivery', 'cancel_exchange_return', 'other'];
  const statusOptions: InquiryStatus[] = ['pending', 'in_progress', 'answered', 'closed'];

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

  const handleCategoryChange = (category: InquiryCategory, checked: boolean) => {
    const newFilter = { ...tempFilter };
    const currentCategories = newFilter.category || [];
    
    if (checked) {
      newFilter.category = [...currentCategories, category];
    } else {
      newFilter.category = currentCategories.filter(c => c !== category);
    }
    
    if (newFilter.category.length === 0) {
      delete newFilter.category;
    }
    
    setTempFilter(newFilter);
  };

  const handleStatusChange = (status: InquiryStatus, checked: boolean) => {
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
    <div className="inquiry-filter">
      <div className="filter-header">
        <h3>문의 검색</h3>
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
                type="button"
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
          <label className="filter-label">문의 유형</label>
          <div className="category-checkboxes">
            {categoryOptions.map((category) => (
              <label key={category} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={tempFilter.category?.includes(category) || false}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                />
                <span>{categoryLabels[category] || category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-label">답변 상태</label>
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
          <label className="filter-label">검색어</label>
          <input
            type="text"
            value={tempFilter.searchKeyword || ''}
            onChange={(e) => handleKeywordChange(e.target.value)}
            placeholder="제목 또는 내용으로 검색"
            className="search-input"
          />
        </div>

        <div className="filter-actions">
          <button type="button" className="reset-button" onClick={handleResetFilter}>
            초기화
          </button>
          <button type="button" className="apply-button" onClick={handleApplyFilter}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
};