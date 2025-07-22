import React from 'react';

// 스타일 import
import './quick-menu-skin-scoped.css';

// Base64 이미지 import
import { QUICK_MENU_IMAGES } from './quick-menu-images';

import type { QuickMenuData } from '@/types/navigation';

// Mock 데이터 (번들에 포함) - base64 이미지 사용
const QUICK_MENU_DATA: QuickMenuData[] = [
    {
        to: '/shop',
        label: '전체',
        thumbnailUrl: QUICK_MENU_IMAGES.all,
    },
    {
        to: '/shop/best',
        label: 'Best',
        thumbnailUrl: QUICK_MENU_IMAGES.best,
    },
    {
        to: '/shop/kitchen-dining/bowls',
        label: '그릇',
        thumbnailUrl: QUICK_MENU_IMAGES.bowl,
    },
    {
        to: '/shop/kitchen-dining/cups',
        label: '컵',
        thumbnailUrl: QUICK_MENU_IMAGES.cup,
    },
    {
        to: '/shop/body-care/oral-care',
        label: '구강케어',
        thumbnailUrl: QUICK_MENU_IMAGES.oralcare,
    },
    {
        to: '/shop/body-care/skin-care',
        label: '스킨케어',
        thumbnailUrl: QUICK_MENU_IMAGES.skincare,
    },
    {
        to: '/shop/bedroom-fabric/homewear',
        label: '홈웨어',
        thumbnailUrl: QUICK_MENU_IMAGES.homewear,
    },
    {
        to: '/shop/bedroom-fabric/mattress-cover',
        label: '패브릭',
        thumbnailUrl: QUICK_MENU_IMAGES.fabric,
    },
];

/**
 * QuickMenuSkin 컴포넌트 - 빠른 메뉴 네비게이션 UMD 버전
 *
 * 기능:
 * - 주요 카테고리별 빠른 접근 메뉴
 * - 가로 스크롤 지원 (모바일)
 * - 썸네일 이미지와 라벨로 구성
 * - 이미지 base64 인코딩으로 번들에 포함
 */
export function QuickMenu() {
    return (
        <nav className="qm-skin-quick-menu qm-skin-globalWrapper qm-skin-overflow-hidden qm-skin-flex qm-skin-justify-center">
            <ul className="qm-skin-flex qm-skin-items-center qm-skin-justify-start qm-skin-gap-3 qm-skin-md-gap-6 qm-skin-overflow-x-auto qm-skin-mx-auto qm-skin-noScrollbar">
                {QUICK_MENU_DATA.map((item) => (
                    <li
                        key={item.to}
                        className="qm-skin-shrink-0 qm-skin-md-shrink qm-skin-group"
                    >
                        <a
                            href={item.to}
                            className="qm-skin-flex qm-skin-flex-col qm-skin-items-center qm-skin-justify-center"
                        >
                            <div className="qm-skin-overflow-hidden qm-skin-rounded-full qm-skin-w-auto qm-skin-max-h-3-5rem qm-skin-md-max-h-5rem qm-skin-aspect-square">
                                <img
                                    src={item.thumbnailUrl}
                                    alt={item.label}
                                    className="qm-skin-w-full qm-skin-h-full qm-skin-object-cover qm-skin-transition-transform qm-skin-duration-300 qm-skin-ease-out qm-skin-group-hover-scale-110"
                                />
                            </div>
                            <span className="qm-skin-leading-body qm-skin-mt-2 qm-skin-text-xs qm-skin-md-text-base">{item.label}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(QuickMenu as any).SAMPLE_DATA = QUICK_MENU_DATA;

export default QuickMenu;