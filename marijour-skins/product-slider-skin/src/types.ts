import type React from 'react';

// 상품 아이템 타입
export interface ProductItem {
  id: number | string;
  name: string;
  thumbnailUrl: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  starRating?: number;
  reviewCount?: number;
  badges?: string[];
  productUrl?: string;
}

// WebBuilder 표준 Props 인터페이스
export interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    id: string;
    type: string;
    props: Record<string, any>;
    // ProductSlider 전용 데이터
    products?: ProductItem[];
    [key: string]: any;
  };
  
  // 컴포넌트 액션
  actions: {
    onClick?: (e: React.MouseEvent) => void;
    onProductClick?: (productId: string | number) => void;
    onCartClick?: (e: React.MouseEvent, productId: string | number) => void;
    onSlideChange?: (index: number) => void;
    onSliderInit?: () => void;
    [actionName: string]: Function | undefined;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값)
  options: {
    // 상품 데이터
    products?: ProductItem[];
    
    // 슬라이더 설정
    desktopSlidesPerView?: number;
    mobileSlidesPerView?: number;
    tabletSlidesPerView?: number;
    slidesPerGroup?: number;
    spaceBetween?: number;
    centeredSlides?: boolean;
    loop?: boolean;
    
    // 자동 재생
    autoplay?: boolean;
    autoplayDelay?: number;
    autoplayDisableOnInteraction?: boolean;
    pauseOnMouseEnter?: boolean;
    
    // 네비게이션
    showNavigation?: boolean;
    navigationPosition?: 'inside' | 'outside';
    navigationStyle?: 'circle' | 'square' | 'arrow';
    navigationColor?: string;
    navigationBgColor?: string;
    navigationHoverBgColor?: string;
    navigationSize?: string;
    
    // 페이지네이션
    showPagination?: boolean;
    paginationType?: 'bullets' | 'fraction' | 'progressbar';
    paginationColor?: string;
    paginationActiveColor?: string;
    paginationPosition?: 'bottom' | 'top';
    
    // 스크롤바
    showScrollbar?: boolean;
    scrollbarDraggable?: boolean;
    scrollbarColor?: string;
    scrollbarBgColor?: string;
    
    // 효과
    effect?: 'slide' | 'fade' | 'coverflow' | 'flip';
    speed?: number;
    
    // 상품 카드 스타일
    productCardStyle?: {
      borderRadius?: string;
      backgroundColor?: string;
      padding?: string;
      shadowEffect?: boolean;
      hoverEffect?: boolean;
      aspectRatio?: string;
    };
    
    // 레이아웃
    containerPadding?: string;
    containerMaxWidth?: string;
    minHeight?: string;
    
    // 애니메이션
    enableAnimation?: boolean;
    animationType?: 'fade' | 'slide' | 'zoom';
    animationDuration?: number;
    animationDelay?: number;
    animateOnScroll?: boolean;
    
    // 반응형
    breakpoints?: {
      [key: number]: {
        slidesPerView?: number;
        spaceBetween?: number;
        slidesPerGroup?: number;
      };
    };
    
    // 상품 카드 내부 옵션
    showProductName?: boolean;
    showPrice?: boolean;
    showOriginalPrice?: boolean;
    showDiscountRate?: boolean;
    showReviews?: boolean;
    showBadges?: boolean;
    showCartButton?: boolean;
    
    // 기타
    lazyLoading?: boolean;
    preloadImages?: boolean;
    watchSlidesProgress?: boolean;
    
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
    showToast: (message: string, options?: any) => void; // 토스트 메시지
  };
  
  // 앱 전역 데이터 (선택적)
  app?: {
    user?: any;
    company?: any;
    currentLanguage?: string;
    theme?: any;
    cart?: any;
  };
  
  // 에디터 모드 전용 props
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
  };
}