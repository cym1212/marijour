import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { SearchIcon, CloseIcon } from '@/components/icons';

import type { SearchBarProps } from '@/types/ui';

/**
 * SearchBar 컴포넌트 - 검색 입력 필드
 *
 * 구조:
 * - 검색 아이콘 + 입력 필드 + 삭제 버튼 (옵션)
 * - Flexbox 기반 레이아웃, 버튼 순서 변경 가능
 * - form 요소로 접근성 향상
 * - URL 쿼리 파라미터와 연동
 *
 * 상태 관리:
 * - searchKeyword: 현재 검색어 입력 값
 * - isResetValue props로 외부에서 초기화 제어
 * - URL keyword 쿼리 파라미터로 자동 설정
 *
 * Props:
 * - tailwind?: string - 추가 스타일 클래스
 * - directionReverse?: boolean - 버튼 순서 반전 여부
 * - hideCloseBtn?: boolean - 삭제 버튼 숨김 여부
 * - isResetValue?: boolean - 외부에서 값 초기화 트리거
 * - forceOpen?: boolean - 강제로 열린 상태 유지
 * - submitCallback?: () => void - 검색 제출 후 콜백 함수
 */
export function SearchBar({ tailwind, directionReverse = false, hideCloseBtn = false, isResetValue, submitCallback }: SearchBarProps) {
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const navigate = useNavigate();
    const location = useLocation();

    // URL에서 keyword 쿼리 파라미터를 읽어서 초기값 설정
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const keywordFromUrl = searchParams.get('keyword');

        if (keywordFromUrl) {
            setSearchKeyword(decodeURIComponent(keywordFromUrl));
        }
    }, [location.search]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchKeyword('');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // 검색어가 있을 때만 검색 페이지로 이동
        if (searchKeyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
        }
        // 검색 제출 후 콜백 함수 호출
        submitCallback?.();

        handleClearSearch();
    };

    useEffect(() => {
        if (isResetValue) {
            setSearchKeyword('');
        }
    }, [isResetValue]);

    return (
        <section className={`searchBar ${tailwind}`}>
            <form className={'flex items-center justify-between bg-white border-b border-black gap-x-1'}>
                <button
                    className={`py-3 px-2 lg:px-0 ${directionReverse ? 'order-3' : 'order-1'}`}
                    aria-label="검색"
                    onClick={handleSubmit}
                >
                    <SearchIcon />
                </button>
                <input
                    type="text"
                    placeholder="검색어를 입력해주세요."
                    className="text-sm bg-transparent px-2 w-full order-2"
                    value={searchKeyword}
                    onChange={handleInputChange}
                />
                {!hideCloseBtn && (
                    <button
                        className={`py-3 px-2 lg:px-0 ${directionReverse ? 'order-1' : 'order-3'}`}
                        aria-label="검색어 지우기"
                        type="button"
                        onClick={handleClearSearch}
                    >
                        <CloseIcon />
                    </button>
                )}
            </form>
        </section>
    );
}
