# 상품 상세 스킨 개발 가이드

이 가이드는 웹빌더의 상품 상세(ProductDetail) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 컴포넌트 개요

ProductDetail은 개별 상품의 상세 정보를 표시하는 이커머스 핵심 컴포넌트입니다. 이미지 갤러리, 옵션 선택, 수량 조절, 장바구니 추가, 바로 구매, 탭 기반 상세 정보 등의 기능을 제공합니다.

## 데이터 구조

### 상품 데이터 (Product)

```typescript
interface Product {
  id: number;                         // 상품 ID
  title?: string;                     // 상품 제목 (레거시)
  name?: string;                      // 상품명
  description?: string;               // 상품 설명 (HTML)
  price?: number;                     // 판매 가격
  oldPrice?: number;                  // 할인 전 가격
  discount?: string;                  // 할인율
  sku?: string;                       // 재고 관리 코드
  stock?: string | number;            // 재고 수량
  mainImage?: string;                 // 메인 이미지 URL (레거시)
  main_image?: string;                // 메인 이미지 URL
  additionalImages?: string[];        // 추가 이미지 URL 배열
  averageRating?: number;             // 평균 평점
  totalReviews?: number;              // 리뷰 총 개수
  recentReviews?: Review[];           // 최근 리뷰 목록
  companyId?: number;                 // 회사 ID
  categoryId?: number;                // 카테고리 ID
  category_id?: number;               // 카테고리 ID (레거시)
  config?: {                          // 추가 설정
    img_url?: string;                 // 이미지 URL
    main_image?: string;              // 메인 이미지 URL
    default_price?: number;           // 기본 가격
    discounted_price?: number;        // 할인 가격
    stock_count?: number;             // 재고 수량
    [key: string]: any;
  };
  tags?: string;                      // 태그 (쉼표 구분)
  features?: {                        // 특징/기능 목록
    label: string;
    value: string;
  }[];
  weights?: string[];                 // 무게 옵션
  relatedProducts?: {                 // 관련 상품
    id: number;
    title: string;
    image: string;
    rating?: number;
    newPrice?: number;
    oldPrice?: number;
  }[];
  optionGroups?: OptionGroup[];       // 옵션 그룹
  variants?: Variant[];               // 변형 상품
  specifications?: Record<string, any>; // 상품 사양
  images?: string[];                  // 이미지 배열 (갤러리용)
  options?: {                         // 간단한 옵션 (레거시)
    name: string;
    values: string[];
    required?: boolean;
  }[];
  [key: string]: any;
}
```

### 옵션 그룹 (OptionGroup)

```typescript
interface OptionGroup {
  id: number;
  productId: number;
  name: string;                       // 옵션명 (예: "색상", "사이즈")
  code: string;                       // 옵션 코드
  displayOrder: number;               // 표시 순서
  isRequired: boolean;                // 필수 선택 여부
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  optionValues?: OptionValue[];       // 옵션값 목록
}

interface OptionValue {
  id: number;
  optionGroupId: number;
  value: string;                      // 옵션값 (예: "빨강", "L")
  code: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
```

### 변형 상품 (Variant)

```typescript
interface Variant {
  id: number;
  productId: number;
  sku: string;                        // 변형 상품 코드
  barcode?: string | null;            // 바코드
  additionalPrice: string;            // 추가 가격
  additionalPv: string;               // 추가 포인트
  stock: number;                      // 재고
  reservedStock: number;              // 예약 재고
  safetyStock: number;                // 안전 재고
  isActive: boolean;                  // 활성화 여부
  isSellable: boolean;                // 판매 가능 여부
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  options: VariantOption[];           // 변형 옵션
}

interface VariantOption {
  variantId: number;
  optionValueId: number;
  optionValue: OptionValue & {
    optionGroup: OptionGroup;
  };
}
```

### 리뷰 (Review)

```typescript
interface Review {
  id?: number;
  userName?: string;                  // 작성자명
  rating?: number;                    // 평점 (1-5)
  content: string;                    // 리뷰 내용
  createdAt: string | Date;           // 작성일
}
```

## SkinProps 인터페이스

