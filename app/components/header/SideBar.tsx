import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SearchBar } from '@/components/ui/input/SearchBar';
import { LoginIcon, CartIcon, ArrowIcon, CloseIcon, UserIcon } from '@/components/icons';
import { GNB_MOCK_DATA } from '@/constants/navigation';

import type { GNBData, SideBarPropsType } from '@/types/navigation';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * SideBar 컴포넌트 - 모바일 전용 사이드 메뉴
 *
 * 구조:
 * - 오버레이 배경 + 슬라이딩 사이드바 메뉴
 * - 2단계 메뉴 시스템: 메인 메뉴 → 메가메뉴 (하위 카테고리)
 * - 각 하위 카테고리별 드롭다운 아코디언
 *
 * 상태 관리:
 * - isOpen: 사이드바 열림/닫힘 (부모로부터 전달)
 * - clickedItem: 선택된 메뉴 아이템 (메가메뉴용)
 * - isMegaMenuOpen: 메가메뉴 열림/닫힘 상태
 * - expandedDropdowns: 현재 열린 드롭다운들의 Set
 *
 * 애니메이션:
 * - GSAP Timeline으로 사이드바 슬라이드 인/아웃
 * - 메가메뉴 페이드 인/아웃 및 슬라이드 전환
 * - 개별 드롭다운 아코디언 애니메이션 (height 기반)
 *
 * Props:
 * - isOpen: boolean - 사이드바 표시 여부
 * - onClose: () => void - 사이드바 닫기 콜백
 */
