import React, { useRef, useEffect, useState } from 'react';
import type { ComponentSkinProps } from './types';

const SplitVisualBannerSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  options,
  utils,
  mode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [elementsVisible, setElementsVisible] = useState({
    image: false,
    title: false,
    description: false,
    button: false
  });

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
    imageDirection = options.imageDirection || data.imageDirection || 'left',
    isOverlay = options.isOverlay !== undefined ? options.isOverlay : data.isOverlay !== undefined ? data.isOverlay : false,
    overlayOpacity = options.overlayOpacity || 0.3,
    overlayColor = options.overlayColor || '#000000',
    
    // 텍스트 스타일
    titleColor = options.titleColor || '#000000',
    titleFontSize = options.titleFontSize || '3rem',
    titleFontWeight = options.titleFontWeight || '700',
    titleFontFamily = options.titleFontFamily || 'serif',
    descriptionColor = options.descriptionColor || '#333333',
    descriptionFontSize = options.descriptionFontSize || '1rem',
    descriptionLineHeight = options.descriptionLineHeight || '1.6',
    
    // 버튼 스타일
    buttonStyle = options.buttonStyle || 'primary',
    buttonBackgroundColor = options.buttonBackgroundColor || '#000000',
    buttonTextColor = options.buttonTextColor || '#ffffff',
    buttonHoverBackgroundColor = options.buttonHoverBackgroundColor || '#333333',
    buttonPadding = options.buttonPadding || '10px 16px 14px 16px',
    buttonBorderRadius = options.buttonBorderRadius || '4px',
    
    // 레이아웃
    gap = options.gap || '32px',
    contentPadding = options.contentPadding || '5%',
    contentAlign = options.contentAlign || 'start',
    contentVerticalAlign = options.contentVerticalAlign || 'end',
    imageAspectRatio = options.imageAspectRatio || '1 / 1',
    containerMaxWidth = options.containerMaxWidth || '100%',
    
    // 애니메이션
    enableAnimation = options.enableAnimation !== false,
    animationType = options.animationType || 'stagger',
    animationDuration = options.animationDuration || 0.9,
    animationDelay = options.animationDelay || 0,
    animationStagger = options.animationStagger || 0.1,
    
    // 반응형
    mobileImageDirection = options.mobileImageDirection || 'top',
    mobileGap = options.mobileGap || '32px',
    mobileContentPadding = options.mobileContentPadding || '20px'
  } = options;

  // 스크롤 애니메이션 설정
  useEffect(() => {
    if (!enableAnimation) {
      setElementsVisible({
        image: true,
        title: true,
        description: true,
        button: true
      });
      return;
    }

    const observers: IntersectionObserver[] = [];
    
    // 이미지 옵저버
    if (imageRef.current) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setElementsVisible(prev => ({ ...prev, image: true }));
              }, animationDelay * 1000);
            }
          });
        },
        { threshold: 0.1 }
      );
      imageObserver.observe(imageRef.current);
      observers.push(imageObserver);
    }

    // 텍스트 요소들 옵저버 (stagger 애니메이션)
    const textElements = [
      { ref: titleRef, key: 'title', delay: 0 },
      { ref: descRef, key: 'description', delay: animationStagger },
      { ref: btnRef, key: 'button', delay: animationStagger * 2 }
    ];

    textElements.forEach(({ ref, key, delay }) => {
      if (ref.current) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setTimeout(() => {
                  setElementsVisible(prev => ({ ...prev, [key]: true }));
                }, (animationDelay + delay) * 1000);
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [enableAnimation, animationDelay, animationStagger]);

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
  const getAnimationClass = (elementType: 'image' | 'title' | 'description' | 'button') => {
    if (!enableAnimation) return '';
    
    const baseClass = 'split-banner-animated';
    const typeClass = `animation-${animationType}`;
    const elementClass = `element-${elementType}`;
    const visibleClass = elementsVisible[elementType] ? 'is-visible' : '';
    
    return utils.cx(baseClass, typeClass, elementClass, visibleClass);
  };

  // 콘텐츠 정렬 클래스
  const getContentAlignmentClass = () => {
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end'
    };
    
    const verticalAlignMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end'
    };
    
    return utils.cx(alignMap[contentAlign], verticalAlignMap[contentVerticalAlign]);
  };

  // 버튼 스타일 클래스
  const getButtonClass = () => {
    const baseClass = 'split-banner-button';
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
      ref={containerRef}
      className={utils.cx(
        'split-visual-banner-skin',
        mode === 'editor' && 'editor-mode'
      )}
      style={{
        '--animation-duration': `${animationDuration}s`,
        '--button-bg': buttonBackgroundColor,
        '--button-text': buttonTextColor,
        '--button-hover-bg': buttonHoverBackgroundColor,
        maxWidth: containerMaxWidth,
        margin: '0 auto'
      } as React.CSSProperties}
    >
      <div 
        className={utils.cx(
          'split-banner-container',
          imageDirection === 'right' && 'image-right',
          `mobile-image-${mobileImageDirection}`
        )}
        style={{
          '--gap': gap,
          '--mobile-gap': mobileGap
        } as React.CSSProperties}
      >
        {/* 이미지 섹션 */}
        <div
          ref={imageRef}
          className={utils.cx(
            'split-banner-image-section',
            getAnimationClass('image')
          )}
          style={{
            aspectRatio: imageAspectRatio
          }}
        >
          <div className="split-banner-image-wrapper">
            <picture>
              <source 
                media="(max-width: 768px)" 
                srcSet={imageUrl.mobile}
              />
              <img
                src={imageUrl.desktop}
                alt={title}
                className="split-banner-image"
                onLoad={() => {
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
                className="split-banner-overlay"
                style={{
                  backgroundColor: overlayColor,
                  opacity: overlayOpacity
                }}
              />
            )}
          </div>
        </div>

        {/* 콘텐츠 섹션 */}
        <div
          className={utils.cx(
            'split-banner-content-section',
            getContentAlignmentClass()
          )}
          style={{
            padding: contentPadding,
            '--mobile-padding': mobileContentPadding
          } as React.CSSProperties}
        >
          <div className="split-banner-content-inner">
            {title && (
              <h2
                ref={titleRef}
                className={utils.cx(
                  'split-banner-title',
                  getAnimationClass('title')
                )}
                style={{
                  color: titleColor,
                  fontSize: titleFontSize,
                  fontWeight: titleFontWeight,
                  fontFamily: titleFontFamily
                }}
              >
                {title}
              </h2>
            )}
            
            {description && (
              <p
                ref={descRef}
                className={utils.cx(
                  'split-banner-description',
                  getAnimationClass('description')
                )}
                style={{
                  color: descriptionColor,
                  fontSize: descriptionFontSize,
                  lineHeight: descriptionLineHeight
                }}
              >
                {description}
              </p>
            )}
            
            {buttonText && buttonLink && (
              <button
                ref={btnRef}
                className={utils.cx(
                  getButtonClass(),
                  getAnimationClass('button')
                )}
                onClick={handleButtonClick}
                style={{
                  padding: buttonPadding,
                  borderRadius: buttonBorderRadius
                }}
                type="button"
                aria-label={buttonText}
              >
                {buttonText}
              </button>
            )}
          </div>
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

export default SplitVisualBannerSkin;