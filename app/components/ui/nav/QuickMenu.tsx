import { Link } from 'react-router';

import { QUICK_MENU_MOCK_DATA } from '@/constants/navigation';

/**
 * QuickMenu 컴포넌트 - 빠른 메뉴 네비게이션
 *
 * 기능:
 * - 주요 카테고리별 빠른 접근 메뉴
 * - 가로 스크롤 지원 (모바일)
 * - 썸네일 이미지와 라벨로 구성
 */
export function QuickMenu() {
    return (
        <nav className="quick-menu globalWrapper overflow-hidden flex justify-center">
            <ul className="flex items-center justify-start gap-3 md:gap-6 overflow-x-auto mx-auto noScrollbar">
                {QUICK_MENU_MOCK_DATA.map((item) => (
                    <li
                        key={item.to}
                        className="shrink-0 md:shrink group/quickMenu"
                    >
                        <Link
                            to={item.to}
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="overflow-hidden rounded-full w-auto max-h-[3.5rem] md:max-h-[5rem] aspect-square">
                                <img
                                    src={item.thumbnailUrl}
                                    alt={item.label}
                                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/quickMenu:scale-110"
                                />
                            </div>
                            <span className="leading-body mt-2 text-xs md:text-base">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
