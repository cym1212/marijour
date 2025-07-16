import React, { useState, useRef } from 'react';
import { InquiryFormData, InquiryCategory } from '../types';

interface InquiryFormProps {
  onSubmit: (data: InquiryFormData) => Promise<void>;
  onCancel: () => void;
  currentUser?: {
    name: string;
    email: string;
    phone?: string;
  };
  isLoggedIn?: boolean;
  allowAttachments?: boolean;
  maxAttachmentCount?: number;
  maxAttachmentSize?: number; // in MB
  allowPrivateInquiry?: boolean;
  categoryLabels: { [key in InquiryCategory]?: string };
  placeholders: {
    [key in InquiryCategory]?: {
      title: string;
      content: string;
    };
  };
}

export const InquiryForm: React.FC<InquiryFormProps> = ({
  onSubmit,
  onCancel,
  currentUser,
  isLoggedIn = false,
  allowAttachments = true,
  maxAttachmentCount = 5,
  maxAttachmentSize = 10,
  allowPrivateInquiry = true,
  categoryLabels,
  placeholders
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    category: 'product',
    title: '',
    content: '',
    isPrivate: false,
    attachments: [],
    writer: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || ''
    }
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: InquiryCategory[] = ['product', 'order_payment', 'delivery', 'cancel_exchange_return', 'other'];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.writer.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.writer.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.writer.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = '제목은 2글자 이상 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '문의 내용을 입력해주세요.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '문의 내용은 10글자 이상 입력해주세요.';
    }

    if (attachments.length > maxAttachmentCount) {
      newErrors.attachments = `첨부파일은 최대 ${maxAttachmentCount}개까지 등록 가능합니다.`;
    }

    // 파일 크기 검증
    for (const file of attachments) {
      if (file.size > maxAttachmentSize * 1024 * 1024) {
        newErrors.attachments = `파일 크기는 ${maxAttachmentSize}MB를 초과할 수 없습니다.`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('writer.')) {
      const writerField = field.replace('writer.', '');
      setFormData(prev => ({
        ...prev,
        writer: {
          ...prev.writer,
          [writerField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // 에러 클리어
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (category: InquiryCategory) => {
    setFormData(prev => ({
      ...prev,
      category,
      title: '',
      content: ''
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxAttachmentCount - attachments.length;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length < files.length) {
      alert(`최대 ${maxAttachmentCount}개까지 업로드 가능합니다.`);
    }

    // 파일 크기 검증
    const oversizedFiles = filesToAdd.filter(file => file.size > maxAttachmentSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert(`파일 크기는 ${maxAttachmentSize}MB를 초과할 수 없습니다.`);
      return;
    }

    setAttachments(prev => [...prev, ...filesToAdd]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileRemove = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        attachments
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('문의 등록 실패:', error);
      alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPlaceholder = placeholders[formData.category];

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>문의 유형</h3>
        <div className="category-buttons">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-button ${formData.category === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {categoryLabels[category] || category}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>작성자 정보</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">이름 *</label>
            <input
              type="text"
              value={formData.writer.name}
              onChange={(e) => handleInputChange('writer.name', e.target.value)}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="이름을 입력해주세요"
              disabled={isLoggedIn}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">이메일 *</label>
            <input
              type="email"
              value={formData.writer.email}
              onChange={(e) => handleInputChange('writer.email', e.target.value)}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="이메일을 입력해주세요"
              disabled={isLoggedIn}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">연락처</label>
          <input
            type="tel"
            value={formData.writer.phone || ''}
            onChange={(e) => handleInputChange('writer.phone', e.target.value)}
            className="form-input"
            placeholder="연락처를 입력해주세요 (선택)"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>문의 내용</h3>
        <div className="form-group">
          <label className="form-label">제목 *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder={currentPlaceholder?.title || '제목을 입력해주세요'}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label">내용 *</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className={`form-textarea ${errors.content ? 'error' : ''}`}
            placeholder={currentPlaceholder?.content || '문의 내용을 자세히 입력해주세요'}
            rows={8}
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        {allowPrivateInquiry && (
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
              />
              <span>비공개 문의</span>
            </label>
          </div>
        )}
      </div>

      {allowAttachments && (
        <div className="form-section">
          <h3>첨부파일 (선택)</h3>
          <div className="file-upload-area">
            {attachments.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6L9 1Z" />
                    <path d="M9 1V6H14" />
                  </svg>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({formatFileSize(file.size)})</span>
                </div>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleFileRemove(index)}
                >
                  ×
                </button>
              </div>
            ))}
            
            {attachments.length < maxAttachmentCount && (
              <div className="add-file-button" onClick={() => fileInputRef.current?.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5V19M5 12H19" />
                </svg>
                <span>파일 추가</span>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.hwp,.txt"
            />
          </div>
          <p className="file-info">
            최대 {maxAttachmentCount}개, 파일당 {maxAttachmentSize}MB까지 업로드 가능합니다.
          </p>
          {errors.attachments && <span className="error-message">{errors.attachments}</span>}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '문의 등록'}
        </button>
      </div>
    </form>
  );
};