import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import { SliderNavigationButton } from '@/components/ui/slider/SliderNavigationButton';
import { ProductItem } from '@/components/ui/product/ProductItem';
import { ProductItemWrapper } from '@/components/ui/product/ProductItemWrapper';

import type { ProductItemProps, ProductSliderProps } from '@/types/product';

interface ExtendedProductSliderProps extends ProductSliderProps {
    onProductClick?: (product: ProductItemProps) => void;
    onAddToCart?: (product: ProductItemProps) => void;
    showPrice?: boolean;
    showAddToCart?: boolean;
    showNavigation?: boolean;
    showPagination?: boolean;
    autoplay?: boolean;
    autoplaySpeed?: number;
}

export const ProductSliderSimple: React.FC<ExtendedProductSliderProps> = ({ 
    data, 
    desktopSlidesPerView = 3, 
    mobileSlidesPerView = 1,
    onProductClick,
    onAddToCart,
    showPrice = true,
    showAddToCart = true,
    showNavigation = true,
    showPagination = true,
    autoplay = true,
    autoplaySpeed = 3000
}) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);


    return (
        <div
            className="productSlider relative w-full h-full"
            ref={sliderRef}
        >
            <Swiper
                modules={[Navigation, Autoplay, Scrollbar]}
                loop
                autoplay={autoplay ? {
                    delay: autoplaySpeed,
                    disableOnInteraction: false,
                } : false}
                speed={800}
                slidesPerView={mobileSlidesPerView + 0.3}
                spaceBetween={20}
                breakpoints={{
                    // 768px 이상
                    768: {
                        slidesPerView: desktopSlidesPerView + 0.3,
                    },
                }}
                scrollbar={showPagination ? {
                    draggable: true,
                } : false}
                navigation={showNavigation ? {
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                } : false}
                onBeforeInit={(swiper) => {
                    if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNextRef.current;
                    }
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    // autoplay 옵션에 따라 초기 상태 설정
                    if (!autoplay && swiper.autoplay) {
                        swiper.autoplay.stop();
                    }
                }}
                className="h-full group !pb-10"
            >
                {data.map((product, idx) => (
                    <SwiperSlide key={`${product.id}_slide_${idx}`}>
                        {onProductClick || onAddToCart ? (
                            <ProductItemWrapper
                                {...product}
                                onProductClick={onProductClick}
                                onAddToCart={onAddToCart}
                                showPrice={showPrice}
                                showAddToCart={showAddToCart}
                            />
                        ) : (
                            <ProductItem {...product} />
                        )}
                    </SwiperSlide>
                ))}

                {/* 내비게이션 버튼 */}
                {showNavigation && (
                    <>
                        <SliderNavigationButton
                            ref={navigationPrevRef}
                            direction="prev"
                            rotate="-90"
                            hoverColor="white"
                        />
                        <SliderNavigationButton
                            ref={navigationNextRef}
                            direction="next"
                            rotate="90"
                            hoverColor="white"
                        />
                    </>
                )}
            </Swiper>
        </div>
    );
};