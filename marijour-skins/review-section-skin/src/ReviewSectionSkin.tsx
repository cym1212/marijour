import React, { useState, useEffect, useRef } from 'react';
import { ReviewSectionSkinProps } from './types';
import { ReviewList } from './components/ReviewList';
import { ReviewFilter } from './components/ReviewFilter';
import { ReviewForm } from './components/ReviewForm';
import { ReviewStatistics } from './components/ReviewStatistics';
import { EmptyState } from './components/EmptyState';
import './review-section-skin.scss';

const ReviewSectionSkin: React.FC<ReviewSectionSkinProps> = ({ 
  data, 
  actions, 
  options = {} 
}) => {
  const {
    reviews = [],
    statistics,
    currentFilter = { sortBy: 'latest' },
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    showStatistics = true,
    showFilter = true,
    showWriteForm = true,
    allowImageUpload = true,
    maxImageCount = 5,
    minContentLength = 10,
    maxContentLength = 500
  } = data || {};

  const {
    dateFormat = 'YYYY.MM.DD',
    showProductInfo = false,
    showBestBadge = true,
    showHelpfulButton = true,
    allowAnonymous = false,
    maskedWriterName = true,
    emptyMessage = '아직 작성된 리뷰가 없습니다.',
    submitButtonText = '리뷰 등록',
    cancelButtonText = '취소',
    writeButtonText = '리뷰 작성',
    filterLabels = {
      latest: '최신순',
      rating_high: '별점 높은순',
      rating_low: '별점 낮은순',
      helpful: '도움순'
    }
  } = options;

  const [isWriting, setIsWriting] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(currentFilter);
  const [expandedImages, setExpandedImages] = useState<{[key: string]: boolean}>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  const handleFilterChange = (filter: any) => {
    setSelectedFilter(filter);
    if (actions?.onFilterChange) {
      actions.onFilterChange(filter);
    }
  };

  const handlePageChange = (page: number) => {
    if (actions?.onPageChange) {
      actions.onPageChange(page);
    }
  };

  const handleWriteClick = () => {
    setIsWriting(true);
  };

  const handleWriteCancel = () => {
    setIsWriting(false);
  };

  const handleReviewSubmit = async (formData: any) => {
    if (actions?.onReviewSubmit) {
      await actions.onReviewSubmit(formData);
      setIsWriting(false);
    }
  };

  const handleImageExpand = (reviewId: string) => {
    setExpandedImages(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleImageClick = (images: string[], index: number) => {
    if (actions?.onImageClick) {
      actions.onImageClick(images, index);
    }
  };

  const handleHelpfulClick = (reviewId: string | number) => {
    if (actions?.onHelpfulClick) {
      actions.onHelpfulClick(reviewId);
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button
          key="first"
          className="page-button"
          onClick={() => handlePageChange(1)}
        >
          처음
        </button>
      );
    }

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          이전
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          다음
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <button
          key="last"
          className="page-button"
          onClick={() => handlePageChange(totalPages)}
        >
          마지막
        </button>
      );
    }

    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="review-section-skin" ref={containerRef}>
      {showStatistics && statistics && (
        <ReviewStatistics statistics={statistics} />
      )}

      <div className="review-section-header">
        <h3 className="section-title">리뷰 ({statistics?.totalCount || 0})</h3>
        {showWriteForm && !isWriting && (
          <button className="write-button" onClick={handleWriteClick}>
            {writeButtonText}
          </button>
        )}
      </div>

      {isWriting && (
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onCancel={handleWriteCancel}
          allowImageUpload={allowImageUpload}
          maxImageCount={maxImageCount}
          minContentLength={minContentLength}
          maxContentLength={maxContentLength}
          submitButtonText={submitButtonText}
          cancelButtonText={cancelButtonText}
        />
      )}

      {showFilter && reviews.length > 0 && (
        <ReviewFilter
          currentFilter={selectedFilter}
          onChange={handleFilterChange}
          labels={filterLabels}
        />
      )}

      {reviews.length > 0 ? (
        <>
          <ReviewList
            reviews={reviews}
            showProductInfo={showProductInfo}
            showBestBadge={showBestBadge}
            showHelpfulButton={showHelpfulButton}
            maskedWriterName={maskedWriterName}
            dateFormat={dateFormat}
            expandedImages={expandedImages}
            onImageExpand={handleImageExpand}
            onImageClick={handleImageClick}
            onHelpfulClick={handleHelpfulClick}
            onDelete={actions?.onReviewDelete}
            onReport={actions?.onReviewReport}
          />
          {renderPagination()}
        </>
      ) : (
        !isWriting && <EmptyState message={emptyMessage} />
      )}
    </div>
  );
};

export default ReviewSectionSkin;