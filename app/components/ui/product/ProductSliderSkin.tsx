import React from 'react';
import { SliderTitle } from '@/components/ui/slider/SliderTitle';
import { ProductSlider } from '@/components/ui/product/ProductSlider';
import type { ProductItemProps } from '@/types/product';

// 웹빌더 문서에 맞춘 ProductItem 인터페이스
interface ProductItem {
    id: number | string;
    title: string;
    newPrice: number;
    oldPrice?: number;
    image?: string;
    thumbnail?: string;
    stockCount: number;
    description?: string;
    category?: string;
    rating?: number;
    discountPercent?: number;
    isInStock?: boolean;
    createdAt?: string;
    updatedAt?: string;
    companyId?: number;
    hasOptions?: boolean;
    config?: {
        img_url?: string;
        main_image?: string;
        stock_count?: string | number;
        default_price?: string | number;
        discounted_price?: string | number;
        [key: string]: any;
    };
    [key: string]: any;
}

// 웹빌더 ProductItem을 내부 ProductItemProps로 변환하는 함수
const mapWebBuilderProduct = (product: ProductItem): ProductItemProps => {
    // 할인율 계산 함수
    const calculateDiscountRate = (original: number, sale?: number): number => {
        if (!original || !sale || original <= sale) return 0;
        return Math.round(((original - sale) / original) * 100);
    };

    // 웹빌더 새 문서 구조에 맞춰 가격 처리
    const currentPrice = product.newPrice || 0;
    const originalPrice = product.oldPrice || currentPrice;
    
    return {
        id: product.id,
        name: product.title || '',
        price: currentPrice,
        originalPrice: product.oldPrice ? originalPrice : undefined,
        discountRate: calculateDiscountRate(originalPrice, currentPrice),
        thumbnailUrl: product.image || product.thumbnail || '',
        starRating: product.rating || 0,
        reviewCount: 0, // 문서에 없는 필드는 기본값
        badges: [] // 문서에 없는 필드는 기본값
    };
};

