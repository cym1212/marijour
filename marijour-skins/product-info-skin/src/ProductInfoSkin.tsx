import React, { useState, useRef, useEffect } from 'react';
import type { ComponentSkinProps, Product } from './types';

// 아이콘 컴포넌트들
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0.5L9.79 5.52L15.5 6.23L11.75 10.07L12.58 15.5L8 12.85L3.42 15.5L4.25 10.07L0.5 6.23L6.21 5.52L8 0.5Z"/>
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="7.5" stroke="currentColor"/>
    <path d="M8 7V12M8 4V5" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// 정보 버튼 컴포넌트
const InfoButton: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className={`info-button-wrapper ${className || ''}`}>
      <button
        type="button"
        className="info-button"
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label="정보 보기"
      >
        <InfoIcon className="info-icon" />
      </button>
      {showTooltip && (
        <div ref={tooltipRef} className="info-tooltip">
          {children}
        </div>
      )}
    </div>
  );
};

// 수량 선택기 컴포넌트
const Steppers: React.FC<{
  count: number;
  setCount: (count: number) => void;
  min?: number;
  max?: number;
  onChange?: (count: number) => void;
}> = ({ count, setCount, min = 0, max = 999, onChange }) => {
  const handleDecrease = () => {
    if (count > min) {
      const newCount = count - 1;
      setCount(newCount);
      onChange?.(newCount);
    }
  };

  const handleIncrease = () => {
    if (count < max) {
      const newCount = count + 1;
      setCount(newCount);
      onChange?.(newCount);
    }
  };

  return (
    <div className="steppers">
      <button
        type="button"
        className="stepper-button"
        onClick={handleDecrease}
        disabled={count <= min}
        aria-label="수량 감소"
      >
        <MinusIcon className="stepper-icon" />
      </button>
      <span className="stepper-count">{count}</span>
      <button
        type="button"
        className="stepper-button"
        onClick={handleIncrease}
        disabled={count >= max}
        aria-label="수량 증가"
      >
        <PlusIcon className="stepper-icon" />
      </button>
    </div>
  );
};

const ProductInfoSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  options,
  utils,
  mode
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // 상품 데이터 추출
  const product: Product = options.product || data.product || {
    id: 1,
    name: '',
    thumbnailUrl: '',
    price: 0
  };

  // 옵션에서 값 추출
  const {
    // 레이아웃
    layout = options.layout || 'horizontal',
    imagePosition = options.imagePosition || 'left',
    imageSize = options.imageSize || '46%',
    imageAspectRatio = options.imageAspectRatio || '1 / 1',
    contentGap = options.contentGap || '60px',
    contentPadding = options.contentPadding || '40px',
    sectionPadding = options.sectionPadding || '20px 0',
    maxWidth = options.maxWidth || '1440px',
    
    // 표시 옵션
    showReviews = options.showReviews !== false,
    showShippingInfo = options.showShippingInfo !== false,
    showDiscountInfo = options.showDiscountInfo !== false,
    showQuantitySelector = options.showQuantitySelector !== false,
    showTotalPrice = options.showTotalPrice !== false,
    showProductImage = options.showProductImage !== false,
    
    // 배송 정보
    shippingFee = options.shippingFee || product.shippingFee || 3000,
    freeShippingAmount = options.freeShippingAmount || 50000,
    additionalShippingFee = options.additionalShippingFee || product.additionalShippingFee || { jeju: 3000, island: 3000 },
    
    // 버튼
    showBuyNowButton = options.showBuyNowButton !== false,
    showAddToCartButton = options.showAddToCartButton !== false,
    buyNowButtonText = options.buyNowButtonText || utils.t('buy_now'),
    addToCartButtonText = options.addToCartButtonText || utils.t('add_to_cart'),
    buttonLayout = options.buttonLayout || 'horizontal',
    buttonGap = options.buttonGap || '16px',
    
    // 스타일
    titleFontSize = options.titleFontSize || '1.5rem',
    titleFontWeight = options.titleFontWeight || '700',
    titleFontFamily = options.titleFontFamily || 'serif',
    titleColor = options.titleColor || '#000000',
    
    priceFontSize = options.priceFontSize || '1.25rem',
    priceFontWeight = options.priceFontWeight || '700',
    priceColor = options.priceColor || '#000000',
    originalPriceColor = options.originalPriceColor || '#9ca3af',
    discountRateColor = options.discountRateColor || '#ef4444',
    discountRateBgColor = options.discountRateBgColor || '#fef2f2',
    
    primaryButtonBgColor = options.primaryButtonBgColor || '#000000',
    primaryButtonTextColor = options.primaryButtonTextColor || '#ffffff',
    primaryButtonHoverBgColor = options.primaryButtonHoverBgColor || '#1f2937',
    secondaryButtonBgColor = options.secondaryButtonBgColor || '#ffffff',
    secondaryButtonTextColor = options.secondaryButtonTextColor || '#000000',
    secondaryButtonBorderColor = options.secondaryButtonBorderColor || '#000000',
    secondaryButtonHoverBgColor = options.secondaryButtonHoverBgColor || '#f3f4f6',
    buttonPadding = options.buttonPadding || '12px 24px',
    buttonBorderRadius = options.buttonBorderRadius || '4px',
    buttonFontSize = options.buttonFontSize || '1rem',
    
    sectionBorderColor = options.sectionBorderColor || 'rgba(0, 0, 0, 0.1)',
    sectionBgColor = options.sectionBgColor || 'rgba(0, 0, 0, 0.03)',
    labelColor = options.labelColor || '#6b7280',
    labelFontSize = options.labelFontSize || '0.875rem',
    valueColor = options.valueColor || '#000000',
    valueFontSize = options.valueFontSize || '0.875rem',
    
    // 애니메이션
    enableAnimation = options.enableAnimation !== false,
    animationType = options.animationType || 'fade',
    animationDuration = options.animationDuration || 0.3
  } = options;

  // 총 가격 계산
  const totalPrice = product.price * quantity;

  // 핸들러들
  const handleBuyNow = () => {
    if (actions.onBuyNow) {
      actions.onBuyNow(product, quantity);
    } else {
      utils.navigate(`/order?productId=${product.id}&quantity=${quantity}`);
    }
  };

  const handleAddToCart = () => {
    if (actions.onAddToCart) {
      actions.onAddToCart(product, quantity);
    }
    utils.showToast(utils.t('product_added_to_cart'), {
      action: {
        label: utils.t('go_to_cart'),
        onClick: () => utils.navigate('/cart')
      }
    });
  };

  const handleReviewClick = () => {
    if (actions.onReviewClick) {
      actions.onReviewClick();
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (actions.onQuantityChange) {
      actions.onQuantityChange(newQuantity);
    }
  };

  // 레이아웃 클래스
  const getLayoutClass = () => {
    if (layout === 'vertical') return 'layout-vertical';
    return imagePosition === 'right' ? 'layout-horizontal image-right' : 'layout-horizontal';
  };

  return (
    <section
      className={utils.cx(
        'product-info-skin',
        getLayoutClass(),
        enableAnimation && `animation-${animationType}`,
        mode === 'editor' && 'editor-mode'
      )}
      style={{
        '--animation-duration': `${animationDuration}s`,
        '--content-gap': contentGap,
        '--section-padding': sectionPadding,
        '--section-border-color': sectionBorderColor,
        '--section-bg-color': sectionBgColor,
        '--button-gap': buttonGap,
        maxWidth: maxWidth,
        margin: '0 auto',
        padding: contentPadding
      } as React.CSSProperties}
    >
      <div className="product-info-container">
        {/* 상품 이미지 */}
        {showProductImage && (
          <div className="product-image-section" style={{ maxWidth: imageSize }}>
            <div className="product-image-wrapper" style={{ aspectRatio: imageAspectRatio }}>
              <img
                src={product.thumbnailUrl}
                alt={product.name}
                className="product-image"
                onLoad={() => setIsLoaded(true)}
              />
            </div>
          </div>
        )}

        {/* 상품 정보 */}
        <div className="product-content-section">
          {/* 상품명 */}
          <h2
            className="product-title"
            style={{
              fontSize: titleFontSize,
              fontWeight: titleFontWeight,
              fontFamily: titleFontFamily,
              color: titleColor
            }}
          >
            {product.name}
          </h2>

          {/* 리뷰 및 가격 섹션 */}
          <div className="info-section">
            {showReviews && product.reviewCount !== undefined && product.reviewCount > 0 && (
              <div className="review-score" onClick={handleReviewClick}>
                <StarIcon className="star-icon" />
                <span className="star-rating">{product.starRating}</span>
                <button className="review-count">
                  {utils.t('reviews_count', { count: product.reviewCount })} ({product.reviewCount})
                </button>
              </div>
            )}

            <div className="price-container">
              {product.discountRate && showDiscountInfo && (
                <span
                  className="discount-rate"
                  style={{
                    color: discountRateColor,
                    backgroundColor: discountRateBgColor
                  }}
                >
                  {product.discountRate}%
                </span>
              )}
              <span
                className="current-price"
                style={{
                  fontSize: priceFontSize,
                  fontWeight: priceFontWeight,
                  color: priceColor
                }}
              >
                {utils.formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span
                  className="original-price"
                  style={{ color: originalPriceColor }}
                >
                  {utils.formatCurrency(product.originalPrice)}
                </span>
              )}
              {showDiscountInfo && product.discountRate && (
                <InfoButton className="discount-info">
                  <div className="tooltip-content">
                    <h4>{utils.t('discount_info')}</h4>
                    <p>{utils.t('product_discount')}: {product.discountRate}% (-{utils.formatCurrency((product.originalPrice || 0) - product.price)})</p>
                  </div>
                </InfoButton>
              )}
            </div>
          </div>

          {/* 배송 정보 섹션 */}
          {showShippingInfo && (
            <div className="info-section">
              <div className="info-row">
                <span className="info-label" style={{ color: labelColor, fontSize: labelFontSize }}>
                  {utils.t('shipping_fee')}
                </span>
                <div className="info-value">
                  <span style={{ color: valueColor, fontSize: valueFontSize }}>
                    {shippingFee === 0 ? utils.t('free_shipping') : utils.formatCurrency(shippingFee)}
                  </span>
                  {totalPrice < freeShippingAmount && (
                    <span className="shipping-notice">
                      ({utils.formatCurrency(freeShippingAmount)} {utils.t('free_shipping_condition')})
                    </span>
                  )}
                  <InfoButton>
                    <div className="tooltip-content">
                      <h4>{utils.t('shipping_info')}</h4>
                      <p>{utils.t('domestic_shipping')}: {utils.formatCurrency(shippingFee)}</p>
                      <p>{utils.t('jeju_shipping')}: {utils.formatCurrency(shippingFee + additionalShippingFee.jeju)}</p>
                      <p>{utils.t('island_shipping')}: {utils.formatCurrency(shippingFee + additionalShippingFee.island)}</p>
                    </div>
                  </InfoButton>
                </div>
              </div>
            </div>
          )}

          {/* 수량 선택 섹션 */}
          {showQuantitySelector && (
            <div className="info-section quantity-section">
              <div className="quantity-selector-wrapper">
                <span className="product-name">{product.name}</span>
                <div className="quantity-price-row">
                  <Steppers
                    count={quantity}
                    setCount={handleQuantityChange}
                    min={1}
                    max={99}
                  />
                  <span className="item-price">{utils.formatCurrency(product.price)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 총 가격 */}
          {showTotalPrice && (
            <div className="total-price-section">
              <span className="total-label">
                {utils.t('total_price')} {quantity}{utils.t('items')}
              </span>
              <span
                className="total-price"
                style={{
                  fontSize: priceFontSize,
                  fontWeight: priceFontWeight,
                  color: priceColor
                }}
              >
                {utils.formatCurrency(totalPrice)}
              </span>
            </div>
          )}

          {/* 버튼 섹션 */}
          <div className={`button-section ${buttonLayout === 'vertical' ? 'button-vertical' : 'button-horizontal'}`}>
            {showAddToCartButton && (
              <button
                className="action-button secondary-button"
                onClick={handleAddToCart}
                style={{
                  backgroundColor: secondaryButtonBgColor,
                  color: secondaryButtonTextColor,
                  border: `1px solid ${secondaryButtonBorderColor}`,
                  padding: buttonPadding,
                  borderRadius: buttonBorderRadius,
                  fontSize: buttonFontSize,
                  '--hover-bg': secondaryButtonHoverBgColor
                } as React.CSSProperties}
              >
                {addToCartButtonText}
              </button>
            )}
            {showBuyNowButton && (
              <button
                className="action-button primary-button"
                onClick={handleBuyNow}
                style={{
                  backgroundColor: primaryButtonBgColor,
                  color: primaryButtonTextColor,
                  padding: buttonPadding,
                  borderRadius: buttonBorderRadius,
                  fontSize: buttonFontSize,
                  '--hover-bg': primaryButtonHoverBgColor
                } as React.CSSProperties}
              >
                {buyNowButtonText}
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
    </section>
  );
};

export default ProductInfoSkin;