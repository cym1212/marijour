import React from 'react';

interface MobileNavProps {
  menus: any[];
  isBusiness: boolean;
  isLoggedIn: boolean;
  isOpen: boolean;
  onToggle: () => void;
  utils: any;
}

export function MobileNav({ menus, isBusiness, isLoggedIn, isOpen, onToggle, utils }: MobileNavProps) {
  const handleClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    utils.navigate(url);
    onToggle(); // 메뉴 클릭 시 닫기
  };

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <button 
        className="mobile-menu-button"
        onClick={onToggle}
        aria-label="메뉴"
      >
        <span className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* 모바일 사이드바 */}
      {isOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={onToggle} />
          <div className="mobile-menu-sidebar">
            <div className="mobile-menu-header">
              <h2>메뉴</h2>
              <button onClick={onToggle} className="close-button" aria-label="닫기">
                ×
              </button>
            </div>
            
            <ul className="mobile-menu-list">
              {menus.map((menu) => (
                <li key={menu.id || menu.url} className="mobile-menu-item">
                  <a 
                    href={menu.url}
                    onClick={(e) => handleClick(e, menu.url)}
                  >
                    {menu.name || menu.label}
                  </a>
                  
                  {menu.children && menu.children.length > 0 && (
                    <ul className="mobile-submenu">
                      {menu.children.map((child: any) => (
                        <li key={child.id || child.url}>
                          <a 
                            href={child.url}
                            onClick={(e) => handleClick(e, child.url)}
                          >
                            {child.name || child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              
              {/* 비즈니스 메뉴 */}
              {isBusiness && isLoggedIn && (
                <>
                  <li className="mobile-menu-item business">
                    <a 
                      href="/business/dashboard"
                      onClick={(e) => handleClick(e, '/business/dashboard')}
                    >
                      비즈니스 대시보드
                    </a>
                  </li>
                  <li className="mobile-menu-item business">
                    <a 
                      href="/business/management"
                      onClick={(e) => handleClick(e, '/business/management')}
                    >
                      관리
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
}