import React from 'react';
import { ReviewFilter as FilterType } from '../types';

interface ReviewFilterProps {
  currentFilter: FilterType;
  onChange: (filter: FilterType) => void;
  labels: {
    latest?: string;
    rating_high?: string;
    rating_low?: string;
    helpful?: string;
  };
}

export const ReviewFilter: React.FC<ReviewFilterProps> = ({
  currentFilter,
  onChange,
  labels
}) => {
  const sortOptions = [
    { value: 'latest', label: labels.latest || '최신순' },
    { value: 'rating_high', label: labels.rating_high || '별점 높은순' },
    { value: 'rating_low', label: labels.rating_low || '별점 낮은순' },
    { value: 'helpful', label: labels.helpful || '도움순' }
  ];

  const handleSortChange = (sortBy: string) => {
    onChange({ ...currentFilter, sortBy: sortBy as any });
  };

  const handleRatingFilter = (rating: number | null) => {
    const newFilter = { ...currentFilter };
    if (rating === null) {
      delete newFilter.rating;
    } else {
      newFilter.rating = rating;
    }
    onChange(newFilter);
  };

  const handleImageFilter = (hasImage: boolean | null) => {
    const newFilter = { ...currentFilter };
    if (hasImage === null) {
      delete newFilter.hasImage;
    } else {
      newFilter.hasImage = hasImage;
    }
    onChange(newFilter);
  };

  return (
    <div className="review-filter">
      <div className="filter-section">
        <h4 className="filter-title">정렬</h4>
        <div className="sort-options">
          {sortOptions.map((option) => (
            <label key={option.value} className="radio-label">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={currentFilter.sortBy === option.value}
                onChange={() => handleSortChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">별점</h4>
        <div className="rating-filter">
          <button
            className={`filter-button ${!currentFilter.rating ? 'active' : ''}`}
            onClick={() => handleRatingFilter(null)}
          >
            전체
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              className={`filter-button ${currentFilter.rating === rating ? 'active' : ''}`}
              onClick={() => handleRatingFilter(rating)}
            >
              {rating}점
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4 className="filter-title">사진</h4>
        <div className="image-filter">
          <button
            className={`filter-button ${currentFilter.hasImage === undefined ? 'active' : ''}`}
            onClick={() => handleImageFilter(null)}
          >
            전체
          </button>
          <button
            className={`filter-button ${currentFilter.hasImage === true ? 'active' : ''}`}
            onClick={() => handleImageFilter(true)}
          >
            사진 있음
          </button>
          <button
            className={`filter-button ${currentFilter.hasImage === false ? 'active' : ''}`}
            onClick={() => handleImageFilter(false)}
          >
            사진 없음
          </button>
        </div>
      </div>
    </div>
  );
};