import type React from 'react';

// 상품 정보 타입
export interface Product {
  id: number | string;
  name: string;
  thumbnailUrl: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  starRating?: number;
  reviewCount?: number;
  description?: string;
  shippingFee?: number;
  additionalShippingFee?: {
    jeju?: number;
    island?: number;
  };
}

// WebBuilder 표준 Props 인터페이스
export interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    id: string;
    type: string;
    props: Record<string, any>;
    // ProductInfo 전용 데이터
    product?: Product;
    [key: string]: any;
  };
  
  // 컴포넌트 액션
  actions: {
    onClick?: (e: React.MouseEvent) => void;
    onBuyNow?: (product: Product, quantity: number) => void;
    onAddToCart?: (product: Product, quantity: number) => void;
    onReviewClick?: () => void;
    onQuantityChange?: (quantity: number) => void;
    [actionName: string]: Function | undefined;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값)
  options: {
    // 상품 데이터
    product?: Product;
    
    // 레이아웃 옵션
    layout?: 'horizontal' | 'vertical';
    imagePosition?: 'left' | 'right' | 'top';
    imageSize?: string;
    imageAspectRatio?: string;
    contentGap?: string;
    contentPadding?: string;
    sectionPadding?: string;
    maxWidth?: string;
    
    // 표시 옵션
    showReviews?: boolean;
    showShippingInfo?: boolean;
    showDiscountInfo?: boolean;
    showQuantitySelector?: boolean;
    showTotalPrice?: boolean;
    showProductImage?: boolean;
    
    // 배송 정보
    shippingFee?: number;
    freeShippingAmount?: number;
    additionalShippingFee?: {
      jeju?: number;
      island?: number;
    };
    shippingInfoText?: string;
    
    // 버튼 옵션
    showBuyNowButton?: boolean;
    showAddToCartButton?: boolean;
    buyNowButtonText?: string;
    addToCartButtonText?: string;
    buttonLayout?: 'horizontal' | 'vertical';
    buttonGap?: string;
    
    // 스타일 옵션
    // 제목
    titleFontSize?: string;
    titleFontWeight?: string;
    titleFontFamily?: string;
    titleColor?: string;
    
    // 가격
    priceFontSize?: string;
    priceFontWeight?: string;
    priceColor?: string;
    originalPriceColor?: string;
    discountRateColor?: string;
    discountRateBgColor?: string;
    
    // 버튼 스타일
    primaryButtonBgColor?: string;
    primaryButtonTextColor?: string;
    primaryButtonHoverBgColor?: string;
    secondaryButtonBgColor?: string;
    secondaryButtonTextColor?: string;
    secondaryButtonBorderColor?: string;
    secondaryButtonHoverBgColor?: string;
    buttonPadding?: string;
    buttonBorderRadius?: string;
    buttonFontSize?: string;
    
    // 정보 섹션 스타일
    sectionBorderColor?: string;
    sectionBgColor?: string;
    labelColor?: string;
    labelFontSize?: string;
    valueColor?: string;
    valueFontSize?: string;
    
    // 수량 선택기 스타일
    stepperBgColor?: string;
    stepperBorderColor?: string;
    stepperButtonColor?: string;
    stepperButtonHoverBgColor?: string;
    
    // 툴팁 스타일
    tooltipBgColor?: string;
    tooltipTextColor?: string;
    tooltipBorderRadius?: string;
    
    // 애니메이션
    enableAnimation?: boolean;
    animationType?: 'fade' | 'slide';
    animationDuration?: number;
    
    // 반응형
    mobileLayout?: 'horizontal' | 'vertical';
    mobileImagePosition?: 'top' | 'bottom';
    mobileTitleFontSize?: string;
    mobilePriceFontSize?: string;
    mobileButtonLayout?: 'horizontal' | 'vertical';
    
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