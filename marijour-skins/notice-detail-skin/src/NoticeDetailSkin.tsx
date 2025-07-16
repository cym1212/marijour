import React, { useEffect, useRef } from 'react';
import { NoticeDetailSkinProps } from './types';
import { NoticeNavigation } from './components/NoticeNavigation';
import { AttachmentList } from './components/AttachmentList';
import { EmptyState } from './components/EmptyState';
import './notice-detail-skin.scss';

const NoticeDetailSkin: React.FC<NoticeDetailSkinProps> = ({ data, utils, actions }) => {
  const {
    id,
    title = '',
    content = '',
    writer = '',
    createdAt = '',
    category,
    isImportant,
    viewCount,
    prevNotice,
    nextNotice,
    pageTitle = '공지사항',
    showCategory = false,
    showViewCount = false,
    showNavigation = true,
    dateFormat = 'YYYY.MM.DD',
    listButtonText = '목록으로',
    listButtonLink = '/notice',
    emptyTitle = '공지사항을 찾을 수 없습니다',
    emptyDescription = '요청하신 공지사항이 존재하지 않거나 삭제되었습니다.',
    emptyIcon = true,
    attachments = []
  } = data || {};

  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  const handleBackToList = () => {
    if (utils?.navigate) {
      utils.navigate(listButtonLink);
    } else if (actions?.onBackToList) {
      actions.onBackToList();
    }
  };

  const handleNoticeNavigate = (noticeId: number | string) => {
    if (utils?.navigate) {
      utils.navigate(`/notice/${noticeId}`);
    } else if (actions?.onNavigate) {
      actions.onNavigate(noticeId);
    }
  };

  const handleAttachmentDownload = (attachment: any) => {
    if (actions?.onDownloadAttachment) {
      actions.onDownloadAttachment(attachment);
    } else {
      // 기본 다운로드 동작
      window.open(attachment.url, '_blank');
    }
  };

  const formatDate = (date: string) => {
    // 간단한 날짜 포맷팅
    return date.replace(/-/g, '.');
  };

  // 내용이 없는 경우
  if (!title) {
    return (
      <div className="notice-detail-skin empty" ref={containerRef}>
        <div className="notice-container">
          <h1 className="page-title">{pageTitle}</h1>
          <div className="notice-empty">
            <EmptyState
              title={emptyTitle}
              description={emptyDescription}
              showIcon={emptyIcon}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notice-detail-skin" ref={containerRef}>
      <div className="notice-container">
        <h1 className="page-title">{pageTitle}</h1>
        
        <article className="notice-detail">
          <header className="notice-header">
            <div className="header-main">
              {isImportant && (
                <span className="notice-badge">중요</span>
              )}
              {showCategory && category && (
                <span className="notice-category">[{category}]</span>
              )}
              <h2 className="notice-title">{title}</h2>
            </div>
            <div className="notice-meta">
              <span className="notice-writer">{writer}</span>
              <span className="notice-date">{formatDate(createdAt)}</span>
              {showViewCount && viewCount !== undefined && (
                <span className="notice-views">조회 {viewCount}</span>
              )}
            </div>
          </header>
          
          <div className="notice-content">
            {content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          {attachments.length > 0 && (
            <AttachmentList
              attachments={attachments}
              onDownload={handleAttachmentDownload}
            />
          )}
          
          <div className="notice-actions">
            <button 
              className="list-button"
              onClick={handleBackToList}
            >
              {listButtonText}
            </button>
          </div>
        </article>
        
        {showNavigation && (prevNotice || nextNotice) && (
          <NoticeNavigation
            prevNotice={prevNotice}
            nextNotice={nextNotice}
            onNavigate={handleNoticeNavigate}
          />
        )}
      </div>
    </div>
  );
};

export default NoticeDetailSkin;