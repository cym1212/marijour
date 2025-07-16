import React from 'react';
import { Inquiry, InquiryCategory, InquiryStatus, InquiryAttachment } from '../types';

interface InquiryDetailProps {
  inquiry: Inquiry;
  categoryLabels: { [key in InquiryCategory]?: string };
  statusLabels: { [key in InquiryStatus]?: string };
  dateFormat?: string;
  isOwner?: boolean;
  onBack: () => void;
  onAction: (action: string, inquiryId: number | string, data?: any) => void;
  onAttachmentDownload: (attachment: InquiryAttachment) => void;
}

export const InquiryDetail: React.FC<InquiryDetailProps> = ({
  inquiry,
  categoryLabels,
  statusLabels,
  dateFormat = 'YYYY.MM.DD',
  isOwner = false,
  onBack,
  onAction,
  onAttachmentDownload
}) => {
  const formatDate = (date: string) => {
    return date.replace(/-/g, '.');
  };

  const formatDateTime = (date: string) => {
    const [datePart, timePart] = date.split('T');
    const formattedDate = datePart.replace(/-/g, '.');
    const formattedTime = timePart ? timePart.substring(0, 5) : '';
    return formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;
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

  const handleEdit = () => {
    onAction('edit', inquiry.id);
  };

  const handleDelete = () => {
    if (confirm('문의를 삭제하시겠습니까?')) {
      onAction('delete', inquiry.id);
    }
  };

  return (
    <div className="inquiry-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4L6 10L12 16" />
          </svg>
          목록으로
        </button>
      </div>

      <div className="inquiry-info">
        <div className="inquiry-status-section">
          <div className={`status-badge large ${getStatusClass(inquiry.status)}`}>
            {statusLabels[inquiry.status] || inquiry.status}
          </div>
          <div className="inquiry-meta-info">
            <span className="category-badge">
              {categoryLabels[inquiry.category] || inquiry.category}
            </span>
            {inquiry.isPrivate && (
              <span className="private-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 6C4 4.89543 4.89543 4 6 4H10C11.1046 4 12 4.89543 12 6V7H13C13.5523 7 14 7.44772 14 8V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V8C2 7.44772 2.44772 7 3 7H4V6Z" />
                </svg>
                비공개 문의
              </span>
            )}
          </div>
        </div>

        <div className="inquiry-header-info">
          <h3 className="inquiry-title">{inquiry.title}</h3>
          <div className="inquiry-details">
            <div className="detail-item">
              <span className="label">작성자</span>
              <span className="value">{inquiry.writer.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">이메일</span>
              <span className="value">{inquiry.writer.email}</span>
            </div>
            {inquiry.writer.phone && (
              <div className="detail-item">
                <span className="label">연락처</span>
                <span className="value">{inquiry.writer.phone}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="label">작성일</span>
              <span className="value">{formatDateTime(inquiry.createdAt)}</span>
            </div>
            {inquiry.updatedAt && inquiry.updatedAt !== inquiry.createdAt && (
              <div className="detail-item">
                <span className="label">수정일</span>
                <span className="value">{formatDateTime(inquiry.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="inquiry-content-section">
        <h4>문의 내용</h4>
        <div className="inquiry-content">
          {inquiry.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>

      {inquiry.attachments && inquiry.attachments.length > 0 && (
        <div className="attachments-section">
          <h4>첨부파일</h4>
          <div className="attachment-list">
            {inquiry.attachments.map((attachment) => (
              <div key={attachment.id} className="attachment-item">
                <div className="attachment-info">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6L9 1Z" />
                    <path d="M9 1V6H14" />
                  </svg>
                  <span className="attachment-name">{attachment.name}</span>
                  <span className="attachment-size">({attachment.size})</span>
                </div>
                <button
                  className="download-button"
                  onClick={() => onAttachmentDownload(attachment)}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 11L8 1" />
                    <path d="M4 7L8 11L12 7" />
                    <path d="M2 15H14" />
                  </svg>
                  다운로드
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {inquiry.answer && (
        <div className="answer-section">
          <div className="answer-header">
            <h4>답변</h4>
            <span className="answer-date">{formatDateTime(inquiry.answer.answeredAt)}</span>
          </div>
          <div className="answer-content">
            <div className="answerer">
              <strong>{inquiry.answer.answeredBy}</strong>
            </div>
            <div className="answer-text">
              {inquiry.answer.content.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {isOwner && inquiry.status === 'pending' && (
        <div className="action-buttons">
          <button className="edit-button" onClick={handleEdit}>
            수정
          </button>
          <button className="delete-button" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
};