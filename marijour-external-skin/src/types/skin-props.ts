import React from 'react';

export interface ExternalSkinProps {
  data: {
    // 인증 관련
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    } | null;
    
    // 사이트 데이터
    withcookieData: {
      skin?: {
        theme?: {
          main_logo_url?: string;
          colorset?: {
            primary?: string;
            secondary?: string;
            tertiary?: string;
          };
        };
        extra?: {
          company_name?: string;
          sns_banner?: Array<{
            url: string;
            text: string;
            style: string;
          }>;
        };
        address?: string;
        phone?: string;
        email?: string;
        owner?: string;
        businessNumber?: string;
        mailOrderBusinessCertificate?: string;
        headTitle?: string;
        headDescription?: string;
        headKeywords?: string;
        headOgImage?: string;
        company?: {
          useShop?: boolean;
          companySettingJson?: any;
        };
      };
    };
    
    // 메뉴 데이터
    menus: Array<{
      id: string;
      name: string;
      url: string;
      visible: boolean;
      is_logged?: boolean;
      is_not_logged?: boolean;
      children?: any[];
    }>;
    globalMenus: any[];
    mainMenus: any[];
    
    // 쇼핑 데이터
    cartItems: any[];
    companyIsUse: boolean;
    
    // 비즈니스
    isBusiness: boolean;
    
    // 다국어
    currentLanguage: string;
    translations: Record<string, string>;
    
    // 자산 및 거래
    assetBalances?: any[];
    transactions?: any[];
  };
  
  actions: {
    onLogin: () => void;
    onLogout: () => void;
    onCheckAuth: () => void;
    onFetchBalances: () => void;
    onFetchTransactions: () => void;
    onFetchCartItems: () => void;
    onFetchMenus: () => void;
    onFetchWithcookieData: () => void;
    onUpdateCart: (items: any[]) => void;
    onChangeLanguage: (lang: string) => void;
  };
  
  utils: {
    navigate: (path: string) => void;
    location: {
      pathname: string;
      search: string;
      hash: string;
      state: any;
    };
    params: Record<string, string>;
    t: (key: string) => string;
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date) => string;
  };
  
  layout: {
    children: React.ReactNode;
    currentMenuId?: string;
    breadcrumbs?: any[];
    pageTitle?: string;
    showHeader?: boolean;
    showFooter?: boolean;
    showSidebar?: boolean;
  };
  
  theme?: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    spacing?: Record<string, string>;
    breakpoints?: Record<string, string>;
  };
}