// 웹빌더 스킨 Props 인터페이스 (문서의 SkinProps)
interface SkinProps {
    data?: {
        products?: ProductItem[];
        allProducts?: ProductItem[];
        loading?: boolean;
        currentSlide?: number;
        totalSlides?: number;
        isUserLoggedIn?: boolean;
        isAdminMode?: boolean;
        itemsPerSlide?: number;
        showStock?: boolean;
        theme?: any;
    };
    actions?: {
        handleSlideChange?: (slideIndex: number) => void;
        handlePrevSlide?: () => void;
        handleNextSlide?: () => void;
        handleAddToCart?: (product: ProductItem) => void;
        handleProductClick?: (product: ProductItem) => void;
        handleMouseEnter?: () => void;
        handleMouseLeave?: () => void;
    };
    options?: {
        sliderTitle?: string;
        sliderDescription?: string;
        showTitle?: boolean;
        titleFontSize?: string;
        titleFontWeight?: string;
        titleColor?: string;
        showPrice?: boolean;
        showAddToCart?: boolean;
        showNavigation?: boolean;
        showPagination?: boolean;
        priceColor?: string;
        cartButtonColor?: string;
        navigationColor?: string;
        paginationColor?: string;
        mobileSlidesPerView?: number;
        desktopSlidesPerView?: number;
        autoplay?: boolean;
        autoplaySpeed?: number;
    };
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

// 기본 제품 데이터 (원본 PRODUCT_MOCK_DATA 형식)
const defaultProducts: ProductItemProps[] = [
    {
        id: 1,
        name: '레고트 누프레임 커플잔 2P',
        discountRate: 20,
        price: 32000,
        originalPrice: 40000,
        starRating: 4.5,
        reviewCount: 120,
        thumbnailUrl: './test-images/product-1.jpg',
        badges: ['Best'],
    },
    {
        id: 2,
        name: '모던 스톤웨어 접시 세트',
        discountRate: 15,
        price: 25500,
        originalPrice: 30000,
        starRating: 4.3,
        reviewCount: 85,
        thumbnailUrl: './test-images/product-2.jpg',
        badges: ['New'],
    },
    {
        id: 3,
        name: '에코 우드 컵 4P 세트',
        discountRate: 10,
        price: 18000,
        originalPrice: 20000,
        starRating: 4.8,
        reviewCount: 200,
        thumbnailUrl: './test-images/product-3.jpg',
    },
    {
        id: 4,
        name: '클래식 도자기 찻잔 세트',
        discountRate: 25,
        price: 15000,
        originalPrice: 20000,
        starRating: 4.2,
        reviewCount: 60,
        thumbnailUrl: './test-images/product-4.jpg',
        badges: ['Best', 'New'],
    },
    {
        id: 5,
        name: '프리미엄 코르크 컵받침 세트',
        discountRate: 30,
        price: 14000,
        originalPrice: 20000,
        starRating: 4.7,
        reviewCount: 150,
        thumbnailUrl: './test-images/product-1.jpg',
        badges: ['Best'],
    },
    {
        id: 6,
        name: '럭셔리 실버 커틀러리 세트',
        discountRate: 18,
        price: 65600,
        originalPrice: 80000,
        starRating: 4.9,
        reviewCount: 95,
        thumbnailUrl: './test-images/product-2.jpg',
        badges: ['Premium'],
    }
];

// 기본 props
const defaultProps: SkinProps = {
    data: {
        products: defaultProducts,
        allProducts: defaultProducts,
        loading: false,
        currentSlide: 0,
        totalSlides: defaultProducts.length,
        isUserLoggedIn: false,
        isAdminMode: false,
        itemsPerSlide: 3,
        showStock: false
    },
    actions: {
        handleSlideChange: (slideIndex) => console.log('Slide changed to:', slideIndex),
        handlePrevSlide: () => console.log('Previous slide'),
        handleNextSlide: () => console.log('Next slide'),
        handleAddToCart: (product) => console.log('Added to cart:', product),
        handleProductClick: (product) => console.log('Product clicked:', product),
        handleMouseEnter: () => console.log('Mouse entered'),
        handleMouseLeave: () => console.log('Mouse left')
    },
    options: {
        sliderTitle: '베스트 상품',
        sliderDescription: '마리쥬르 베스트 상품을 소개합니다.',
        showTitle: true,
        mobileSlidesPerView: 1,
        desktopSlidesPerView: 3,
        autoplay: true,
        autoplaySpeed: 3000,
        showPrice: true,
        showAddToCart: true,
        showNavigation: true,
        showPagination: true
    },
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

const ProductSliderSkin: React.FC<SkinProps> = (props) => {
    // props가 없으면 기본값 사용
    const { 
        data = defaultProps.data, 
        actions = defaultProps.actions,
        options = defaultProps.options
    } = props || defaultProps;
    
    const { allProducts, loading } = data!;
    
    // options에서 설정값 추출
    const {
        sliderTitle,
        showTitle,
        showPrice,
        showAddToCart,
        showNavigation,
        showPagination,
        autoplay,
        autoplaySpeed,
        mobileSlidesPerView,
        desktopSlidesPerView
    } = options || {};

    
    console.log('[ProductSliderSkin] 받은 options:', options);
    console.log('[ProductSliderSkin] showTitle:', showTitle);
    console.log('[ProductSliderSkin] sliderTitle:', sliderTitle);
    console.log('[ProductSliderSkin] showPrice:', showPrice);
    console.log('[ProductSliderSkin] showAddToCart:', showAddToCart);
    console.log('[ProductSliderSkin] 전체 상품 개수:', allProducts?.length);
    
    // allProducts를 사용하여 전체 상품을 Swiper에 전달
    const mappedProducts = (allProducts || []).map(product => {
        const mapped = mapWebBuilderProduct(product);
        return mapped;
    });


    if (loading) {
        return <div>로딩 중...</div>;
    }

    return (
        <section style={{ 
            maxWidth: '1400px', 
            margin: '0 auto', 
            padding: '40px 20px',
            background: 'white',
            minHeight: '400px'
        }}>

            {/* 제목 표시 */}
            {showTitle && sliderTitle && (
                <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '30px',
                    color: '#333'
                }}>
                    {sliderTitle}
                </div>
            )}
            

            
            {mappedProducts.length > 0 ? (
                (() => {
                    try {
                        return (
                            <ProductSlider
                                data={mappedProducts}
                                desktopSlidesPerView={desktopSlidesPerView || 3}
                                mobileSlidesPerView={mobileSlidesPerView || 1}
                                onProductClick={(product) => {
                                    const originalProduct = allProducts?.find(p => p.id === product.id);
                                    if (originalProduct && actions?.handleProductClick) {
                                        actions.handleProductClick(originalProduct);
                                    }
                                }}
                                onAddToCart={(product) => {
                                    console.log('[ProductSliderSkin] Add to cart:', product);
                                    const originalProduct = allProducts?.find(p => p.id === product.id);
                                    if (originalProduct && actions?.handleAddToCart) {
                                        actions.handleAddToCart(originalProduct);
                                    }
                                }}
                                showPrice={showPrice}
                                showAddToCart={showAddToCart}
                                showNavigation={showNavigation}
                                showPagination={showPagination}
                                autoplay={autoplay}
                                autoplaySpeed={autoplaySpeed || 3000}
                            />
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
        </section>
    );
};

export default ProductSliderSkin;