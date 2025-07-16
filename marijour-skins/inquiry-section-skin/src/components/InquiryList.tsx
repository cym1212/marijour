import React from 'react';
import { Inquiry, InquiryCategory, InquiryStatus } from '../types';

interface InquiryListProps {
  inquiries: Inquiry[];
  categoryLabels: { [key in InquiryCategory]?: string };
  statusLabels: { [key in InquiryStatus]?: string };
  dateFormat?: string;
  onInquirySelect: (inquiryId: number | string) => void;
}

export const InquiryList: React.FC<InquiryListProps> = ({
  inquiries,
  categoryLabels,
  statusLabels,
  dateFormat = 'YYYY.MM.DD',
  onInquirySelect
}) => {
  const formatDate = (date: string) => {
    // 간단한 날짜 포맷팅
    return date.replace(/-/g, '.');
  };

  const getStatusClass = (status: InquiryStatus) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-progress';
      case 'answered':
        return 'status-answered';
      case 'closed':
        return 'status-closed';
      default:
        return '';
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="inquiry-list">
      {inquiries.map((inquiry) => (
        <div 
          key={inquiry.id} 
          className="inquiry-item"
          onClick={() => onInquirySelect(inquiry.id)}
        >
          <div className="inquiry-header">
            <div className="inquiry-meta">
              <span className="inquiry-category">
                {categoryLabels[inquiry.category] || inquiry.category}
              </span>
              <span className="inquiry-date">{formatDate(inquiry.createdAt)}</span>
              {inquiry.isPrivate && (
                <span className="private-badge">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H7C8.10457 3 9 3.89543 9 5V6H10C10.5523 6 11 6.44772 11 7V10C11 10.5523 10.5523 11 10 11H2C1.44772 11 1 10.5523 1 10V7C1 6.44772 1.44772 6 2 6H3V5Z" />
                  </svg>
                  비공개
                </span>
              )}
            </div>
            <div className={`inquiry-status ${getStatusClass(inquiry.status)}`}>
              {statusLabels[inquiry.status] || inquiry.status}
            </div>
          </div>

          <div className="inquiry-content">
            <h4 className="inquiry-title">{inquiry.title}</h4>
            <p className="inquiry-text">{truncateText(inquiry.content)}</p>
          </div>

          <div className="inquiry-footer">
            <div className="inquiry-writer">
              <span>작성자: {inquiry.writer.name}</span>
            </div>
            <div className="inquiry-actions">
              {inquiry.attachments && inquiry.attachments.length > 0 && (
                <span className="attachment-badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8.5 3L3.5 8C3.10218 8.39782 3.10218 9.10218 3.5 9.5C3.89782 9.89782 4.60218 9.89782 5 9.5L10 4.5C10.7956 3.70442 10.7956 2.42893 10 1.63333C9.20442 0.837748 7.92893 0.837748 7.13333 1.63333L2.13333 6.63333C0.944444 7.82222 0.944444 9.67778 2.13333 10.8667C3.32222 12.0556 5.17778 12.0556 6.36667 10.8667L11.5 5.5" />
                  </svg>
                  {inquiry.attachments.length}
                </span>
              )}
              {inquiry.answer && (
                <span className="answer-badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 7L5 11L13 3" />
                  </svg>
                  답변 완료
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};