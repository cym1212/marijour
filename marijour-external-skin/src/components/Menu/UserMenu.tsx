import React, { useState, useEffect } from 'react';

interface UserMenuProps {
  isLoggedIn: boolean;
  user: any;
  cartItems: any[];
  actions: any;
  utils: any;
  useShop?: boolean;
}

export function UserMenu({ isLoggedIn, user, cartItems, actions, utils, useShop }: UserMenuProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const cartCount = cartItems?.length || 0;

  useEffect(() => {
    // URL에 keyword가 있으면 검색창 열기
    const searchParams = new URLSearchParams(utils.location.search);
    if (searchParams.has('keyword')) {
      setIsSearchOpen(true);
      setSearchKeyword(searchParams.get('keyword') || '');
    }
  }, [utils.location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      utils.navigate(`/search?keyword=${encodeURIComponent(searchKeyword)}`);
      setIsSearchOpen(false);
    }
  };

  const handleNavClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    utils.navigate(url);
  };

  const handleLogout = () => {
    actions.onLogout();
  };

  return (
    <nav id="marijour-menu" className="user-menu">
      <ul className="menu-list">
        {/* 검색 버튼 - 데스크톱만 */}
        <li className="menu-item search-item desktop-only">
          <button 
            className="menu-button"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="검색"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </li>

        {/* 사용자 메뉴 */}
        {isLoggedIn ? (
          <>
            <li className="menu-item user-item desktop-only">
              <a 
                href="/my-page/orders"
                onClick={(e) => handleNavClick(e, '/my-page/orders')}
                aria-label="마이페이지"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {user?.name && <span className="user-name">{user.name}</span>}
              </a>
            </li>
            <li className="menu-item logout-item desktop-only">
              <button 
                className="menu-button"
                onClick={handleLogout}
                aria-label="로그아웃"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </li>
          </>
        ) : (
          <li className="menu-item login-item desktop-only">
            <a 
              href="/login"
              onClick={(e) => handleNavClick(e, '/login')}
              aria-label="로그인"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </a>
          </li>
        )}

        {/* 장바구니 - 쇼핑몰 기능이 활성화된 경우만 */}
        {useShop && (
          <li className="menu-item cart-item">
            <a 
              href="/cart"
              onClick={(e) => handleNavClick(e, '/cart')}
              aria-label="장바구니"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </a>
          </li>
        )}
      </ul>

      {/* 검색창 오버레이 */}
      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="search-input"
                autoFocus
              />
              <button type="submit" className="search-submit">
                검색
              </button>
              <button 
                type="button" 
                className="search-close"
                onClick={() => setIsSearchOpen(false)}
              >
                ×
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}