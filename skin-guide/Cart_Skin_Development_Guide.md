# 장바구니 스킨 개발 가이드

이 가이드는 웹빌더의 장바구니(Cart) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 컴포넌트 개요

Cart는 사용자가 선택한 상품들을 관리하고 결제 전 최종 확인을 하는 이커머스 핵심 컴포넌트입니다. 수량 조절, 상품 삭제, 직급별 가격 계산, 배송비 계산 등의 기능을 제공합니다.

## 데이터 구조

### 장바구니 아이템 (CartItem)

```typescript
interface CartItem {
    id: number;                      // 장바구니 아이템 ID
    count: number;                   // 수량
    productId: number;               // 상품 ID
    variantId?: number | null;       // 상품 옵션 ID
    variant?: CartVariant | null;    // 상품 옵션 정보
    options?: Record<string, any> | null;  // 추가 옵션
    product: {                      // 상품 정보
        id: number;
        title: string;                 // 상품명
        config?: {
            img_url?: string;            // 상품 이미지 URL
            default_price?: number;      // 기본 가격
            discounted_price?: number;   // 할인 가격
            stock_count?: number;        // 재고 수량
            [key: string]: any;
        };
        optionJson?: {                 // 직급별 가격 등 추가 정보
            level2_price?: Record<string, number>;
            [key: string]: any;
        };
        [key: string]: any;
    };
}
```

### 장바구니 옵션 (CartVariant)

```typescript
interface CartVariant {
    id: number;
    productId: number;
    sku: string;                     // 재고 관리 코드
    barcode?: string | null;         // 바코드
    additionalPrice: string;         // 추가 가격
    additionalPv: string;            // 추가 포인트
    stock: number;                   // 옵션별 재고
    options?: Array<{                // 옵션 정보
        variantId: number;
        optionValueId: number;
        optionValue: {
            id: number;
            value: string;               // 옵션값 (예: "빨강", "L")
            optionGroup: {
                id: number;
                name: string;              // 옵션명 (예: "색상", "사이즈")
            };
        };
    }>;
}
```

### 가격 계산 정보 (Calculations)

```typescript
interface Calculations {
    subtotal: number;                // 상품 합계
    shippingFee: number;             // 배송비
    total: number;                   // 총 결제 금액
}
```

### 직급별 가격 정보 (PriceInfo)

