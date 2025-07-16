import React, { useState } from 'react';

interface SearchFilterProps {
  searchKeyword: string;
  selectedCategory: string;
  categories: Array<{ value: string; label: string; }>;
  enableSearch: boolean;
  enableCategoryFilter: boolean;
  onSearch: (keyword: string) => void;
  onCategoryChange: (category: string) => void;
}

const SearchIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="9" cy="9" r="7" />
    <path d="M14 14L18 18" />
  </svg>
);

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchKeyword,
  selectedCategory,
  categories,
  enableSearch,
  enableCategoryFilter,
  onSearch,
  onCategoryChange
}) => {
  const [keyword, setKeyword] = useState(searchKeyword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword);
  };

  if (!enableSearch && !enableCategoryFilter) {
    return null;
  }

  return (
    <div className="search-filter">
      {enableCategoryFilter && categories.length > 0 && (
        <div className="category-filter">
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">전체 카테고리</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {enableSearch && (
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
            />
            <button type="submit" className="search-button" aria-label="검색">
              <SearchIcon />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};