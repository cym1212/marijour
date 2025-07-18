import React from 'react';
import { SliderTitle } from '@/components/ui/slider/SliderTitle';
import { ProductSlider } from '@/components/ui/product/ProductSlider';
import type { ProductItemProps } from '@/types/product';

// 웹빌더 ProductItem을 ProductItemProps로 변환하는 함수
const mapWebBuilderProduct = (product: any): ProductItemProps => {
    // 할인율 계산 함수
    const calculateDiscountRate = (original: number, sale: number): number => {
        if (!original || !sale || original <= sale) return 0;
        return Math.round(((original - sale) / original) * 100);
    };

    const price = product.config?.discounted_price || product.salePrice || product.price || 0;
    const originalPrice = product.config?.default_price || product.price || 0;
    
    return {
        id: product.id,
        name: product.title || product.name || '',
        price: price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountRate: calculateDiscountRate(originalPrice, price),
        thumbnailUrl: product.config?.img_url || product.image || product.thumbnail || '',
        starRating: product.starRating || 0,
        reviewCount: product.reviewCount || 0,
        badges: product.badges || []
    };
};

// 웹빌더 스킨 Props 인터페이스 (문서에 맞게 수정)
interface ProductSliderSkinProps {
    data?: {
        products?: any[];
        allProducts?: any[];
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
        handleAddToCart?: (product: any) => void;
        handleProductClick?: (product: any) => void;
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
const defaultProps: ProductSliderSkinProps = {
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

const ProductSliderSkin: React.FC<ProductSliderSkinProps> = (props) => {
    // props가 없으면 기본값 사용
    const { 
        data = defaultProps.data, 
        actions = defaultProps.actions,
        options = defaultProps.options
    } = props || defaultProps;
    
    const { products, loading } = data!;
    const { sliderTitle, sliderDescription, showTitle, mobileSlidesPerView, desktopSlidesPerView } = options!;

    if (loading) {
        return <div>로딩 중...</div>;
    }

    // products가 이미 ProductItemProps[] 형식인지 확인
    const isProductItemProps = (product: any): boolean => {
        return product && 'name' in product && 'price' in product;
    };
    
    // 웹빌더 형식인 경우에만 변환, 아니면 그대로 사용
    const mappedProducts = (products || []).map(product => 
        isProductItemProps(product) ? product : mapWebBuilderProduct(product)
    );

    return (
        <section className="globalWrapper py-10 md:py-15 mb-5">
            <div className="py-5 md:py-0">
                {showTitle && sliderTitle && (
                    <SliderTitle
                        title={sliderTitle}
                        description={sliderDescription || ''}
                    />
                )}
                <ProductSlider
                    data={mappedProducts}
                    mobileSlidesPerView={mobileSlidesPerView}
                    desktopSlidesPerView={desktopSlidesPerView}
                />
            </div>
        </section>
    );
};

export default ProductSliderSkin;