실제 스킨이 받는 props는 다음과 같은 구조입니다:

```typescript
interface SkinProps {
  // ComponentSkinWrapper에서 병합된 데이터
  data: {
    // 원본 컴포넌트 데이터
    id: string;
    type: string;
    props: Record<string, any>;
    componentProps?: Record<string, any>;
    style?: React.CSSProperties;
    
    // ProductDetailLogic에서 반환된 모든 필드가 직접 포함됨
    product: Product | null;              // 상품 정보
    selectedOptions: Record<string, string>; // 선택된 옵션 {옵션명: 옵션값}
    quantity: number;                     // 선택된 수량
    loading: boolean;                     // 로딩 상태
    activeTab: string;                    // 활성 탭 ('description' | 'specification' | 'reviews')
    mainImage: string;                    // 현재 표시 중인 메인 이미지
    relatedProducts: any[];               // 관련 상품 목록
    isUserLoggedIn: boolean;              // 사용자 로그인 상태
    isAdminMode: boolean;                 // 관리자 모드 여부
    theme: Record<string, any>;           // 테마 정보
    
    // 기타 데이터
    [key: string]: any;
  };
  
  // ProductDetailLogic에서 반환된 액션들
  actions: {
    handleOptionChange: (optionName: string, value: string) => void;  // 옵션 선택
    handleQuantityChange: (quantity: number) => void;                 // 수량 변경
    handleAddToCart: () => Promise<void>;                            // 장바구니 추가
    handleBuyNow: () => Promise<void>;                               // 바로 구매
    handleTabChange: (tab: string) => void;                          // 탭 변경
    handleImageChange: (image: string) => void;                      // 이미지 변경
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    // 프로퍼티 패널에서 설정 가능한 속성들
    productId?: number;                   // 상품 ID (URL 파라미터가 우선)
    order?: string;                       // 정렬 순서 ('' | 'order-last')
    none?: string;                        // 사이드바 표시 ('none' | 'block')
    lg?: number;                          // 메인 컨텐츠 너비 (12 | 9 | 8 | 6)
    showDescriptionTab?: boolean;         // 상품 설명 탭 표시 (기본값: true)
    showReviewsTab?: boolean;             // 리뷰 탭 표시 (기본값: true)
    showSpecificationTab?: boolean;       // 스펙 탭 표시 (기본값: true)
    showStock?: boolean;                  // 재고 표시 (기본값: false)
    
    // ProductDetailSkinnable의 defaultProps에서 정의된 추가 속성들
    showRelatedProducts?: boolean;        // 관련 상품 표시 (기본값: true)
    showQuantitySelector?: boolean;       // 수량 선택기 표시 (기본값: true)
    showAddToCart?: boolean;              // 장바구니 버튼 표시 (기본값: true)
    showBuyNow?: boolean;                 // 바로구매 버튼 표시 (기본값: true)
    addToCartButtonColor?: string;        // 장바구니 버튼 색상 (기본값: '#007bff')
    buyNowButtonColor?: string;           // 바로구매 버튼 색상 (기본값: '#28a745')
    priceColor?: string;                  // 가격 텍스트 색상 (기본값: '#ff6b6b')
    stockTextColor?: string;              // 재고 텍스트 색상 (기본값: '#28a745')
    
    // 디바이스별 속성 설정 (프로퍼티 패널의 디바이스 탭 사용 시)
    deviceProperty?: {
      pc?: Record<string, any>;           // PC 전용 속성
      mobile?: Record<string, any>;       // 모바일 전용 속성
    };
    
    style?: React.CSSProperties;          // 추가 스타일
    [key: string]: any;
  };
  
  // 렌더링 모드
  mode: 'editor' | 'preview' | 'production';
  
  // 유틸리티 함수들
  utils: {
    t: (key: string, params?: Record<string, any>) => string;  // 번역
    navigate: (path: string) => void;                          // 라우팅
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: string | Date, format?: string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: (string | undefined | null | false)[]) => string;
  };
  
  // 앱 전역 정보
  app?: {
    user?: any;                   // 사용자 정보
    company?: any;                // 회사 정보
    currentLanguage?: string;     // 현재 언어
    theme?: any;                  // 테마 정보
    isUserLoggedIn?: boolean;     // 로그인 여부
  };
  
  // 에디터 관련 정보 (에디터 모드에서만)
  editor?: {
    isSelected: boolean;         // 선택 상태
    onSelect: () => void;        // 선택 핸들러
    onEdit: () => void;          // 편집 핸들러
    onDelete: () => void;        // 삭제 핸들러
    dragHandleProps?: any;       // 드래그 핸들 props
  };
}
```

