import React, { useRef, useEffect, useState } from 'react';
import type { ComponentSkinProps } from './types';

const TextBannerSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  options,
  utils,
  mode
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 옵션에서 값 추출 (기본값 제공)
  const {
    // 콘텐츠
    title = data.title || '',
    description = data.description || '',
    buttonLink = options.buttonLink || data.buttonLink || '#',
    buttonText = options.buttonText || utils.t('view_more'),
    linkTarget = options.linkTarget || '_self',
    
    // 이미지
    imageUrl = options.imageUrl || data.imageUrl || {
      desktop: '',
      mobile: ''
    },
    imageOverlay = options.imageOverlay !== false,
    overlayOpacity = options.overlayOpacity || 0.3,
    overlayColor = options.overlayColor || '#000000',
    
    // 텍스트 스타일
    textAlign = options.textAlign || 'left',
    titleColor = options.titleColor || '#ffffff',
    titleFontSize = options.titleFontSize || '2rem',
    titleFontWeight = options.titleFontWeight || '700',
    descriptionColor = options.descriptionColor || '#ffffff',
    descriptionFontSize = options.descriptionFontSize || '1rem',
    
    // 레이아웃
    contentPosition = options.contentPosition || 'left',
    contentVerticalAlign = options.contentVerticalAlign || 'center',
    padding = options.padding || '40px',
    height = options.height || '500px',
    mobileHeight = options.mobileHeight || '400px',
    
    // 애니메이션
    enableAnimation = options.enableAnimation !== false,
    animationType = options.animationType || 'fade',
    animationDuration = options.animationDuration || 0.9,
    animationDelay = options.animationDelay || 0,
    animationTrigger = options.animationTrigger || 'onScroll'
  } = options;

  // 스크롤 트리거 애니메이션
  useEffect(() => {
    if (!enableAnimation || animationTrigger !== 'onScroll') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setTimeout(() => {
              setIsVisible(true);
            }, animationDelay * 1000);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, [enableAnimation, animationTrigger, animationDelay, isVisible]);

  // 로드 트리거 애니메이션
  useEffect(() => {
    if (enableAnimation && animationTrigger === 'onLoad') {
      setTimeout(() => {
        setIsVisible(true);
      }, animationDelay * 1000);
    }
  }, [enableAnimation, animationTrigger, animationDelay]);

  // 클릭 핸들러
  const handleClick = (e: React.MouseEvent) => {
    if (actions.onClick) {
      actions.onClick(e);
    }
    if (buttonLink && buttonLink !== '#') {
      if (linkTarget === '_blank') {
        window.open(buttonLink, '_blank');
      } else {
        utils.navigate(buttonLink);
      }
    }
  };

  // 애니메이션 클래스 생성
  const getAnimationClass = () => {
    if (!enableAnimation) return '';
    
    const baseClass = 'text-banner-animated';
    const visibleClass = isVisible ? 'is-visible' : '';
    
    return utils.cx(baseClass, `animation-${animationType}`, visibleClass);
  };

  // 콘텐츠 정렬 클래스
  const getContentAlignmentClass = () => {
    const horizontal = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    }[contentPosition];

    const vertical = {
      top: 'items-start',
      center: 'items-center',
      bottom: 'items-end'
    }[contentVerticalAlign];

    return utils.cx(horizontal, vertical);
  };

  return (
    <div
      ref={bannerRef}
      className={utils.cx(
        'text-banner-skin',
        getAnimationClass(),
        mode === 'editor' && 'editor-mode'
      )}
      style={{
        '--animation-duration': `${animationDuration}s`,
        height: height,
      } as React.CSSProperties}
    >
      {/* 배경 이미지 */}
      <div className="text-banner-image-wrapper">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet={imageUrl.mobile}
          />
          <img
            src={imageUrl.desktop}
            alt={title}
            className="text-banner-image"
            onLoad={() => {
              setIsLoaded(true);
              if (actions.onImageLoad) {
                actions.onImageLoad();
              }
            }}
            onError={() => {
              if (actions.onImageError) {
                actions.onImageError();
              }
            }}
          />
        </picture>
        
        {/* 오버레이 */}
        {imageOverlay && (
          <div
            className="text-banner-overlay"
            style={{
              backgroundColor: overlayColor,
              opacity: overlayOpacity
            }}
          />
        )}
      </div>

      {/* 콘텐츠 */}
      <div
        className={utils.cx(
          'text-banner-content',
          getContentAlignmentClass()
        )}
        style={{
          padding: padding,
          textAlign: textAlign as any
        }}
      >
        <div className="text-banner-inner">
          {title && (
            <h3
              className="text-banner-title"
              style={{
                color: titleColor,
                fontSize: titleFontSize,
                fontWeight: titleFontWeight
              }}
            >
              {title}
            </h3>
          )}
          
          {description && (
            <p
              className="text-banner-description"
              style={{
                color: descriptionColor,
                fontSize: descriptionFontSize
              }}
            >
              {description}
            </p>
          )}
          
          {buttonLink && buttonLink !== '#' && (
            <button
              className="text-banner-button"
              onClick={handleClick}
              onMouseEnter={() => {
                if (enableAnimation && animationTrigger === 'onHover') {
                  setIsVisible(true);
                }
              }}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>

      {/* 에디터 모드 오버레이 */}
      {mode === 'editor' && (
        <div className="editor-overlay">
          <div className="editor-controls">
            {editor?.isSelected && (
              <>
                <button onClick={editor.onEdit}>편집</button>
                <button onClick={editor.onDelete}>삭제</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextBannerSkin;