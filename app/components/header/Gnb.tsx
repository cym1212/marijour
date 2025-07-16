import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { SideBar } from '@/components/header/SideBar';
import { MenuIcon } from '@/components/icons';
import { GNB_MOCK_DATA } from '@/constants/navigation';

import type { GNBData } from '@/types/navigation';

gsap.registerPlugin(useGSAP);

/**
 * Gnb 컴포넌트 - 글로벌 네비게이션 바 컴포넌트
 *
 * 구조:
 * - 데스크톱: 호버 기반 메가메뉴 시스템
 * - 모바일: 햄버거 메뉴 버튼으로 사이드바 토글
 *
 * 상태 관리:
 * - isSideBarOpen: 사이드바 열림/닫힘 상태
 * - 데스크톱 메가메뉴: hoveredItem, isMegaMenuOpen, megaMenuTimeline
 *
 * 애니메이션:
 * - GSAP Timeline을 활용한 메가메뉴 fade/slide 애니메이션
 * - 호버 상호작용과 포커스 관리
 *
 * Props:
 * - SideBar: isOpen, onClose 함수 전달
 * - MobileGnb: onOpen 함수 전달
 */
export function Gnb() {
    const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

    function handleOpenSideBar() {
        setIsSideBarOpen(true);
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    }

    function handleCloseSideBar() {
        setIsSideBarOpen(false);
        document.body.style.overflow = ''; // 스크롤 복원
    }

    return (
        <nav
            id="gnb"
            className="lg:w-[300px]"
        >
            <DesktopGnb />
            <MobileGnb onOpen={handleOpenSideBar} />
            <SideBar
                isOpen={isSideBarOpen}
                onClose={handleCloseSideBar}
            />
        </nav>
    );
}

function DesktopGnb() {
    const [hoveredItem, setHoveredItem] = useState<GNBData | null>(null);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [megaMenuTimeline, setMegaMenuTimeline] = useState<gsap.core.Timeline | null>(null);

    function handleMouseHover(item: GNBData) {
        if (item.children && item.children.length > 0) {
            setHoveredItem(item);
            setIsMegaMenuOpen(true);
        } else {
            // depth가 없는 메뉴를 hover하면 메가 메뉴 닫기
            setHoveredItem(null);
            setIsMegaMenuOpen(false);
        }
    }

    function handleGnbMouseLeave() {
        // GNB 전체 영역을 벗어났을 때만 메가 메뉴 닫기
        setIsMegaMenuOpen(false);
    }

    function handleMegaMenuMouseLeave() {
        // 메가 메뉴 영역을 벗어났을 때 메가 메뉴 닫기
        setIsMegaMenuOpen(false);
    }

    function handleMegaMenuMouseEnter() {
        // 메가 메뉴에 마우스가 들어오면 상태 유지
        if (hoveredItem) {
            setIsMegaMenuOpen(true);
        }
    }

    // 컨포넌트 마운트되면 상태를 변경
    useEffect(() => {
        setIsMounted(true);
        return () => {
            // 컴포넌트 언마운트 시 타임라인 정리
            if (megaMenuTimeline) {
                megaMenuTimeline.kill();
            }
        };
    }, [megaMenuTimeline]);

    useGSAP(() => {
        // 브레이크 포인트 fade-in 애니메이션
        const gnb = document.querySelector('.desktopGnb');
        if (gnb) {
            const mm = gsap.matchMedia();
            mm.add('(width >= 64rem)', () => {
                gsap.to(gnb, {
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                });
            });
        }
    }, []);

    useGSAP(() => {
        const megaMenu = document.querySelector('#header .megaMenu');

        if (!megaMenu) return;

        // 기존 타임라인이 있으면 중단
        if (megaMenuTimeline) {
            megaMenuTimeline.kill();
        }

        if (isMegaMenuOpen) {
            // 메가 메뉴 열기 애니메이션
            const tl = gsap.timeline();
            tl.set(megaMenu, {
                visibility: 'visible',
            }).to(megaMenu, {
                opacity: 1,
                duration: 0.4,
                ease: 'power2.out',
            });

            setMegaMenuTimeline(tl);
        } else {
            // 메가 메뉴 닫기 애니메이션
            const tl = gsap.timeline();
            tl.to(megaMenu, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out',
            })
                .set(megaMenu, {
                    visibility: 'hidden',
                })
                .call(() => {
                    setHoveredItem(null); // hoveredItem 초기화
                });

            setMegaMenuTimeline(tl);
        }
    }, [isMegaMenuOpen]);

    return (
        <>
            <DesktopGnbNavigation
                hoveredItem={hoveredItem}
                handleMouseHover={handleMouseHover}
                handleGnbMouseLeave={handleGnbMouseLeave}
            />
            {/* DOM이 마운트되면 Portal 렌더링 */}
            {/* 헤더에서 props drilling을 피하기 위해 portal 사용 */}
            {isMounted &&
                createPortal(
                    <DesktopGnbMegaMenu
                        hoveredItem={hoveredItem}
                        handleMegaMenuMouseEnter={handleMegaMenuMouseEnter}
                        handleMegaMenuMouseLeave={handleMegaMenuMouseLeave}
                    />,
                    document.querySelector('#header') || document.body
                )}
        </>
    );
}

