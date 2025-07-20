# 상품 목록 스킨 개발 가이드

이 가이드는 웹빌더의 상품 목록(ProductList) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 데이터 구조

### 상품 데이터 (Product)

```typescript
interface Product {
   id: number | string;
   title: string;                // 상품명
   description?: string;         // 상품 설명
   image?: string;              // 상품 이미지 URL
   imageTwo?: string;           // 두 번째 이미지 URL (호버 효과용)
   oldPrice: number;            // 이전 가격 (정가)
   newPrice: number;            // 현재 가격 (판매가)
   sale?: string;               // 할인 타입 (NEW, SALE 등)
   isInStock?: boolean;         // 재고 여부
   stockCount?: number;         // 재고 수량
   rating?: number;             // 평점 (1-5)
   companyId?: number;          // 회사 ID
   hasOptions?: boolean;        // 옵션이 있는 상품인지 여부
   config?: {
      default_price?: string | number;      // 기본 가격
      discounted_price?: string | number;   // 할인 가격
      system_price?: string | number;       // 시스템 가격
      stock_count?: string | number;        // 재고 수량
      [key: string]: any;                  // 기타 설정
   };

   // 호환성을 위한 추가 필드 (로직에서 자동 매핑)
   name?: string;              // title과 동일 (하위 호환성)
   price?: number;             // newPrice와 동일
   originalPrice?: number;     // oldPrice와 동일
   thumbnail?: string;         // image와 동일

   // API에서 올 수 있는 추가 필드
   created_at?: string;
   category_id?: string | number;
   variant_id?: string | number;
   stock?: number;            // stockCount와 유사
   [key: string]: any;
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
    
    // ProductListLogic에서 반환된 data 객체의 모든 필드가 직접 포함됨
    products: Product[];          // 현재 페이지의 상품들
    loading: boolean;             // 로딩 상태
    currentPage: number;          // 현재 페이지 번호
    totalPages: number;           // 전체 페이지 수
    totalProducts: number;        // 전체 상품 수
    selectedCategory: string | null;  // 선택된 카테고리
    searchQuery: string;              // 검색어
    sortBy: string;                   // 정렬 기준 (name, price, created, stock)
    sortOrder: string;                // 정렬 순서 (asc, desc)
    isUserLoggedIn: boolean;          // 로그인 여부
    isAdminMode: boolean;             // 관리자 모드 여부
    itemsPerRow: number;              // 한 줄당 상품 수
    showStock: boolean;               // 재고 표시 여부
    theme: Record<string, any>;       // 테마 설정
    
    // 모바일 관련 데이터
    isMobile: boolean;                // 모바일 여부
    mobileProducts: Product[];        // 모바일 무한스크롤용 상품 목록
    mobilePage: number;               // 모바일 현재 페이지
    isLoadingMore: boolean;           // 추가 로딩 중 여부
    loadMoreButtonRef: React.RefObject<HTMLButtonElement | null>;
    
    // ProductListLogic에서 반환된 기타 데이터
    [key: string]: any;
  };
  
  // ProductListLogic에서 반환된 액션들
  actions: {
    handleAddToCart: (product: Product) => Promise<void>;        // 장바구니 추가
    handleCategoryChange: (categoryId: string | null) => void;   // 카테고리 변경
    handleSearch: (query: string) => void;                       // 검색
    handleSortChange: (sortBy: string, sortOrder: string) => void; // 정렬 변경
    handlePageChange: (page: number) => void;                    // 페이지 변경
    handleLoadMore: () => Promise<void>;                        // 더보기 (모바일)
    handleProductClick: (product: Product) => void;             // 상품 클릭
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    order?: string;                           // 컬럼 순서
    lg?: number;                             // 그리드 크기 (1-12)
    className?: string;                       // CSS 클래스
    itemsPerRow?: number;                    // 한 줄당 상품 수
    categoryId?: string | number;            // 카테고리 ID
    excludeIndexes?: (string | number)[];    // 제외할 인덱스
    showStock?: boolean;                     // 재고 표시 여부
    include_product_ids?: (string | number)[];   // 포함할 상품 ID
    exclude_product_ids?: (string | number)[];   // 제외할 상품 ID
    include_category_ids?: (string | number)[];  // 포함할 카테고리 ID
    exclude_category_ids?: (string | number)[];  // 제외할 카테고리 ID
    itemsPerPage?: number;                   // 페이지당 아이템 수
    skin?: string;                           // 스킨 ID
    showPrice?: boolean;                     // 가격 표시 여부
    showAddToCart?: boolean;                 // 장바구니 버튼 표시 여부
    showPagination?: boolean;                // 페이지네이션 표시 여부
    sortBy?: string;                         // 기본 정렬 기준
    sortOrder?: string;                      // 기본 정렬 순서
    priceColor?: string;                     // 가격 색상
    cartButtonColor?: string;                // 장바구니 버튼 색상
    stockTextColor?: string;                 // 재고 텍스트 색상
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

## 데이터 접근 방법

### componentProps 접근

컴포넌트 설정값은 두 가지 방법으로 접근할 수 있습니다:

```typescript
// 방법 1: data.componentProps를 통한 접근
const componentProps = data.componentProps || {};
const itemsPerRow = componentProps.itemsPerRow || 4;

