import React, { useEffect, useState } from 'react';

// 스타일 import
import './shop-header-skin-scoped.css';

// CategoryMenuItem 인터페이스
interface CategoryMenuItem {
    id: string;
    categoryId: number;
    categoryName: string;
    routingPath: string;
    parentId: string | null;
    order: number;
    visible: boolean;
    children?: CategoryMenuItem[];
}

// ComponentSkinProps 인터페이스
interface ComponentSkinProps {
    data?: {
        id?: string;
        className?: string;
        style?: React.CSSProperties;
        componentProps?: {
            menuItems?: CategoryMenuItem[];
            showProductCount?: boolean;
            showIcon?: boolean;
            showDescription?: boolean;
            showCategoryInfo?: boolean;
            layout?: 'list' | 'grid' | 'dropdown';
            columns?: number;
            emptyMessage?: string;
            skin?: string;
        };
        menuItems?: CategoryMenuItem[];
        loading?: boolean;
        error?: string | null;
        selectedItemId?: string | null;
        isExpanded?: boolean;
        // v2.0+ API 속성들
        breadcrumb?: Array<{
            id: number;
            name: string;
            parentId: number | null;
        }>;
        currentChildren?: CategoryMenuItem[];
        // 추가 가능한 속성들
        hasBreadcrumb?: boolean;
        currentChildrenLength?: number;
        effectiveMenuItemsLength?: number;
        isLowestLevel?: boolean;
        effectiveMenuItems?: CategoryMenuItem[];
    };
    actions?: {
        handleMenuItemClick?: (item: CategoryMenuItem) => void;
        toggleExpanded?: () => void;
        handleBackToRoot?: () => void; // v2.1+ API
    };
    utils?: {
        t?: (key: string) => string;
        navigate?: (path: string, options?: any) => void;
        formatDate?: (date: Date | string, format?: string) => string;
        formatCurrency?: (amount: number, currency?: string) => string;
        getAssetUrl?: (path: string) => string;
        cx?: (...classes: any[]) => string;
    };
    app?: {
        user?: any;
        company?: any;
        currentLanguage?: string;
        isUserLoggedIn?: boolean;
        theme?: object;
    };
    mode?: 'editor' | 'preview' | 'production';
    editor?: {
        isSelected?: boolean;
    };
}

// 기본 메뉴 아이템 (폴백용)
const DEFAULT_MENU_ITEMS: CategoryMenuItem[] = [
    {
        id: 'menu-1',
        categoryId: 1,
        categoryName: 'Best',
        routingPath: '/best',
        parentId: null,
        order: 1,
        visible: true
    },
    {
        id: 'menu-2',
        categoryId: 2,
        categoryName: '키친&다이닝',
        routingPath: '/kitchen-dining',
        parentId: null,
        order: 2,
        visible: true
    },
    {
        id: 'menu-3',
        categoryId: 3,
        categoryName: '바디케어',
        routingPath: '/body-care',
        parentId: null,
        order: 3,
        visible: true
    },
    {
        id: 'menu-4',
        categoryId: 4,
        categoryName: '침실&패브릭',
        routingPath: '/bedroom-fabric',
        parentId: null,
        order: 4,
        visible: true
    }
];

