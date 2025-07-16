import type { GNBData } from '@/types/navigation';

/**
 * 현재 경로에 맞는 하위 경로들을 네비게이션 데이터에서 재귀적으로 가져오는 유틸리티 함수
 *
 * @param currentPath - 현재 경로 (예: '/shop/kitchen-dining/bowls')
 * @param menuPath - 대상 메뉴 경로 (예: '/shop')
 * @param navigationData - 네비게이션 데이터 배열
 * @returns 하위 경로 배열
 */
export function findSubRoutes(currentPath: string, menuPath: string, navigationData: GNBData[]) {
    // 대상 메뉴 찾기
    const targetMenu = navigationData.find((item) => item.to === menuPath);

    if (!targetMenu || !targetMenu.children) {
        return [];
    }

    // 재귀적으로 경로를 찾는 내부 함수
    function findRouteRecursively(routes: GNBData[], targetPath: string): GNBData | null {
        for (const route of routes) {
            if (route.to === targetPath) {
                return route;
            }

            if (route.children && route.children.length > 0) {
                const found = findRouteRecursively(route.children, targetPath);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }

    // 현재 경로가 대상 메뉴 경로와 동일한 경우, 바로 하위 메뉴들 반환
    if (currentPath === menuPath) {
        return targetMenu.children.map((child) => ({
            path: child.to,
            label: child.label,
            id: child.to.split('/').pop() || '',
            children: child.children || [],
        }));
    }

    // 재귀적으로 현재 경로에 해당하는 메뉴 찾기
    const currentMenu = findRouteRecursively(targetMenu.children, currentPath);

    if (currentMenu && currentMenu.children && currentMenu.children.length > 0) {
        return currentMenu.children.map((subChild) => ({
            path: subChild.to,
            label: subChild.label,
            id: subChild.to.split('/').pop() || '',
            children: subChild.children || [],
        }));
    }

    return [];
}

/**
 * 특정 메뉴 경로의 모든 하위 경로를 재귀적으로 가져오는 유틸리티 함수
 *
 * @param menuPath - 메뉴 경로 (예: '/shop')
 * @param navigationData - 네비게이션 데이터 배열
 * @returns 모든 하위 경로 배열 (평면화된)
 */
export function getAllSubRoutes(menuPath: string, navigationData: GNBData[]): Array<{ path: string; label: string; id: string }> {
    const menu = navigationData.find((item) => item.to === menuPath);

    if (!menu || !menu.children) {
        return [];
    }

    const flattenRoutes = (routes: GNBData[]): Array<{ path: string; label: string; id: string }> => {
        const result: Array<{ path: string; label: string; id: string }> = [];

        routes.forEach((route) => {
            result.push({
                path: route.to,
                label: route.label,
                id: route.to.split('/').pop() || '',
            });

            if (route.children && route.children.length > 0) {
                result.push(...flattenRoutes(route.children));
            }
        });

        return result;
    };

    return flattenRoutes(menu.children);
}

/**
 * 경로의 깊이를 계산하는 유틸리티 함수
 *
 * @param path - 경로 (예: '/shop/kitchen-dining/bowls')
 * @returns 경로 깊이 (예: 3)
 */
export function getPathDepth(path: string): number {
    return path.split('/').filter((segment) => segment.length > 0).length;
}

/**
 * 부모 경로를 가져오는 유틸리티 함수
 *
 * @param path - 현재 경로 (예: '/shop/kitchen-dining/bowls')
 * @returns 부모 경로 (예: '/shop/kitchen-dining')
 */
export function getParentPath(path: string): string {
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length <= 1) return '/';

    return '/' + segments.slice(0, -1).join('/');
}

/**
 * 특정 경로의 전체 계층 구조(breadcrumb)를 가져오는 유틸리티 함수
 *
 * @param targetPath - 대상 경로 (예: '/shop/kitchen-dining/bowls')
 * @param navigationData - 네비게이션 데이터 배열
 * @returns 계층 구조 배열 (root부터 현재 경로까지)
 */
export function getPathHierarchy(targetPath: string, navigationData: GNBData[]): Array<{ path: string; label: string; id: string }> {
    const hierarchy: Array<{ path: string; label: string; id: string }> = [];

    // 재귀적으로 경로를 찾고 계층 구조 구성
    function findPathRecursively(routes: GNBData[], searchPath: string, currentHierarchy: Array<{ path: string; label: string; id: string }>): boolean {
        for (const route of routes) {
            const newHierarchy = [
                ...currentHierarchy,
                {
                    path: route.to,
                    label: route.label,
                    id: route.to.split('/').pop() || '',
                },
            ];

            if (route.to === searchPath) {
                hierarchy.push(...newHierarchy);
                return true;
            }

            if (route.children && route.children.length > 0) {
                if (findPathRecursively(route.children, searchPath, newHierarchy)) {
                    return true;
                }
            }
        }
        return false;
    }

    findPathRecursively(navigationData, targetPath, []);
    return hierarchy;
}

/**
 * 경로가 특정 메뉴의 하위 경로인지 확인하는 유틸리티 함수
 *
 * @param currentPath - 현재 경로
 * @param menuPath - 메뉴 경로
 * @param navigationData - 네비게이션 데이터 배열
 * @returns 하위 경로 여부
 */
export function isSubPathOf(currentPath: string, menuPath: string, navigationData: GNBData[]): boolean {
    const hierarchy = getPathHierarchy(currentPath, navigationData);
    return hierarchy.some((item) => item.path === menuPath);
}
