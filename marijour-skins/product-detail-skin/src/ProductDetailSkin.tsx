import React, { useEffect, useState, useRef } from 'react';
import { ProductDetailSkinProps } from './types';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfo } from './components/ProductInfo';
import { ProductTabs } from './components/ProductTabs';
import { ReviewSection } from './components/ReviewSection';
import { RelatedProducts } from './components/RelatedProducts';
import { PurchaseBar } from './components/PurchaseBar';
import './product-detail-skin.scss';

const ProductDetailSkin: React.FC<ProductDetailSkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  const [showPurchaseBar, setShowPurchaseBar] = useState(false);
  const productInfoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 유틸리티 함수
  const { t, cx, navigate, formatCurrency, formatDate, getAssetUrl } = utils || {};
  
  // 상품 상세 로직에서 제공하는 데이터
  const { 
    product,           // 상품 정보 객체
    selectedOptions,   // 선택된 옵션들
    quantity,          // 선택된 수량
    loading,           // 로딩 상태
    activeTab,         // 현재 활성 탭
    mainImage,         // 메인 이미지 URL
    relatedProducts,   // 관련 상품 배열
    isUserLoggedIn,    // 사용자 로그인 여부
    isAdminMode,       // 관리자/에디터 모드 여부
    theme              // 테마 정보
  } = data || {};
  
  // 상품 상세 로직에서 제공하는 액션
  const {
    handleOptionChange,    // 옵션 변경 핸들러
    handleQuantityChange,  // 수량 변경 핸들러
    handleAddToCart,       // 장바구니 추가 핸들러
    handleBuyNow,          // 바로 구매 핸들러
    handleTabChange,       // 탭 변경 핸들러
    handleImageChange      // 이미지 변경 핸들러
  } = actions || {};
  
  // 사용자가 설정한 옵션
  const {
    showDescriptionTab = true,
    showReviewsTab = true,
    showSpecificationTab = true,
    showStock = true,
    showRelatedProducts = true,
    showQuantitySelector = true,
    showAddToCart = true,
    showBuyNow = true,
    addToCartButtonColor = '#007bff',
    buyNowButtonColor = '#28a745',
    priceColor = '#ff6b6b',
    stockTextColor = '#28a745',
    order = '',
    none = 'none',
    lg = '9'
  } = options || {};

  // 기존 데이터 구조와 호환성을 위한 매핑
  const tabs = [
    { id: 'detail', label: '상품상세' },
    { id: 'review', label: '리뷰' },
    { id: 'qna', label: 'Q&A' },
    { id: 'shipping', label: '배송/교환/반품' }
  ];
  
  const enablePurchaseBar = showAddToCart || showBuyNow;
  const showReviews = showReviewsTab;
  const reviews = data?.reviews || [];

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  // Purchase Bar 스크롤 감지
  useEffect(() => {
    if (!enablePurchaseBar || !productInfoRef.current) return;

    const handleScroll = () => {
      const productInfoBottom = productInfoRef.current?.getBoundingClientRect().bottom || 0;
      setShowPurchaseBar(productInfoBottom < 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enablePurchaseBar]);

  const handleAddToCartClick = () => {
    if (handleAddToCart) {
      handleAddToCart();
    } else {
      console.log('Add to cart clicked');
    }
  };

  const handleBuyNowClick = () => {
    if (handleBuyNow) {
      handleBuyNow();
    } else if (navigate) {
      navigate('/order');
    }
  };

  const handleProductClick = (link: string) => {
    if (navigate) {
      navigate(link);
    }
  };

  // 로딩 상태
  if (loading && !product) {
    return (
      <div className="product-detail-skin">
        <div className="product-detail-container">
          <div className="loading-state">
            {t ? t('상품 정보를 불러오는 중...') : '상품 정보를 불러오는 중...'}
          </div>
        </div>
      </div>
    );
  }

  // 상품이 없는 경우
  if (!product && !isAdminMode) {
    return (
      <div className="product-detail-skin">
        <div className="product-detail-container">
          <div className="error-state">
            {t ? t('상품을 찾을 수 없습니다.') : '상품을 찾을 수 없습니다.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-skin" ref={containerRef}>
      <div className="product-detail-container">
        <div className="product-main">
          <div className="product-gallery-section">
            <ProductGallery 
              images={product?.images || []} 
              productName={product?.name || ''}
              mainImage={mainImage}
              onImageChange={handleImageChange}
            />
          </div>
          
          <div className="product-info-section" ref={productInfoRef}>
            <ProductInfo
              product={product}
              selectedOptions={selectedOptions}
              quantity={quantity}
              onAddToCart={handleAddToCartClick}
              onBuyNow={handleBuyNowClick}
              onOptionChange={handleOptionChange}
              onQuantityChange={handleQuantityChange}
              showStock={showStock}
              showQuantitySelector={showQuantitySelector}
              showAddToCart={showAddToCart}
              showBuyNow={showBuyNow}
              addToCartButtonColor={addToCartButtonColor}
              buyNowButtonColor={buyNowButtonColor}
              priceColor={priceColor}
              stockTextColor={stockTextColor}
              formatCurrency={formatCurrency}
              t={t}
            />
          </div>
        </div>

        <div className="product-content">
          {showDescriptionTab && (
            <ProductTabs 
              tabs={tabs}
              activeTab={activeTab}
              detailImageUrl={product?.detailImageUrl}
              onTabChange={handleTabChange}
              showDescriptionTab={showDescriptionTab}
              showReviewsTab={showReviewsTab}
              showSpecificationTab={showSpecificationTab}
              t={t}
            />
          )}
          
          {showReviews && reviews.length > 0 && (
            <ReviewSection
              reviews={reviews}
              rating={product?.rating}
              reviewCount={product?.reviewCount}
              t={t}
            />
          )}
          
          {showRelatedProducts && relatedProducts && relatedProducts.length > 0 && (
            <RelatedProducts
              products={relatedProducts}
              onProductClick={handleProductClick}
              formatCurrency={formatCurrency}
              t={t}
            />
          )}
        </div>
      </div>

      {enablePurchaseBar && (
        <PurchaseBar
          product={product}
          isVisible={showPurchaseBar}
          onAddToCart={handleAddToCartClick}
          onBuyNow={handleBuyNowClick}
          showAddToCart={showAddToCart}
          showBuyNow={showBuyNow}
          addToCartButtonColor={addToCartButtonColor}
          buyNowButtonColor={buyNowButtonColor}
          t={t}
        />
      )}
    </div>
  );
};

// UMD 내보내기 (필수)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductDetailSkin;
} else {
  (window as any).ProductDetailSkin = ProductDetailSkin;
}

export default ProductDetailSkin;