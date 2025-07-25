import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Autoplay, Scrollbar } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// 스타일 import
import './key-visual-slider-skin-scoped.css';

// MainBanner API 타입 정의
interface BannerItem {
  icon?: string;
  text?: string;
  description?: string;
  url?: string;
  position?: string;
  textColor?: string;
  textShadow?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonText?: string;
  transparentButton?: boolean;
  showTitle?: boolean;
  showButton?: boolean;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  style?: string | React.CSSProperties;
}

interface ComponentSkinProps {
  data?: {
    banners?: BannerItem[];
    currentIndex?: number;
    isTransitioning?: boolean;
    isPaused?: boolean;
    isLoading?: boolean;
    isHovering?: boolean;
    bannerMode?: 'slider' | 'list';
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    transitionSpeed?: number;
    showDots?: boolean;
    showArrows?: boolean;
    pauseOnHover?: boolean;
    infiniteLoop?: boolean;
    containerHeight?: string;
    isMobile?: boolean;
    isEditorMode?: boolean;
    isPreviewMode?: boolean;
    getImageSource?: (banner: BannerItem, index: number) => string;
  };
  actions?: {
    goToNext?: () => void;
    goToPrev?: () => void;
    goToSlide?: (index: number) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onTouchStart?: (e: React.TouchEvent) => void;
    onTouchMove?: (e: React.TouchEvent) => void;
    onTouchEnd?: () => void;
    onBannerClick?: (banner: BannerItem) => void;
  };
  options?: Record<string, any>;
  mode?: 'editor' | 'preview' | 'production';
  utils?: {
    t?: (key: string) => string;
    navigate?: (path: string) => void;
    formatCurrency?: (amount: number) => string;
    formatDate?: (date: Date) => string;
    getAssetUrl?: (path: string) => string;
    cx?: (...classes: string[]) => string;
  };
  app?: any;
  editor?: any;
}

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

// 기본 슬라이드 데이터 (WebBuilder에서 데이터가 없을 때 사용)
const DEFAULT_SLIDE_DATA: BannerItem[] = [
    {
        text: '프리미엄 배딩',
        description: '보들보들 자연의 부드러운\n촉감을 그대로 담은 편안한 차렵이불',
        icon: '/images/main-slide-1.jpg',
        url: '/#',
        showTitle: true,
        showButton: true,
        buttonText: '자세히 보기',
    },
    {
        text: '달콤한 나만의 시간',
        description: '나를 위한 다독임\n포근한 베이비 파우더 향으로 시작하세요.',
        icon: '/images/main-slide-2-desktop.jpg',
        url: '/#',
        showTitle: true,
        showButton: true,
        buttonText: '자세히 보기',
    },
    {
        text: '포근함으로 채우는 식탁',
        description: '베스트 셀러는 이유가 있죠\n포근한 색감으로 칙칙했던 주방을 밝혀보세요',
        icon: '/images/main-slide-3.jpg',
        url: '/#',
        showTitle: true,
        showButton: true,
        buttonText: '자세히 보기',
    },
];

