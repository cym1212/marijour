import React, { useState, useEffect, useRef } from 'react';
import { NoticeListSkinProps } from './types';
import { Pagination } from './components/Pagination';
import { SearchFilter } from './components/SearchFilter';
import { EmptyState } from './components/EmptyState';
import './notice-list-skin.scss';

const NoticeListSkin: React.FC<NoticeListSkinProps> = ({ data, utils, actions }) => {
  const {
    notices = [],
    currentPage: initialPage = 1,
    totalPages = 1,
    itemsPerPage = 10,
    title = '공지사항',
    showContent = true,
    contentLineClamp = 2,
    showWriter = true,
    showDate = true,
    showViewCount = false,
    showCategory = false,
    searchKeyword = '',
    selectedCategory = '',
    categories = [],
    layout = 'list',
    emptyTitle = '등록된 공지사항이 없습니다',
    emptyDescription = '새로운 공지사항이 등록되면 여기에 표시됩니다.',
    emptyIcon = true,
    enableSearch = false,
    enableCategoryFilter = false,
    dateFormat = 'YYYY.MM.DD'
  } = data || {};

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filteredNotices, setFilteredNotices] = useState(notices);
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  // 아이템 애니메이션
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.notice-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [filteredNotices, currentPage]);

  // 필터링
  useEffect(() => {
    let filtered = notices;

    // 카테고리 필터
    if (selectedCategory) {
      filtered = filtered.filter(notice => notice.category === selectedCategory);
    }

    // 검색어 필터
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(keyword) ||
        notice.content.toLowerCase().includes(keyword)
      );
    }

    setFilteredNotices(filtered);
    setCurrentPage(1);
  }, [searchKeyword, selectedCategory, notices]);

  // 페이지네이션 처리
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNoticeClick = (noticeId: number | string) => {
    if (utils?.navigate) {
      utils.navigate(`/notice/${noticeId}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (actions?.onPageChange) {
      actions.onPageChange(page);
    }
    // 스크롤 상단으로
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (keyword: string) => {
    if (actions?.onSearch) {
      actions.onSearch(keyword);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (actions?.onCategoryChange) {
      actions.onCategoryChange(category);
    }
  };

  const formatDate = (date: string) => {
    // 간단한 날짜 포맷팅 (실제로는 더 복잡한 로직 필요)
    return date.replace(/-/g, '.');
  };

  const calculatedTotalPages = Math.ceil(filteredNotices.length / itemsPerPage);

  return (
    <div className="notice-list-skin" ref={containerRef}>
      <div className="notice-container">
        <h1 className="notice-title">{title}</h1>

        {(enableSearch || enableCategoryFilter) && (
          <SearchFilter
            searchKeyword={searchKeyword}
            selectedCategory={selectedCategory}
            categories={categories}
            enableSearch={enableSearch}
            enableCategoryFilter={enableCategoryFilter}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
          />
        )}

        {paginatedNotices.length > 0 ? (
          <>
            <div className={`notice-list layout-${layout}`}>
              {layout === 'list' ? (
                <ul className="list-view">
                  {paginatedNotices.map((notice, index) => (
                    <li
                      key={notice.id}
                      className="notice-item"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <a
                        href={`/notice/${notice.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNoticeClick(notice.id);
                        }}
                        className="notice-link"
                      >
                        <div className="notice-main">
                          <div className="notice-header">
                            {notice.isImportant && (
                              <span className="notice-badge">중요</span>
                            )}
                            {showCategory && notice.category && (
                              <span className="notice-category">[{notice.category}]</span>
                            )}
                            <h3 className="notice-item-title">{notice.title}</h3>
                          </div>
                          {showContent && (
                            <p 
                              className="notice-content"
                              style={{
                                WebkitLineClamp: contentLineClamp,
                                lineClamp: contentLineClamp
                              }}
                            >
                              {notice.content}
                            </p>
                          )}
                        </div>
                        <div className="notice-meta">
                          {showWriter && (
                            <span className="notice-writer">{notice.writer}</span>
                          )}
                          {showDate && (
                            <span className="notice-date">{formatDate(notice.createdAt)}</span>
                          )}
                          {showViewCount && notice.viewCount !== undefined && (
                            <span className="notice-views">조회 {notice.viewCount}</span>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="card-view">
                  {paginatedNotices.map((notice, index) => (
                    <article
                      key={notice.id}
                      className="notice-card"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => handleNoticeClick(notice.id)}
                    >
                      <div className="card-header">
                        {notice.isImportant && (
                          <span className="notice-badge">중요</span>
                        )}
                        {showCategory && notice.category && (
                          <span className="notice-category">{notice.category}</span>
                        )}
                      </div>
                      <h3 className="card-title">{notice.title}</h3>
                      {showContent && (
                        <p 
                          className="card-content"
                          style={{
                            WebkitLineClamp: contentLineClamp,
                            lineClamp: contentLineClamp
                          }}
                        >
                          {notice.content}
                        </p>
                      )}
                      <div className="card-footer">
                        {showWriter && (
                          <span className="notice-writer">{notice.writer}</span>
                        )}
                        {showDate && (
                          <span className="notice-date">{formatDate(notice.createdAt)}</span>
                        )}
                        {showViewCount && notice.viewCount !== undefined && (
                          <span className="notice-views">조회 {notice.viewCount}</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {calculatedTotalPages > 1 && (
              <div className="pagination-wrapper">
                <Pagination
                  currentPage={currentPage}
                  totalPages={calculatedTotalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            showIcon={emptyIcon}
          />
        )}
      </div>
    </div>
  );
};

export default NoticeListSkin;