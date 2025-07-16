import './styles/main.scss'; // CSS 파일 생성을 위해 필수!
import React, { useEffect } from 'react';
import { ExternalSkinProps } from './types/skin-props';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GlobalTopBanner } from './components/GlobalTopBanner';

const MarijouirSkin: React.FC<ExternalSkinProps> = ({
  data,
  actions,
  utils,
  layout,
  theme
}) => {
  const { 
    isUserLoggedIn,
    isAdminLoggedIn,
    user,
    withcookieData,
    menus,
    cartItems,
    isBusiness
  } = data;

  // 테마 색상 동적 설정
  useEffect(() => {
    const colorSet = withcookieData?.skin?.theme?.colorset;
    if (colorSet) {
      const root = document.documentElement;
      if (colorSet.primary) {
        root.style.setProperty('--theme-primary', colorSet.primary);
      }
      if (colorSet.secondary) {
        root.style.setProperty('--theme-secondary', colorSet.secondary);
      }
      if (colorSet.tertiary) {
        root.style.setProperty('--theme-tertiary', colorSet.tertiary);
      }
    }
  }, [withcookieData]);

  // main 영역 높이 계산 (기존 프로젝트 로직 유지)
  useEffect(() => {
    const handleResize = () => {
      const bannerTextBox = document.querySelector('#globalTopBanner');
      const header = document.querySelector('#header');
      const footer = document.querySelector('#footer');
      const main = document.querySelector('#main');

      if (main) {
        const bannerHeight = bannerTextBox?.clientHeight || 0;
        const headerHeight = header?.clientHeight || 0;
        const footerHeight = footer?.clientHeight || 0;
        const totalHeight = bannerHeight + headerHeight + footerHeight;

        (main as HTMLElement).style.minHeight = `calc(100vh - ${totalHeight}px)`;
      }
    };

    handleResize();

    // 리사이즈 이벤트 최적화 (디바운싱)
    let resizeTimeout: NodeJS.Timeout;
    const handleResizeTimeout = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        handleResize();
      }, 10);
    };

    window.addEventListener('resize', handleResizeTimeout, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResizeTimeout);
      clearTimeout(resizeTimeout);
    };
  }, []);

  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;

  return (
    <div className="marijour-skin">
      {layout.showHeader !== false && (
        <>
          <GlobalTopBanner 
            text={withcookieData?.skin?.extra?.company_name ? 
              `Welcome to ${withcookieData.skin.extra.company_name} 🤍` : 
              "Happy Family Month 🤍 16% Sale"
            }
          />
          <Header 
            data={data}
            actions={actions}
            utils={utils}
          />
        </>
      )}
      
      <main id="main" className="marijour-main">
        {layout.children}
      </main>
      
      {layout.showFooter !== false && (
        <Footer data={data} />
      )}
    </div>
  );
};

// UMD 전역 변수 등록
if (typeof window !== 'undefined') {
  (window as any).MarijouirSkin = MarijouirSkin;
  console.log('MarijouirSkin registered:', (window as any).MarijouirSkin);
}

// webpack의 library export를 위해
export { MarijouirSkin };
export default MarijouirSkin;