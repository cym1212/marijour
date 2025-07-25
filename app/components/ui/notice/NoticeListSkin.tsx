import React from 'react';

// 스타일 import
import './notice-list-skin-scoped.css';

// 공통 데이터 import
import { Notice, NOTICE_MOCK_DATA } from './noticeData';

/**
 * NoticeListSkin 컴포넌트 - 공지사항 목록 UMD 버전
 *
 * 기능:
 * - 공지사항 목록 표시
 * - 페이지네이션 (10개씩)
 * - 공지사항 클릭 이벤트
 * - 완전히 독립적인 컴포넌트 (props 없음)
 */
export function NoticeList() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [selectedNotices, setSelectedNotices] = React.useState<Notice[]>([]);
    
    const itemsPerPage = 10;
    const totalPages = Math.ceil(NOTICE_MOCK_DATA.length / itemsPerPage);
    
    // 현재 페이지의 공지사항 계산
    React.useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setSelectedNotices(NOTICE_MOCK_DATA.slice(startIndex, endIndex));
    }, [currentPage]);

    const handleNoticeClick = (notice: Notice) => {
        // URL에 공지사항 ID를 포함하여 상세 페이지로 이동
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
        const detailUrl = `${baseUrl}/test-notice-detail-skin.html?id=${notice.id}`;
        window.location.href = detailUrl;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 페이지네이션 렌더링
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // 이전 페이지 버튼
        if (currentPage > 1) {
            pages.push(
                <button
                    key="prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="nl-skin-pagination-btn"
                >
                    이전
                </button>
            );
        }

        // 페이지 번호 버튼들
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`nl-skin-pagination-btn ${currentPage === i ? 'nl-skin-pagination-active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        // 다음 페이지 버튼
        if (currentPage < totalPages) {
            pages.push(
                <button
                    key="next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="nl-skin-pagination-btn"
                >
                    다음
                </button>
            );
        }

        return (
            <div className="nl-skin-pagination">
                {pages}
            </div>
        );
    };

    return (
        <div className="nl-skin-container">
            <section className="nl-skin-wrapper">
                <div className="nl-skin-header">
                    <h2 className="nl-skin-page-title">공지사항</h2>
                </div>

                <div className="nl-skin-content">
                    {selectedNotices.length > 0 ? (
                        <div className="nl-skin-list">
                            <ul className="nl-skin-list-ul">
                                {selectedNotices.map((notice) => (
                                    <li key={notice.id} className="nl-skin-item">
                                        <button
                                            onClick={() => handleNoticeClick(notice)}
                                            className="nl-skin-item-button"
                                        >
                                            <div className="nl-skin-item-content">
                                                <h3 className="nl-skin-item-title">
                                                    {notice.title}
                                                </h3>
                                                <p className="nl-skin-item-text">
                                                    {notice.content}
                                                </p>
                                            </div>
                                            <div className="nl-skin-item-meta">
                                                <span className="nl-skin-item-writer">{notice.writer}</span>
                                                <span className="nl-skin-item-date">{notice.createAt}</span>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="nl-skin-empty">
                            <div className="nl-skin-empty-content">
                                <div className="nl-skin-empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3 className="nl-skin-empty-title">등록된 공지사항이 없습니다</h3>
                                <p className="nl-skin-empty-description">새로운 공지사항이 등록되면 여기에 표시됩니다.</p>
                            </div>
                        </div>
                    )}

                    {/* 페이지네이션 */}
                    {renderPagination()}
                </div>
            </section>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(NoticeList as any).SAMPLE_DATA = NOTICE_MOCK_DATA;

export default NoticeList;