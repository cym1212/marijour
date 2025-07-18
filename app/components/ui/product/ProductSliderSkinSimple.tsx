import React from 'react';
import { SliderTitle } from '@/components/ui/slider/SliderTitle';
import { Link } from 'react-router';
import { CartIcon } from '@/components/icons';
import { CartButton } from '@/components/ui/button/CartButton';
import { ProductPrice } from '@/components/ui/product/ProductPrice';
import { ReviewScore } from '@/components/ui/product/ReviewScore';
import { TextBadge } from '@/components/ui/Badge';

// 웹빌더 문서에 맞춘 ProductItem 인터페이스
interface ProductItem {
    id: number | string;
    name: string;
    price: number;
    salePrice?: number;
    image?: string;
    thumbnail?: string;
    stock: number;
    created_at?: string;
    [key: string]: any;
}

// 웹빌더 문서의 SkinProps
interface SkinProps {
    data: {
        products: ProductItem[];
        allProducts: ProductItem[];
        loading: boolean;
        currentSlide: number;
        totalSlides: number;
        isUserLoggedIn: boolean;
        isAdminMode: boolean;
        itemsPerSlide: number;
        showStock: boolean;
        theme: any;
    };
    actions: {
        handleSlideChange: (slideIndex: number) => void;
        handlePrevSlide: () => void;
        handleNextSlide: () => void;
        handleAddToCart: (product: ProductItem) => void;
        handleProductClick: (product: ProductItem) => void;
        handleMouseEnter: () => void;
        handleMouseLeave: () => void;
    };
    options: {
        sliderTitle?: string;
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
    };
    mode: 'editor' | 'preview' | 'production';
    utils: {
        t: (key: string, params?: Record<string, any>) => string;
        navigate: (path: string) => void;
        formatCurrency: (amount: number, currency?: string) => string;
        formatDate: (date: string | Date, format?: string) => string;
        getAssetUrl: (path: string) => string;
        cx: (...classes: (string | undefined | null | false)[]) => string;
    };
}

const ProductSliderSkinSimple: React.FC<SkinProps> = ({ 
    data, 
    actions, 
    options, 
    mode, 
    utils 
}) => {
    const { products, loading, showStock } = data;
    const { 
        sliderTitle, 
        showTitle = true,
        showPrice = true,
        showAddToCart = true,
        showNavigation = true,
        priceColor,
        cartButtonColor
    } = options;
    
    if (loading) {
        return <div>로딩 중...</div>;
    }

    // 할인율 계산
    const calculateDiscountRate = (original: number, sale?: number): number => {
        if (!original || !sale || original <= sale) return 0;
        return Math.round(((original - sale) / original) * 100);
    };

    return (
        <section className="globalWrapper py-10 md:py-15 mb-5">
            <div className="py-5 md:py-0">
                {showTitle && sliderTitle && (
                    <SliderTitle
                        title={sliderTitle}
                        description=""
                    />
                )}
                
                <div className="relative group">
                    {/* 상품 그리드 - 웹빌더가 이미 슬라이싱한 products 사용 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {products.map((product) => (
                            <div 
                                key={product.id}
                                className="productItem group/productItem cursor-pointer"
                                onClick={() => actions.handleProductClick(product)}
                            >
                                {/* 썸네일 */}
                                <div className="relative overflow-hidden">
                                    <div className="w-full h-full aspect-square">
                                        <img
                                            src={product.image || product.thumbnail || ''}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover/productItem:scale-105"
                                        />
                                    </div>
                                    {showAddToCart && (
                                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4">
                                            <CartButton
                                                colorType="primary"
                                                tailwind="p-2.5"
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    actions.handleAddToCart(product);
                                                }}
                                            >
                                                <CartIcon tailwind="hover-white" />
                                            </CartButton>
                                        </div>
                                    )}
                                </div>
                                
                                {/* 제품 정보 */}
                                <div className="mt-3 md:mt-4">
                                    <h4 className="text-sm text-gray-900 line-clamp-2">{product.name}</h4>
                                    {showPrice && (
                                        <div className="mt-0.5 md:mt-1 space-y-0.5 md:space-y-1">
                                            <ProductPrice
                                                discountRate={calculateDiscountRate(product.price, product.salePrice)}
                                                price={product.salePrice || product.price}
                                                originalPrice={product.salePrice ? product.price : undefined}
                                            />
                                        </div>
                                    )}
                                    {showStock && (
                                        <p className="text-xs text-gray-500 mt-1">재고: {product.stock}개</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* 네비게이션 버튼 */}
                    {showNavigation && (
                        <>
                            <button
                                onClick={actions.handlePrevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-lg rounded-full p-3"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <button
                                onClick={actions.handleNextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-lg rounded-full p-3"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductSliderSkinSimple;