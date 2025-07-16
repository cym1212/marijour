import React, { useRef, useEffect, useState } from 'react';
import type { ComponentSkinProps, ProductItem } from './types';

// Swiper 모듈 import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper 스타일
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// 아이콘 컴포넌트들
const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 8.33333V6.66667C6.66667 4.82572 8.15905 3.33333 10 3.33333C11.8409 3.33333 13.3333 4.82572 13.3333 6.66667V8.33333M4.16667 8.33333H15.8333L16.6667 16.6667H3.33333L4.16667 8.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0.5L7.545 4.13L11.5 4.635L8.75 7.415L9.39 11.5L6 9.58L2.61 11.5L3.25 7.415L0.5 4.635L4.455 4.13L6 0.5Z"/>
  </svg>
);

// 상품 카드 컴포넌트
const ProductCard: React.FC<{
  product: ProductItem;
  options: any;
  utils: any;
  onProductClick?: (productId: string | number) => void;
  onCartClick?: (e: React.MouseEvent, productId: string | number) => void;
}> = ({ product, options, utils, onProductClick, onCartClick }) => {
  const {
    showProductName = true,
    showPrice = true,
    showOriginalPrice = true,
    showDiscountRate = true,
    showReviews = true,
    showBadges = true,
    showCartButton = true,
    productCardStyle = {}
  } = options;

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onProductClick) {
      onProductClick(product.id);
    } else if (product.productUrl) {
      utils.navigate(product.productUrl);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCartClick) {
      onCartClick(e, product.id);
    }
    utils.showToast(utils.t('product_added_to_cart'));
  };

  return (
    <div
      className="product-card"
      style={{
        borderRadius: productCardStyle.borderRadius || '0px',
        backgroundColor: productCardStyle.backgroundColor || 'transparent',
        padding: productCardStyle.padding || '0px',
        boxShadow: productCardStyle.shadowEffect ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
      }}
    >
      <a href={product.productUrl || '#'} onClick={handleProductClick} className="product-link">
        {/* 이미지 */}
        <div className="product-image-container" style={{ aspectRatio: productCardStyle.aspectRatio || '1/1' }}>
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="product-image"
          />
          
          {/* 장바구니 버튼 */}
          {showCartButton && (
            <button
              className="cart-button"
              onClick={handleCartClick}
              aria-label={utils.t('add_to_cart')}
            >
              <CartIcon className="cart-icon" />
            </button>
          )}
          
          {/* 배지 */}
          {showBadges && product.badges && product.badges.length > 0 && (
            <div className="badges-container">
              {product.badges.map((badge, index) => (
                <span key={index} className="product-badge">{badge}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* 상품 정보 */}
        <div className="product-info">
          {showProductName && (
            <h4 className="product-name">{product.name}</h4>
          )}
          
          {/* 가격 정보 */}
          {showPrice && (
            <div className="price-container">
              {product.discountRate && showDiscountRate && (
                <span className="discount-rate">{product.discountRate}%</span>
              )}
              <span className="current-price">{utils.formatCurrency(product.price)}</span>
              {product.originalPrice && showOriginalPrice && (
                <span className="original-price">{utils.formatCurrency(product.originalPrice)}</span>
              )}
            </div>
          )}
          
          {/* 리뷰 정보 */}
          {showReviews && product.reviewCount !== undefined && product.reviewCount > 0 && (
            <div className="review-container">
              <StarIcon className="star-icon" />
              <span className="star-rating">{product.starRating}</span>
              <span className="review-count">({product.reviewCount})</span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
};

const ProductSliderSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  options,
  utils,
  mode
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 옵션에서 값 추출
  const {
    // 상품 데이터
    products = options.products || data.products || [],
    
    // 슬라이더 설정
    desktopSlidesPerView = options.desktopSlidesPerView || 3,
    mobileSlidesPerView = options.mobileSlidesPerView || 1,
    tabletSlidesPerView = options.tabletSlidesPerView || 2,
    slidesPerGroup = options.slidesPerGroup || 1,
    spaceBetween = options.spaceBetween || 20,
    centeredSlides = options.centeredSlides || false,
    loop = options.loop !== false,
    
    // 자동 재생
    autoplay = options.autoplay !== false,
    autoplayDelay = options.autoplayDelay || 3000,
    autoplayDisableOnInteraction = options.autoplayDisableOnInteraction || false,
    pauseOnMouseEnter = options.pauseOnMouseEnter !== false,
    
    // 네비게이션
    showNavigation = options.showNavigation !== false,
    navigationColor = options.navigationColor || '#ffffff',
    navigationBgColor = options.navigationBgColor || 'rgba(0, 0, 0, 0.5)',
    navigationHoverBgColor = options.navigationHoverBgColor || 'rgba(0, 0, 0, 0.7)',
    navigationSize = options.navigationSize || '48px',
    
    // 페이지네이션
    showPagination = options.showPagination || false,
    paginationType = options.paginationType || 'bullets',
    paginationColor = options.paginationColor || '#000000',
    paginationActiveColor = options.paginationActiveColor || '#000000',
    
    // 스크롤바
    showScrollbar = options.showScrollbar !== false,
    scrollbarDraggable = options.scrollbarDraggable !== false,
    
    // 효과
    effect = options.effect || 'slide',
    speed = options.speed || 800,
    
    // 레이아웃
    containerPadding = options.containerPadding || '0px',
    containerMaxWidth = options.containerMaxWidth || '100%',
    minHeight = options.minHeight || 'auto',
    
    // 애니메이션
    enableAnimation = options.enableAnimation !== false,
    animationType = options.animationType || 'fade',
    animationDuration = options.animationDuration || 0.9,
    animateOnScroll = options.animateOnScroll !== false
  } = options;

  // 스크롤 애니메이션
  useEffect(() => {
    if (!enableAnimation || !animateOnScroll) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // 자동 재생 시작
            if (swiperRef.current && autoplay) {
              swiperRef.current.autoplay.start();
            }
          } else {
            // 뷰포트 벗어나면 자동 재생 중지
            if (swiperRef.current && autoplay) {
              swiperRef.current.autoplay.stop();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => {
      if (sliderRef.current) {
        observer.unobserve(sliderRef.current);
      }
    };
  }, [enableAnimation, animateOnScroll, autoplay]);

  // Swiper 설정
  const swiperParams = {
    modules: [Navigation, Pagination, Scrollbar, Autoplay],
    loop: loop,
    speed: speed,
    spaceBetween: spaceBetween,
    slidesPerView: mobileSlidesPerView + 0.3,
    slidesPerGroup: slidesPerGroup,
    centeredSlides: centeredSlides,
    
    autoplay: autoplay ? {
      delay: autoplayDelay,
      disableOnInteraction: autoplayDisableOnInteraction,
      pauseOnMouseEnter: pauseOnMouseEnter
    } : false,
    
    navigation: showNavigation ? {
      prevEl: navigationPrevRef.current,
      nextEl: navigationNextRef.current,
    } : false,
    
    pagination: showPagination ? {
      type: paginationType,
      clickable: true,
    } : false,
    
    scrollbar: showScrollbar ? {
      draggable: scrollbarDraggable,
    } : false,
    
    breakpoints: {
      768: {
        slidesPerView: tabletSlidesPerView + 0.3,
      },
      1024: {
        slidesPerView: desktopSlidesPerView + 0.3,
      },
      ...options.breakpoints
    },
    
    onSwiper: (swiper: SwiperType) => {
      swiperRef.current = swiper;
      if (autoplay) {
        swiper.autoplay.stop(); // 초기에는 중지
      }
      if (actions.onSliderInit) {
        actions.onSliderInit();
      }
    },
    
    onSlideChange: () => {
      if (swiperRef.current && actions.onSlideChange) {
        actions.onSlideChange(swiperRef.current.activeIndex);
      }
    }
  };

  return (
    <div
      ref={sliderRef}
      className={utils.cx(
        'product-slider-skin',
        enableAnimation && `animation-${animationType}`,
        isVisible && 'is-visible',
        mode === 'editor' && 'editor-mode'
      )}
      style={{
        '--animation-duration': `${animationDuration}s`,
        '--navigation-color': navigationColor,
        '--navigation-bg': navigationBgColor,
        '--navigation-hover-bg': navigationHoverBgColor,
        '--navigation-size': navigationSize,
        '--pagination-color': paginationColor,
        '--pagination-active-color': paginationActiveColor,
        padding: containerPadding,
        maxWidth: containerMaxWidth,
        minHeight: minHeight,
        margin: '0 auto'
      } as React.CSSProperties}
    >
      <Swiper {...swiperParams} className="product-swiper">
        {products.map((product, index) => (
          <SwiperSlide key={product.id || index}>
            <ProductCard
              product={product}
              options={options}
              utils={utils}
              onProductClick={actions.onProductClick}
              onCartClick={actions.onCartClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 네비게이션 버튼 */}
      {showNavigation && (
        <>
          <button
            ref={navigationPrevRef}
            className="swiper-navigation swiper-navigation-prev"
            aria-label={utils.t('previous_slide')}
          >
            <ArrowIcon className="navigation-icon rotate-180" />
          </button>
          <button
            ref={navigationNextRef}
            className="swiper-navigation swiper-navigation-next"
            aria-label={utils.t('next_slide')}
          >
            <ArrowIcon className="navigation-icon" />
          </button>
        </>
      )}

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

export default ProductSliderSkin;