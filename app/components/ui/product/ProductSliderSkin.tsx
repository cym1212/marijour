import React from 'react';
import { SliderTitle } from '@/components/ui/slider/SliderTitle';
import { ProductSlider } from '@/components/ui/product/ProductSlider';
import type { ProductItemProps } from '@/types/product';

// 스킨 전용 CSS - 다른 컴포넌트 스타일 간섭 방지
import './product-slider-skin-scoped.css';

// ProductSlider API 문서에 맞춘 ProductItem 인터페이스
interface ProductItem {
    id: number;
    
    // 상품명 (title 또는 name 중 하나는 필수)
    title?: string;
    name?: string;
    
    // 가격 정보
    price?: number;
    salePrice?: number;
    
    // 이미지 (image 또는 thumbnail 중 하나는 필수)
    image?: string;
    thumbnail?: string;
    
    // 재고 정보
    stock_count?: number;
    
    // 외부 스킨 호환성을 위한 config 객체
    config?: {
        default_price?: number;
        discounted_price?: number;
        img_url?: string;
        stock_count?: number;
    };
    
    // 기타 속성
    [key: string]: any;
}

// ProductItem을 내부 ProductItemProps로 변환하는 함수
const mapWebBuilderProduct = (product: ProductItem): ProductItemProps => {
    // 할인율 계산 함수
    const calculateDiscountRate = (original: number, sale?: number): number => {
        if (!original || !sale || original <= sale) return 0;
        return Math.round(((original - sale) / original) * 100);
    };

    // API 문서에 따른 데이터 호환성 처리
    const productName = product.title || product.name || '상품명 없음';
    const price = product.config?.default_price || product.price || 0;
    const salePrice = product.config?.discounted_price || product.salePrice || product.sale_price;
    const imageUrl = product.config?.img_url || product.image || product.thumbnail || '/placeholder.jpg';
    const stock = product.config?.stock_count || product.stock_count || product.stock;
    
    const discountRate = calculateDiscountRate(price, salePrice);
    
    return {
        id: product.id,
        name: productName,
        price: salePrice || price,
        originalPrice: discountRate > 0 ? price : undefined,
        discountRate: discountRate > 0 ? discountRate : undefined,
        thumbnailUrl: imageUrl,
        starRating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        badges: product.badges || []
    };
};

// 수정된 ProductSlider API에 맞춘 ComponentSkinProps 인터페이스
interface ComponentSkinProps {
    data?: {
        // 상품 데이터
        allProducts?: ProductItem[];
        defaultProducts?: ProductItem[];
        products?: ProductItem[]; // allProducts의 별칭
        
        // 상태 관련 Props
        loading?: boolean;
        translateX?: number;
        slideWidth?: number;
        isTransitioning?: boolean;
        isMobile?: boolean;
        isTablet?: boolean;
        innerContainerWidth?: number;
        
        // 설정 관련 Props
        sliderTitle?: string;
        showTitle?: boolean;
        titleFontSize?: string;
        titleFontWeight?: string;
        titleColor?: string;
        showPrice?: boolean;
        showAddToCart?: boolean;
        showStock?: boolean;
        cartButtonColor?: string;
        
        // 스타일 Props
        containerStyle?: React.CSSProperties;
        titleStyle?: React.CSSProperties;
        
        // 터치/스와이프 상태
        touchStart?: number | null;
        touchEnd?: number | null;
        
        // 편집기 관련 Props
        isEditingTitle?: boolean;
        titleEditValue?: string;
        
        // 필터링 설정 Props
        include_product_ids?: string;
        exclude_product_ids?: string;
        include_category_ids?: string;
        exclude_category_ids?: string;
        
        // 참조 객체
        containerRef?: React.RefObject<HTMLDivElement | null>;
        sliderRef?: React.RefObject<HTMLDivElement | null>;
        slideRef?: React.RefObject<HTMLDivElement | null>;
    };
    actions?: {
        // 슬라이드 제어 액션
        moveSlide?: (direction: 'next' | 'prev') => void;
        
        // 상품 상호작용 액션
        handleAddToCart?: (product: any, e: React.MouseEvent) => void;
        handleProductClick?: (product: any) => void;
        
        // 터치/스와이프 이벤트
        handleTouchStart?: (e: React.TouchEvent) => void;
        handleTouchMove?: (e: React.TouchEvent) => void;
        handleTouchEnd?: () => void;
        
        // 제목 편집 액션
        handleTitleDoubleClick?: () => void;
        handleTitleBlur?: () => void;
        setTitleEditValue?: (value: string) => void;
        
        // 필터링 액션
        handleFilterOptionChange?: (optionName: string, value: string) => void;
        renderFilteringSettings?: () => boolean;
        
        // 유틸리티 액션
        formatPrice?: (price: number) => string;
    };
    options?: Record<string, any>; // 더 이상 사용하지 않음 - 모든 설정은 data에서 가져옴
    mode?: 'editor' | 'preview' | 'production';
    utils?: {
        t: (key: string, params?: Record<string, any>) => string;
        navigate: (path: string) => void;
        formatCurrency: (amount: number, currency?: string) => string;
        formatDate: (date: string | Date, format?: string) => string;
        getAssetUrl: (path: string) => string;
        cx: (...classes: (string | undefined | null | false)[]) => string;
    };
}

