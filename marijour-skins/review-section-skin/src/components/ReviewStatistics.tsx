import React from 'react';
import { ReviewStatistics as StatisticsType } from '../types';

interface ReviewStatisticsProps {
  statistics: StatisticsType;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill={star <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
          className={star <= rating ? "filled" : "empty"}
        >
          <path d="M10 1.5L12.5 7L18.5 8L14.25 12L15.5 18L10 15L4.5 18L5.75 12L1.5 8L7.5 7L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
};

export const ReviewStatistics: React.FC<ReviewStatisticsProps> = ({ statistics }) => {
  const { totalCount, averageRating, ratingDistribution } = statistics;

  const getPercentage = (count: number) => {
    if (totalCount === 0) return 0;
    return Math.round((count / totalCount) * 100);
  };

  const maxCount = Math.max(...Object.values(ratingDistribution));

  return (
    <div className="review-statistics">
      <div className="statistics-summary">
        <div className="average-rating">
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <StarRating rating={Math.round(averageRating)} />
          <span className="total-count">총 {totalCount}개의 리뷰</span>
        </div>
      </div>

      <div className="rating-distribution">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating as keyof typeof ratingDistribution];
          const percentage = getPercentage(count);
          const widthPercentage = totalCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={rating} className="distribution-row">
              <span className="rating-label">{rating}점</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
              <span className="rating-percentage">{percentage}%</span>
              <span className="rating-count">({count})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};