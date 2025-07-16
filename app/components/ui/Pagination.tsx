import { useNavigate, useLocation } from 'react-router';

import { DubbleArrowIcon, ArrowIcon } from '@/components/icons';

import type { PaginationProps } from '@/types/ui';

/**
 * Pagination 컴포넌트 - 재사용 가능한 페이지네이션 UI
 *
 * 기능:
 * - 이전/다음 페이지 이동
 * - 첫 페이지/마지막 페이지 이동
 * - 페이지 번호 직접 선택
 * - 현재 페이지 강조 표시
 * - 표시할 페이지 수 제한 가능
 * - URL query parameter 자동 제어
 */
export function Pagination({ currentPage, totalPages, maxVisiblePages = 5, baseUrl, queryParamName = 'page' }: PaginationProps) {
    const navigate = useNavigate();
    const location = useLocation();

    // 표시할 페이지 번호 범위 계산
    const getVisiblePages = () => {
        const pages: number[] = [];

        if (totalPages <= maxVisiblePages) {
            // 전체 페이지가 maxVisiblePages 이하면 모든 페이지 표시
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // 현재 페이지를 중심으로 페이지 범위 계산
            const halfVisible = Math.floor(maxVisiblePages / 2);
            let startPage = currentPage - halfVisible;
            let endPage = currentPage + halfVisible;

            // 시작 페이지가 1보다 작으면 조정
            if (startPage < 1) {
                startPage = 1;
                endPage = maxVisiblePages;
            }

            // 끝 페이지가 전체 페이지보다 크면 조정
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = totalPages - maxVisiblePages + 1;
                if (startPage < 1) startPage = 1;
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            // URL query parameter 업데이트
            const searchParams = new URLSearchParams(location.search);

            if (page === 1) {
                // 1페이지인 경우 query parameter 제거
                searchParams.delete(queryParamName);
            } else {
                searchParams.set(queryParamName, page.toString());
            }

            const newSearch = searchParams.toString();
            const newUrl = baseUrl || location.pathname;
            const fullUrl = newSearch ? `${newUrl}?${newSearch}` : newUrl;

            navigate(fullUrl, { replace: true });
        }
    };

    return (
        <nav
            className="flex items-center justify-center space-x-1"
            aria-label="페이지네이션"
        >
            {/* 첫 페이지로 이동 */}
            <button
                className={`p-2 ${isFirstPage ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
                onClick={() => handlePageClick(1)}
                disabled={isFirstPage}
                aria-label="첫 페이지로 이동"
            >
                <DubbleArrowIcon
                    rotate="-90"
                    tailwind="w-[16px] h-[16px]"
                />
            </button>

            {/* 이전 페이지 */}
            <button
                className={`p-2 ${isFirstPage ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={isFirstPage}
                aria-label="이전 페이지"
            >
                <ArrowIcon
                    rotate="-90"
                    tailwind="w-[16px] h-[16px]"
                />
            </button>

            {/* 페이지 번호들 */}
            <div className="flex items-center space-x-1 px-1">
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        className={`px-2.5 text-sm ${page === currentPage ? 'font-bold text-primary' : 'text-black/40 hover-primary'}`}
                        onClick={() => handlePageClick(page)}
                        aria-label={`${page}페이지로 이동`}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* 다음 페이지 */}
            <button
                className={`p-2 ${isLastPage ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={isLastPage}
                aria-label="다음 페이지"
            >
                <ArrowIcon
                    rotate="90"
                    tailwind="w-[16px] h-[16px]"
                />
            </button>

            {/* 마지막 페이지로 이동 */}
            <button
                className={`p-2 ${isLastPage ? 'text-black/40 cursor-not-allowed' : 'text-black hover-black-40'}`}
                onClick={() => handlePageClick(totalPages)}
                disabled={isLastPage}
                aria-label="마지막 페이지로 이동"
            >
                <DubbleArrowIcon
                    rotate="90"
                    tailwind="w-[16px] h-[16px]"
                />
            </button>
        </nav>
    );
}
