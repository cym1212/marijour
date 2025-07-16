import React, { useState, useEffect } from 'react';
import { MegaMenu } from './MegaMenu';

interface DesktopNavProps {
  menus: any[];
  isBusiness: boolean;
  isLoggedIn: boolean;
  utils: any;
}

export function DesktopNav({ menus, isBusiness, isLoggedIn, utils }: DesktopNavProps) {
  const [hoveredMenu, setHoveredMenu] = useState<any>(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    // Fade-in 애니메이션
    const nav = document.querySelector('.desktop-nav');
    if (nav) {
      (nav as HTMLElement).style.opacity = '0';
      setTimeout(() => {
        if (nav) {
          (nav as HTMLElement).style.transition = 'opacity 0.9s ease-out';
          (nav as HTMLElement).style.opacity = '1';
        }
      }, 100);
    }
  }, []);

  const handleMouseEnter = (menu: any) => {
    if (menu.children && menu.children.length > 0) {
      setHoveredMenu(menu);
      setIsMegaMenuOpen(true);
    } else {
      setHoveredMenu(null);
      setIsMegaMenuOpen(false);
    }
  };

  const handleMouseLeave = () => {
    setIsMegaMenuOpen(false);
  };

  const handleMegaMenuMouseEnter = () => {
    if (hoveredMenu) {
      setIsMegaMenuOpen(true);
    }
  };

  const handleMegaMenuMouseLeave = () => {
    setIsMegaMenuOpen(false);
    setHoveredMenu(null);
  };

  const handleNavClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    utils.navigate(url);
  };

  return (
    <>
      <ul 
        className="desktop-nav"
        onMouseLeave={handleMouseLeave}
      >
        {menus.map((menu) => (
          <li 
            key={menu.id || menu.url}
            className="nav-item"
            onMouseEnter={() => handleMouseEnter(menu)}
          >
            <a 
              href={menu.url}
              onClick={(e) => handleNavClick(e, menu.url)}
              className="nav-link"
            >
              {menu.name || menu.label}
            </a>
          </li>
        ))}
        
        {/* 비즈니스 전용 메뉴 */}
        {isBusiness && isLoggedIn && (
          <>
            <li className="nav-item business-menu">
              <a href="/business/dashboard" onClick={(e) => handleNavClick(e, '/business/dashboard')} className="nav-link">
                비즈니스 대시보드
              </a>
            </li>
            <li className="nav-item business-menu">
              <a href="/business/management" onClick={(e) => handleNavClick(e, '/business/management')} className="nav-link">
                관리
              </a>
            </li>
          </>
        )}
      </ul>

      {isMegaMenuOpen && hoveredMenu && (
        <MegaMenu
          menu={hoveredMenu}
          onMouseEnter={handleMegaMenuMouseEnter}
          onMouseLeave={handleMegaMenuMouseLeave}
          utils={utils}
        />
      )}
    </>
  );
}