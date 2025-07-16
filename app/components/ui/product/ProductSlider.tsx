import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Swiper as SwiperType } from 'swiper';

gsap.registerPlugin(useGSAP, ScrollTrigger);

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

import { SliderNavigationButton } from '@/components/ui/slider/SliderNavigationButton';
import { ProductItem } from '@/components/ui/product/ProductItem';

import type { ProductSliderProps } from '@/types/product';

export function ProductSlider({ data, desktopSlidesPerView = 3, mobileSlidesPerView = 1 }: ProductSliderProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    useGSAP(() => {
        if (!sliderRef.current) return;

        ScrollTrigger.create({
            trigger: sliderRef.current,
            start: 'top 95%',
            end: 'bottom 5%',
            onEnter: () => {
                // 뷰포트 진입 시 fade-in 및 autoplay 시작
                gsap.to(sliderRef.current, {
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                });

                if (swiperRef.current && swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.start();
                }
            },
            onLeave: () => {
                // 뷰포트 하단 이탈 시 autoplay 중지
                if (swiperRef.current && swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.stop();
                }
            },
            onEnterBack: () => {
                // 뷰포트 재진입 시 autoplay 재시작
                if (swiperRef.current && swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.start();
                }
            },
            onLeaveBack: () => {
                // 뷰포트 상단 이탈 시 autoplay 중지
                if (swiperRef.current && swiperRef.current.autoplay) {
                    swiperRef.current.autoplay.stop();
                }
            },
        });
    }, [sliderRef.current]);

    return (
        <div
            className="productSlider relative w-full h-full opacity-0"
            ref={sliderRef}
        >
            <Swiper
                modules={[Navigation, Autoplay, Scrollbar]}
                loop
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                }}
                speed={800}
                slidesPerView={mobileSlidesPerView + 0.3}
                spaceBetween={20}
                breakpoints={{
                    // 768px 이상
                    768: {
                        slidesPerView: desktopSlidesPerView + 0.3,
                    },
                }}
                scrollbar={{
                    draggable: true,
                }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onBeforeInit={(swiper) => {
                    if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNextRef.current;
                    }
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    // 초기에는 autoplay 중지 상태로 시작
                    swiper.autoplay.stop();
                }}
                className="h-full group !pb-10"
            >
                {data.map((slide, idx) => (
                    <SwiperSlide key={slide.id + idx}>
                        <ProductItem
                            id={slide.id}
                            name={slide.name}
                            discountRate={slide.discountRate}
                            price={slide.price}
                            originalPrice={slide.originalPrice}
                            starRating={slide.starRating}
                            reviewCount={slide.reviewCount}
                            thumbnailUrl={slide.thumbnailUrl}
                            badges={slide.badges}
                        />
                    </SwiperSlide>
                ))}

                {/* 내비게이션 버튼 */}
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
            </Swiper>
        </div>
    );
}