## 데이터 소스

ProductDetail 컴포넌트는 다음과 같은 방식으로 데이터를 받습니다:

1. **Product ID**: 프로퍼티 패널 설정 또는 URL 파라미터 (/product/:id)
2. **Redux State**: 상품 정보는 Redux store의 product.productItems에서 가져옵니다
3. **Property Panel**: 에디터에서 설정한 UI 옵션값 (options 객체로 전달)
4. **URL Parameters**: useParams()를 통해 상품 ID 추출
5. **Dummy Data**: 관리자 모드에서는 더미 데이터를 표시합니다

## 프로퍼티 패널 설정

웹빌더 에디터의 프로퍼티 패널에서 다음 속성들을 설정할 수 있습니다:

### 기본 설정
- **상품 ID**: 표시할 상품의 ID (URL 파라미터가 우선됨)

### 레이아웃 설정
- **정렬 순서**: 기본 또는 역순
- **사이드바 표시**: 사이드바 표시 여부
- **메인 컨텐츠 너비**: 전체 폭(12), 75%(9), 66%(8), 50%(6)

### 탭 설정
- **상품 설명 탭 표시**: 상품 설명 탭 표시 여부
- **리뷰 탭 표시**: 리뷰 탭 표시 여부
- **상품 스펙 탭 표시**: 사양 정보 탭 표시 여부

### 기타 설정
- **재고 표시**: 재고 수량 표시 여부