// 방법 2: options를 통한 접근 (ComponentSkinWrapper에서 병합된 값)
const itemsPerRow = options.itemsPerRow || 4;
```

### 로직 데이터 접근

ProductListLogic에서 반환된 데이터는 data 객체에 직접 병합되어 있습니다:

```typescript
// 상품 목록
const products = data.products || [];

// 로딩 상태
const loading = data.loading || false;

// 페이지 정보
const currentPage = data.currentPage || 1;
const totalPages = data.totalPages || 1;

// 모바일 관련
const isMobile = data.isMobile || false;
const mobileProducts = data.mobileProducts || [];
```

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MyProductListSkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app 
}) => {
  const { t, navigate } = utils;
  
  // 데이터 추출
  const products = data.products || [];
  const loading = data.loading || false;
  const currentPage = data.currentPage || 1;
  const totalPages = data.totalPages || 1;
  const isMobile = data.isMobile || false;
  const isLoadingMore = data.isLoadingMore || false;
  
  // 옵션 추출
  const itemsPerRow = options.itemsPerRow || 4;
  const showStock = options.showStock || false;
  const showPrice = options.showPrice !== false;
  const showAddToCart = options.showAddToCart !== false;
  
  // 사용자 상태
  const isUserLoggedIn = app?.isUserLoggedIn || false;
  
  // 액션 사용
  const {
    handleAddToCart,
    handlePageChange,
    handleSearch,
    handleSortChange,
    handleLoadMore,
    handleProductClick
  } = actions;
  
  if (loading) {
    return <div className="loading-spinner">{t('로딩 중...')}</div>;
  }
  
  return (
    <div className={options.className || 'padding-tb-40'}>
      {/* 검색 및 정렬 UI */}
      <div className="product-list-controls">
        <input 
          type="text" 
          placeholder={t('상품 검색...')}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split('-');
          handleSortChange(sortBy, sortOrder);
        }}>
          <option value="created-desc">{t('최신순')}</option>
          <option value="name-asc">{t('이름순')}</option>
          <option value="price-asc">{t('낮은 가격순')}</option>
          <option value="price-desc">{t('높은 가격순')}</option>
        </select>
      </div>
      
      {/* 상품 그리드 */}
      <div className="product-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className="product-item"
            onClick={() => handleProductClick(product)}
          >
            <img 
              src={product.image || product.thumbnail} 
              alt={product.title || product.name}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.png';
              }}
            />
            <h3>{product.title || product.name}</h3>
            
            {/* 가격 표시 */}
            {showPrice && (
              <>
                {product.oldPrice > product.newPrice && (
                  <span className="old-price">
                    {utils.formatCurrency(product.oldPrice)}
                  </span>
                )}
                <span className="price" style={{ color: options.priceColor }}>
                  {utils.formatCurrency(product.newPrice || product.price)}
                </span>
              </>
            )}
            
            {/* 재고 표시 */}
            {showStock && (
              <div className="stock-info" style={{ color: options.stockTextColor }}>
                {(product.stockCount || product.stock || 0) > 0 ? (
                  <span>{t('재고')}: {product.stockCount || product.stock}</span>
                ) : (
                  <span className="out-of-stock">{t('품절')}</span>
                )}
              </div>
            )}
            
            {/* 장바구니 버튼 */}
            {showAddToCart && isUserLoggedIn && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                disabled={(product.stockCount || product.stock || 0) === 0}
                style={{ backgroundColor: options.cartButtonColor }}
              >
                {product.hasOptions ? t('옵션 선택') : t('장바구니 담기')}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 (PC) */}
      {!isMobile && options.showPagination !== false && totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page}
            </button>
          ))}
        </div>
      )}
      
      {/* 더보기 버튼 (모바일) */}
      {isMobile && data.mobilePage < totalPages && (
        <button 
          ref={data.loadMoreButtonRef}
          onClick={handleLoadMore}
          disabled={isLoadingMore}
          className="load-more-button"
        >
          {isLoadingMore ? t('로딩 중...') : t('더보기')}
        </button>
      )}
    </div>
  );
};

export default MyProductListSkin;
```

