import type React from 'react';

// WebBuilder 표준 Props 인터페이스
export interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    id: string;
    type: string;
    props: Record<string, any>;
    // GlobalTopBanner 전용 데이터
    text?: string;
    link?: string;
    isVisible?: boolean;
    [key: string]: any;
  };
  
  // 컴포넌트 액션
  actions: {
    onClick?: (e: React.MouseEvent) => void;
    onClose?: () => void;
    [actionName: string]: Function | undefined;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값)
  options: {
    // 텍스트 옵션
    text?: string;
    link?: string;
    linkTarget?: '_self' | '_blank';
    
    // 스타일 옵션
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    fontWeight?: string;
    height?: string;
    padding?: string;
    
    // 애니메이션 옵션
    enableAnimation?: boolean;
    animationDuration?: number;
    animationType?: 'fade' | 'slide' | 'none';
    
    // 기타 옵션
    showCloseButton?: boolean;
    closeButtonColor?: string;
    stickyTop?: boolean;
    
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