import React, { useEffect, useRef, useState } from 'react';
import { ExternalSkinProps } from '@/types/skin-props';
import { Navigation } from './Navigation/Navigation';
import { UserMenu } from './Menu/UserMenu';

interface HeaderProps {
  data: ExternalSkinProps['data'];
  actions: ExternalSkinProps['actions'];
  utils: ExternalSkinProps['utils'];
}

export function Header({ data, actions, utils }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { withcookieData, isUserLoggedIn, isAdminLoggedIn, user, cartItems } = data;
  
  // 로고 URL과 회사명 가져오기
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  const companyName = withcookieData?.skin?.extra?.company_name || 'Marijour';
  
  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 헤더 애니메이션
  useEffect(() => {
    if (headerRef.current) {
      const logo = headerRef.current.querySelector('.logo');
      if (logo) {
        (logo as HTMLElement).style.opacity = '0';
        setTimeout(() => {
          if (logo) {
            (logo as HTMLElement).style.transition = 'opacity 0.9s ease-out';
            (logo as HTMLElement).style.opacity = '1';
          }
        }, 100);
      }
    }
  }, []);

  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;

  return (
    <header
      id="header"
      ref={headerRef}
      className={`marijour-header ${isScrolled ? 'scrolled' : ''}`}
    >
      <div className="marijour-wrapper header-wrapper">
        <Navigation 
          menus={data.menus || data.mainMenus || []}
          isLoggedIn={isLoggedIn}
          isBusiness={data.isBusiness}
          utils={utils}
        />
        
        <div className="logo">
          <h1 className="logo-text">
            <a href="/" onClick={(e) => {
              e.preventDefault();
              utils.navigate('/');
            }}>
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={companyName}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={logoUrl ? 'hidden' : ''}>{companyName}</span>
            </a>
          </h1>
        </div>
        
        <UserMenu
          isLoggedIn={isLoggedIn}
          user={user}
          cartItems={cartItems}
          actions={actions}
          utils={utils}
          useShop={withcookieData?.skin?.company?.useShop && data.companyIsUse}
        />
      </div>
    </header>
  );
}