```typescript
interface PriceInfo {
    originalPrice: number;           // 원래 가격
    levelPrice: number;              // 직급 할인 적용 가격
    discount: number;                // 할인 금액
    discountRate: number;            // 할인율 (%)
    levelName: string | null;        // 직급명
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

        // CartLogic에서 반환된 데이터
        cartItems: CartItem[];            // 장바구니 아이템 목록
        loading: boolean;                 // 로딩 상태
        error?: any;                      // 에러 정보
        localQuantities: Record<number, number>;  // 로컬 수량 상태
        calculations: Calculations;       // 가격 계산 정보
        isUserLoggedIn: boolean;          // 사용자 로그인 상태
        isAdminLoggedIn: boolean;         // 관리자 로그인 상태
        withcookieData?: any;             // 위드쿠키 전역 데이터
        userInfo?: any;                   // 사용자 정보
        freeShippingLimit: number;        // 무료배송 기준 금액
        title: string;                    // 장바구니 제목
        emptyText: string;                // 빈 장바구니 메시지
        shippingFee: number;              // 기본 배송비
        showStock: boolean;               // 재고 표시 여부
        theme: Record<string, any>;       // 테마 정보

        // 기타 데이터
        [key: string]: any;
    };

    // CartLogic에서 반환된 액션들
    actions: {
        handleIncreaseQuantity: (item: any) => void;              // 수량 1 증가
        handleDecreaseQuantity: (item: any) => void;              // 수량 1 감소
        handleRemoveFromCart: (cartItemId: number) => Promise<void>;  // 아이템 삭제
        handleCheckout: () => void;                               // 결제 진행
        handleClearCart: () => Promise<void>;                     // 장바구니 비우기
        calculateLevelPrice: (basePrice: number, product: any) => PriceInfo;  // 직급별 가격 계산
        calculateTotalPrice: () => number;                        // 상품 합계 계산
        calculateGrandTotal: () => number;                        // 총 합계 계산
    };

    // 프로퍼티 패널에서 설정한 옵션들
    options: {
        // 기본 속성들
        title?: string;                       // 제목 (기본값: '장바구니')
        emptyText?: string;                   // 빈 장바구니 메시지 (기본값: '장바구니가 비어 있습니다.')
        shippingFee?: number;                 // 배송비 (기본값: 4000)
        showStock?: boolean;                  // 재고 표시 여부 (기본값: false)

        // 스타일 관련 속성들
        primaryButtonColor?: string;          // 기본 버튼 색상 (기본값: '#007bff')
        secondaryButtonColor?: string;        // 보조 버튼 색상 (기본값: '#6c757d')
        dangerButtonColor?: string;           // 위험 작업 버튼 색상 (기본값: '#dc3545')
        priceColor?: string;                  // 가격 텍스트 색상 (기본값: '#ff6b6b')
        summaryBackgroundColor?: string;      // 요약 박스 배경색 (기본값: '#f8f9fa')

        style?: React.CSSProperties;          // 추가 스타일
        className?: string;                   // CSS 클래스
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

## 액션 기반 아키텍처

Cart 컴포넌트는 **액션 기반 아키텍처**를 사용합니다:

```
외부 스킨 → 액션 호출 → 웹빌더 CartLogic → Redux/API 연동 → 응답 → 외부 스킨
```

### 데이터 흐름

1. **CartLogic Hook**: 웹빌더의 `useCartLogic`에서 데이터와 액션을 제공
2. **Redux Integration**: 장바구니 상태는 Redux store에서 관리
3. **Local State**: 수량 변경은 즉시 반응을 위해 로컬 상태 사용
4. **Action Handlers**: 모든 사용자 인터랙션은 액션을 통해 처리
5. **Property Panel**: 에디터에서 설정한 UI 옵션값 (options 객체로 전달)

### 외부 스킨의 역할

- **UI 렌더링**: 전달받은 데이터를 사용하여 UI 구성
- **액션 호출**: 사용자 인터랙션 시 제공된 액션 함수 호출
- **옵션 활용**: 프로퍼티 패널 설정값을 사용하여 UI 커스터마이징

> ⚠️ **중요**: 외부 스킨에서 직접 API 호출하거나 Redux 상태를 변경하지 마세요. 모든 데이터 조작은 액션을 통해 수행됩니다.

## 프로퍼티 패널 설정

웹빌더 에디터의 프로퍼티 패널에서 다음 속성들을 설정할 수 있습니다:

### 기본 설정
- **타이틀**: 장바구니 페이지 제목
- **빈 장바구니 메시지**: 장바구니가 비어 있을 때 표시할 메시지
- **배송비**: 기본 배송비 금액 (원 단위)
- **재고 정보 표시**: 각 상품의 재고 수량 표시 여부

### 스타일 설정
- **기본 버튼 색상**: 결제하기 등 주요 버튼 색상
- **보조 버튼 색상**: 쇼핑 계속하기 등 보조 버튼 색상
- **삭제 버튼 색상**: 상품 삭제 등 위험 작업 버튼 색상
- **가격 텍스트 색상**: 가격 표시 색상
- **요약 박스 배경색**: 주문 요약 섹션 배경색

## 올바른 Props 사용법

### ✅ 올바른 Props 구조

```typescript
const MyCartSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor
}) => {
  // ✅ 올바른 data 추출
  const { 
    cartItems = [],           // 장바구니 아이템 배열
    loading = false,
    error = null,
    localQuantities = {},     // 로컬 수량 상태
    calculations = {
      subtotal: 0,
      shippingFee: 0,      
      total: 0             
    },
    isUserLoggedIn = false,
    isAdminLoggedIn = false,
    freeShippingLimit = 50000,
    title = '장바구니',
    emptyText = '장바구니가 비어 있습니다.',
    shippingFee = 4000,
    showStock = false
  } = data || {};
  
  // ✅ 올바른 actions 추출
  const {
    handleIncreaseQuantity = () => {},
    handleDecreaseQuantity = () => {},
    handleRemoveFromCart = () => {},
    handleCheckout = () => {},
    handleClearCart = () => {},
    calculateLevelPrice = () => ({}),
    calculateTotalPrice = () => 0,
    calculateGrandTotal = () => 0
  } = actions || {};
  
  // ✅ 올바른 options 추출
  const {
    primaryButtonColor = '#007bff',
    dangerButtonColor = '#dc3545',
    priceColor = '#ff6b6b'
  } = options || {};
}
```

### ❌ 외부 개발자가 자주 하는 실수들

```typescript
// ❌ 잘못된 props 구조
const MyCartSkin = (props) => {
  const cartItems = props.cartItems;     // 틀림 - data.cartItems여야 함
  const handleClick = props.onClick;     // 틀림 - actions에서 추출해야 함
}

// ❌ 잘못된 data 필드명
const { 
  items,              // ❌ cartItems여야 함
  selectedItems,      // ❌ 존재하지 않음
  couponCode,        // ❌ 쿠폰 기능 없음
  quantity,          // ❌ item.count를 사용해야 함
  user               // ❌ userInfo를 사용해야 함
} = data;

// ❌ 잘못된 액션 호출
handleQuantityChange(itemId, 5)    // ❌ 이 함수는 존재하지 않음
handleToggleSelect()               // ❌ 선택 기능 없음
handleIncreaseQuantity(itemId)     // ❌ item 객체 전체를 전달해야 함
handleDecreaseQuantity(itemId)     // ❌ item 객체 전체를 전달해야 함

// ❌ 잘못된 가격 계산
calculateLevelPrice(item, user.level)  // ❌ basePrice와 product를 전달해야 함
```

### 📋 외부 개발자 체크리스트

#### 1. Props 구조 확인
- [ ] `ComponentSkinProps` 타입 사용
- [ ] `{ data, actions, options, utils }` 구조로 받기
- [ ] 기본값 설정 (`= {}`, `= []` 등)

#### 2. Data 필드명 확인
- [ ] `cartItems` (items 아님)
- [ ] `calculations.total` (totalAmount 아님)
- [ ] `calculations.shippingFee` (shippingCost 아님)
- [ ] `localQuantities` (로컬 수량 상태, Record<number, number> 타입)
- [ ] `item.count` (item.quantity 아님)
- [ ] `userInfo` (user 아님)

#### 3. Actions 사용 확인
- [ ] `actions.handleIncreaseQuantity(item)` - 수량 1 증가 (⚠️ item 객체 전체 전달)
- [ ] `actions.handleDecreaseQuantity(item)` - 수량 1 감소 (⚠️ item 객체 전체 전달)
- [ ] `actions.handleRemoveFromCart(item.id)` - 아이템 삭제 (item.id만 전달)
- [ ] `actions.handleCheckout()` - 결제 페이지로 이동
- [ ] `actions.calculateLevelPrice(basePrice, product)` - 직급별 가격 계산 (⚠️ basePrice와 product 전달)

#### 4. 빈 장바구니 처리
- [ ] `cartItems.length === 0` 체크
- [ ] `data.emptyText` 표시
- [ ] 로그인 상태 확인 (`data.isUserLoggedIn`)

#### 5. 디버깅 방법
```typescript
console.log('Cart Debug:', {
  cartItemsLength: cartItems?.length,
  cartItems: cartItems,
  isUserLoggedIn: data?.isUserLoggedIn,
  dataKeys: Object.keys(data || {}),
  actionsKeys: Object.keys(actions || {})
});
```

## 기본 사용 예제

```typescript
import React from 'react';
import { ComponentSkinProps } from '@withcookie/webbuilder-sdk';
import { Link } from 'react-router-dom';

const MyCartSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  const { t, formatCurrency } = utils;
  
  // 데이터 추출
  const { 
    cartItems = [],
    loading,
    error,
    localQuantities,
    calculations,
    isUserLoggedIn,
    isAdminLoggedIn,
    freeShippingLimit,
    title,
    emptyText,
    shippingFee,
    showStock
  } = data;
  
  // 액션 추출
  const {
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveFromCart,
    handleCheckout,
    handleClearCart,
    calculateLevelPrice
  } = actions;
  
  // 옵션 추출
  const {
    primaryButtonColor = '#007bff',
    dangerButtonColor = '#dc3545',
    priceColor = '#ff6b6b',
    summaryBackgroundColor = '#f8f9fa'
  } = options;
  
  // 로딩 상태
  if (loading) {
    return (
      <div className="cart-loading">
        <p>{t('장바구니 정보를 불러오는 중입니다...')}</p>
      </div>
    );
  }
  
  // 에러 상태
  if (error) {
    return (
      <div className="cart-error">
        <p>{t('장바구니 정보를 불러오는데 실패했습니다')}</p>
        <button onClick={() => window.location.reload()}>
          {t('다시 시도')}
        </button>
      </div>
    );
  }
  
  // 로그인 필요
  if (!isUserLoggedIn && !isAdminLoggedIn) {
    return (
      <div className="cart-login-required">
        <p>{t('장바구니를 확인하려면 로그인이 필요합니다.')}</p>
        <Link to="/login">{t('로그인')}</Link>
      </div>
    );
  }
  
  // 빈 장바구니
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>{title}</h2>
        <p>{emptyText}</p>
        <Link to="/shopping">{t('쇼핑 계속하기')}</Link>
      </div>
    );
  }
  
  return (
    <div className="cart-container">
      <h2>{title}</h2>
      
      <div className="cart-content">
        {/* 장바구니 상품 목록 */}
        <div className="cart-items">
          {cartItems.map((item) => {
            // 상품 가격 정보
            const product = item.product || {};
            const config = product.config || {};
            const basePrice = config.discounted_price || config.default_price || 0;
            
            // 직급별 가격 계산
            const priceInfo = calculateLevelPrice(basePrice, product);
            const finalBasePrice = priceInfo.levelPrice;
            
            // Variant 추가 가격
            const additionalPrice = item.variant?.additionalPrice 
              ? Number(item.variant.additionalPrice) 
              : 0;
            
            // 최종 가격
            const price = finalBasePrice + additionalPrice;
            
            // 수량 (로컬 상태 우선)
            const count = localQuantities[item.id] || item.count || 1;
            
            return (
              <div key={item.id} className="cart-item">
                {/* 상품 이미지 */}
                <div className="cart-item-image">
                  <Link to={`/products/${product.id}`}>
                    <img 
                      src={config.img_url} 
                      alt={product.title}
                      onError={(e: any) => {
                        e.target.src = '/images/product-placeholder.png';
                      }}
                    />
                  </Link>
                </div>
                
                {/* 상품 정보 */}
                <div className="cart-item-info">
                  <h3>
                    <Link to={`/products/${product.id}`}>
                      {t(product.title || '상품명 없음')}
                    </Link>
                  </h3>
                  
                  {/* 옵션 정보 */}
                  {item.variant?.options && (
                    <div className="cart-item-options">
                      {item.variant.options.map((opt: any, index: number) => (
                        <span key={index}>
                          {opt.optionValue.optionGroup.name}: {opt.optionValue.value}
                          {index < item.variant.options.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 가격 정보 */}
                  <div className="cart-item-price">
                    {priceInfo.discount > 0 && priceInfo.levelName && (
                      <div className="level-price-info">
                        <span className="level-badge">{priceInfo.levelName}</span>
                        <span className="original-price">
                          {formatCurrency(basePrice)}
                        </span>
                        <span className="arrow">→</span>
                        <span className="level-price">
                          {formatCurrency(finalBasePrice)}
                        </span>
                      </div>
                    )}
                    <span style={{ color: priceColor }}>
                      {formatCurrency(price)}
                    </span>
                  </div>
                  
                  {/* 재고 표시 */}
                  {showStock && config.stock_count !== undefined && (
                    <div className="cart-item-stock">
                      {t('재고')}: {config.stock_count}{t('개')}
                    </div>
                  )}
                </div>
                
                {/* 수량 조절 */}
                <div className="cart-item-quantity">
                  <button 
                    onClick={() => handleDecreaseQuantity(item)}
                    disabled={count <= 1}
                  >
                    -
                  </button>
                  <span>{count}</span>
                  <button 
                    onClick={() => handleIncreaseQuantity(item)}
                  >
                    +
                  </button>
                </div>
                
                {/* 합계 */}
                <div className="cart-item-subtotal">
                  <span style={{ color: priceColor }}>
                    {formatCurrency(price * count)}
                  </span>
                </div>
                
                {/* 삭제 버튼 */}
                <div className="cart-item-remove">
                  <button 
                    onClick={() => handleRemoveFromCart(item.id)}
                    style={{ color: dangerButtonColor }}
                  >
                    <i className="fa fa-times" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 주문 요약 */}
        <div className="order-summary" style={{ backgroundColor: summaryBackgroundColor }}>
          <h3>{t('주문 요약')}</h3>
          
          <div className="summary-row">
            <span>{t('상품 금액')}</span>
            <span>{formatCurrency(calculations.subtotal)}</span>
          </div>
          
          <div className="summary-row">
            <span>
              {t('배송비')}
              {calculations.subtotal >= freeShippingLimit && (
                <small>({t('무료')})</small>
              )}
            </span>
            <span>{formatCurrency(calculations.shippingFee)}</span>
          </div>
          
          {calculations.shippingFee > 0 && (
            <p className="shipping-info">
              {formatCurrency(freeShippingLimit)} {t('이상 구매시 무료배송')}
            </p>
          )}
          
          <div className="summary-total">
            <span>{t('총 결제금액')}</span>
            <span style={{ color: priceColor }}>
              {formatCurrency(calculations.total)}
            </span>
          </div>
          
          {/* 결제 버튼 */}
          <button
            className="checkout-button"
            style={{ backgroundColor: primaryButtonColor }}
            onClick={handleCheckout}
            disabled={loading}
          >
            {t('결제하기')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCartSkin;
```

## 수량 관리

### 수량 변경 시스템

Cart 컴포넌트는 수량을 1씩 증가/감소시키는 간단한 시스템을 사용합니다:

```typescript
// 수량 증가
<button onClick={() => handleIncreaseQuantity(item)}>+</button>

// 수량 감소 (1 이하로는 내려가지 않음)
<button 
  onClick={() => handleDecreaseQuantity(item)}
  disabled={count <= 1}
>
  -
</button>
```

### 로컬 수량 상태

빠른 UI 반응을 위해 `localQuantities` 객체에서 수량을 관리합니다:

```typescript
// 현재 수량 가져오기
const count = localQuantities[item.id] || item.count || 1;

// 수량 변경 시 즉시 UI 업데이트
// API 호출은 debounce되어 300ms 후 실행됨
```

## 가격 계산

### 직급별 가격 시스템

Cart는 사용자의 직급(level2)에 따른 할인 가격을 지원합니다:

```typescript
// 직급별 가격 계산
const priceInfo = calculateLevelPrice(basePrice, product);

// priceInfo 구조
{
  originalPrice: 10000,    // 원래 가격
  levelPrice: 8000,        // 직급 할인가
  discount: 2000,          // 할인 금액
  discountRate: 20,        // 할인율 (%)
  levelName: "VIP"         // 직급명
}
```

### 가격 구성 요소

```typescript
// 1. 기본 가격 (할인가 우선)
const basePrice = config.discounted_price || config.default_price || 0;

// 2. 직급별 가격 적용
const finalBasePrice = priceInfo.levelPrice;

// 3. 옵션 추가 가격
const additionalPrice = item.variant?.additionalPrice ? Number(item.variant.additionalPrice) : 0;

// 4. 최종 가격
const price = finalBasePrice + additionalPrice;

// 5. 수량별 합계
const subtotal = price * count;
```

### 배송비 계산

```typescript
// 무료배송 조건
if (calculations.subtotal >= freeShippingLimit) {
  // 배송비 무료
  shippingFee = 0;
} else {
  // 기본 배송비 적용
  shippingFee = data.shippingFee || 4000;
}
```

## 반응형 디자인

### 모바일 최적화

```css
/* 모바일 장바구니 */
@media (max-width: 768px) {
  .cart-container {
    padding: 16px;
  }
  
  .cart-content {
    flex-direction: column;
  }
  
  /* 카드 형식으로 변환 */
  .cart-item {
    display: block;
    border: 1px solid #eee;
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;
  }
  
  /* 주문 요약 하단 고정 */
  .order-summary {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: 16px;
    z-index: 1000;
  }
}
```

## 접근성 고려사항

```typescript
// 접근성 향상
<div role="region" aria-label={t('장바구니')}>
  <h2>{title}</h2>
  
  {/* 스크린 리더를 위한 요약 */}
  <div className="sr-only" aria-live="polite">
    {t('총 {{count}}개 상품, 합계 {{total}}', {
      count: cartItems.length,
      total: formatCurrency(calculations.total)
    })}
  </div>
  
  {/* 삭제 버튼 */}
  <button 
    onClick={() => handleRemoveFromCart(item.id)}
    aria-label={t('{{name}} 삭제', { name: item.product.title })}
  >
    <i className="fa fa-times" />
  </button>
</div>
```

## 외부 스킨 개발 및 배포

### 1. UMD 번들 빌드 설정

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'cart-skin.js',
    library: 'CartCustomSkin',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM'
  },
  // ... 기타 설정
};
```

### 2. 스킨 등록 방법

#### 수동 등록
```javascript
import { registerComponentSkin } from '@withcookie/webbuilder-sdk';

registerComponentSkin({
  id: 'custom-cart',
  name: '커스텀 장바구니',
  componentTypes: ['cart'],
  umdUrl: 'https://cdn.example.com/skins/cart-skin.js',
  globalName: 'CartCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/cart-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '모던한 디자인의 장바구니',
  version: '1.0.0',
  author: 'Your Name'
});
```

## 주의사항

1. **Redux 연동**: 장바구니 데이터는 Redux store에서 관리되므로 직접 수정하지 마세요
2. **수량 변경**: handleIncreaseQuantity/handleDecreaseQuantity를 통해서만 변경
    - ⚠️ **중요**: 이 함수들은 `item` 객체 전체를 받습니다, `itemId`만 받지 않습니다!
    - ✅ 올바른 사용: `handleIncreaseQuantity(item)`
    - ❌ 잘못된 사용: `handleIncreaseQuantity(item.id)`
3. **로컬 상태**: localQuantities를 통해 즉시 UI 업데이트, API는 debounce됨
4. **직급별 가격**: calculateLevelPrice로 사용자 직급에 따른 할인가 계산
    - ⚠️ **중요**: `calculateLevelPrice(basePrice, product)` 형태로 사용
    - ❌ 잘못된 사용: `calculateLevelPrice(item, user.level)`
5. **무료배송**: freeShippingLimit 이상 구매 시 배송비가 0이 됩니다
6. **로그인 체크**: isUserLoggedIn/isAdminLoggedIn으로 로그인 상태 확인
7. **에러 처리**: error 상태 확인하여 적절한 에러 메시지 표시
8. **수량 필드명**: `item.count`를 사용합니다 (`item.quantity`가 아님)

## 액션 상세 설명

### handleIncreaseQuantity / handleDecreaseQuantity
- **용도**: 장바구니 아이템 수량을 1씩 증가/감소
- **매개변수**: `item: CartItem` (전체 아이템 객체)
- **동작**: 로컬 상태 즉시 업데이트, API는 300ms debounce

### handleRemoveFromCart
- **용도**: 장바구니에서 아이템 삭제
- **매개변수**: `cartItemId: number` (아이템 ID)
- **반환**: `Promise<void>`
- **동작**: Redux에서 아이템 제거 후 장바구니 새로고침

### handleCheckout
- **용도**: 결제 페이지로 이동
- **동작**: /checkout 페이지로 이동

### handleClearCart
- **용도**: 장바구니 전체 비우기
- **반환**: `Promise<void>`
- **동작**: 확인 후 모든 아이템 삭제

### calculateLevelPrice
- **용도**: 직급별 할인 가격 계산
- **매개변수**: `basePrice: number`, `product: any`
- **반환**: `PriceInfo` 객체
- **동작**: 사용자 직급에 따른 할인가 계산

### calculateTotalPrice / calculateGrandTotal
- **용도**: 상품 합계 / 총 결제금액 계산
- **반환**: `number`
- **동작**: 현재 장바구니의 금액 계산

## 스타일링 팁

### CSS 구조
```css
.cart-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.cart-content {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
    align-items: start;
}

.cart-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.cart-item-quantity {
    display: flex;
    align-items: center;
    gap: 10px;
}

.cart-item-quantity button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
}

.order-summary {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 25px;
    position: sticky;
    top: 20px;
}

.checkout-button {
    width: 100%;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}
```