import type React from 'react';

// WebBuilder 표준 Props 인터페이스
export interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    id: string;
    type: string;
    props: Record<string, any>;
    // KeyVisualSlider 전용 데이터
    slides?: KeyVisualSliderData[];
    currentSlide?: number;
    [key: string]: any;
  };
  
  // 컴포넌트 액션
  actions: {
    onSlideChange?: (index: number) => void;
    onSlideClick?: (index: number, slide: KeyVisualSliderData) => void;
    [actionName: string]: Function | undefined;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값)
  options: {
    // Swiper 설정
    autoplay?: boolean;
    autoplayDelay?: number;
    loop?: boolean;
    effect?: 'fade' | 'slide' | 'cube' | 'coverflow' | 'flip';
    speed?: number;
    showNavigation?: boolean;
    showScrollbar?: boolean;
    showPagination?: boolean;
    
    // 스타일 옵션
    height?: string;
    mobileHeight?: string;
    overlayOpacity?: number;
    buttonText?: string;
    buttonColor?: string;
    buttonHoverColor?: string;
    
    [optionName: string]: any;
  };
  
  // 렌더링 모드
  mode: 'editor' | 'preview' | 'production';
  
  // 유틸리티 함수
  utils: {
    t: (key: string) => string; // 번역
    navigate: (path: string) => void; // 페이지 이동
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: any[]) => string; // 클래스명 조합
  };
  
  // 앱 전역 데이터 (선택적)
  app?: {
    user?: any;
    company?: any;
    currentLanguage?: string;
    theme?: any;
  };
  
  // 에디터 모드 전용 props
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
  };
}

// KeyVisualSlider 데이터 타입
export interface KeyVisualSliderData {
  title: string;
  description: string;
  imageUrl: {
    desktop: string;
    mobile: string;
  };
  buttonLink?: string;
  buttonText?: string;
  overlayEnabled?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
}

// 내부 슬라이더 설정 타입
export interface SliderConfig {
  modules: any[];
  effect?: string;
  fadeEffect?: { crossFade: boolean };
  loop: boolean;
  autoplay: {
    delay: number;
    disableOnInteraction: boolean;
  } | false;
  slidesPerView: number;
  speed: number;
  scrollbar?: {
    draggable: boolean;
  } | false;
  navigation?: {
    prevEl: HTMLElement | null;
    nextEl: HTMLElement | null;
  } | false;
  pagination?: {
    clickable: boolean;
  } | false;
}