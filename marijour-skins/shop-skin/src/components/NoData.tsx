import React from 'react';

interface NoDataProps {
  title: string;
  description: string;
}

export const NoData: React.FC<NoDataProps> = ({ title, description }) => {
  return (
    <div className="no-data-container">
      <div className="no-data-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6H16L14 4H10L8 6H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V8C20 6.9 19.1 6 20 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </div>
      <h3 className="no-data-title">{title}</h3>
      <p className="no-data-description">{description}</p>
    </div>
  );
};