// ShopHeaderSkin 컴포넌트
export const ShopHeaderSkin: React.FC<ComponentSkinProps> = (props = {}) => {
    const { data = {}, actions = {}, utils = {}, mode = 'production' } = props;
    
    // data에서 필요한 값 추출
    const {
        componentProps = {},
        menuItems: dataMenuItems = [],
        loading = false,
        error = null,
        selectedItemId = null,
        isExpanded = false,
        breadcrumb = [],
        currentChildren = [],
        // 로그에서 보이는 추가 속성들
        hasBreadcrumb = false,
        currentChildrenLength = 0,
        effectiveMenuItems = [],
        effectiveMenuItemsLength = 0,
        isLowestLevel = false
    } = data;
    
    // componentProps에서 설정값 추출
    const {
        menuItems: propMenuItems = [],
        showProductCount = false,
        showIcon = false,
        showDescription = false,
        showCategoryInfo = false,
        layout = 'list',
        columns = 3,
        emptyMessage = '메뉴가 없습니다.'
    } = componentProps;
    
    // 실제 사용할 menuItems 결정
    // effectiveMenuItems가 있으면 우선 사용 (웹빌더 v2.0+)
    const menuItems = effectiveMenuItems && effectiveMenuItems.length > 0 ? effectiveMenuItems :
                     propMenuItems.length > 0 ? propMenuItems : 
                     dataMenuItems.length > 0 ? dataMenuItems : 
                     DEFAULT_MENU_ITEMS;
    
    // actions 추출
    const {
        handleMenuItemClick = (item: CategoryMenuItem) => {
            console.log('Menu item clicked:', item);
        },
        toggleExpanded = () => {},
        handleBackToRoot = () => {
            console.log('Back to root');
        }
    } = actions;
    
    // utils 추출
    const {
        t = (key: string) => key,
        navigate = (path: string, options?: any) => {
            console.log('Navigate to:', path, options);
        }
    } = utils;
    
    // 현재 경로 확인 (브라우저 환경에서만)
    const [currentPath, setCurrentPath] = useState('');
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentPath(window.location.pathname);
        }
    }, []);
    
    // 계층 구조로 메뉴 변환 (currentChildren이 없을 때 폴백용)
    const buildMenuTree = (items: CategoryMenuItem[]) => {
        const tree: CategoryMenuItem[] = [];
        const itemMap: { [key: string]: CategoryMenuItem } = {};
        
        // visible한 아이템만 필터링
        const visibleItems = items.filter(item => item.visible !== false);
        
        // 각 아이템을 맵에 저장하고 children 배열 초기화
        visibleItems.forEach(item => {
            itemMap[item.id] = { ...item, children: [] };
        });
        
        // 부모-자식 관계 설정
        visibleItems.forEach(item => {
            if (item.parentId && itemMap[item.parentId]) {
                itemMap[item.parentId].children!.push(itemMap[item.id]);
            } else if (!item.parentId) {
                tree.push(itemMap[item.id]);
            }
        });
        
        // order 기준으로 정렬
        const sortByOrder = (items: CategoryMenuItem[]) => {
            items.sort((a, b) => (a.order || 0) - (b.order || 0));
            items.forEach(item => {
                if (item.children && item.children.length > 0) {
                    sortByOrder(item.children);
                }
            });
        };
        
        sortByOrder(tree);
        return tree;
    };
    
    // 현재 표시할 메뉴 아이템들 결정
    // v2.0: currentChildren이 있으면 사용, 없으면 전체 메뉴 트리 사용
    // breadcrumb이 있고 currentChildren이 빈 배열이면 최하위 레벨로 판단
    const isAtLowestLevel = breadcrumb && breadcrumb.length > 0 && currentChildren && currentChildren.length === 0;
    
    const displayItems = currentChildren && currentChildren.length > 0 
        ? currentChildren 
        : !breadcrumb || breadcrumb.length === 0 
            ? buildMenuTree(menuItems)
            : [];
    
    // 메뉴 아이템 클릭 핸들러
    const handleItemClick = (item: CategoryMenuItem) => {
        // actions의 handleMenuItemClick 호출
        // 웹빌더 내부에서:
        // 1. 하위 메뉴가 있으면 fetchCategoryDetail 호출하여 breadcrumb과 currentChildren 업데이트
        // 2. Redux를 통해 자동으로 상품 조회 API 호출
        handleMenuItemClick(item);
        
        // 에디터 모드에서는 라우팅하지 않음
        if (mode === 'editor') {
            return;
        }
        
        // 라우팅 경로가 없으면 무시
        if (!item.routingPath) {
            return;
        }
        
        // /shopping + 사용자 설정 경로로 라우팅
        const fullPath = `/shopping${item.routingPath}`;
        
        // navigate 함수로 라우팅
        navigate(fullPath, {
            state: {
                categoryId: item.categoryId,
                categoryName: item.categoryName,
                menuItemId: item.id,
                routingPath: item.routingPath
            }
        });
    };
    
    // 로딩 중
    if (loading) {
        return (
            <section className="sh-skin-globalWrapper sh-skin-w-full sh-skin-py-7-5 sh-skin-md-py-10">
                <div className="sh-skin-breadcrumbTabsHeader">
                    <div className="sh-skin-loading">
                        <span>{t('로딩 중...')}</span>
                    </div>
                </div>
            </section>
        );
    }
    
    // 에러
    if (error) {
        return (
            <section className="sh-skin-globalWrapper sh-skin-w-full sh-skin-py-7-5 sh-skin-md-py-10">
                <div className="sh-skin-breadcrumbTabsHeader">
                    <div className="sh-skin-error">
                        {error}
                    </div>
                </div>
            </section>
        );
    }
    
    // 메뉴가 없을 때 (최하위 레벨이 아닌 경우에만 빈 메시지 표시)
    if ((!displayItems || displayItems.length === 0) && !isAtLowestLevel) {
        return (
            <section className="sh-skin-globalWrapper sh-skin-w-full sh-skin-py-7-5 sh-skin-md-py-10">
                <div className="sh-skin-breadcrumbTabsHeader">
                    <h2 className="sh-skin-font-serif sh-skin-text-3xl sh-skin-leading-heading">Shop</h2>
                    <div className="sh-skin-empty">
                        {emptyMessage}
                    </div>
                </div>
            </section>
        );
    }
    
    // 브레드크럼 렌더링 함수
    const renderBreadcrumb = () => {
        // v2.0 API의 breadcrumb 사용
        if (!breadcrumb || breadcrumb.length === 0) return null;
        
        return (
            <nav className="sh-skin-my-3">
                <ol className="sh-skin-breadcrumbs sh-skin-flex sh-skin-items-center">
                    <li className="sh-skin-flex sh-skin-items-center sh-skin-text-sm sh-skin-hover-primary">
                        <button 
                            onClick={() => {
                                // v2.1+ handleBackToRoot 사용, 없으면 fallback
                                if (handleBackToRoot) {
                                    handleBackToRoot();
                                } else {
                                    // 이전 버전 호환
                                    handleMenuItemClick({
                                        id: 'all',
                                        categoryId: 0,
                                        categoryName: 'Shop',
                                        routingPath: '',
                                        parentId: null,
                                        order: 0,
                                        visible: true
                                    });
                                }
                            }}
                            className="sh-skin-breadcrumb-link"
                        >
                            Shop
                        </button>
                        <span className="sh-skin-mx-1-5">{'>'}</span>
                    </li>
                    {breadcrumb.map((item: {id: number; name: string; parentId: number | null}, index: number, arr: any[]) => (
                        <li key={item.id} className="sh-skin-flex sh-skin-items-center sh-skin-text-sm sh-skin-hover-primary">
                            <button 
                                onClick={() => {
                                    if (index < arr.length - 1) {
                                        // 중간 breadcrumb 클릭 시 해당 카테고리로 이동
                                        const menuItem = menuItems.find(m => m.categoryId === item.id);
                                        if (menuItem) {
                                            handleMenuItemClick(menuItem);
                                        }
                                    }
                                }}
                                className="sh-skin-breadcrumb-link"
                                style={{
                                    fontWeight: index === arr.length - 1 ? 'bold' : 'normal',
                                    cursor: index < arr.length - 1 ? 'pointer' : 'default'
                                }}
                            >
                                {item.name}
                            </button>
                            {index < arr.length - 1 && <span className="sh-skin-mx-1-5">{'>'}</span>}
                        </li>
                    ))}
                </ol>
            </nav>
        );
    };
    
    return (
        <section className="sh-skin-globalWrapper sh-skin-w-full sh-skin-py-7-5 sh-skin-md-py-10">
            <div className="sh-skin-breadcrumbTabsHeader">
                {/* 브레드크럼 - Shop 글자 위에 표시 */}
                {renderBreadcrumb()}
                
                {/* Shop 타이틀 - 항상 표시 */}
                <h2 className="sh-skin-font-serif sh-skin-text-3xl sh-skin-leading-heading">
                    {breadcrumb && breadcrumb.length > 0 
                        ? breadcrumb[breadcrumb.length - 1].name 
                        : 'Shop'}
                </h2>
                
                {/* 현재 뎁스의 메뉴들만 표시 - 하위 메뉴가 있을 때만 */}
                {displayItems.length > 0 && (
                    <nav className="sh-skin-mt-4 sh-skin-overflow-x-auto sh-skin-noScrollbar">
                        <ul className="sh-skin-flex sh-skin-gap-4 sh-skin-md-gap-7">
                            {displayItems.map((item) => {
                                const isActive = currentPath === `/shopping${item.routingPath}` || 
                                               selectedItemId === item.id;
                                const hasChildren = item.children && item.children.length > 0;
                                
                                return (
                                    <li key={item.id} className="sh-skin-shrink-0">
                                        <a 
                                            className={`sh-skin-text-black-40 sh-skin-hover-black ${isActive ? 'sh-skin-active' : ''}`}
                                            href={`/shopping${item.routingPath}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleItemClick(item);
                                            }}
                                        >
                                            {showIcon && (
                                                <span className="sh-skin-icon">📁 </span>
                                            )}
                                            {item.categoryName}
                                            {showProductCount && (
                                                <span className="sh-skin-count"> (0)</span>
                                            )}
                                        </a>
                                        {showDescription && (
                                            <p className="sh-skin-description">
                                                {item.routingPath}
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                )}
                
                {/* 카테고리 정보 표시 */}
                {showCategoryInfo && selectedItemId && (
                    <div className="sh-skin-category-info">
                        {(() => {
                            const selectedItem = menuItems.find(item => item.id === selectedItemId);
                            if (!selectedItem) return null;
                            
                            return (
                                <div className="sh-skin-info-content">
                                    <span>현재 카테고리: {selectedItem.categoryName}</span>
                                    <span> (ID: {selectedItem.categoryId})</span>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ShopHeaderSkin;