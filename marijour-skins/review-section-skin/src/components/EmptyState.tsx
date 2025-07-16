import React from 'react';

interface EmptyStateProps {
  message: string;
}

const ReviewIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M24 4L29.5 16L42 18L33 27L35.5 40L24 34L12.5 40L15 27L6 18L18.5 16L24 4Z" />
    <path d="M16 24L20 28L28 20" />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <ReviewIcon />
      </div>
      <p className="empty-message">{message}</p>
    </div>
  );
};