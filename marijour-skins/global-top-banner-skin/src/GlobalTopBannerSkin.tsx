import React, { useEffect, useRef, useState } from 'react';

// Import custom styles
import './global-top-banner-skin.scss';

import type { ComponentSkinProps } from './types';

// 메인 스킨 컴포넌트
const GlobalTopBannerSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  utils,
  mode
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { t, navigate, cx } = utils;
  
  // 옵션 추출 (기본값 포함)
  const {
    text = data.text || '',
    link = data.link,
    linkTarget = '_self',
    backgroundColor = '#89a1be',
    textColor = '#ffffff',
    fontSize = '1rem',
    fontWeight = '400',
    height = 'auto',
    padding = '10px 20px',
    enableAnimation = true,
    animationDuration = 0.9,
    animationType = 'fade',
    showCloseButton = false,
    closeButtonColor = '#ffffff',
    stickyTop = false
  } = options;

  // 애니메이션 효과
  useEffect(() => {
    if (enableAnimation && animationType === 'fade' && bannerRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, animationDuration * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [enableAnimation, animationType, animationDuration]);

  // 배너 클릭 핸들러
  const handleBannerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (link) {
      if (linkTarget === '_blank') {
        window.open(link, '_blank');
      } else {
        navigate(link);
      }
    }
    
    if (actions.onClick) {
      actions.onClick(e);
    }
  };

  // 닫기 버튼 핸들러
  const handleClose = () => {
    setIsVisible(false);
    if (actions.onClose) {
      actions.onClose();
    }
  };

  // 배너가 숨겨진 경우 렌더링하지 않음
  if (!isVisible || !text) {
    return null;
  }

  const bannerStyle: React.CSSProperties = {
    backgroundColor,
    height,
    position: stickyTop ? 'sticky' : 'relative',
    top: stickyTop ? 0 : 'auto',
    zIndex: stickyTop ? 1000 : 'auto'
  };

  const textStyle: React.CSSProperties = {
    color: textColor,
    fontSize,
    fontWeight,
    padding
  };

  const animationClass = enableAnimation && isAnimating
    ? animationType === 'fade' ? 'globalTopBanner-fadeIn' : 'globalTopBanner-slideIn'
    : '';

  return (
    <section
      id="globalTopBanner"
      className={cx('globalTopBanner', animationClass, mode === 'editor' && 'globalTopBanner--editor')}
      style={bannerStyle}
      onClick={link ? handleBannerClick : undefined}
    >
      <div 
        ref={bannerRef}
        className={cx(
          'globalWrapper flex items-center justify-center',
          link && 'cursor-pointer hover-opacity-90'
        )}
      >
        <h4 
          className="globalTopBanner-text leading-body whitespace-pre-line"
          style={textStyle}
        >
          {text}
        </h4>
        
        {showCloseButton && (
          <button
            type="button"
            className="globalTopBanner-close"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-label={t('close')}
            style={{ color: closeButtonColor }}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 4L4 12M4 4L12 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
};

// UMD 내보내기
if (typeof window !== 'undefined') {
  (window as any).MarijuourGlobalTopBannerSkin = GlobalTopBannerSkin;
}

export default GlobalTopBannerSkin;