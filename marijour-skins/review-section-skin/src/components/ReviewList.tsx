import React from 'react';
import { ReviewItem } from './ReviewItem';
import { Review } from '../types';

interface ReviewListProps {
  reviews: Review[];
  showProductInfo?: boolean;
  showBestBadge?: boolean;
  showHelpfulButton?: boolean;
  maskedWriterName?: boolean;
  dateFormat?: string;
  expandedImages: {[key: string]: boolean};
  onImageExpand: (reviewId: string) => void;
  onImageClick: (images: string[], index: number) => void;
  onHelpfulClick: (reviewId: string | number) => void;
  onDelete?: (reviewId: string | number) => void;
  onReport?: (reviewId: string | number) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  showProductInfo,
  showBestBadge,
  showHelpfulButton,
  maskedWriterName,
  dateFormat,
  expandedImages,
  onImageExpand,
  onImageClick,
  onHelpfulClick,
  onDelete,
  onReport
}) => {
  return (
    <div className="review-list">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          showProductInfo={showProductInfo}
          showBestBadge={showBestBadge}
          showHelpfulButton={showHelpfulButton}
          maskedWriterName={maskedWriterName}
          dateFormat={dateFormat}
          isExpanded={expandedImages[review.id.toString()]}
          onImageExpand={() => onImageExpand(review.id.toString())}
          onImageClick={onImageClick}
          onHelpfulClick={() => onHelpfulClick(review.id)}
          onDelete={onDelete ? () => onDelete(review.id) : undefined}
          onReport={onReport ? () => onReport(review.id) : undefined}
        />
      ))}
    </div>
  );
};