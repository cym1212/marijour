import React, { useState, useRef } from 'react';
import type { ComponentSkinProps } from './types';

// 카트 아이콘 컴포넌트
const CartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 8.33333V6.66667C6.66667 4.82572 8.15905 3.33333 10 3.33333C11.8409 3.33333 13.3333 4.82572 13.3333 6.66667V8.33333M4.16667 8.33333H15.8333L16.6667 16.6667H3.33333L4.16667 8.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 별점 아이콘 컴포넌트
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0.5L7.545 4.13L11.5 4.635L8.75 7.415L9.39 11.5L6 9.58L2.61 11.5L3.25 7.415L0.5 4.635L4.455 4.13L6 0.5Z"/>
  </svg>
);

const ProductItemSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  options,
  utils,
  mode
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);

  // 옵션에서 값 추출 (기본값 제공)
  const {
    // 상품 정보
    productId = options.productId || data.productId || '1',
    name = options.name || data.name || '',
    thumbnailUrl = options.thumbnailUrl || data.thumbnailUrl || '',
    price = options.price || data.price || 0,
    originalPrice = options.originalPrice || data.originalPrice,
    discountRate = options.discountRate || data.discountRate,
    starRating = options.starRating || data.starRating || 0,
    reviewCount = options.reviewCount || data.reviewCount || 0,
    badges = options.badges || data.badges || [],
    productUrl = options.productUrl || `/products/${productId}`,
    
    // 레이아웃
    aspectRatio = options.aspectRatio || '1 / 1',
    imageObjectFit = options.imageObjectFit || 'cover',
    nameLinesClamp = options.nameLinesClamp || 2,
    showCartButton = options.showCartButton !== false,
    cartButtonPosition = options.cartButtonPosition || 'bottom-right',
    showBadges = options.showBadges !== false,
    badgePosition = options.badgePosition || 'bottom',
    
    // 스타일
    borderRadius = options.borderRadius || '0px',
    backgroundColor = options.backgroundColor || 'transparent',
    hoverEffect = options.hoverEffect !== false,
    hoverScale = options.hoverScale || 1.05,
    shadowEffect = options.shadowEffect || false,
    shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0.1)',
    padding = options.padding || '0px',
    gap = options.gap || '12px',
    
    // 텍스트 스타일
    nameColor = options.nameColor || '#111827',
    nameFontSize = options.nameFontSize || '0.875rem',
    nameFontWeight = options.nameFontWeight || '400',
    priceColor = options.priceColor || '#111827',
    priceFontSize = options.priceFontSize || '1rem',
    priceFontWeight = options.priceFontWeight || '700',
    originalPriceColor = options.originalPriceColor || '#9ca3af',
    discountColor = options.discountColor || '#ef4444',
    discountBgColor = options.discountBgColor || '#fef2f2',
    
    // 리뷰 스타일
    showReviews = options.showReviews !== false,
    starColor = options.starColor || '#facc15',
    starSize = options.starSize || '12px',
    reviewCountColor = options.reviewCountColor || '#6b7280',
    
    // 장바구니 버튼
    cartButtonColor = options.cartButtonColor || '#ffffff',
    cartButtonBgColor = options.cartButtonBgColor || '#000000',
    cartButtonHoverBgColor = options.cartButtonHoverBgColor || '#1f2937',
    cartButtonSize = options.cartButtonSize || '40px',
    cartIconColor = options.cartIconColor || '#ffffff',
    
    // 배지 스타일
    badgeTextColor = options.badgeTextColor || '#000000',
    badgeBorderColor = options.badgeBorderColor || '#000000',
    badgeBgColor = options.badgeBgColor || 'transparent',
    badgeFontSize = options.badgeFontSize || '0.75rem',
    
    // 애니메이션
    enableAnimation = options.enableAnimation !== false,
    animationType = options.animationType || 'fade',
    animationDuration = options.animationDuration || 0.3,
    animationDelay = options.animationDelay || 0,
    
    // 가격 표시
    showOriginalPrice = options.showOriginalPrice !== false,
    showDiscountRate = options.showDiscountRate !== false,
    priceFormat = options.priceFormat || 'default',
    currencySymbol = options.currencySymbol || '원',
    
    // 기타
    linkTarget = options.linkTarget || '_self'
  } = options;

  // 가격 포맷팅
  const formatPrice = (amount: number) => {
    if (priceFormat === 'currency') {
      return `${currencySymbol} ${amount.toLocaleString()}`;
    }
    return utils.formatCurrency(amount);
  };

  // 상품 클릭 핸들러
  const handleProductClick = (e: React.MouseEvent) => {
    if (actions.onProductClick) {
      e.preventDefault();
      actions.onProductClick(productId);
    } else if (productUrl) {
      if (linkTarget === '_blank') {
        window.open(productUrl, '_blank');
      } else {
        utils.navigate(productUrl);
      }
    }
  };

  // 장바구니 버튼 클릭 핸들러
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (actions.onCartClick) {
      actions.onCartClick(e, productId);
    }
    
    // 토스트 메시지 표시
    utils.showToast(utils.t('product_added_to_cart'), {
      action: {
        label: utils.t('go_to_cart'),
        onClick: () => utils.navigate('/cart')
      }
    });
  };

  // 리뷰 클릭 핸들러
  const handleReviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (actions.onReviewClick) {
      actions.onReviewClick();
    }
  };

  // 장바구니 버튼 위치 클래스
  const getCartButtonPositionClass = () => {
    const positions = {
      'bottom-right': 'bottom-3 right-3 md:bottom-4 md:right-4',
      'bottom-left': 'bottom-3 left-3 md:bottom-4 md:left-4',
      'top-right': 'top-3 right-3 md:top-4 md:right-4',
      'top-left': 'top-3 left-3 md:top-4 md:left-4',
      'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };
    return positions[cartButtonPosition] || positions['bottom-right'];
  };

  return (
    <div
      ref={productRef}
      className={utils.cx(
        'product-item-skin',
        hoverEffect && 'hover-effect',
        enableAnimation && `animation-${animationType}`,
        mode === 'editor' && 'editor-mode'
      )}
      style={{
        '--animation-duration': `${animationDuration}s`,
        '--animation-delay': `${animationDelay}s`,
        '--hover-scale': hoverScale,
        '--shadow-color': shadowColor,
        borderRadius: borderRadius,
        backgroundColor: backgroundColor,
        padding: padding,
        boxShadow: shadowEffect ? `0 1px 3px ${shadowColor}` : 'none'
      } as React.CSSProperties}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={productUrl}
        onClick={handleProductClick}
        target={linkTarget}
        className="product-link"
      >
        {/* 썸네일 이미지 */}
        <div className="product-image-container" style={{ aspectRatio }}>
          <img
            src={thumbnailUrl}
            alt={name}
            className={utils.cx(
              'product-image',
              `object-${imageObjectFit}`
            )}
            onLoad={() => {
              setIsImageLoaded(true);
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
          
          {/* 장바구니 버튼 */}
          {showCartButton && (
            <div className={utils.cx('cart-button-wrapper', getCartButtonPositionClass())}>
              <button
                className="cart-button"
                onClick={handleCartClick}
                style={{
                  backgroundColor: cartButtonBgColor,
                  color: cartButtonColor,
                  width: cartButtonSize,
                  height: cartButtonSize,
                  '--hover-bg': cartButtonHoverBgColor
                } as React.CSSProperties}
                aria-label={utils.t('add_to_cart')}
              >
                <CartIcon className="cart-icon" />
              </button>
            </div>
          )}
          
          {/* 상단 배지 */}
          {showBadges && badgePosition === 'top' && badges.length > 0 && (
            <div className="badges-container badges-top">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="product-badge"
                  style={{
                    color: badgeTextColor,
                    borderColor: badgeBorderColor,
                    backgroundColor: badgeBgColor,
                    fontSize: badgeFontSize
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="product-info" style={{ gap }}>
          <h4
            className={`product-name line-clamp-${nameLinesClamp}`}
            style={{
              color: nameColor,
              fontSize: nameFontSize,
              fontWeight: nameFontWeight
            }}
          >
            {name}
          </h4>
          
          <div className="product-details">
            {/* 가격 정보 */}
            <div className="price-container">
              {discountRate && showDiscountRate && (
                <span
                  className="discount-rate"
                  style={{
                    color: discountColor,
                    backgroundColor: discountBgColor
                  }}
                >
                  {discountRate}%
                </span>
              )}
              <span
                className="current-price"
                style={{
                  color: priceColor,
                  fontSize: priceFontSize,
                  fontWeight: priceFontWeight
                }}
              >
                {formatPrice(price)}
              </span>
              {originalPrice && showOriginalPrice && (
                <span
                  className="original-price"
                  style={{ color: originalPriceColor }}
                >
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            
            {/* 리뷰 정보 */}
            {showReviews && reviewCount > 0 && (
              <div
                className="review-container"
                onClick={handleReviewClick}
                style={{ cursor: actions.onReviewClick ? 'pointer' : 'default' }}
              >
                <StarIcon className="star-icon" />
                <span className="star-rating" style={{ color: starColor }}>
                  {starRating}
                </span>
                <span className="review-count" style={{ color: reviewCountColor }}>
                  ({reviewCount})
                </span>
              </div>
            )}
          </div>
          
          {/* 하단 배지 */}
          {showBadges && badgePosition === 'bottom' && badges.length > 0 && (
            <div className="badges-container badges-bottom">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="product-badge"
                  style={{
                    color: badgeTextColor,
                    borderColor: badgeBorderColor,
                    backgroundColor: badgeBgColor,
                    fontSize: badgeFontSize
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>

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

export default ProductItemSkin;