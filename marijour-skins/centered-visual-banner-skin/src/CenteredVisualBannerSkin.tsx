import React, { useRef, useEffect, useState } from 'react';
import type { ComponentSkinProps } from './types';

const CenteredVisualBannerSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  options,
  utils,
  mode
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 옵션에서 값 추출 (기본값 제공)
  const {
    // 콘텐츠
    title = options.title || data.title || '',
    description = options.description || data.description || '',
    buttonText = options.buttonText || data.buttonText || '',
    buttonLink = options.buttonLink || data.buttonLink || '#',
    linkTarget = options.linkTarget || '_self',
    
    // 이미지
    imageUrl = options.imageUrl || options.src || data.imageUrl || data.src || {
      desktop: '',
      mobile: ''
    },
    isOverlay = options.isOverlay !== undefined ? options.isOverlay : data.isOverlay !== undefined ? data.isOverlay : true,
    overlayOpacity = options.overlayOpacity || 0.4,
    overlayColor = options.overlayColor || '#000000',
    
    // 텍스트 스타일
    isSmallText = options.isSmallText !== undefined ? options.isSmallText : data.isSmallText || false,
    titleColor = options.titleColor || '#ffffff',
    titleFontSize = options.titleFontSize || (isSmallText ? '1.25rem' : '3rem'),
    titleFontWeight = options.titleFontWeight || '700',
    titleFontFamily = options.titleFontFamily || 'serif',
    descriptionColor = options.descriptionColor || '#ffffff',
    descriptionFontSize = options.descriptionFontSize || (isSmallText ? '0.875rem' : '1rem'),
    descriptionLineHeight = options.descriptionLineHeight || '1.6',
    
    // 버튼 스타일
    buttonStyle = options.buttonStyle || 'primary',
    buttonBackgroundColor = options.buttonBackgroundColor || '#000000',
    buttonTextColor = options.buttonTextColor || '#ffffff',
    buttonHoverBackgroundColor = options.buttonHoverBackgroundColor || '#333333',
    buttonPadding = options.buttonPadding || '10px 16px 14px 16px',
    buttonBorderRadius = options.buttonBorderRadius || '4px',
    buttonMarginTop = options.buttonMarginTop || '26px',
    
    // 레이아웃
    contentMaxWidth = options.contentMaxWidth || '800px',
    contentPadding = options.contentPadding || '20px',
    verticalPadding = options.verticalPadding || '7.5vh',
    minHeight = options.minHeight || '500px',
    textAlign = options.textAlign || 'center',
    verticalAlign = options.verticalAlign || 'center',
    
    // 애니메이션
    enableAnimation = options.enableAnimation !== false,
    animationType = options.animationType || 'fade',
    animationDuration = options.animationDuration || 0.9,
    animationDelay = options.animationDelay || 0,
    animationTrigger = options.animationTrigger || 'onScroll',
    
    // 반응형
    mobileMinHeight = options.mobileMinHeight || '400px',
    mobilePadding = options.mobilePadding || '15px',
    mobileTitleFontSize = options.mobileTitleFontSize || (isSmallText ? '1.125rem' : '2rem'),
    mobileDescriptionFontSize = options.mobileDescriptionFontSize || (isSmallText ? '0.875rem' : '1rem')
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

  // 버튼 클릭 핸들러
  const handleButtonClick = (e: React.MouseEvent) => {
    if (actions.onButtonClick) {
      actions.onButtonClick(e);
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
    
    const baseClass = 'centered-banner-animated';
    const visibleClass = isVisible ? 'is-visible' : '';
    
    return utils.cx(baseClass, `animation-${animationType}`, visibleClass);
  };

  // 수직 정렬 클래스
  const getVerticalAlignClass = () => {
    const alignMap = {
      top: 'justify-start',
      center: 'justify-center',
      bottom: 'justify-end'
    };
    
    return alignMap[verticalAlign] || 'justify-center';
  };

  // 버튼 스타일 클래스
  const getButtonClass = () => {
    const baseClass = 'centered-banner-button';
    const styleClasses = {
      primary: 'button-primary',
      secondary: 'button-secondary',
      outline: 'button-outline',
      text: 'button-text'
    };
    
    return utils.cx(baseClass, styleClasses[buttonStyle]);
  };

  return (
    <div
      ref={bannerRef}
      className={utils.cx(
        'centered-visual-banner-skin',
        getAnimationClass(),
        mode === 'editor' && 'editor-mode'
      )}
      style={{
        '--animation-duration': `${animationDuration}s`,
        '--button-bg': buttonBackgroundColor,
        '--button-text': buttonTextColor,
        '--button-hover-bg': buttonHoverBackgroundColor,
        minHeight: minHeight,
        '--mobile-min-height': mobileMinHeight
      } as React.CSSProperties}
    >
      {/* 배경 이미지 */}
      <div className="centered-banner-image-wrapper">
        <picture>
          <source 
            media="(max-width: 768px)" 
            srcSet={imageUrl.mobile}
          />
          <img
            src={imageUrl.desktop}
            alt={title}
            className="centered-banner-image"
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
        {isOverlay && (
          <div
            className="centered-banner-overlay"
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
          'centered-banner-content',
          getVerticalAlignClass()
        )}
        style={{
          padding: `${verticalPadding} ${contentPadding}`,
          '--mobile-padding': `${verticalPadding} ${mobilePadding}`
        } as React.CSSProperties}
      >
        <div
          ref={contentRef}
          className="centered-banner-inner"
          style={{
            maxWidth: contentMaxWidth,
            textAlign: textAlign as any
          }}
        >
          {title && (
            <h2
              className="centered-banner-title"
              style={{
                color: titleColor,
                fontSize: titleFontSize,
                fontWeight: titleFontWeight,
                fontFamily: titleFontFamily,
                '--mobile-font-size': mobileTitleFontSize
              } as React.CSSProperties}
            >
              {title}
            </h2>
          )}
          
          {description && (
            <p
              className="centered-banner-description"
              style={{
                color: descriptionColor,
                fontSize: descriptionFontSize,
                lineHeight: descriptionLineHeight,
                '--mobile-font-size': mobileDescriptionFontSize
              } as React.CSSProperties}
            >
              {description}
            </p>
          )}
          
          {buttonText && buttonLink && (
            <button
              className={getButtonClass()}
              onClick={handleButtonClick}
              style={{
                padding: buttonPadding,
                borderRadius: buttonBorderRadius,
                marginTop: buttonMarginTop
              }}
              type="button"
              aria-label={buttonText}
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

export default CenteredVisualBannerSkin;