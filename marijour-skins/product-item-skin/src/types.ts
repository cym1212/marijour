import type React from 'react';

// WebBuilder 표준 Props 인터페이스
export interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    id: string;
    type: string;
    props: Record<string, any>;
    // ProductItem 전용 데이터
    productId?: number | string;
    name?: string;
    thumbnailUrl?: string;
    price?: number;
    originalPrice?: number;
    discountRate?: number;
    starRating?: number;
    reviewCount?: number;
    badges?: string[];
    [key: string]: any;
  };
  
  // 컴포넌트 액션
  actions: {
    onClick?: (e: React.MouseEvent) => void;
    onProductClick?: (productId: string | number) => void;
    onCartClick?: (e: React.MouseEvent, productId: string | number) => void;
    onImageLoad?: () => void;
    onImageError?: () => void;
    onReviewClick?: () => void;
    [actionName: string]: Function | undefined;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값)
  options: {
    // 상품 정보
    productId?: number | string;
    name?: string;
    thumbnailUrl?: string;
    price?: number;
    originalPrice?: number;
    discountRate?: number;
    starRating?: number;
    reviewCount?: number;
    badges?: string[];
    productUrl?: string;
    
    // 레이아웃 옵션
    aspectRatio?: string;
    imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    nameLinesClamp?: number;
    showCartButton?: boolean;
    cartButtonPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
    showBadges?: boolean;
    badgePosition?: 'top' | 'bottom';
    
    // 스타일 옵션
    borderRadius?: string;
    backgroundColor?: string;
    hoverEffect?: boolean;
    hoverScale?: number;
    shadowEffect?: boolean;
    shadowColor?: string;
    padding?: string;
    gap?: string;
    
    // 텍스트 스타일
    nameColor?: string;
    nameFontSize?: string;
    nameFontWeight?: string;
    priceColor?: string;
    priceFontSize?: string;
    priceFontWeight?: string;
    originalPriceColor?: string;
    discountColor?: string;
    discountBgColor?: string;
    
    // 리뷰 스타일
    showReviews?: boolean;
    starColor?: string;
    starSize?: string;
    reviewCountColor?: string;
    
    // 장바구니 버튼 스타일
    cartButtonColor?: string;
    cartButtonBgColor?: string;
    cartButtonHoverBgColor?: string;
    cartButtonSize?: string;
    cartIconColor?: string;
    
    // 배지 스타일
    badgeTextColor?: string;
    badgeBorderColor?: string;
    badgeBgColor?: string;
    badgeFontSize?: string;
    
    // 애니메이션
    enableAnimation?: boolean;
    animationType?: 'fade' | 'slide' | 'zoom' | 'none';
    animationDuration?: number;
    animationDelay?: number;
    
    // 가격 표시 옵션
    showOriginalPrice?: boolean;
    showDiscountRate?: boolean;
    priceFormat?: 'default' | 'compact' | 'currency';
    currencySymbol?: string;
    
    // 기타 옵션
    linkTarget?: '_self' | '_blank';
    showTooltip?: boolean;
    tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
    
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