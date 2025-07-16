import React, { useState, useRef } from 'react';
import { ReviewFormData } from '../types';

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel: () => void;
  allowImageUpload?: boolean;
  maxImageCount?: number;
  minContentLength?: number;
  maxContentLength?: number;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const StarRatingInput: React.FC<{
  rating: number;
  onChange: (rating: number) => void;
}> = ({ rating, onChange }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="star-rating-input">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="star-button"
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => onChange(star)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            className={star <= (hoveredRating || rating) ? "filled" : "empty"}
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </button>
      ))}
      <span className="rating-text">
        {rating > 0 ? `${rating}점` : '별점을 선택해주세요'}
      </span>
    </div>
  );
};

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  allowImageUpload = true,
  maxImageCount = 5,
  minContentLength = 10,
  maxContentLength = 500,
  submitButtonText = '리뷰 등록',
  cancelButtonText = '취소'
}) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (rating === 0) {
      newErrors.rating = '별점을 선택해주세요.';
    }

    if (content.length < minContentLength) {
      newErrors.content = `리뷰는 최소 ${minContentLength}자 이상 작성해주세요.`;
    } else if (content.length > maxContentLength) {
      newErrors.content = `리뷰는 최대 ${maxContentLength}자까지 작성 가능합니다.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxImageCount - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length < files.length) {
      alert(`최대 ${maxImageCount}개까지 업로드 가능합니다.`);
    }

    // 이미지 미리보기 생성
    const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...filesToAdd]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleImageRemove = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        content,
        images
      });

      // 폼 초기화
      setRating(0);
      setContent('');
      setImages([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">별점</label>
        <StarRatingInput rating={rating} onChange={setRating} />
        {errors.rating && <span className="error-message">{errors.rating}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">리뷰 내용</label>
        <textarea
          className="form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`상품에 대한 솔직한 리뷰를 ${minContentLength}자 이상 작성해주세요.`}
          rows={5}
        />
        <div className="content-info">
          <span className={content.length < minContentLength || content.length > maxContentLength ? 'error' : ''}>
            {content.length} / {maxContentLength}
          </span>
        </div>
        {errors.content && <span className="error-message">{errors.content}</span>}
      </div>

      {allowImageUpload && (
        <div className="form-group">
          <label className="form-label">사진 첨부 (선택)</label>
          <div className="image-upload-area">
            {previewUrls.map((url, index) => (
              <div key={index} className="image-preview">
                <img src={url} alt={`미리보기 ${index + 1}`} />
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleImageRemove(index)}
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < maxImageCount && (
              <div className="add-image-button" onClick={() => fileInputRef.current?.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5V19M5 12H19" />
                </svg>
                <span>사진 추가</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
          </div>
          <p className="image-info">최대 {maxImageCount}개까지 등록 가능합니다.</p>
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelButtonText}
        </button>
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '등록 중...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};