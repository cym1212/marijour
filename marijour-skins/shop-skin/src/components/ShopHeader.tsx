import React from 'react';
import { Category, SortOption } from '../types';

interface ShopHeaderProps {
  title?: string;
  totalCount?: number;
  categories?: Category[];
  currentCategory?: string;
  sortOptions?: SortOption[];
  currentSort?: string;
  viewType?: 'grid' | 'list';
  showSort?: boolean;
  showViewTypeToggle?: boolean;
  onCategoryChange?: (categoryId: string) => void;
  onSortChange?: (sortValue: string) => void;
  onViewTypeChange?: (viewType: 'grid' | 'list') => void;
}

const GridIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="6" height="6" />
    <rect x="11" y="3" width="6" height="6" />
    <rect x="3" y="11" width="6" height="6" />
    <rect x="11" y="11" width="6" height="6" />
  </svg>
);

const ListIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="5" x2="17" y2="5" />
    <line x1="3" y1="10" x2="17" y2="10" />
    <line x1="3" y1="15" x2="17" y2="15" />
  </svg>
);

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  totalCount,
  categories,
  currentCategory,
  sortOptions,
  currentSort,
  viewType = 'grid',
  showSort,
  showViewTypeToggle,
  onCategoryChange,
  onSortChange,
  onViewTypeChange,
}) => {
  return (
    <div className="shop-header">
      {title && (
        <h1 className="shop-title">{title}</h1>
      )}
      
      {categories && categories.length > 0 && (
        <div className="shop-categories">
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.id} className="category-item">
                <button
                  className={`category-button ${currentCategory === category.id ? 'active' : ''}`}
                  onClick={() => onCategoryChange?.(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="shop-controls">
        <div className="shop-info">
          {totalCount !== undefined && (
            <span className="total-count">전체 {totalCount}개</span>
          )}
        </div>
        
        <div className="shop-actions">
          {showSort && sortOptions && sortOptions.length > 0 && (
            <select
              className="sort-select"
              value={currentSort}
              onChange={(e) => onSortChange?.(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          
          {showViewTypeToggle && (
            <div className="view-type-toggle">
              <button
                className={`view-type-button ${viewType === 'grid' ? 'active' : ''}`}
                onClick={() => onViewTypeChange?.('grid')}
                aria-label="그리드 뷰"
              >
                <GridIcon />
              </button>
              <button
                className={`view-type-button ${viewType === 'list' ? 'active' : ''}`}
                onClick={() => onViewTypeChange?.('list')}
                aria-label="리스트 뷰"
              >
                <ListIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};