## 상품 데이터 처리

상품 데이터는 여러 필드명을 지원하므로 호환성을 고려해야 합니다:

```typescript
// 상품 정보 추출 (다양한 필드명 지원)
const productName = product.title || product.name;
const productPrice = product.newPrice || product.price;
const originalPrice = product.oldPrice || product.originalPrice;
const productImage = product.image || product.thumbnail;
const stockCount = product.stockCount ?? product.stock ?? product.config?.stock_count;

// 할인율 계산
const discountRate = originalPrice > productPrice 
  ? Math.round((1 - productPrice / originalPrice) * 100)
  : 0;

// 옵션 상품 처리
if (product.hasOptions) {
  // 상세 페이지로 이동하여 옵션 선택
  handleProductClick(product);
} else {
  // 바로 장바구니에 추가
  handleAddToCart(product);
}
```

## 모바일 대응

ProductList는 PC와 모바일에서 다르게 동작합니다:

### PC 모드
- 페이지네이션 방식
- 한 번에 지정된 수의 상품만 표시
- 페이지 번호 클릭으로 이동

### 모바일 모드
- 무한 스크롤 방식
- 더보기 버튼 또는 자동 로드
- 기존 상품에 새 상품 추가

```typescript
// 모바일 여부에 따른 상품 목록 선택
const displayProducts = data.isMobile ? data.mobileProducts : data.products;

// 모바일 무한 스크롤 구현
{data.isMobile && data.mobilePage < data.totalPages && (
  <button 
    ref={data.loadMoreButtonRef}  // 자동 로드를 위한 ref
    onClick={actions.handleLoadMore}
    disabled={data.isLoadingMore}
  >
    {data.isLoadingMore ? '로딩 중...' : '더보기'}
  </button>
)}
```

## 반응형 그리드 레이아웃

Bootstrap 그리드 시스템을 활용한 반응형 레이아웃:

