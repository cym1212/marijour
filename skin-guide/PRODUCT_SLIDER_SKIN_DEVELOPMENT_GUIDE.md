# 상품 슬라이더 스킨 개발 가이드

이 가이드는 웹빌더의 상품 슬라이더 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 데이터 구조

### 상품 데이터 (ProductItem)

```typescript
interface ProductItem {
  id: number;
  title?: string;         // 상품명 (title 또는 name 사용)
  name?: string;          
  price?: number;         // 정가
  salePrice?: number;     // 할인가
  image?: string;         // 상품 이미지 URL
  thumbnail?: string;     // 썸네일 이미지 URL
  stock_count?: number;   // 재고 수량
  config?: {
    default_price?: number;      // 기본 가격
    discounted_price?: number;   // 할인 가격
    img_url?: string;           // 이미지 URL
    stock_count?: number;       // 재고 수량
  };
  [key: string]: any;     // 추가 커스텀 필드
}
```

## Props 인터페이스

실제 스킨이 받는 props는 SkinProps 인터페이스를 따릅니다:

```typescript
interface SkinProps {
  // 컴포넌트 로직에서 전달된 데이터
  data: {
    products: ProductItem[];      // 현재 슬라이드의 상품들
    allProducts: ProductItem[];   // 전체 상품 목록
    loading: boolean;
    currentSlide: number;
    totalSlides: number;
    isUserLoggedIn: boolean;
    isAdminMode: boolean;
    itemsPerSlide: number;
    showStock: boolean;
    theme: any;
  };
  
  // 컴포넌트 로직에서 전달된 액션들
  actions: {
    handleSlideChange: (slideIndex: number) => void;
    handlePrevSlide: () => void;
    handleNextSlide: () => void;
    handleAddToCart: (product: ProductItem) => void;
    handleProductClick: (product: ProductItem) => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    sliderTitle?: string;
    showTitle?: boolean;
    titleFontSize?: string;
    titleFontWeight?: string;
    titleColor?: string;
    showPrice?: boolean;
    showAddToCart?: boolean;
    showNavigation?: boolean;
    showPagination?: boolean;
    priceColor?: string;
    cartButtonColor?: string;
    navigationColor?: string;
    paginationColor?: string;
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
}
```

## 데이터 소스

상품 슬라이더는 두 가지 방식으로 데이터를 받습니다:

1. **Property Panel**: 에디터에서 설정한 UI 옵션값 (options 객체로 전달)
2. **API 응답**: Redux를 통해 받아온 상품 데이터 (data.products로 전달)

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MyProductSliderSkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils 
}) => {
  const { t } = utils;
  
  // 데이터 추출
  const { 
    products,
    loading,
    currentSlide,
    totalSlides
  } = data;
  
  // 옵션 추출
  const {
    sliderTitle,
    showTitle,
    showPrice,
    priceColor
  } = options;
  
  // 액션 사용
  const {
    handleNextSlide,
    handlePrevSlide,
    handleProductClick,
    handleAddToCart
  } = actions;
  
  if (loading) {
    return <div>{t('로딩 중...')}</div>;
  }
  
  return (
    <div>
      {showTitle && <h2>{sliderTitle}</h2>}
      
      <button onClick={handlePrevSlide}>이전</button>
      
      {products.map(product => (
        <div key={product.id} onClick={() => handleProductClick(product)}>
          <h3>{product.name || product.title}</h3>
          {showPrice && (
            <p style={{ color: priceColor }}>
              {product.price?.toLocaleString()}원
            </p>
          )}
          <button onClick={() => handleAddToCart(product)}>
            장바구니 담기
          </button>
        </div>
      ))}
      
      <button onClick={handleNextSlide}>다음</button>
    </div>
  );
};

export default MyProductSliderSkin;
```

## 상품 데이터 처리

상품 데이터는 config 필드와 일반 필드 모두를 지원해야 합니다:

```typescript
// 상품 정보 추출 (config 필드 우선)
const price = product.config?.default_price || product.price;
const salePrice = product.config?.discounted_price || product.salePrice;
const image = product.config?.img_url || product.image || product.thumbnail;
const stock = product.config?.stock_count ?? product.stock_count;
const name = product.title || product.name;
```

## 외부 스킨 개발 및 배포

### 1. UMD 번들 빌드 설정

외부 스킨은 UMD(Universal Module Definition) 형식으로 빌드되어야 합니다:

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'product-slider-skin.js',
    library: 'ProductSliderCustomSkin',  // 전역 변수명
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

#### 수동 등록 (Manual Registration)
```javascript
// 애플리케이션 초기화 시
import { registerComponentSkin } from '@withcookie/webbuilder-sdk';

registerComponentSkin({
  id: 'custom-product-slider',
  name: '커스텀 상품 슬라이더',
  componentTypes: ['product-slider'],  // 지원하는 컴포넌트 타입
  umdUrl: 'https://cdn.example.com/skins/product-slider-skin.js',
  globalName: 'ProductSliderCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/product-slider-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '모던한 디자인의 상품 슬라이더',
  version: '1.0.0',
  author: 'Your Name'
});
```

#### API 기반 자동 등록
위드쿠키 스킨 마켓플레이스에 등록하면 자동으로 사용 가능합니다.

### 3. 전역 변수 충돌 방지

API 기반 스킨의 경우 자동으로 전역 변수 충돌을 방지합니다:
- 각 스킨은 고유한 전역 변수명으로 로드됩니다
- 로드 후 원본 전역 변수는 자동으로 정리됩니다

