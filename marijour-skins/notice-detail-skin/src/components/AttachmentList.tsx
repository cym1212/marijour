import React from 'react';

interface Attachment {
  id: string;
  name: string;
  size: string;
  url: string;
}

interface AttachmentListProps {
  attachments: Attachment[];
  onDownload: (attachment: Attachment) => void;
}

const FileIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6L9 1Z" />
    <path d="M9 1V6H14" />
  </svg>
);

const DownloadIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 11L8 1" />
    <path d="M4 7L8 11L12 7" />
    <path d="M2 15H14" />
  </svg>
);

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onDownload
}) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="attachment-list">
      <h3 className="attachment-title">첨부파일</h3>
      <ul className="attachment-items">
        {attachments.map((attachment) => (
          <li key={attachment.id} className="attachment-item">
            <div className="attachment-info">
              <FileIcon />
              <span className="attachment-name">{attachment.name}</span>
              <span className="attachment-size">({attachment.size})</span>
            </div>
            <button
              className="download-button"
              onClick={() => onDownload(attachment)}
              aria-label={`${attachment.name} 다운로드`}
            >
              <DownloadIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};