// 데스크톱 GNB 네비게이션 컴포넌트
function DesktopGnbNavigation({ hoveredItem, handleMouseHover, handleGnbMouseLeave }: { hoveredItem: GNBData | null; handleMouseHover: (item: GNBData) => void; handleGnbMouseLeave: () => void }) {
    return (
        <ul
            className="desktopGnb lg:flex hidden items-center justify-start gap-x-7 opacity-0"
            onMouseLeave={handleGnbMouseLeave}
        >
            {GNB_MOCK_DATA.map((item) => (
                <li
                    key={item.to}
                    className="relative py-4 group"
                    onMouseEnter={() => handleMouseHover(item)}
                >
                    <Link
                        to={item.to}
                        className="text-sm leading-logo hover-primary"
                    >
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );
}

// 데스크톱 GNB 메가메뉴 컴포넌트
function DesktopGnbMegaMenu({ hoveredItem, handleMegaMenuMouseEnter, handleMegaMenuMouseLeave }: { hoveredItem: GNBData | null; handleMegaMenuMouseEnter: () => void; handleMegaMenuMouseLeave: () => void }) {
    return (
        <div
            className="megaMenu hidden invisible absolute lg:flex w-full opacity-0 h-auto items-center justify-center border-t border-black/10 bg-white/95"
            onMouseEnter={handleMegaMenuMouseEnter}
            onMouseLeave={handleMegaMenuMouseLeave}
        >
            {hoveredItem && hoveredItem.children && (
                <div className="globalWrapper w-full py-10">
                    <div className="flex justify-start gap-x-20 justify-start">
                        {hoveredItem.children.map((category, index) => (
                            <DesktopGnbMegaMenuCategory
                                key={category.to}
                                category={category}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// 데스크톱 GNB 메가메뉴 카테고리 컴포넌트
function DesktopGnbMegaMenuCategory({ category }: { category: GNBData }) {
    return (
        <div className="flex-shrink-0 mr-12">
            {/* 카테고리 제목 */}
            <div className="mb-4">
                <h4>
                    <Link
                        to={category.to}
                        className="text-sm hover-primary block leading-logo"
                    >
                        {category.label}
                    </Link>
                </h4>
            </div>

            {/* 서브 카테고리 목록 */}
            {category.children && category.children.length > 0 && (
                <ul className="space-y-2.5">
                    {category.children.map((subItem) => (
                        <li key={subItem.to}>
                            <Link
                                to={subItem.to}
                                className="text-sm text-black/60 hover-black block leading-logo"
                            >
                                {subItem.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function MobileGnb({ onOpen }: { onOpen: () => void }) {
    // 브레이크 포인트 fade-in 애니메이션
    useGSAP(() => {
        const gnb = document.querySelector('.mobileGnb');
        if (gnb) {
            const mm = gsap.matchMedia();
            mm.add('(width < 64rem)', () => {
                gsap.to(gnb, {
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                });
            });
        }
    }, []);

    return (
        <div className="mobileGnb lg:hidden opacity-0">
            <button
                className="block pr-3 py-3.5 md:py-5"
                aria-label="메뉴"
                type="button"
                onClick={onOpen}
            >
                <MenuIcon />
            </button>
        </div>
    );
}
