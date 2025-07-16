import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SearchBar } from '@/components/ui/input/SearchBar';
import { SearchIcon, LoginIcon, CartIcon, UserIcon } from '@/components/icons';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Menu 컴포넌트 - 헤더 우측 메뉴 (데스크톱 전용)
 *
 * 구조:
 * - 검색, 로그인, 장바구니 버튼으로 구성
 * - 검색 버튼 클릭 시 전체화면 오버레이 검색창
 * - Portal을 사용한 모달형 검색 인터페이스
 *
 * 상태 관리:
 * - isSearchBarOpen: 검색창 오버레이 열림/닫힘 상태
 * - isMounted: DOM 마운트 상태 (Portal 사용을 위함)
 *
 * 애니메이션:
 * - GSAP로 버튼들 fade-in 효과
 * - 검색 오버레이 fade-in/out 애니메이션
 * - ScrollTrigger로 스크롤 인터랙션
 */
export function Menu() {
    const [isSearchBarOpen, setIsSearchBarOpen] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const location = useLocation();

    // URL에 keyword가 있는지 확인
    const hasKeywordInUrl = () => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.has('keyword');
    };

    function handleToggleSearchBar() {
        setIsSearchBarOpen(!isSearchBarOpen);
    }

    // DOM이 마운트되면 상태를 변경
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // URL에 keyword가 있으면 SearchBar를 자동으로 열기
    useEffect(() => {
        if (hasKeywordInUrl()) {
            setIsSearchBarOpen(true);
        }
    }, [location.search]);

    useGSAP(() => {
        // 브레이크 포인트 fade-in 애니메이션
        const searchBtn = document.querySelector('.searchBtn');
        const userBtn = document.querySelector('.userBtn');
        const loginBtn = document.querySelector('.loginBtn');
        const cartBtn = document.querySelector('.cartBtn');

        if (searchBtn && loginBtn && cartBtn && userBtn) {
            const mm = gsap.matchMedia();
            mm.add('(width >= 64rem)', () => {
                gsap.to([searchBtn, userBtn, loginBtn], {
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                });
            });
            mm.add('(width < 64rem)', () => {
                gsap.to([searchBtn, userBtn, loginBtn], {
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power2.out',
                });
            });
            gsap.to(cartBtn, {
                opacity: 1,
                duration: 0.9,
                ease: 'power2.out',
            });
        }
    }, []);

    useGSAP(() => {
        const searchBarContainer = document.querySelector('#header .searchBarContainer');

        if (!searchBarContainer) return;

        if (isSearchBarOpen) {
            gsap.to(searchBarContainer, {
                opacity: 1,
                visibility: 'visible',
                height: '140px',
                duration: 0.5,
                ease: 'power2.out',
            });
        } else {
            gsap.timeline()
                .to(searchBarContainer, {
                    opacity: 0,
                    height: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                })
                .set(
                    searchBarContainer,
                    {
                        visibility: 'hidden',
                    },
                    '-=0.35'
                );
        }
    }, [isSearchBarOpen]);

    return (
        <nav
            id="menu"
            className="lg:w-[300px]"
        >
            <ul className="flex items-center justify-end gap-x-3.5">
                <li className="searchBtn lg:flex hidden items-center justify-center opacity-0">
                    <button
                        className="block"
                        aria-label="검색"
                        type="button"
                        onClick={handleToggleSearchBar}
                    >
                        <SearchIcon />
                    </button>
                </li>
                <li className="userBtn lg:flex hidden items-center justify-center opacity-0">
                    <button
                        className="block"
                        aria-label="마이페이지"
                        type="button"
                    >
                        <Link to={'/my-page/orders'}>
                            <UserIcon />
                        </Link>
                    </button>
                </li>
                <li className="loginBtn lg:flex hidden items-center justify-center opacity-0">
                    <button
                        className="block"
                        aria-label="로그인"
                        type="button"
                    >
                        <Link to={'/login'}>
                            <LoginIcon />
                        </Link>
                    </button>
                </li>
                <li className="cartBtn flex items-center justify-center opacity-0">
                    <button
                        className="block lg:py-0 py-3.5 md:py-5"
                        aria-label="장바구니"
                        type="button"
                    >
                        <Link to={'/cart'}>
                            <CartIcon />
                        </Link>
                    </button>
                    <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center ml-1">
                        <span className="text-sm text-white font-bold">0</span>
                    </div>
                </li>
            </ul>

            {/* DOM이 마운트되면 Portal 렌더링 */}
            {/* 헤더에서 props drilling을 피하기 위해 portal 사용 */}
            {isMounted &&
                createPortal(
                    <div className="searchBarContainer hidden invisible lg:flex w-full opacity-0 h-0 items-center justify-center border-t border-black/10 bg-white">
                        <SearchBar tailwind="lg:w-full lg:max-w-[680px]" />
                    </div>,
                    document.querySelector('#header') || document.body
                )}
        </nav>
    );
}