export function SideBar({ isOpen, onClose }: SideBarPropsType) {
    const [clickedItem, setClickedItem] = useState<GNBData | null>(null);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
    const [megaMenuTimeline, setMegaMenuTimeline] = useState<gsap.core.Timeline | null>(null);
    const [expandedDropdowns, setExpandedDropdowns] = useState<Set<string>>(new Set());

    function handleOpenMegaMenu(item: GNBData) {
        setClickedItem(item);
        setIsMegaMenuOpen(true);
    }

    function handleCloseMegaMenu() {
        setIsMegaMenuOpen(false);
        // 메가메뉴가 닫힐 때 모든 드롭다운도 초기화
        setExpandedDropdowns(new Set());
    }

    function toggleDropdown(childTo: string) {
        const newExpanded = new Set(expandedDropdowns);
        const wasExpanded = newExpanded.has(childTo);

        if (wasExpanded) {
            newExpanded.delete(childTo);
        } else {
            newExpanded.add(childTo);
        }
        setExpandedDropdowns(newExpanded);
    }

    // 드롭다운 개별 애니메이션
    useGSAP(() => {
        if (!clickedItem || !clickedItem.children) return;

        // 현재 상태에 따라 각 드롭다운의 애니메이션 결정
        clickedItem.children.forEach((child) => {
            const dropdown = document.querySelector(`[data-dropdown="${child.to}"]`);
            const button = document.querySelector(`[data-dropdown-btn="${child.to}"] svg`);

            if (dropdown && button) {
                const shouldBeExpanded = expandedDropdowns.has(child.to);
                const dropdownElement = dropdown as HTMLElement;
                const currentHeight = dropdownElement.style.height;
                const isCurrentlyExpanded = currentHeight !== '0px' && currentHeight !== '';

                // 상태가 바뀐 경우에만 애니메이션 실행
                if (shouldBeExpanded !== isCurrentlyExpanded) {
                    // 기존 애니메이션 중단
                    gsap.killTweensOf(dropdown);
                    gsap.killTweensOf(button);

                    if (shouldBeExpanded) {
                        // 드롭다운 열기 애니메이션
                        gsap.set(dropdown, {
                            height: 'auto',
                            overflow: 'hidden',
                        });

                        const height = dropdown.scrollHeight;

                        gsap.fromTo(
                            dropdown,
                            {
                                height: 0,
                                opacity: 0,
                            },
                            {
                                height: height,
                                opacity: 1,
                                duration: 0.4,
                                ease: 'power2.out',
                            }
                        );

                        // 버튼 화살표 회전
                        gsap.to(button, {
                            rotation: 0,
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                    } else {
                        // 드롭다운 닫기 애니메이션
                        gsap.to(dropdown, {
                            height: 0,
                            opacity: 0,
                            duration: 0.4,
                            ease: 'power2.out',
                        });

                        // 버튼 화살표 원래 위치로
                        gsap.to(button, {
                            rotation: 180,
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                    }
                }
            }
        });
    }, [expandedDropdowns, clickedItem]);

    // 컴포넌트 언마운트 시 타임라인 정리
    useEffect(() => {
        return () => {
            if (megaMenuTimeline) {
                megaMenuTimeline.kill();
            }
        };
    }, [megaMenuTimeline]);

    // 메가메뉴가 닫힐 때 모든 드롭다운 초기화
    useGSAP(() => {
        if (!isMegaMenuOpen && clickedItem && clickedItem.children) {
            // 메가메뉴가 닫혔을 때만 모든 드롭다운 초기화
            clickedItem.children.forEach((child) => {
                const dropdown = document.querySelector(`[data-dropdown="${child.to}"]`);
                const button = document.querySelector(`[data-dropdown-btn="${child.to}"] svg`);

                if (dropdown && button) {
                    gsap.killTweensOf(dropdown);
                    gsap.killTweensOf(button);
                    gsap.set(dropdown, { height: 0, opacity: 0 });
                    gsap.set(button, { rotation: 0 });
                }
            });
        }
    }, [isMegaMenuOpen]);

    // 사이드 바 fade-in-out 애니메이션
    useGSAP(() => {
        const container = document.querySelector('#sideBar');
        const overlay = document.querySelector('.sideBarOverlay');
        const content = document.querySelector('.sideBarContent');

        if (isOpen) {
            gsap.set(container, { visibility: 'visible', width: '100%' });
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
            gsap.to(content, {
                x: '0%',
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
        } else {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
            });
            gsap.to(content, {
                x: '-5%',
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.set(container, { visibility: 'hidden', width: '0%' });
                    setIsMegaMenuOpen(false);
                    setClickedItem(null);
                    setExpandedDropdowns(new Set());
                    megaMenuTimeline?.kill();
                },
            });
        }
    }, [isOpen]);

    // 메가 메뉴 애니메이션
    useGSAP(() => {
        const menu = document.querySelector('.sideBarMenu');
        const megaMenu = document.querySelector('.sideBarMegaMenu');

        // 기존 타임라인이 있으면 중단
        if (megaMenuTimeline) {
            megaMenuTimeline.kill();
        }

        if (isMegaMenuOpen) {
            const tl = gsap.timeline();
            tl.set(megaMenu, { opacity: 0, x: '5%', visibility: 'visible' })
                .to(menu, {
                    opacity: 0,
                    x: '-5%',
                    duration: 0.5,
                    ease: 'power2.out',
                })
                .to(
                    megaMenu,
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '<'
                );

            setMegaMenuTimeline(tl);
        } else {
            const tl = gsap.timeline();
            tl.to(megaMenu, {
                opacity: 0,
                x: '5%',
                duration: 0.5,
                ease: 'power2.out',
            })
                .to(
                    menu,
                    {
                        opacity: 1,
                        x: '0%',
                        duration: 0.5,
                        ease: 'power2.out',
                    },
                    '<'
                )
                .set(megaMenu, {
                    visibility: 'hidden',
                })
                .call(() => {
                    setClickedItem(null);
                });

            setMegaMenuTimeline(tl);
        }
    }, [clickedItem, isMegaMenuOpen]);

    // 메가메뉴가 닫힐 때만 모든 드롭다운 초기화
    useGSAP(() => {
        if (!isMegaMenuOpen && clickedItem && clickedItem.children) {
            // 메가메뉴가 닫혔을 때만 모든 드롭다운 초기화
            clickedItem.children.forEach((child) => {
                const dropdown = document.querySelector(`[data-dropdown="${child.to}"]`);
                const button = document.querySelector(`[data-dropdown-btn="${child.to}"] svg`);

                if (dropdown && button) {
                    gsap.killTweensOf(dropdown);
                    gsap.killTweensOf(button);
                    gsap.set(dropdown, { height: 0, opacity: 0 });
                    gsap.set(button, { rotation: 180 });
                }
            });
        }
    }, [isMegaMenuOpen]);

    return (
        <section
            id="sideBar"
            className={`sideBar fixed top-0 left-0 h-full overflow-hidden z-10000 w-0 invisible`}
        >
            <SideBarOverlay onClose={onClose!} />
            <SideBarContent
                onClose={onClose!}
                isOpen={isOpen}
                clickedItem={clickedItem}
                handleOpenMegaMenu={handleOpenMegaMenu}
                handleCloseMegaMenu={handleCloseMegaMenu}
                toggleDropdown={toggleDropdown}
            />
        </section>
    );
}

// 사이드바 오버레이 컴포넌트
function SideBarOverlay({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="sideBarOverlay fixed bg-black/60 w-full h-full opacity-0"
            onClick={onClose}
            onTouchEnd={onClose}
        />
    );
}

// 사이드바 콘텐츠 컴포넌트
function SideBarContent({
    onClose,
    isOpen,
    clickedItem,
    handleOpenMegaMenu,
    handleCloseMegaMenu,
    toggleDropdown,
}: {
    onClose: () => void;
    isOpen: boolean;
    clickedItem: GNBData | null;
    handleOpenMegaMenu: (item: GNBData) => void;
    handleCloseMegaMenu: () => void;
    toggleDropdown: (childTo: string) => void;
}) {
    return (
        <div className="sideBarContent fixed left-0 bg-white w-full max-w-[400px] h-full flex flex-col opacity-0 transform -translate-x-['5%']">
            <SideBarHeader onClose={onClose} />
            <SideBarSearchSection
                isOpen={isOpen}
                onClose={onClose}
            />
            <SideBarNavigation
                clickedItem={clickedItem}
                handleOpenMegaMenu={handleOpenMegaMenu}
                handleCloseMegaMenu={handleCloseMegaMenu}
                toggleDropdown={toggleDropdown}
                onClose={onClose}
            />
            <SideBarFooter onClose={onClose} />
        </div>
    );
}

// 사이드바 헤더 컴포넌트
function SideBarHeader({ onClose }: { onClose: () => void }) {
    return (
        <div className="flex items-center justify-end p-2">
            <button
                className="closeBtn p-3.5"
                aria-label="메뉴 닫기"
                type="button"
                onClick={onClose}
            >
                <CloseIcon />
            </button>
        </div>
    );
}

// 사이드바 검색 섹션 컴포넌트
function SideBarSearchSection({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <div className="p-5">
            <SearchBar
                directionReverse
                hideCloseBtn
                isResetValue={!isOpen}
                submitCallback={onClose}
            />
        </div>
    );
}

// 사이드바 네비게이션 컴포넌트
function SideBarNavigation({ clickedItem, handleOpenMegaMenu, handleCloseMegaMenu, toggleDropdown, onClose }: { clickedItem: GNBData | null; handleOpenMegaMenu: (item: GNBData) => void; handleCloseMegaMenu: () => void; toggleDropdown: (childTo: string) => void; onClose: () => void }) {
    return (
        <nav className="sideBarGnb grow relative">
            <SideBarMainMenu
                handleOpenMegaMenu={handleOpenMegaMenu}
                onClose={onClose}
            />
            <SideBarMegaMenu
                clickedItem={clickedItem}
                handleCloseMegaMenu={handleCloseMegaMenu}
                toggleDropdown={toggleDropdown}
                onClose={onClose}
            />
        </nav>
    );
}

// 사이드바 메인 메뉴 컴포넌트
function SideBarMainMenu({ handleOpenMegaMenu, onClose }: { handleOpenMegaMenu: (item: GNBData) => void; onClose: () => void }) {
    return (
        <ul className="sideBarMenu space-y-8 absolute top-0 left-0 w-full h-full overflow-y-auto">
            {GNB_MOCK_DATA.map((item) => (
                <li
                    key={item.to}
                    className="flex items-center justify-between px-5"
                >
                    <h3>
                        <Link
                            to={item.to}
                            className="font-serif text-3xl leading-heading hover-primary-80"
                            onClick={onClose}
                        >
                            {item.label}
                        </Link>
                    </h3>
                    {item.children && item.children.length > 0 && (
                        <button
                            type="button"
                            className="flex items-center justify-center p-3 pr-1.5"
                            aria-label="메가 메뉴 열기"
                            onClick={() => handleOpenMegaMenu(item)}
                        >
                            <ArrowIcon rotate="90" />
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );
}

// 사이드바 메가 메뉴 컴포넌트
function SideBarMegaMenu({ clickedItem, handleCloseMegaMenu, toggleDropdown, onClose }: { clickedItem: GNBData | null; handleCloseMegaMenu: () => void; toggleDropdown: (childTo: string) => void; onClose: () => void }) {
    return (
        <div className="sideBarMegaMenu absolute top-0 left-0 w-full h-full overflow-y-auto invisible">
            {clickedItem && clickedItem.children && (
                <>
                    <SideBarMegaMenuHeader
                        clickedItem={clickedItem}
                        handleCloseMegaMenu={handleCloseMegaMenu}
                    />
                    <SideBarMegaMenuList
                        clickedItem={clickedItem}
                        toggleDropdown={toggleDropdown}
                        onClose={onClose}
                    />
                </>
            )}
        </div>
    );
}

// 사이드바 메가 메뉴 헤더 컴포넌트
function SideBarMegaMenuHeader({ clickedItem, handleCloseMegaMenu }: { clickedItem: GNBData; handleCloseMegaMenu: () => void }) {
    return (
        <div className="flex items-center justify-start px-5 mb-9">
            <button
                type="button"
                className="flex items-center justify-center p-3 pl-1.5"
                aria-label="메가 메뉴 닫기"
                onClick={handleCloseMegaMenu}
            >
                <ArrowIcon rotate="270" />
            </button>
            <h3 className="font-serif text-3xl leading-heading ml-4">{clickedItem.label}</h3>
        </div>
    );
}

// 사이드바 메가 메뉴 리스트 컴포넌트
function SideBarMegaMenuList({ clickedItem, toggleDropdown, onClose }: { clickedItem: GNBData; toggleDropdown: (childTo: string) => void; onClose: () => void }) {
    return (
        <ul className="sideBarMegaMenu">
            {clickedItem.children?.map((child) => (
                <li
                    key={child.to}
                    className="px-5 mb-4 last:mb-0"
                >
                    <div className="flex items-center justify-between">
                        <h4>
                            <Link
                                to={child.to}
                                className="text-sm leading-logo hover-primary-80"
                                onClick={onClose}
                            >
                                {child.label}
                            </Link>
                        </h4>
                        {child.children && child.children.length > 0 && (
                            <button
                                type="button"
                                className="flex items-center justify-center p-3"
                                aria-label="하위 메뉴 열기"
                                data-dropdown-btn={child.to}
                                onClick={() => toggleDropdown(child.to)}
                            >
                                <ArrowIcon
                                    rotate="180"
                                    tailwind="w-[16px] h-[16px] text-black/40 hover-black transition-transform"
                                />
                            </button>
                        )}
                    </div>
                    {child.children && child.children.length > 0 && (
                        <ul
                            className="dropdown w-full mt-2 overflow-hidden"
                            data-dropdown={child.to}
                            style={{ height: 0, opacity: 0 }}
                        >
                            {child.children.map((subChild) => (
                                <li
                                    key={subChild.to}
                                    className="flex mb-3 last:mb-0"
                                >
                                    <Link
                                        to={subChild.to}
                                        className="text-sm text-black/60 hover-black block leading-logo"
                                        onClick={onClose}
                                    >
                                        {subChild.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}

// 사이드바 푸터 컴포넌트
function SideBarFooter({ onClose }: { onClose: () => void }) {
    return (
        <nav className="sideBarMenu">
            <ul className="flex items-center justify-between py-2 mx-5 border-t border-black/10">
                <li className="flex items-center justify-center h-14 w-full">
                    <button
                        className="p-4"
                        aria-label="로그인"
                        type="button"
                        onClick={onClose}
                    >
                        <Link to={'/login'}>
                            <LoginIcon />
                        </Link>
                    </button>
                </li>
                <li className="relative flex items-center justify-center h-14 w-full before:content-[''] before:absolute before:top-1/2 before:left-0 before:h-5 before:w-px before:bg-black/10 before:transform before:-translate-y-1/2 after:content-[''] after:absolute after:top-1/2 after:right-0 after:h-5 after:w-px after:bg-black/10 after:transform after:-translate-y-1/2">
                    <button
                        className="p-4"
                        aria-label="마이페이지"
                        type="button"
                        onClick={onClose}
                    >
                        <Link to={'/my-page'}>
                            <UserIcon />
                        </Link>
                    </button>
                </li>
                <li className="flex items-center justify-center h-14 w-full">
                    <button
                        className="p-4 pr-0"
                        aria-label="장바구니"
                        type="button"
                        onClick={onClose}
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
        </nav>
    );
}
