import React, { useState } from 'react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

interface NavigationProps {
  menus: any[];
  isLoggedIn: boolean;
  isBusiness: boolean;
  utils: any;
}

export function Navigation({ menus, isLoggedIn, isBusiness, utils }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 메뉴 필터링 로직
  const filterMenus = (menuList: any[]) => {
    return menuList.filter(menu => {
      // 로그인 필요 메뉴 체크
      if (menu.is_logged && !isLoggedIn) return false;
      // 비로그인 전용 메뉴 체크
      if (menu.is_not_logged && isLoggedIn) return false;
      // visible 체크
      if (menu.visible === false) return false;
      return true;
    });
  };

  const filteredMenus = filterMenus(menus);

  return (
    <nav id="marijour-gnb" className="navigation">
      <DesktopNav 
        menus={filteredMenus}
        isBusiness={isBusiness}
        isLoggedIn={isLoggedIn}
        utils={utils}
      />
      <MobileNav 
        menus={filteredMenus}
        isBusiness={isBusiness}
        isLoggedIn={isLoggedIn}
        isOpen={isMobileMenuOpen}
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        utils={utils}
      />
    </nav>
  );
}