export function KeyVisualSlider(props: ComponentSkinProps = {}) {
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<any>(null);
    
    // props에서 데이터와 액션 추출
    const { data = {}, actions = {}, utils = {} } = props;
    
    // WebBuilder에서 전달된 데이터 또는 기본 데이터 사용
    const banners = data.banners || DEFAULT_SLIDE_DATA;
    const currentIndex = data.currentIndex || 0;
    const autoPlay = data.autoPlay !== undefined ? data.autoPlay : true;
    const autoPlaySpeed = data.autoPlaySpeed || 3000;
    const transitionSpeed = data.transitionSpeed || 800;
    const showArrows = data.showArrows !== undefined ? data.showArrows : true;
    const showDots = data.showDots !== undefined ? data.showDots : true;
    const infiniteLoop = data.infiniteLoop !== undefined ? data.infiniteLoop : true;
    const pauseOnHover = data.pauseOnHover !== undefined ? data.pauseOnHover : false;
    const isMobile = data.isMobile || false;

    // currentIndex가 변경될 때 Swiper를 해당 슬라이드로 이동
    React.useEffect(() => {
        if (swiperRef.current && swiperRef.current.slideTo) {
            swiperRef.current.slideTo(currentIndex);
        }
    }, [currentIndex]);

    return (
        <div className={`kvs-skin-container kvs-skin-keyVisualSlider kvs-skin-globalWrapper ${isMobile ? 'kvs-skin-mobile' : 'kvs-skin-desktop'}`}>
            <Swiper
                modules={[EffectFade, Navigation, Autoplay, Scrollbar]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                loop={infiniteLoop}
                autoplay={autoPlay ? {
                    delay: autoPlaySpeed,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: pauseOnHover,
                } : false}
                slidesPerView={1}
                speed={transitionSpeed}
                scrollbar={showDots ? {
                    draggable: true,
                } : false}
                initialSlide={currentIndex}
                navigation={showArrows ? {
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                } : false}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                    if (showArrows && swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNextRef.current;
                    }
                }}
                onSlideChange={(swiper) => {
                    if (actions.goToSlide) {
                        actions.goToSlide(swiper.activeIndex);
                    }
                }}
                onMouseEnter={() => {
                    if (actions.onMouseEnter) {
                        actions.onMouseEnter();
                    }
                }}
                onMouseLeave={() => {
                    if (actions.onMouseLeave) {
                        actions.onMouseLeave();
                    }
                }}
                className="kvs-skin-swiper kvs-skin-group"
            >
                {banners.map((slide, idx) => (
                    <SwiperSlide key={(slide.text || '') + idx}>
                        <div className="kvs-skin-slide">
                            <BannerImage
                                src={{
                                    desktop: data.getImageSource ? data.getImageSource(slide, idx) : slide.icon || '/images/main-slide-1.jpg',
                                    mobile: data.getImageSource ? data.getImageSource(slide, idx) : slide.icon || '/images/main-slide-1.jpg',
                                }}
                            />
                            <div className={`kvs-skin-content-wrapper kvs-skin-globalWrapper ${slide.position ? `kvs-skin-position-${slide.position}` : ''}`}>
                                <div>
                                    {slide.showTitle !== false && slide.text && (
                                        <h3 className="kvs-skin-title">{slide.text}</h3>
                                    )}
                                    {slide.showTitle !== false && slide.description && (
                                        <p className="kvs-skin-description">{slide.description}</p>
                                    )}
                                </div>
                                {slide.showButton !== false && slide.url && slide.url !== '#' && (
                                    <button
                                        className="kvs-skin-button"
                                        type="button"
                                        onClick={() => {
                                            if (actions.onBannerClick) {
                                                actions.onBannerClick(slide);
                                            } else {
                                                window.location.href = slide.url || '/#';
                                            }
                                        }}
                                        aria-label={slide.buttonText || '자세히 보기'}
                                    >
                                        <span className="kvs-skin-button-text">
                                            {slide.buttonText || '자세히 보기'}
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* 내비게이션 버튼 */}
                {showArrows && banners.length > 1 && (
                    <>
                        <div
                            ref={navigationPrevRef}
                            className="kvs-skin-nav kvs-skin-nav-prev"
                        >
                            <button
                                type="button"
                                className="kvs-skin-nav-button"
                                onClick={() => {
                                    if (actions.goToPrev) {
                                        actions.goToPrev();
                                    } else if (swiperRef.current) {
                                        swiperRef.current.slidePrev();
                                    }
                                }}
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
                                onClick={() => {
                                    if (actions.goToNext) {
                                        actions.goToNext();
                                    } else if (swiperRef.current) {
                                        swiperRef.current.slideNext();
                                    }
                                }}
                            >
                                <ArrowIcon
                                    rotate="90"
                                    tailwind="kvs-skin-hover-white"
                                />
                            </button>
                        </div>
                    </>
                )}
                {/* Scrollbar */}
                {showDots && banners.length > 1 && (
                    <div className="swiper-scrollbar kvs-skin-scrollbar"></div>
                )}
            </Swiper>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(KeyVisualSlider as any).SAMPLE_DATA = DEFAULT_SLIDE_DATA;

export default KeyVisualSlider;