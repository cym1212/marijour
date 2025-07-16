import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation, Autoplay, Scrollbar } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// Import custom styles
import './key-visual-slider-skin.scss';

import type { ComponentSkinProps, KeyVisualSliderData, SliderConfig } from './types';

// ArrowIcon 컴포넌트 (원본에서 복사)
const ArrowIcon = ({ rotate, className = '' }: { rotate?: string; className?: string }) => {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`hover-primary ${className}`}
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

// BannerImage 컴포넌트 (원본에서 복사 및 수정)
const BannerImage = ({ 
  src, 
  isOverlay, 
  overlayOpacity = 0.5 
}: { 
  src: { desktop: string; mobile: string }; 
  isOverlay?: boolean;
  overlayOpacity?: number;
}) => {
  const { desktop, mobile } = src;

  return (
    <div className="bannerImage relative w-full h-full">
      {/* 데스크톱 이미지 */}
      <div
        className="bannerImageMedia hidden lg-block w-full h-full bg-no-repeat bg-center bg-cover transition-transform duration-300 ease-out group-hover-scale"
        style={{ backgroundImage: `url(${desktop})` }}
      ></div>
      {/* 모바일 이미지 */}
      <div
        className="bannerImageMedia block lg-hidden w-full h-full bg-no-repeat bg-center bg-cover transition-transform duration-300 ease-out group-hover-scale"
        style={{ backgroundImage: `url(${mobile})` }}
      ></div>
      {isOverlay && (
        <div 
          className="bannerImageOverlay absolute top-0 left-0 w-full h-full bg-black"
          style={{ opacity: overlayOpacity }}
        ></div>
      )}
    </div>
  );
};

// SliderNavigationButton 컴포넌트 (원본에서 복사 및 수정)
const SliderNavigationButton = React.forwardRef<
  HTMLDivElement,
  { direction: 'prev' | 'next'; rotate: string; hoverColor: 'white' | 'black' }
>(({ direction, rotate, hoverColor }, ref) => {
  const hoveredColor = hoverColor === 'white' ? 'hover-white' : 'hover-black-40';
  const directionClass = direction === 'prev' ? 'left-0' : 'right-0';

  return (
    <div
      ref={ref}
      className={`absolute ${directionClass} top-half -translate-y-half z-10 opacity-0 group-hover-opacity transition-opacity duration-300`}
    >
      <button
        type="button"
        className="flex items-center justify-center p-3 bg-black-20 text-white hover-bg-white-40 transition-colors duration-300"
        aria-label={direction === 'prev' ? '이전 슬라이드' : '다음 슬라이드'}
      >
        <ArrowIcon
          rotate={rotate}
          className={hoveredColor}
        />
      </button>
    </div>
  );
});

// 메인 스킨 컴포넌트
const KeyVisualSliderSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  utils,
  mode
}) => {
  const navigationPrevRef = useRef<HTMLDivElement>(null);
  const navigationNextRef = useRef<HTMLDivElement>(null);
  
  const { t, navigate, cx, getAssetUrl } = utils;
  
  // 데이터 추출
  const slides = data.slides || [];
  
  // 옵션 추출 (기본값 포함)
  const {
    autoplay = true,
    autoplayDelay = 3000,
    loop = true,
    effect = 'fade',
    speed = 800,
    showNavigation = true,
    showScrollbar = true,
    showPagination = false,
    height = '100vh',
    mobileHeight = '100vh',
    overlayOpacity = 0.5,
    buttonText,
    buttonColor = '#89a1be',
    buttonHoverColor
  } = options;
  
  // Swiper 설정
  const sliderConfig: SliderConfig = {
    modules: [EffectFade, Navigation, Autoplay, Scrollbar],
    effect: effect as any,
    fadeEffect: { crossFade: true },
    loop,
    autoplay: autoplay ? {
      delay: autoplayDelay,
      disableOnInteraction: false,
    } : false,
    slidesPerView: 1,
    speed,
    scrollbar: showScrollbar ? {
      draggable: true,
    } : false,
    navigation: showNavigation ? {
      prevEl: navigationPrevRef.current,
      nextEl: navigationNextRef.current,
    } : false,
    pagination: showPagination ? {
      clickable: true,
    } : false,
  };

  // 슬라이드 변경 핸들러
  const handleSlideChange = (swiper: any) => {
    if (actions.onSlideChange) {
      actions.onSlideChange(swiper.activeIndex);
    }
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = (slide: KeyVisualSliderData, index: number) => {
    if (slide.buttonLink) {
      navigate(slide.buttonLink);
    }
    if (actions.onSlideClick) {
      actions.onSlideClick(index, slide);
    }
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="keyVisualSlider-empty flex items-center justify-center h-96 bg-gray-100">
        <p className="text-gray-500">{t('no_slides_available')}</p>
      </div>
    );
  }

  return (
    <div 
      className="keyVisualSlider globalWrapper relative w-full"
      style={{ 
        height, 
        '--mobile-height': mobileHeight 
      } as React.CSSProperties}
    >
      <Swiper
        {...sliderConfig}
        onSlideChange={handleSlideChange}
        onBeforeInit={(swiper) => {
          if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
          }
        }}
        className="h-full group"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={`${slide.title}-${idx}`}>
            <div className="overflow-hidden flex justify-center items-center w-full h-full relative">
              <BannerImage
                src={{
                  desktop: getAssetUrl(slide.imageUrl.desktop),
                  mobile: getAssetUrl(slide.imageUrl.mobile),
                }}
                isOverlay={slide.overlayEnabled !== false}
                overlayOpacity={overlayOpacity}
              />
              <div 
                className={cx(
                  'globalWrapper absolute left-0 top-0 w-full h-full px-5 md-px-10 py-vh flex flex-col items-start justify-end',
                  slide.textColor || 'text-white',
                  slide.textAlign === 'center' && 'items-center text-center',
                  slide.textAlign === 'right' && 'items-end text-right'
                )}
              >
                <div>
                  <h3 className="font-serif text-3xl leading-heading whitespace-pre-line">
                    {slide.title}
                  </h3>
                  {slide.description && (
                    <p className="leading-body whitespace-pre-line mt-3">
                      {slide.description}
                    </p>
                  )}
                </div>
                {(slide.buttonLink || buttonText || slide.buttonText) && (
                  <button
                    className={cx(
                      'px-4 pt-2-5 pb-3-5 mt-6-5 transition-colors duration-200',
                      mode === 'editor' && 'pointer-events-none'
                    )}
                    style={{ 
                      backgroundColor: buttonColor,
                      color: slide.textColor || 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (buttonHoverColor) {
                        e.currentTarget.style.backgroundColor = buttonHoverColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = buttonColor;
                    }}
                    type="button"
                    aria-label={slide.buttonText || buttonText || t('view_more')}
                    onClick={() => handleButtonClick(slide, idx)}
                  >
                    <span className="font-pretendard text-sm">
                      {slide.buttonText || buttonText || t('view_more')}
                    </span>
                  </button>
                )}
              </div>
            </div>
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

// UMD 내보내기
if (typeof window !== 'undefined') {
  (window as any).MarijuourKeyVisualSliderSkin = KeyVisualSliderSkin;
}

export default KeyVisualSliderSkin;