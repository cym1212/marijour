import React from 'react';

interface EmptyStateProps {
  message: string;
}

const InquiryIcon: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M32 8C45.2548 8 56 18.7452 56 32C56 45.2548 45.2548 56 32 56C18.7452 56 8 45.2548 8 32C8 18.7452 18.7452 8 32 8Z" />
    <path d="M24 24H40" />
    <path d="M24 32H40" />
    <path d="M24 40H32" />
    <path d="M44 20L48 24L44 28" />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <InquiryIcon />
      </div>
      <p className="empty-message">{message}</p>
    </div>
  );
};