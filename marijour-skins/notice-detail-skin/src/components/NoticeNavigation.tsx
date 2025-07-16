import React from 'react';

interface NoticeNavigationProps {
  prevNotice?: {
    id: number | string;
    title: string;
  };
  nextNotice?: {
    id: number | string;
    title: string;
  };
  onNavigate: (id: number | string) => void;
}

const ChevronUp: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 10L8 6L4 10" />
  </svg>
);

const ChevronDown: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 6L8 10L12 6" />
  </svg>
);

export const NoticeNavigation: React.FC<NoticeNavigationProps> = ({
  prevNotice,
  nextNotice,
  onNavigate
}) => {
  if (!prevNotice && !nextNotice) {
    return null;
  }

  return (
    <div className="notice-navigation">
      {prevNotice && (
        <div 
          className="nav-item prev"
          onClick={() => onNavigate(prevNotice.id)}
        >
          <div className="nav-icon">
            <ChevronUp />
          </div>
          <div className="nav-content">
            <span className="nav-label">이전글</span>
            <span className="nav-title">{prevNotice.title}</span>
          </div>
        </div>
      )}
      
      {nextNotice && (
        <div 
          className="nav-item next"
          onClick={() => onNavigate(nextNotice.id)}
        >
          <div className="nav-icon">
            <ChevronDown />
          </div>
          <div className="nav-content">
            <span className="nav-label">다음글</span>
            <span className="nav-title">{nextNotice.title}</span>
          </div>
        </div>
      )}
    </div>
  );
};