// API 연동용 스킨 - 기본 데이터 없음

// 기본 props
const defaultProps: ComponentSkinProps = {
    data: {
        // 상품 데이터
        allProducts: [],
        defaultProducts: [],
        products: [],
        
        // 상태 관련
        loading: false,
        translateX: 0,
        slideWidth: 300,
        isTransitioning: false,
        isMobile: false,
        isTablet: false,
        innerContainerWidth: 1200,
        
        // 설정 관련
        sliderTitle: '인기 상품',
        showTitle: true,
        titleFontSize: '18px',
        titleFontWeight: '600',
        titleColor: '#333',
        showPrice: true,
        showAddToCart: true,
        showStock: false,
        cartButtonColor: '#007bff',
        
        // 스타일
        containerStyle: {},
        titleStyle: {},
        
        // 터치/스와이프
        touchStart: null,
        touchEnd: null,
        
        // 편집기
        isEditingTitle: false,
        titleEditValue: '',
        
        // 필터링
        include_product_ids: '',
        exclude_product_ids: '',
        include_category_ids: '',
        exclude_category_ids: ''
    },
    actions: {
        moveSlide: (direction) => console.log('Move slide:', direction),
        handleAddToCart: (product, e) => console.log('Added to cart:', product),
        handleProductClick: (product) => console.log('Product clicked:', product),
        handleTouchStart: (e) => console.log('Touch start'),
        handleTouchMove: (e) => console.log('Touch move'),
        handleTouchEnd: () => console.log('Touch end'),
        handleTitleDoubleClick: () => console.log('Title double click'),
        handleTitleBlur: () => console.log('Title blur'),
        setTitleEditValue: (value) => console.log('Set title edit value:', value),
        handleFilterOptionChange: (optionName, value) => console.log('Filter change:', optionName, value),
        renderFilteringSettings: () => false,
        formatPrice: (price) => `${price.toLocaleString()}원`
    },
    options: {}, // 더 이상 사용 안함
    mode: 'production',
    utils: {
        t: (key) => key,
        navigate: (path) => console.log('Navigate to:', path),
        formatCurrency: (amount) => `${amount.toLocaleString()}원`,
        formatDate: (date) => new Date(date).toLocaleDateString(),
        getAssetUrl: (path) => path,
        cx: (...classes) => classes.filter(Boolean).join(' ')
    }
};