### 스타일 설정
- **여백**: padding 값
- **배경색**: 배경 색상
- **모서리 둥글기**: border-radius 값
- **테두리**: border 스타일
- **그림자**: box-shadow 효과

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MyProductDetailSkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  const { t, cx, formatCurrency, navigate } = utils;
  
  // 데이터 추출
  const { 
    product,
    selectedOptions,
    quantity,
    loading,
    activeTab,
    mainImage,
    relatedProducts,
    isUserLoggedIn,
    isAdminMode
  } = data;
  
  // 액션 추출
  const {
    handleOptionChange,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
    handleTabChange,
    handleImageChange
  } = actions;
  
  // 옵션 추출
  const {
    showDescriptionTab = true,
    showReviewsTab = true,
    showSpecificationTab = true,
    showStock = true,
    showRelatedProducts = true,
    showQuantitySelector = true,
    showAddToCart = true,
    showBuyNow = true,
    priceColor = '#ff6b6b',
    stockTextColor = '#28a745'
  } = options;
  
  // 로딩 상태
  if (loading && !product) {
    return (
      <div className={cx('product-detail-container', 'loading', options.className)}>
        <div className="spinner">{t('상품 정보를 불러오는 중...')}</div>
      </div>
    );
  }
  
  // 상품이 없는 경우
  if (!product && !isAdminMode) {
    return (
      <div className={cx('product-detail-container', 'empty', options.className)}>
        <p>{t('상품을 찾을 수 없습니다.')}</p>
      </div>
    );
  }
  
  return (
    <div className={cx('product-detail-container', options.className)}>
      <div className="product-main">
        {/* 이미지 갤러리 */}
        <div className="product-images">
          <div className="main-image">
            <img 
              src={mainImage} 
              alt={product?.name}
              onError={(e: any) => {
                e.target.src = '/images/product-placeholder.png';
              }}
            />
          </div>
          
          {/* 썸네일 */}
          {product?.images && product.images.length > 1 && (
            <div className="thumbnails">
              {product.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={cx('thumbnail', mainImage === image && 'active')}
                  onClick={() => handleImageChange(image)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* 상품 정보 */}
        <div className="product-info">
          <h1 className="product-title">{product?.name}</h1>
          
          {/* 가격 */}
          <div className="price-section">
            <span className="price" style={{ color: priceColor }}>
              {formatCurrency(product?.price || 0)}
            </span>
            {product?.oldPrice && (
              <span className="old-price">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
          </div>
          
          {/* 재고 */}
          {showStock && product?.stock !== undefined && (
            <div className="stock-info" style={{ color: stockTextColor }}>
              {product.stock > 0 
                ? t('재고: {{stock}}개', { stock: product.stock })
                : t('품절')
              }
            </div>
          )}
          
          {/* 옵션 선택 */}
          {product?.options && product.options.map((option: any) => (
            <div key={option.name} className="option-group">
              <label>
                {option.name}
                {option.required && <span className="required">*</span>}
              </label>
              <select
                value={selectedOptions[option.name] || ''}
                onChange={(e) => handleOptionChange(option.name, e.target.value)}
                required={option.required}
              >
                <option value="">{t('선택하세요')}</option>
                {option.values.map((value: string) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          ))}
          
          {/* 수량 선택 */}
          {showQuantitySelector && (
            <div className="quantity-selector">
              <label>{t('수량')}:</label>
              <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={product?.stock || 999}
              />
              <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
            </div>
          )}
          
          {/* 구매 버튼 */}
          <div className="action-buttons">
            {showAddToCart && (
              <button
                className="add-to-cart"
                onClick={handleAddToCart}
                disabled={loading || product?.stock === 0}
                style={{ backgroundColor: options.addToCartButtonColor }}
              >
                {loading ? t('처리중...') : t('장바구니 담기')}
              </button>
            )}
            {showBuyNow && (
              <button
                className="buy-now"
                onClick={handleBuyNow}
                disabled={loading || product?.stock === 0}
                style={{ backgroundColor: options.buyNowButtonColor }}
              >
                {loading ? t('처리중...') : t('바로 구매')}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 탭 콘텐츠 */}
      <ProductTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        product={product}
        showDescriptionTab={showDescriptionTab}
        showSpecificationTab={showSpecificationTab}
        showReviewsTab={showReviewsTab}
        t={t}
      />
      
      {/* 관련 상품 */}
      {showRelatedProducts && relatedProducts.length > 0 && (
        <RelatedProducts
          products={relatedProducts}
          navigate={navigate}
          formatCurrency={formatCurrency}
          priceColor={priceColor}
          t={t}
        />
      )}
    </div>
  );
};

// 탭 컴포넌트
const ProductTabs: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  product: any;
  showDescriptionTab: boolean;
  showSpecificationTab: boolean;
  showReviewsTab: boolean;
  t: (key: string) => string;
}> = ({ 
  activeTab, 
  onTabChange, 
  product, 
  showDescriptionTab, 
  showSpecificationTab, 
  showReviewsTab, 
  t 
}) => {
  return (
    <div className="product-tabs">
      <div className="tab-list">
        {showDescriptionTab && (
          <button
            className={cx('tab', activeTab === 'description' && 'active')}
            onClick={() => onTabChange('description')}
          >
            {t('상품 설명')}
          </button>
        )}
        {showSpecificationTab && (
          <button
            className={cx('tab', activeTab === 'specification' && 'active')}
            onClick={() => onTabChange('specification')}
          >
            {t('상품 정보')}
          </button>
        )}
        {showReviewsTab && (
          <button
            className={cx('tab', activeTab === 'reviews' && 'active')}
            onClick={() => onTabChange('reviews')}
          >
            {t('리뷰')}
          </button>
        )}
      </div>
      
      <div className="tab-content">
        {activeTab === 'description' && (
          <div className="description-content">
            {product?.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p>{t('상품 설명이 없습니다.')}</p>
            )}
          </div>
        )}
        
        {activeTab === 'specification' && (
          <div className="specification-content">
            {product?.specifications ? (
              <SpecificationTable specifications={product.specifications} />
            ) : (
              <p>{t('상품 정보가 없습니다.')}</p>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="reviews-content">
            {product?.recentReviews && product.recentReviews.length > 0 ? (
              <ReviewList reviews={product.recentReviews} t={t} />
            ) : (
              <p>{t('리뷰가 없습니다.')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProductDetailSkin;
```

## 이미지 갤러리 구현

### 기본 갤러리

```typescript
const ImageGallery: React.FC<{
  images: string[];
  mainImage: string;
  onImageChange: (image: string) => void;
  productName: string;
}> = ({ images, mainImage, onImageChange, productName }) => {
  const [zoomed, setZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };
  
  return (
    <div className="image-gallery">
      {/* 메인 이미지 */}
      <div 
        className={cx('main-image-container', zoomed && 'zoomed')}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img 
          src={mainImage}
          alt={productName}
          style={zoomed ? {
            transform: 'scale(2)',
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          } : {}}
        />
      </div>
      
      {/* 썸네일 목록 */}
      <div className="thumbnail-list">
        {images.map((image, index) => (
          <div
            key={index}
            className={cx('thumbnail', mainImage === image && 'active')}
            onClick={() => onImageChange(image)}
          >
            <img src={image} alt={`${productName} ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 고급 갤러리 (슬라이더)

```typescript
const AdvancedGallery: React.FC<{
  images: string[];
  mainImage: string;
  onImageChange: (image: string) => void;
}> = ({ images, mainImage, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(
    images.findIndex(img => img === mainImage) || 0
  );
  
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onImageChange(images[newIndex]);
  };
  
  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onImageChange(images[newIndex]);
  };
  
  return (
    <div className="advanced-gallery">
      <div className="gallery-main">
        <button className="nav-button prev" onClick={goToPrevious}>‹</button>
        <img src={images[currentIndex]} alt="Product" />
        <button className="nav-button next" onClick={goToNext}>›</button>
      </div>
      
      <div className="gallery-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={cx('indicator', index === currentIndex && 'active')}
            onClick={() => {
              setCurrentIndex(index);
              onImageChange(images[index]);
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

## 옵션 선택 시스템

### 변형 상품 기반 옵션

```typescript
// 변형 상품 기반 옵션 선택
const VariantOptions: React.FC<{
  product: any;
  selectedOptions: Record<string, string>;
  onOptionChange: (optionName: string, value: string) => void;
  t: (key: string) => string;
}> = ({ product, selectedOptions, onOptionChange, t }) => {
  // 선택된 옵션에 해당하는 변형 상품 찾기
  const selectedVariant = useMemo(() => {
    if (!product?.variants || !product?.optionGroups) return null;
    
    return product.variants.find((variant: any) => {
      return variant.options.every((variantOption: any) => {
        const optionGroup = variantOption.optionValue.optionGroup;
        return selectedOptions[optionGroup.name] === variantOption.optionValue.value;
      });
    });
  }, [product, selectedOptions]);
  
  // 선택 가능한 옵션값 필터링
  const getAvailableOptions = (optionGroupName: string) => {
    if (!product?.variants) return [];
    
    const availableValues = new Set<string>();
    
    product.variants.forEach((variant: any) => {
      // 다른 옵션들이 현재 선택과 일치하는지 확인
      const otherOptionsMatch = variant.options.every((opt: any) => {
        const groupName = opt.optionValue.optionGroup.name;
        if (groupName === optionGroupName) return true;
        return !selectedOptions[groupName] || 
               selectedOptions[groupName] === opt.optionValue.value;
      });
      
      if (otherOptionsMatch && variant.isSellable && variant.stock > 0) {
        const option = variant.options.find(
          (opt: any) => opt.optionValue.optionGroup.name === optionGroupName
        );
        if (option) {
          availableValues.add(option.optionValue.value);
        }
      }
    });
    
    return Array.from(availableValues);
  };
  
  return (
    <div className="variant-options">
      {product?.optionGroups?.map((group: any) => {
        const availableValues = getAvailableOptions(group.name);
        
        return (
          <div key={group.id} className="option-group">
            <label>
              {group.name}
              {group.isRequired && <span className="required">*</span>}
            </label>
            
            <div className="option-values">
              {group.optionValues?.map((optionValue: any) => {
                const isAvailable = availableValues.includes(optionValue.value);
                const isSelected = selectedOptions[group.name] === optionValue.value;
                
                return (
                  <button
                    key={optionValue.id}
                    className={cx(
                      'option-button',
                      isSelected && 'selected',
                      !isAvailable && 'disabled'
                    )}
                    onClick={() => onOptionChange(group.name, optionValue.value)}
                    disabled={!isAvailable}
                  >
                    {optionValue.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* 선택된 변형 상품 정보 */}
      {selectedVariant && (
        <div className="selected-variant-info">
          {selectedVariant.additionalPrice && parseFloat(selectedVariant.additionalPrice) > 0 && (
            <p className="additional-price">
              {t('추가 금액')}: +{formatCurrency(parseFloat(selectedVariant.additionalPrice))}
            </p>
          )}
          <p className="variant-stock">
            {t('재고')}: {selectedVariant.stock}개
          </p>
        </div>
      )}
    </div>
  );
};
```

## 가격 계산 및 표시

### 동적 가격 계산

```typescript
// 가격 계산 훅
const useProductPrice = (product: any, selectedVariant: any) => {
  const basePrice = product?.price || product?.config?.default_price || 0;
  const discountedPrice = product?.config?.discounted_price;
  const additionalPrice = selectedVariant?.additionalPrice 
    ? parseFloat(selectedVariant.additionalPrice) 
    : 0;
  
  const finalPrice = (discountedPrice || basePrice) + additionalPrice;
  const discountRate = basePrice > 0 && discountedPrice 
    ? Math.round((1 - discountedPrice / basePrice) * 100)
    : 0;
  
  return {
    basePrice,
    discountedPrice,
    additionalPrice,
    finalPrice,
    discountRate
  };
};

// 가격 표시 컴포넌트
const PriceDisplay: React.FC<{
  product: any;
  selectedVariant: any;
  formatCurrency: (price: number) => string;
  priceColor: string;
}> = ({ product, selectedVariant, formatCurrency, priceColor }) => {
  const { basePrice, finalPrice, discountRate, additionalPrice } = 
    useProductPrice(product, selectedVariant);
  
  return (
    <div className="price-display">
      {discountRate > 0 && (
        <div className="discount-badge">{discountRate}% OFF</div>
      )}
      
      <div className="price-row">
        {discountRate > 0 && (
          <span className="original-price">
            {formatCurrency(basePrice)}
          </span>
        )}
        <span className="final-price" style={{ color: priceColor }}>
          {formatCurrency(finalPrice)}
        </span>
      </div>
      
      {additionalPrice > 0 && (
        <div className="additional-price-info">
          ({t('기본가')} {formatCurrency(finalPrice - additionalPrice)} 
          + {t('옵션')} {formatCurrency(additionalPrice)})
        </div>
      )}
    </div>
  );
};
```

## 리뷰 시스템

### 리뷰 목록 표시

```typescript
const ReviewList: React.FC<{
  reviews: Review[];
  t: (key: string) => string;
}> = ({ reviews, t }) => {
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortBy === 'recent') {
      sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return sorted;
  }, [reviews, sortBy]);
  
  return (
    <div className="review-list">
      <div className="review-header">
        <h3>{t('고객 리뷰')}</h3>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="recent">{t('최신순')}</option>
          <option value="rating">{t('평점순')}</option>
        </select>
      </div>
      
      {sortedReviews.map((review, index) => (
        <div key={review.id || index} className="review-item">
          <div className="review-meta">
            <span className="reviewer-name">{review.userName || t('익명')}</span>
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={i < (review.rating || 0) ? 'star filled' : 'star'}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="review-date">
              {formatDate(review.createdAt)}
            </span>
          </div>
          <div className="review-content">
            {review.content}
          </div>
        </div>
      ))}
    </div>
  );
};
```

## 반응형 디자인

### 모바일 최적화

```css
/* 모바일 상품 상세 */
@media (max-width: 768px) {
  .product-detail-container {
    padding: 16px;
  }
  
  .product-main {
    flex-direction: column;
  }
  
  .product-images {
    width: 100%;
    margin-bottom: 24px;
  }
  
  .thumbnails {
    display: flex;
    overflow-x: auto;
    gap: 8px;
    padding: 8px 0;
    -webkit-overflow-scrolling: touch;
  }
  
  .thumbnail {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
  }
  
  .option-values {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .action-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: 16px;
    z-index: 1000;
    display: flex;
    gap: 8px;
  }
  
  .action-buttons button {
    flex: 1;
    padding: 16px;
    font-size: 16px;
  }
  
  .related-products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
```

## 성능 최적화

### 이미지 최적화

```typescript
// 지연 로딩 이미지 컴포넌트
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onError?: (e: any) => void;
}> = ({ src, alt, className, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && imgRef.current) {
          imgRef.current.src = src;
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  return (
    <div className={cx('lazy-image-container', className)}>
      {isLoading && <div className="image-skeleton" />}
      <img
        ref={imgRef}
        alt={alt}
        className={cx('lazy-image', !isLoading && 'loaded')}
        onLoad={() => setIsLoading(false)}
        onError={(e) => {
          setIsLoading(false);
          setHasError(true);
          onError?.(e);
        }}
      />
    </div>
  );
};
```

### 메모이제이션

```typescript
// 관련 상품 컴포넌트 메모이제이션
const RelatedProducts = React.memo<{
  products: any[];
  navigate: (path: string) => void;
  formatCurrency: (price: number) => string;
  priceColor: string;
  t: (key: string) => string;
}>(({ products, navigate, formatCurrency, priceColor, t }) => {
  return (
    <div className="related-products">
      <h2>{t('관련 상품')}</h2>
      <div className="related-products-grid">
        {products.map((product) => (
          <RelatedProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/product/${product.id}`)}
            formatCurrency={formatCurrency}
            priceColor={priceColor}
          />
        ))}
      </div>
    </div>
  );
});

// 개별 관련 상품 카드 메모이제이션
const RelatedProductCard = React.memo<{
  product: any;
  onClick: () => void;
  formatCurrency: (price: number) => string;
  priceColor: string;
}>(({ product, onClick, formatCurrency, priceColor }) => {
  return (
    <div className="related-product-card" onClick={onClick}>
      <LazyImage
        src={product.image || '/images/product-placeholder.png'}
        alt={product.title || product.name}
        className="related-product-image"
      />
      <div className="related-product-info">
        <h4>{product.title || product.name}</h4>
        <div className="price" style={{ color: priceColor }}>
          {formatCurrency(product.newPrice || product.price)}
        </div>
      </div>
    </div>
  );
});
```

## 접근성 고려사항

```typescript
// 접근성 향상 컴포넌트
const AccessibleProductDetail = () => (
  <div role="main" aria-label={t('상품 상세 정보')}>
    <h1 id="product-title">{product?.name}</h1>
    
    {/* 이미지 갤러리 */}
    <div role="region" aria-label={t('상품 이미지')}>
      <img 
        src={mainImage} 
        alt={product?.name}
        aria-describedby="image-description"
      />
      <span id="image-description" className="sr-only">
        {t('{{count}}개의 이미지 중 {{current}}번째 이미지', {
          count: product?.images?.length || 1,
          current: currentImageIndex + 1
        })}
      </span>
    </div>
    
    {/* 가격 정보 */}
    <div role="region" aria-label={t('가격 정보')}>
      <span aria-live="polite" aria-atomic="true">
        {t('현재 가격 {{price}}', { price: formatCurrency(finalPrice) })}
      </span>
    </div>
    
    {/* 옵션 선택 */}
    <fieldset>
      <legend>{t('상품 옵션 선택')}</legend>
      {/* 옵션 컨트롤들 */}
    </fieldset>
    
    {/* 액션 버튼 */}
    <div role="group" aria-label={t('구매 옵션')}>
      <button
        aria-label={t('장바구니에 {{product}} 추가', { product: product?.name })}
        disabled={!canAddToCart}
      >
        {t('장바구니 담기')}
      </button>
    </div>
  </div>
);
```

## 외부 스킨 개발 및 배포

### 1. UMD 번들 빌드 설정

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'product-detail-skin.js',
    library: 'ProductDetailCustomSkin',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  // ... 기타 설정
};
```

### 2. 스킨 등록 방법

#### 수동 등록
```javascript
import { registerComponentSkin } from '@withcookie/webbuilder-sdk';

registerComponentSkin({
  id: 'custom-product-detail',
  name: '커스텀 상품 상세',
  componentTypes: ['product-detail'],
  umdUrl: 'https://cdn.example.com/skins/product-detail-skin.js',
  globalName: 'ProductDetailCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/product-detail-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '모던한 디자인의 상품 상세 페이지',
  version: '1.0.0',
  author: 'Your Name'
});
```

#### API 기반 자동 등록
위드쿠키 스킨 마켓플레이스에 등록하면 자동으로 사용 가능합니다.

## 데이터 흐름

### 상품 ID 결정 우선순위

```typescript
// ProductDetailLogic.ts에서의 상품 ID 결정 로직
const productId = props.componentProps?.productId || // 1. 프로퍼티 패널 설정
                  params.productId ||                 // 2. URL 파라미터 (:productId)
                  params.id;                          // 3. URL 파라미터 (:id)
```

### 상품 데이터 로딩

1. Redux store의 product.productItems에서 상품 검색
2. 같은 카테고리의 관련 상품 자동 필터링 (최대 4개)
3. 관리자 모드에서는 더미 데이터 자동 생성

## 주의사항

1. **상품 ID**: URL 파라미터가 프로퍼티 패널 설정보다 우선됩니다
2. **옵션 검증**: required 옵션은 장바구니 추가 전 검증됩니다
3. **재고 체크**: 수량 변경 시 재고를 초과할 수 없습니다
4. **이미지 처리**: 이미지 로드 실패 시 placeholder 이미지로 대체됩니다
5. **가격 계산**: 변형 상품의 추가 가격이 자동으로 계산됩니다
6. **비동기 처리**: 모든 액션은 Promise를 반환하므로 로딩 상태를 표시하세요
7. **관리자 모드**: 에디터에서는 더미 데이터가 표시됩니다
8. **디바이스별 속성**: deviceProperty를 통해 PC/모바일 다른 설정 가능

## 액션 상세 설명

### handleOptionChange
- **용도**: 상품 옵션 선택
- **매개변수**: `optionName: string`, `value: string`
- **동작**: 선택된 옵션을 로컬 상태에 저장

### handleQuantityChange
- **용도**: 구매 수량 변경
- **매개변수**: `quantity: number`
- **동작**: 재고 확인 후 수량 업데이트

### handleAddToCart
- **용도**: 장바구니에 상품 추가
- **반환**: `Promise<void>`
- **동작**: 옵션 검증 후 Redux에 상품 추가

### handleBuyNow
- **용도**: 바로 구매 (장바구니 추가 후 결제 페이지 이동)
- **반환**: `Promise<void>`
- **동작**: 장바구니 추가 후 /checkout으로 이동

### handleTabChange
- **용도**: 탭 전환
- **매개변수**: `tab: string` ('description' | 'specification' | 'reviews')
- **동작**: 활성 탭 변경

### handleImageChange
- **용도**: 메인 이미지 변경
- **매개변수**: `image: string`
- **동작**: 갤러리의 메인 이미지 변경

## 스타일링 팁

### CSS 구조
```css
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.product-images {
  position: sticky;
  top: 20px;
}

.main-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.thumbnail.active {
  border-color: #333;
}

.option-button {
  padding: 12px 24px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.option-button.selected {
  border-color: #333;
  background: #333;
  color: white;
}

.option-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 중요 참고사항

### 이미지 필드 우선순위
메인 이미지는 다음 순서로 결정됩니다:
1. `product?.config?.img_url`
2. `product?.config?.main_image`
3. `product?.mainImage`
4. 기본값: `/images/product-placeholder.png`

추가 이미지 배열: `product?.additionalImages || []`

전체 이미지 배열(allImages)은 메인 이미지와 추가 이미지들을 합친 배열입니다.