import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  showIcon: boolean;
}

const NoticeIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 8H36C37.1046 8 38 8.89543 38 10V38C38 39.1046 37.1046 40 36 40H12C10.8954 40 10 39.1046 10 38V10C10 8.89543 10.8954 8 12 8Z" />
    <path d="M16 16H32" />
    <path d="M16 24H32" />
    <path d="M16 32H24" />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  showIcon
}) => {
  return (
    <div className="empty-state">
      {showIcon && (
        <div className="empty-icon">
          <NoticeIcon />
        </div>
      )}
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
    </div>
  );
};