const ProductSliderSkin: React.FC<ComponentSkinProps> = (props = {}) => {
    // props가 없으면 기본값 사용
    const { 
        data = defaultProps.data, 
        actions = defaultProps.actions,
        utils = defaultProps.utils
    } = props || defaultProps;
    
    // 수정된 API: 모든 설정을 data 객체에서 가져옴
    const {
        // 상품 데이터
        allProducts,
        defaultProducts,
        loading,
        
        // 슬라이드 상태
        translateX = 0,
        slideWidth = 300,
        isTransitioning = false,
        
        // 설정
        sliderTitle = '인기 상품',
        showTitle = true,
        titleStyle = {},
        containerStyle = {},
        showPrice = true,
        showStock = false,
        showAddToCart = true,
        cartButtonColor = '#007bff',
        
        // 편집기
        isEditingTitle = false,
        titleEditValue = '',
        
        // 참조
        containerRef,
        sliderRef
    } = data || {};

    // 로딩 상태 처리
    if (loading) {
        return <div className="ps-skin-loading">상품을 불러오는 중...</div>;
    }
    
    // 상품 데이터 처리: allProducts 우선, 없으면 defaultProducts 사용
    const productsToShow = allProducts?.length > 0 ? allProducts : defaultProducts;
    if (!productsToShow || productsToShow.length === 0) {
        return <div className="ps-skin-empty">표시할 상품이 없습니다.</div>;
    }
    
    console.log('[ProductSliderSkin] 받은 data:', data);
    console.log('[ProductSliderSkin] showTitle:', showTitle);
    console.log('[ProductSliderSkin] sliderTitle:', sliderTitle);
    console.log('[ProductSliderSkin] showPrice:', showPrice);
    console.log('[ProductSliderSkin] showAddToCart:', showAddToCart);
    console.log('[ProductSliderSkin] 전체 상품 개수:', productsToShow?.length);
    console.log('[ProductSliderSkin] translateX:', translateX);
    console.log('[ProductSliderSkin] slideWidth:', slideWidth);
    
    // productsToShow를 사용하여 전체 상품을 내부 컴포넌트에 전달
    const mappedProducts = (productsToShow || []).map(product => {
        const mapped = mapWebBuilderProduct(product);
        return mapped;
    });

    return (
        <div 
            ref={containerRef}
            className="ps-skin-container"
            style={{
                maxWidth: '1400px', 
                margin: '0 auto', 
                padding: '40px 20px',
                background: 'white',
                minHeight: '400px',
                // 원본 스타일 보존 - border 제거
                border: 'none',
                borderWidth: '0',
                ...containerStyle
            }}
            onTouchStart={actions?.handleTouchStart}
            onTouchMove={actions?.handleTouchMove}
            onTouchEnd={actions?.handleTouchEnd}
        >

            {/* 제목 표시 - 편집 모드 지원 */}
            {showTitle && (
                isEditingTitle ? (
                    <input 
                        type="text" 
                        value={titleEditValue}
                        onChange={(e) => actions?.setTitleEditValue?.(e.target.value)}
                        onBlur={actions?.handleTitleBlur}
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '30px',
                            border: '1px solid #ccc',
                            padding: '8px',
                            ...titleStyle
                        }}
                        autoFocus
                    />
                ) : (
                    <h2 
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '30px',
                            cursor: 'pointer',
                            ...titleStyle
                        }}
                        onDoubleClick={actions?.handleTitleDoubleClick}
                    >
                        {sliderTitle}
                    </h2>
                )
            )}
            

            
            {mappedProducts.length > 0 ? (
                (() => {
                    try {
                        return (
                            <div style={{ height: '100%', minHeight: '350px' }}>
                                <ProductSlider
                                    data={mappedProducts}
                                    desktopSlidesPerView={3} // 기본값 사용
                                    mobileSlidesPerView={1}
                                    onProductClick={(product) => {
                                        console.log('[ProductSliderSkin] onProductClick 호출됨:', product);
                                        const originalProduct = productsToShow?.find(p => p.id === product.id);
                                        if (originalProduct && actions?.handleProductClick) {
                                            actions.handleProductClick(originalProduct);
                                        } else if (utils?.navigate) {
                                            // 기본 상품 상세 페이지로 이동
                                            utils.navigate(`/product/${product.id}`);
                                        } else {
                                            // Fallback: 새 창에서 상품 상세 페이지 열기
                                            window.open(`/product/${product.id}`, '_blank');
                                        }
                                    }}
                                    onAddToCart={(product) => {
                                        console.log('[ProductSliderSkin] Add to cart:', product);
                                        const originalProduct = productsToShow?.find(p => p.id === product.id);
                                        if (originalProduct && actions?.handleAddToCart) {
                                            // 수정된 API: 이벤트 객체도 전달
                                            const fakeEvent = { preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent;
                                            actions.handleAddToCart(originalProduct, fakeEvent);
                                        }
                                    }}
                                    showPrice={showPrice}
                                    showStock={showStock} // 재고 표시 옵션 추가
                                    showAddToCart={showAddToCart}
                                    showNavigation={true}
                                    showPagination={true}
                                    autoplay={true}
                                    autoplaySpeed={3000}
                                />
                            </div>
                        );
                    } catch (error) {
                        console.error('[ProductSliderSkin] ProductSlider 렌더링 오류:', error);
                        return (
                            <div style={{
                                background: 'red', 
                                color: 'white', 
                                padding: '20px',
                                fontSize: '16px'
                            }}>
                                ❌ ProductSlider 렌더링 오류: {error instanceof Error ? error.message : String(error)}
                            </div>
                        );
                    }
                })()
            ) : (
                <div style={{
                    background: 'red', 
                    color: 'white', 
                    padding: '20px',
                    fontSize: '16px'
                }}>
                    ❌ 매핑된 상품 데이터가 없습니다!
                </div>
            )}
        </div>
    );
};

export default ProductSliderSkin;