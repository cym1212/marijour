import React, { useEffect, useRef } from 'react';
import { ReviewScoreSkinProps } from './types';
import './review-score-skin.scss';

const StarIcon: React.FC<{ filled?: boolean; half?: boolean }> = ({ filled = true, half = false }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="half-fill">
        <stop offset="50%" stopColor="currentColor" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path 
      d="M8 0L9.79 5.52H15.6L10.9 8.97L12.69 14.5L8 11.05L3.31 14.5L5.1 8.97L0.4 5.52H6.21L8 0Z"
      fill={half ? "url(#half-fill)" : filled ? "currentColor" : "transparent"}
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

const ReviewScoreSkin: React.FC<ReviewScoreSkinProps> = ({ data, utils, actions }) => {
  const {
    averageRating = 0,
    totalReviews = 0,
    displayMode = 'simple',
    showDistribution = true,
    showPercentage = true,
    showProgressBar = true,
    enableCountClick = true,
    statistics,
    maxRating = 5,
    ratingPrecision = 1,
    reviewLabel = '개 리뷰',
    noReviewsMessage = '아직 리뷰가 없습니다.'
  } = data || {};

  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  // 프로그레스 바 애니메이션
  useEffect(() => {
    if (showProgressBar && statistics?.distribution) {
      const bars = document.querySelectorAll('.progress-fill');
      bars.forEach((bar, index) => {
        const element = bar as HTMLElement;
        setTimeout(() => {
          element.style.width = `${statistics.distribution[index].percentage}%`;
        }, 100 * index);
      });
    }
  }, [showProgressBar, statistics]);

  const handleReviewCountClick = () => {
    if (enableCountClick && actions?.onReviewCountClick) {
      actions.onReviewCountClick();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < maxRating; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} filled />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarIcon key={i} half />);
      } else {
        stars.push(<StarIcon key={i} filled={false} />);
      }
    }

    return stars;
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(ratingPrecision);
  };

  // Simple mode - 기본 리뷰 점수 표시
  if (displayMode === 'simple') {
    if (totalReviews === 0) {
      return (
        <div className="review-score-skin simple no-reviews" ref={containerRef}>
          <span className="no-reviews-message">{noReviewsMessage}</span>
        </div>
      );
    }

    return (
      <div className="review-score-skin simple" ref={containerRef}>
        <div className="star-icon">
          <StarIcon />
        </div>
        <span className="average-rating">{formatRating(averageRating)}</span>
        {enableCountClick ? (
          <button 
            className="review-count clickable"
            onClick={handleReviewCountClick}
          >
            {totalReviews}{reviewLabel}
          </button>
        ) : (
          <span className="review-count">({totalReviews})</span>
        )}
      </div>
    );
  }

  // Detailed mode - 별점과 개수 표시
  if (displayMode === 'detailed') {
    return (
      <div className="review-score-skin detailed" ref={containerRef}>
        <div className="rating-summary">
          <div className="average-section">
            <div className="average-number">{formatRating(averageRating)}</div>
            <div className="stars-row">
              {renderStars(averageRating)}
            </div>
            <div className="total-reviews">
              {totalReviews.toLocaleString('ko-KR')}{reviewLabel}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full mode - 전체 통계 표시
  return (
    <div className="review-score-skin full" ref={containerRef}>
      <h2 className="section-title">상품 리뷰</h2>
      
      <div className="review-statistics">
        <div className="rating-summary">
          <div className="average-section">
            <div className="average-number">{formatRating(averageRating)}</div>
            <div className="stars-row">
              {renderStars(averageRating)}
            </div>
            <div className="total-reviews">
              총 {totalReviews.toLocaleString('ko-KR')}{reviewLabel}
            </div>
          </div>
        </div>

        {showDistribution && statistics?.distribution && (
          <div className="rating-distribution">
            {[...Array(maxRating)].map((_, index) => {
              const starNum = maxRating - index;
              const dist = statistics.distribution.find(d => d.stars === starNum) || 
                         { stars: starNum, count: 0, percentage: 0 };
              
              return (
                <div key={starNum} className="distribution-row">
                  <div className="star-label">{starNum}점</div>
                  {showProgressBar && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: '0%' }}
                      />
                    </div>
                  )}
                  <div className="count-info">
                    {showPercentage && (
                      <span className="percentage">{dist.percentage}%</span>
                    )}
                    <span className="count">({dist.count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {enableCountClick && totalReviews > 0 && (
        <button 
          className="view-all-reviews"
          onClick={handleReviewCountClick}
        >
          모든 리뷰 보기
        </button>
      )}
    </div>
  );
};

export default ReviewScoreSkin;