import React from 'react';
import { ProductReview } from '../types';

interface ReviewSectionProps {
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}

const StarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0L9.79 5.52H15.6L10.9 8.97L12.69 14.5L8 11.05L3.31 14.5L5.1 8.97L0.4 5.52H6.21L8 0Z"/>
  </svg>
);

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, rating, reviewCount }) => {
  return (
    <div className="review-section">
      <div className="review-header">
        <h2 className="review-title">상품 리뷰</h2>
        <div className="review-summary">
          <div className="rating-average">
            <span className="rating-number">{rating.toFixed(1)}</span>
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? 'filled' : 'empty'}>
                  <StarIcon />
                </span>
              ))}
            </div>
          </div>
          <span className="review-total">총 {reviewCount}개의 리뷰</span>
        </div>
      </div>

      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? 'filled' : 'empty'}>
                    <StarIcon />
                  </span>
                ))}
              </div>
              <div className="review-meta">
                <span className="review-author">{review.author}</span>
                <span className="review-date">{review.date}</span>
              </div>
            </div>
            <div className="review-content">
              <p>{review.content}</p>
              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((image, index) => (
                    <img key={index} src={image} alt={`리뷰 이미지 ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};