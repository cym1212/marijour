import React from 'react';
import { Review } from '../types';

interface ReviewItemProps {
  review: Review;
  showProductInfo?: boolean;
  showBestBadge?: boolean;
  showHelpfulButton?: boolean;
  maskedWriterName?: boolean;
  dateFormat?: string;
  isExpanded?: boolean;
  onImageExpand: () => void;
  onImageClick: (images: string[], index: number) => void;
  onHelpfulClick: () => void;
  onDelete?: () => void;
  onReport?: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={star <= rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
          className={star <= rating ? "filled" : "empty"}
        >
          <path d="M8 1.5L10.163 5.692L15 6.5L11.5 10L12.326 14.5L8 12.192L3.674 14.5L4.5 10L1 6.5L5.837 5.692L8 1.5Z" />
        </svg>
      ))}
    </div>
  );
};

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  showProductInfo,
  showBestBadge,
  showHelpfulButton,
  maskedWriterName,
  dateFormat,
  isExpanded,
  onImageExpand,
  onImageClick,
  onHelpfulClick,
  onDelete,
  onReport
}) => {
  const formatDate = (date: string) => {
    // 간단한 날짜 포맷팅
    return date.replace(/-/g, '.');
  };

  const maskWriterName = (name: string) => {
    if (!maskedWriterName) return name;
    if (name.length <= 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  return (
    <div className="review-item">
      {showProductInfo && review.productName && (
        <div className="review-product-info">
          {review.productImage && (
            <img 
              src={review.productImage} 
              alt={review.productName}
              className="product-thumbnail"
            />
          )}
          <span className="product-name">{review.productName}</span>
        </div>
      )}

      <div className="review-header">
        <div className="review-rating-info">
          <StarRating rating={review.rating} />
          {showBestBadge && review.isBest && (
            <span className="best-badge">BEST</span>
          )}
        </div>
        <div className="review-meta">
          <span className="review-writer">{maskWriterName(review.writer)}</span>
          <span className="review-date">{formatDate(review.createdAt)}</span>
        </div>
      </div>

      <div className="review-content">
        <p>{review.content}</p>
      </div>

      {review.images && review.images.length > 0 && (
        <div className={`review-images ${isExpanded ? 'expanded' : ''}`}>
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
              className="review-image"
              onClick={() => onImageClick(review.images!, index)}
            />
          ))}
          {review.images.length > 1 && (
            <button 
              className="expand-button"
              onClick={onImageExpand}
            >
              {isExpanded ? '접기' : `사진 ${review.images.length}개 모두 보기`}
            </button>
          )}
        </div>
      )}

      <div className="review-actions">
        {showHelpfulButton && (
          <button className="helpful-button" onClick={onHelpfulClick}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 1V9M7 9L10 6M7 9L4 6M1 13H13" />
            </svg>
            도움이 돼요 {review.helpfulCount ? `(${review.helpfulCount})` : ''}
          </button>
        )}
        <div className="review-menu">
          {onDelete && (
            <button className="menu-button" onClick={onDelete}>삭제</button>
          )}
          {onReport && (
            <button className="menu-button" onClick={onReport}>신고</button>
          )}
        </div>
      </div>
    </div>
  );
};