```typescript
import { Row, Col } from 'react-bootstrap';

// itemsPerRow에 따른 컬럼 크기 계산
const calculateXlValue = (items: number): number => {
  switch(items) {
    case 2: return 6;
    case 3: return 4;
    case 6: return 2;
    default: return 3; // 기본값 4개 (xl=3)
  }
};

const getColSize = (itemsPerRow: number) => {
  const xl = calculateXlValue(itemsPerRow);
  return {
    xl,
    lg: xl,
    md: itemsPerRow >= 4 ? 4 : 6,
    sm: 6,
    xs: 12
  };
};

<Row>
  {products.map(product => (
    <Col key={product.id} {...getColSize(options.itemsPerRow || 4)}>
      {/* 상품 아이템 */}
    </Col>
  ))}
</Row>
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
    filename: 'product-list-skin.js',
    library: 'ProductListCustomSkin',  // 전역 변수명
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-bootstrap': 'ReactBootstrap'  // Bootstrap 사용 시
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
  id: 'custom-product-list',
  name: '커스텀 상품 목록',
  componentTypes: ['product-list'],  // 지원하는 컴포넌트 타입
  umdUrl: 'https://cdn.example.com/skins/product-list-skin.js',
  globalName: 'ProductListCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/product-list-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '모던한 그리드 레이아웃의 상품 목록',
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

## 성능 최적화 팁

1. **이미지 최적화**
   - lazy loading 구현
   - 적절한 placeholder 이미지 사용
   - 이미지 에러 처리

2. **렌더링 최적화**
   - React.memo를 활용한 상품 아이템 메모이제이션
   - 가상 스크롤링 구현 (대량 상품 표시 시)

3. **모바일 최적화**
   - 터치 이벤트 최적화
   - 이미지 크기 조절
   - 무한 스크롤 시 메모리 관리

## 주의사항

1. **재고 관리**: showStock이 true일 때만 재고 정보를 표시
2. **인증 상태**: 장바구니 버튼은 로그인한 사용자에게만 표시
3. **에러 처리**: 이미지 로드 실패, API 오류 등을 적절히 처리
4. **다국어 지원**: utils.t() 함수를 사용하여 모든 텍스트 번역
5. **모바일 대응**: isMobile 플래그를 확인하여 적절한 UI 제공
6. **옵션 상품**: hasOptions가 true인 경우 상세 페이지로 이동
7. **데이터 병합**: ProductListLogic의 반환값은 data 객체에 직접 병합됨
8. **상품 클릭 처리**: handleProductClick을 사용하여 일관된 네비게이션 처리

## 상품 클릭 처리

### handleProductClick 액션

ProductList 컴포넌트는 상품 클릭 시 일관된 동작을 보장하기 위해 `handleProductClick` 액션을 제공합니다:

```typescript
// 상품 카드 클릭
<div 
  className="product-card" 
  onClick={() => actions.handleProductClick(product)}
>
  {/* 상품 내용 */}
</div>

// 또는 상품 이미지/제목 클릭
<a 
  href={`/products/${product.id}`}
  onClick={(e) => {
    e.preventDefault();
    actions.handleProductClick(product);
  }}
>
  <img src={product.image} alt={product.title} />
</a>
```

### handleProductClick의 주요 기능

1. **모바일 상태 저장**: 모바일에서 상품 목록의 스크롤 위치와 로드된 상품을 저장
2. **에디터 모드 감지**: 에디터 모드에서는 네비게이션을 막아 편집 중 이동 방지
3. **네비게이션 처리**: utils.navigate 또는 window.location.href를 통한 페이지 이동
4. **뒤로가기 최적화**: 모바일에서 뒤로가기 시 이전 상태 복원

### 구현 예제

```typescript
const MyProductListSkin: React.FC<SkinProps> = ({ data, actions, utils }) => {
  const { handleProductClick } = actions;
  
  return (
    <div className="product-list">
      {data.products.map(product => (
        <div 
          key={product.id}
          className="product-item"
          onClick={() => handleProductClick(product)}
          style={{ cursor: 'pointer' }}
        >
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <p>{utils.formatCurrency(product.price)}</p>
        </div>
      ))}
    </div>
  );
};
```

### 직접 네비게이션 vs handleProductClick

```typescript
// ❌ 권장하지 않음 - 직접 네비게이션
onClick={() => utils.navigate(`/products/${product.id}`)}

// ✅ 권장 - handleProductClick 사용
onClick={() => actions.handleProductClick(product)}
```

handleProductClick을 사용하면 다음과 같은 이점이 있습니다:
- 모바일 무한 스크롤 상태 자동 저장
- 에디터 모드에서 안전한 동작
- 향후 기능 추가 시 자동 적용