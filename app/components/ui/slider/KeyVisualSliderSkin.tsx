import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Autoplay, Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// 스타일 import
import './key-visual-slider-skin-scoped.css';

import type { KeyVisualSliderData } from '@/types/ui';

// 원본 컴포넌트들을 번들에 포함
const BannerImage = ({ src, isOverlay }: { src: { desktop: string; mobile: string }; isOverlay?: boolean }) => {
    const { desktop, mobile } = src;

    return (
        <div className="kvs-skin-banner-image">
            {/* 데스크톱 이미지 */}
            <div
                className="kvs-skin-banner-image-media kvs-skin-banner-image-desktop"
                style={{ backgroundImage: `url(${desktop})` }}
            ></div>
            {/* 모바일 이미지 */}
            <div
                className="kvs-skin-banner-image-media kvs-skin-banner-image-mobile"
                style={{ backgroundImage: `url(${mobile})` }}
            ></div>
            {isOverlay && <div className="kvs-skin-banner-image-overlay"></div>}
        </div>
    );
};

const ArrowIcon = ({ rotate, tailwind = '' }: { rotate?: string; tailwind?: string }) => {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`kvs-skin-arrow-icon ${tailwind}`}
            style={{ transform: rotate ? `rotate(${rotate}deg)` : 'none' }}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

// Mock 데이터 (번들에 포함) - 원본과 동일한 이미지 사용
const SLIDE_DATA: KeyVisualSliderData[] = [
    {
        title: '프리미엄 배딩',
        description: '보들보들 자연의 부드러운\n촉감을 그대로 담은 편안한 차렵이불',
        imageUrl: {
            desktop: '/images/main-slide-1.jpg',
            mobile: '/images/main-slide-1.jpg',
        },
        buttonLink: '/#',
    },
    {
        title: '달콤한 나만의 시간',
        description: '나를 위한 다독임\n포근한 베이비 파우더 향으로 시작하세요.',
        imageUrl: {
            desktop: '/images/main-slide-2-desktop.jpg',
            mobile: '/images/main-slide-2-mobile.jpg',
        },
        buttonLink: '/#',
    },
    {
        title: '포근함으로 채우는 식탁',
        description: '베스트 셀러는 이유가 있죠\n포근한 색감으로 칙칙했던 주방을 밝혀보세요',
        imageUrl: {
            desktop: '/images/main-slide-3.jpg',
            mobile: '/images/main-slide-3.jpg',
        },
        buttonLink: '/#',
    },
];

export function KeyVisualSlider() {
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<any>(null);
    
    // 기본 샘플 데이터 사용
    const slides = SLIDE_DATA;

    // Swiper 초기화 후 첫 번째 슬라이드로 이동
    React.useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(0);
        }
    }, []);

    return (
        <div className="kvs-skin-container kvs-skin-keyVisualSlider kvs-skin-globalWrapper">
            <Swiper
                modules={[EffectFade, Navigation, Autoplay, Scrollbar]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                slidesPerView={1}
                speed={800}
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
                className="kvs-skin-swiper kvs-skin-group"
            >
                {slides.map((slide, idx) => (
                    <SwiperSlide key={slide.title + idx}>
                        <div className="kvs-skin-slide">
                            <BannerImage
                                src={{
                                    desktop: slide.imageUrl.desktop,
                                    mobile: slide.imageUrl.mobile,
                                }}
                            />
                            <div className="kvs-skin-content-wrapper kvs-skin-globalWrapper">
                                <div>
                                    <h3 className="kvs-skin-title">{slide.title}</h3>
                                    <p className="kvs-skin-description">{slide.description}</p>
                                </div>
                                <button
                                    className="kvs-skin-button"
                                    type="button"
                                    onClick={() => window.location.href = slide.buttonLink || '/#'}
                                    aria-label="자세히 보기"
                                >
                                    <span className="kvs-skin-button-text">
                                        자세히 보기
                                    </span>
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* 내비게이션 버튼 */}
                <div
                    ref={navigationPrevRef}
                    className="kvs-skin-nav kvs-skin-nav-prev"
                >
                    <button
                        type="button"
                        className="kvs-skin-nav-button"
                    >
                        <ArrowIcon
                            rotate="-90"
                            tailwind="kvs-skin-hover-white"
                        />
                    </button>
                </div>
                <div
                    ref={navigationNextRef}
                    className="kvs-skin-nav kvs-skin-nav-next"
                >
                    <button
                        type="button"
                        className="kvs-skin-nav-button"
                    >
                        <ArrowIcon
                            rotate="90"
                            tailwind="kvs-skin-hover-white"
                        />
                    </button>
                </div>
            </Swiper>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(KeyVisualSlider as any).SAMPLE_DATA = SLIDE_DATA;

export default KeyVisualSlider;