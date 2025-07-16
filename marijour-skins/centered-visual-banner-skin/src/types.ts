import type React from 'react';

// WebBuilder 표준 Props 인터페이스
export interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    id: string;
    type: string;
    props: Record<string, any>;
    // CenteredVisualBanner 전용 데이터
    title?: string;
    description?: string;
    src?: {
      desktop: string;
      mobile: string;
    };
    imageUrl?: {
      desktop: string;
      mobile: string;
    };
    buttonText?: string;
    buttonLink?: string;
    isOverlay?: boolean;
    isSmallText?: boolean;
    [key: string]: any;
  };
  
  // 컴포넌트 액션
  actions: {
    onClick?: (e: React.MouseEvent) => void;
    onButtonClick?: (e: React.MouseEvent) => void;
    onImageLoad?: () => void;
    onImageError?: () => void;
    [actionName: string]: Function | undefined;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값)
  options: {
    // 콘텐츠 옵션
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    linkTarget?: '_self' | '_blank';
    
    // 이미지 옵션
    imageUrl?: {
      desktop: string;
      mobile: string;
    };
    src?: {
      desktop: string;
      mobile: string;
    };
    isOverlay?: boolean;
    overlayOpacity?: number;
    overlayColor?: string;
    
    // 텍스트 스타일 옵션
    isSmallText?: boolean;
    titleColor?: string;
    titleFontSize?: string;
    titleFontWeight?: string;
    titleFontFamily?: string;
    descriptionColor?: string;
    descriptionFontSize?: string;
    descriptionLineHeight?: string;
    
    // 버튼 스타일 옵션
    buttonStyle?: 'primary' | 'secondary' | 'outline' | 'text';
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonHoverBackgroundColor?: string;
    buttonPadding?: string;
    buttonBorderRadius?: string;
    buttonMarginTop?: string;
    
    // 레이아웃 옵션
    contentMaxWidth?: string;
    contentPadding?: string;
    verticalPadding?: string;
    minHeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'center' | 'bottom';
    
    // 애니메이션 옵션
    enableAnimation?: boolean;
    animationType?: 'fade' | 'slide' | 'zoom' | 'none';
    animationDuration?: number;
    animationDelay?: number;
    animationTrigger?: 'onLoad' | 'onScroll';
    
    // 반응형 옵션
    mobileMinHeight?: string;
    mobilePadding?: string;
    mobileTitleFontSize?: string;
    mobileDescriptionFontSize?: string;
    
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