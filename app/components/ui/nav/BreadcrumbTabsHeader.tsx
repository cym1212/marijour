import { Link, useLocation } from 'react-router';

import { findSubRoutes, getPathDepth, getPathHierarchy } from '@/utils/navigation';

import type { BreadcrumbTabsHeaderProps } from '@/types/ui';

/**
 * BreadcrumbTabsHeader 컴포넌트 - 브레드크럼 및 탭 헤더
 *
 * 기능:
 * - 현재 페이지의 경로 계층 구조 표시 (브레드크럼)
 * - 현재 경로의 하위 메뉴 탭 표시
 * - 자동으로 경로 깊이 감지하여 UI 결정
 *
 * 파라미터:
 * @param navData - 네비게이션 데이터
 * @param mainPath - 메인 경로
 */
export function BreadcrumbTabsHeader({ navData, mainPath }: BreadcrumbTabsHeaderProps) {
    const { pathname } = useLocation();

    // 현재 경로의 계층 깊이 가져오기
    const pathDepth = getPathDepth(pathname);

    // 현재 경로의 계층 구조를 GNB DATA에서 가져오기
    const pathHierarchy = getPathHierarchy(pathname, navData);

    // 현재 경로의 하위 경로를 GNB DATA에서 가져오기
    const subRoutes = findSubRoutes(pathname, mainPath, navData);

    return (
        <div className="breadcrumbTabsHeader">
            {pathDepth > 1 && pathHierarchy.length > 0 && (
                <nav className="my-3">
                    <ol className="breadcrumbs flex items-center">
                        {pathHierarchy.map((item, index, arr) => (
                            <li
                                key={item.path}
                                className="flex items-center leading-logo text-sm hover-primary"
                            >
                                <Link to={item.path}>{item.label}</Link>
                                {index < arr.length - 1 && <span className="mx-1.5">{'>'}</span>}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}
            <h2 className="font-serif text-3xl leading-heading">{pathHierarchy[pathHierarchy.length - 1]?.label}</h2>
            {subRoutes.length > 0 && (
                <nav className="mt-4 overflow-x-auto noScrollbar">
                    <ul className="flex gap-4 md:gap-7">
                        {subRoutes.map((route) => (
                            <li
                                key={route.id}
                                className="shrink-0"
                            >
                                <Link
                                    to={route.path}
                                    className="text-black/40 hover-black"
                                >
                                    {route.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
}
