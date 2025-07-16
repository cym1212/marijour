import React from 'react';

interface EmptyStateProps {
  message: string;
}

const OrderIcon: React.FC = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8 16L16 8H48L56 16V48L48 56H16L8 48V16Z" />
    <path d="M20 24H44" />
    <path d="M20 32H44" />
    <path d="M20 40H32" />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <OrderIcon />
      </div>
      <p className="empty-message">{message}</p>
    </div>
  );
};