# 외부 상품 상세 스킨 개발 가이드

## 목차
1. [개요](#개요)
2. [시작하기](#시작하기)
3. [기본 스킨 템플릿](#기본-스킨-템플릿)
4. [Props 상세 설명](#props-상세-설명)
5. [스타일링 가이드](#스타일링-가이드)
6. [빌드 및 배포](#빌드-및-배포)
7. [테스트 방법](#테스트-방법)
8. [실전 예제](#실전-예제)
9. [속성 패널에서 스킨 선택하기](#속성-패널에서-스킨-선택하기)
10. [주의사항 및 팁](#주의사항-및-팁)

## 개요

WithCookie WebBuilder의 상품 상세 컴포넌트는 외부 스킨을 지원합니다. 이를 통해 개발자는 자신만의 독특한 상품 상세 페이지 UI를 만들어 적용할 수 있습니다. 이 가이드는 외부 상품 상세 스킨을 개발하는 전체 과정을 상세히 설명합니다.

### 외부 스킨의 장점
- **커스터마이징**: 프로젝트에 맞는 고유한 디자인 적용
- **재사용성**: 한 번 만든 스킨을 여러 프로젝트에서 사용
- **독립적 개발**: WithCookie 코드 수정 없이 별도 개발
- **쉬운 배포**: CDN을 통한 간편한 배포 및 업데이트

## 시작하기

### 1. 프로젝트 생성

```bash
# 프로젝트 디렉토리 생성
mkdir my-product-detail-skin
cd my-product-detail-skin

# package.json 초기화
npm init -y

# 필요한 패키지 설치
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-react
```

### 2. 프로젝트 구조

```
my-product-detail-skin/
├── src/
│   └── index.jsx        # 메인 스킨 컴포넌트
├── dist/               # 빌드 결과물
├── package.json
├── webpack.config.js
├── .babelrc
└── README.md
```

### 3. 설정 파일

**.babelrc**
```json
{
  "presets": ["@babel/preset-react"]
}
```

**webpack.config.js**
```javascript
const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-product-detail-skin.umd.js',
    library: 'MyCustomProductDetailSkin',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
```

**package.json (scripts 추가)**
```json
{
  "name": "my-product-detail-skin",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "serve": "npx http-server dist -p 3001 --cors"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-react": "^7.18.0",
    "babel-loader": "^9.1.0",
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.0"
  }
}
```

## 기본 스킨 템플릿

### JavaScript 파일 (src/index.jsx)

웹빌더 속성 패널의 모든 옵션을 활용하는 완전한 템플릿입니다:

```jsx
import React from 'react';

const MyCustomProductDetailSkin = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  // 유틸리티 함수
  const { t, cx, navigate, formatCurrency, formatDate, getAssetUrl } = utils;
  
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
  } = data;
  
  // 상품 상세 로직에서 제공하는 액션
  const {
    handleOptionChange,    // 옵션 변경 핸들러
    handleQuantityChange,  // 수량 변경 핸들러
    handleAddToCart,       // 장바구니 추가 핸들러
    handleBuyNow,          // 바로 구매 핸들러
    handleTabChange,       // 탭 변경 핸들러
    handleImageChange      // 이미지 변경 핸들러
  } = actions;
  
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
  } = options;
  
  // 스타일 정의
  const containerStyle = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  };

  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '60px'
  };

  const imageContainerStyle = {
    position: 'relative'
  };

  const mainImageStyle = {
    width: '100%',
    height: 'auto',
    maxHeight: '600px',
    objectFit: 'contain',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  };

  const thumbnailListStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    overflowX: 'auto'
  };

  const thumbnailStyle = {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'border-color 0.3s ease'
  };

  const productInfoStyle = {
    padding: '20px 0'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  };

  const priceContainerStyle = {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid #eee'
  };

  const priceStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: priceColor
  };

  const stockStyle = {
    fontSize: '16px',
    color: stockTextColor,
    marginTop: '10px'
  };

  const optionGroupStyle = {
    marginBottom: '25px'
  };

  const optionLabelStyle = {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '10px',
    color: '#333'
  };

  const optionSelectStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer'
  };

  const quantitySelectorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px'
  };

  const quantityButtonStyle = {
    width: '40px',
    height: '40px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const quantityInputStyle = {
    width: '60px',
    height: '40px',
    textAlign: 'center',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px'
  };

  const buttonStyle = {
    flex: '1',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const addToCartButtonStyle = {
    ...buttonStyle,
    backgroundColor: addToCartButtonColor,
    color: '#fff'
  };

  const buyNowButtonStyle = {
    ...buttonStyle,
    backgroundColor: buyNowButtonColor,
    color: '#fff'
  };

  const tabContainerStyle = {
    borderTop: '1px solid #eee',
    paddingTop: '40px'
  };

  const tabListStyle = {
    display: 'flex',
    gap: '30px',
    marginBottom: '30px',
    borderBottom: '2px solid #eee'
  };

  const tabButtonStyle = {
    padding: '15px 0',
    fontSize: '16px',
    fontWeight: '500',
    color: '#666',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'color 0.3s ease'
  };

  const activeTabStyle = {
    ...tabButtonStyle,
    color: '#333',
    fontWeight: 'bold'
  };

  const tabContentStyle = {
    padding: '30px 0',
    minHeight: '300px'
  };

  const relatedProductsStyle = {
    marginTop: '60px',
    paddingTop: '40px',
    borderTop: '1px solid #eee'
  };

  const relatedTitleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333'
  };

  const relatedGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  };

  const relatedCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  };

  const relatedImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  };

  const relatedInfoStyle = {
    padding: '15px'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '16px',
    color: '#666'
  };

  // 로딩 상태
  if (loading && !product) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          {t('상품 정보를 불러오는 중...')}
        </div>
      </div>
    );
  }

  // 상품이 없는 경우
  if (!product && !isAdminMode) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          {t('상품을 찾을 수 없습니다.')}
        </div>
      </div>
    );
  }

  // 가격 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <div style={containerStyle}>
      {/* 메인 콘텐츠 영역 */}
      <div style={mainContentStyle}>
        {/* 이미지 영역 */}
        <div style={imageContainerStyle}>
          <img
            src={mainImage}
            alt={product?.name || '상품 이미지'}
            style={mainImageStyle}
            onError={(e) => {
              e.target.src = '/images/product-placeholder.png';
            }}
          />
          
          {/* 썸네일 이미지 */}
          {product?.images && product.images.length > 1 && (
            <div style={thumbnailListStyle}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  style={{
                    ...thumbnailStyle,
                    borderColor: mainImage === image ? '#333' : 'transparent'
                  }}
                  onClick={() => handleImageChange(image)}
                  onError={(e) => {
                    e.target.src = '/images/product-placeholder.png';
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* 상품 정보 영역 */}
        <div style={productInfoStyle}>
          <h1 style={titleStyle}>{product?.name || '상품명'}</h1>
          
          {/* 가격 정보 */}
          <div style={priceContainerStyle}>
            <div style={priceStyle}>
              {formatPrice(product?.price || 0)}
            </div>
            {showStock && product?.stock !== undefined && (
              <div style={stockStyle}>
                {product.stock > 0 
                  ? `${t('재고')}: ${product.stock}${t('개')}`
                  : t('품절')
                }
              </div>
            )}
          </div>
          
          {/* 옵션 선택 */}
          {product?.options && product.options.map((option) => (
            <div key={option.name} style={optionGroupStyle}>
              <label style={optionLabelStyle}>
                {option.name}
                {option.required && <span style={{ color: '#ff0000' }}> *</span>}
              </label>
              <select
                value={selectedOptions[option.name] || ''}
                onChange={(e) => handleOptionChange(option.name, e.target.value)}
                style={optionSelectStyle}
                required={option.required}
              >
                <option value="">{t('선택하세요')}</option>
                {option.values.map((value) => (
                  <option key={value} value={value}>
                    {String(value)}
                  </option>
                ))}
              </select>
            </div>
          ))}
          
          {/* 수량 선택 */}
          {showQuantitySelector && (
            <div style={quantitySelectorStyle}>
              <label style={optionLabelStyle}>{t('수량')}:</label>
              <button
                style={quantityButtonStyle}
                onClick={() => handleQuantityChange(quantity - 1)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                style={quantityInputStyle}
                min="1"
                max={product?.stock || 999}
              />
              <button
                style={quantityButtonStyle}
                onClick={() => handleQuantityChange(quantity + 1)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                +
              </button>
            </div>
          )}
          
          {/* 구매 버튼 */}
          <div style={buttonContainerStyle}>
            {showAddToCart && (
              <button
                style={addToCartButtonStyle}
                onClick={handleAddToCart}
                disabled={loading || product?.stock === 0}
                onMouseEnter={(e) => {
                  if (!loading && product?.stock > 0) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {loading ? t('처리중...') : t('장바구니 담기')}
              </button>
            )}
            {showBuyNow && (
              <button
                style={buyNowButtonStyle}
                onClick={handleBuyNow}
                disabled={loading || product?.stock === 0}
                onMouseEnter={(e) => {
                  if (!loading && product?.stock > 0) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {loading ? t('처리중...') : t('바로 구매')}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 탭 콘텐츠 */}
      <div style={tabContainerStyle}>
        <div style={tabListStyle}>
          {showDescriptionTab && (
            <button
              style={activeTab === 'description' ? activeTabStyle : tabButtonStyle}
              onClick={() => handleTabChange('description')}
            >
              {t('상품 설명')}
              {activeTab === 'description' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  backgroundColor: '#333'
                }} />
              )}
            </button>
          )}
          {showSpecificationTab && (
            <button
              style={activeTab === 'specification' ? activeTabStyle : tabButtonStyle}
              onClick={() => handleTabChange('specification')}
            >
              {t('상품 정보')}
              {activeTab === 'specification' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  backgroundColor: '#333'
                }} />
              )}
            </button>
          )}
          {showReviewsTab && (
            <button
              style={activeTab === 'reviews' ? activeTabStyle : tabButtonStyle}
              onClick={() => handleTabChange('reviews')}
            >
              {t('리뷰')}
              {activeTab === 'reviews' && (
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '0',
                  right: '0',
                  height: '2px',
                  backgroundColor: '#333'
                }} />
              )}
            </button>
          )}
        </div>
        
        <div style={tabContentStyle}>
          {activeTab === 'description' && (
            <div dangerouslySetInnerHTML={{ 
              __html: product?.description || '<p>상품 설명이 없습니다.</p>' 
            }} />
          )}
          
          {activeTab === 'specification' && (
            <div>
              {product?.specifications ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '15px', fontWeight: '500', width: '30%' }}>
                          {key}
                        </td>
                        <td style={{ padding: '15px' }}>
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>{t('상품 정보가 없습니다.')}</p>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <p>{t('리뷰가 없습니다.')}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 관련 상품 */}
      {showRelatedProducts && relatedProducts.length > 0 && (
        <div style={relatedProductsStyle}>
          <h2 style={relatedTitleStyle}>{t('관련 상품')}</h2>
          <div style={relatedGridStyle}>
            {relatedProducts.map((related) => (
              <div
                key={related.id}
                style={relatedCardStyle}
                onClick={() => utils.navigate && utils.navigate(`/product/${related.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <img
                  src={related.image || '/images/product-placeholder.png'}
                  alt={related.name}
                  style={relatedImageStyle}
                  onError={(e) => {
                    e.target.src = '/images/product-placeholder.png';
                  }}
                />
                <div style={relatedInfoStyle}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {related.name}
                  </h4>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: priceColor 
                  }}>
                    {formatPrice(related.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// UMD 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyCustomProductDetailSkin;
} else {
  window.MyCustomProductDetailSkin = MyCustomProductDetailSkin;
}
```

## 웹빌더 속성 패널 연동

### 상품 상세 컴포넌트 속성 패널에서 설정 가능한 옵션들

웹빌더 에디터에서 상품 상세 컴포넌트를 선택하면 우측 속성 패널에서 다음 옵션들을 실시간으로 설정할 수 있습니다:

#### 기본 설정
- **상품 ID**: 표시할 상품의 고유 ID (숫자)

#### 레이아웃 설정
- **정렬 순서**: 기본 / 역순 선택
- **사이드바 표시**: 표시 안함 / 표시 선택
- **메인 컨텐츠 너비**: 전체 폭 / 75% 폭 / 66% 폭 / 50% 폭 선택

#### 탭 설정
- **상품 설명 탭 표시**: 체크박스 (기본: 체크됨)
- **리뷰 탭 표시**: 체크박스 (기본: 체크됨)
- **상품 스펙 탭 표시**: 체크박스 (기본: 체크됨)

#### 기타 설정
- **재고 표시**: 체크박스 (기본: 체크 안됨)

#### 스타일 설정
- **여백**: 텍스트 입력 (기본: 20px)
- **배경색**: 색상 선택기 (기본: #ffffff)
- **모서리 둥글기**: 텍스트 입력 (기본: 0px)
- **테두리**: 텍스트 입력 (기본: 1px solid #eeeeee)
- **그림자**: 텍스트 입력 (기본: none)

### 실시간 옵션 반영 메커니즘

#### 데이터 흐름
```
속성 패널에서 옵션 변경
        ↓
ComponentProps 업데이트 
        ↓
ComponentRenderer가 새로운 props로 리렌더링
        ↓  
스킨 컴포넌트가 변경된 options로 즉시 업데이트
```

#### 속성 패널 ↔ options 완전 매핑표

| 속성 패널 필드명 | options 키 | UI 타입 | 기본값 | 설명 |
|---|---|---|---|---|
| 상품 ID | `productId` | 숫자 입력 | 0 | 표시할 상품의 ID |
| 정렬 순서 | `order` | 드롭다운 | '' | 기본/역순 |
| 사이드바 표시 | `none` | 드롭다운 | 'none' | 표시안함/표시 |
| 메인 컨텐츠 너비 | `lg` | 드롭다운 | '9' | 12/9/8/6 |
| 상품 설명 탭 표시 | `showDescriptionTab` | 체크박스 | true | 설명 탭 표시 여부 |
| 리뷰 탭 표시 | `showReviewsTab` | 체크박스 | true | 리뷰 탭 표시 여부 |
| 상품 스펙 탭 표시 | `showSpecificationTab` | 체크박스 | true | 스펙 탭 표시 여부 |
| 재고 표시 | `showStock` | 체크박스 | false | 재고 표시 여부 |
| 여백 | `style.padding` | 텍스트 입력 | '20px' | 컴포넌트 여백 |
| 배경색 | `style.backgroundColor` | 색상 선택기 | '#ffffff' | 배경색 |
| 모서리 둥글기 | `style.borderRadius` | 텍스트 입력 | '0px' | 모서리 둥글기 |
| 테두리 | `style.border` | 텍스트 입력 | '1px solid #eeeeee' | 테두리 스타일 |
| 그림자 | `style.boxShadow` | 텍스트 입력 | 'none' | 그림자 효과 |

## Props 상세 설명

### data 객체

| 속성 | 타입 | 설명 |
|------|------|------|
| `product` | `object` | 상품 정보 객체 (id, name, price, description, image, images, stock, specifications 등) |
| `selectedOptions` | `object` | 현재 선택된 옵션들 |
| `quantity` | `number` | 선택된 수량 |
| `loading` | `boolean` | 로딩 상태 |
| `activeTab` | `string` | 현재 활성 탭 ('description', 'specification', 'reviews') |
| `mainImage` | `string` | 메인 이미지 URL |
| `relatedProducts` | `array` | 관련 상품 배열 |
| `isUserLoggedIn` | `boolean` | 사용자 로그인 여부 |
| `isAdminMode` | `boolean` | 관리자/에디터 모드 여부 |
| `theme` | `object` | 테마 정보 |

### actions 객체

| 함수 | 설명 | 사용법 |
|------|------|--------|
| `handleOptionChange` | 옵션 변경 처리 | `handleOptionChange(optionName, value)` |
| `handleQuantityChange` | 수량 변경 처리 | `handleQuantityChange(newQuantity)` |
| `handleAddToCart` | 장바구니 추가 | `onClick={handleAddToCart}` |
| `handleBuyNow` | 바로 구매 | `onClick={handleBuyNow}` |
| `handleTabChange` | 탭 변경 | `handleTabChange(tabName)` |
| `handleImageChange` | 이미지 변경 | `handleImageChange(imageUrl)` |

### options 객체

스킨에서 사용할 수 있는 추가 옵션들:

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `showDescriptionTab` | `boolean` | `true` | 상품 설명 탭 표시 여부 |
| `showReviewsTab` | `boolean` | `true` | 리뷰 탭 표시 여부 |
| `showSpecificationTab` | `boolean` | `true` | 상품 스펙 탭 표시 여부 |
| `showStock` | `boolean` | `true` | 재고 표시 여부 |
| `showRelatedProducts` | `boolean` | `true` | 관련 상품 표시 여부 |
| `showQuantitySelector` | `boolean` | `true` | 수량 선택기 표시 여부 |
| `showAddToCart` | `boolean` | `true` | 장바구니 버튼 표시 여부 |
| `showBuyNow` | `boolean` | `true` | 바로 구매 버튼 표시 여부 |
| `addToCartButtonColor` | `string` | `'#007bff'` | 장바구니 버튼 색상 |
| `buyNowButtonColor` | `string` | `'#28a745'` | 바로 구매 버튼 색상 |
| `priceColor` | `string` | `'#ff6b6b'` | 가격 텍스트 색상 |
| `stockTextColor` | `string` | `'#28a745'` | 재고 텍스트 색상 |

### utils 객체

| 함수 | 설명 | 예시 |
|------|------|------|
| `t(key)` | 다국어 번역 | `t('장바구니 담기')` |
| `cx(...classes)` | 클래스명 조합 | `cx('base', isActive && 'active')` |
| `navigate(path)` | 페이지 이동 | `navigate('/product/123')` |
| `formatCurrency(amount)` | 통화 포맷 | `formatCurrency(50000)` |
| `formatDate(date)` | 날짜 포맷 | `formatDate(new Date())` |
| `getAssetUrl(path)` | 에셋 URL 생성 | `getAssetUrl('/images/product.jpg')` |

## 스타일링 가이드

### 1. 인라인 스타일 사용

```jsx
const buttonStyle = {
  padding: '15px 30px',
  backgroundColor: addToCartButtonColor,
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
};

<button style={buttonStyle}>장바구니 담기</button>
```

### 2. CSS 파일 분리 (권장)

**dist/my-product-detail-skin.css**
```css
.my-product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.my-product-detail-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;
}

.my-product-detail-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.my-product-detail-thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
}

.my-product-detail-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.my-product-detail-thumbnail.active {
  border-color: #333;
}

.my-product-detail-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.my-product-detail-price {
  font-size: 32px;
  font-weight: bold;
  color: #ff6b6b;
}

.my-product-detail-option {
  margin-bottom: 25px;
}

.my-product-detail-option-label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.my-product-detail-option-select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.my-product-detail-quantity {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.my-product-detail-quantity-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.my-product-detail-quantity-btn:hover {
  background-color: #f0f0f0;
}

.my-product-detail-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.my-product-detail-button {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.my-product-detail-button:hover {
  opacity: 0.9;
}

.my-product-detail-tabs {
  border-top: 1px solid #eee;
  padding-top: 40px;
}

.my-product-detail-tab-list {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.my-product-detail-tab {
  padding: 15px 0;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.my-product-detail-tab.active {
  color: #333;
  font-weight: bold;
}

.my-product-detail-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #333;
}

.my-product-detail-related {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid #eee;
}

.my-product-detail-related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.my-product-detail-related-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.my-product-detail-related-card:hover {
  transform: translateY(-5px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .my-product-detail-main {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .my-product-detail-related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 3. 반응형 디자인

```jsx
const isMobile = window.innerWidth < 768;

const mainContentStyle = {
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: isMobile ? '30px' : '40px',
  marginBottom: '60px'
};

const relatedGridStyle = {
  display: 'grid',
  gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
  gap: '20px'
};
```

## 빌드 및 배포

### 1. 개발 모드

```bash
# 파일 변경 감지 및 자동 빌드
npm run dev

# 별도 터미널에서 로컬 서버 실행
npm run serve
```

### 2. 프로덕션 빌드

```bash
npm run build
```

### 3. 배포 및 등록

```javascript
// 스킨 등록
registerComponentSkin({
  id: 'my-custom-product-detail',
  name: '나의 커스텀 상품 상세',
  componentTypes: ['product-detail'],
  umdUrl: 'https://cdn.example.com/my-product-detail-skin.umd.js',
  cssUrls: ['https://cdn.example.com/my-product-detail-skin.css'],
  globalName: 'MyCustomProductDetailSkin'
});
```

## 테스트 방법

### 1. 로컬 테스트

```javascript
// 개발 환경에서 테스트용 등록
import { registerComponentSkin } from '@withcookie/webbuilder';

if (process.env.NODE_ENV === 'development') {
  registerComponentSkin({
    id: 'my-custom-product-detail-dev',
    name: '개발용: 나의 커스텀 상품 상세',
    componentTypes: ['product-detail'],
    umdUrl: 'http://localhost:3001/my-product-detail-skin.umd.js',
    cssUrls: ['http://localhost:3001/my-product-detail-skin.css'],
    globalName: 'MyCustomProductDetailSkin'
  });
}
```

### 2. 브라우저 콘솔 확인

```javascript
// 스킨이 로드되었는지 확인
console.log(window.MyCustomProductDetailSkin);

// Props 구조 확인
const TestSkin = (props) => {
  console.log('Props:', props);
  console.log('Product:', props.data.product);
  console.log('Options:', props.options);
  return window.MyCustomProductDetailSkin(props);
};
```

## 실전 예제

### 1. 미니멀 상품 상세

```jsx
const MinimalProductDetail = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { product, quantity, mainImage } = data;
  const { handleQuantityChange, handleAddToCart } = actions;
  
  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px'
  };
  
  const imageStyle = {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '0',
    marginBottom: '30px'
  };
  
  const titleStyle = {
    fontSize: '24px',
    fontWeight: '300',
    marginBottom: '20px',
    color: '#333'
  };
  
  const priceStyle = {
    fontSize: '20px',
    fontWeight: '400',
    color: '#000',
    marginBottom: '30px'
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '15px',
    fontSize: '14px',
    fontWeight: '400',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };
  
  return (
    <div style={containerStyle}>
      <img src={mainImage} alt={product?.name} style={imageStyle} />
      <h1 style={titleStyle}>{product?.name}</h1>
      <div style={priceStyle}>{product?.price?.toLocaleString()}원</div>
      <button style={buttonStyle} onClick={handleAddToCart}>
        {t('장바구니에 추가')}
      </button>
    </div>
  );
};
```

### 2. 카드형 상품 상세

```jsx
const CardProductDetail = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { product, quantity, mainImage, relatedProducts } = data;
  const { handleAddToCart, handleBuyNow } = actions;
  
  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  };
  
  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '40px'
  };
  
  const imageContainerStyle = {
    position: 'relative',
    height: '400px',
    overflow: 'hidden'
  };
  
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };
  
  const contentStyle = {
    padding: '30px'
  };
  
  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#1a1a1a'
  };
  
  const priceStyle = {
    fontSize: '28px',
    fontWeight: '900',
    color: '#e74c3c',
    marginBottom: '20px'
  };
  
  const buttonContainerStyle = {
    display: 'flex',
    gap: '15px'
  };
  
  const primaryButtonStyle = {
    flex: '1',
    padding: '15px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };
  
  const secondaryButtonStyle = {
    ...primaryButtonStyle,
    backgroundColor: '#2ecc71'
  };
  
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={imageContainerStyle}>
          <img src={mainImage} alt={product?.name} style={imageStyle} />
        </div>
        <div style={contentStyle}>
          <h1 style={titleStyle}>{product?.name}</h1>
          <div style={priceStyle}>{product?.price?.toLocaleString()}원</div>
          <div style={buttonContainerStyle}>
            <button style={primaryButtonStyle} onClick={handleAddToCart}>
              {t('장바구니')}
            </button>
            <button style={secondaryButtonStyle} onClick={handleBuyNow}>
              {t('바로 구매')}
            </button>
          </div>
        </div>
      </div>
      
      {/* 관련 상품 */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>{t('관련 상품')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {relatedProducts.map((related) => (
              <div key={related.id} style={{ ...cardStyle, cursor: 'pointer' }}>
                <img src={related.image} alt={related.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div style={{ padding: '15px' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>{related.name}</h4>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#e74c3c' }}>
                    {related.price?.toLocaleString()}원
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

## 속성 패널에서 스킨 선택하기

WithCookie WebBuilder는 에디터의 속성 패널에서 손쉽게 스킨을 선택할 수 있는 UI를 제공합니다.

### 스킨 선택 UI

상품 상세 컴포넌트를 선택하면 속성 패널 상단에 "컴포넌트 스킨" 섹션이 표시됩니다:

```
┌─────────────────────────────────┐
│ 🛡️ 컴포넌트 스킨                │
├─────────────────────────────────┤
│ [기본 스킨          ▼]         │
│                                 │
│ 사용 가능한 스킨:              │
│ • 기본 스킨                    │
│ • 나의 커스텀 상품 상세        │
│ • 미니멀 상품 상세             │
│ • 카드형 상품 상세             │
│                                 │
│ [🛒 더 많은 스킨 구매하기]      │
└─────────────────────────────────┘
```

### 스킨 선택 작동 방식

1. **스킨 목록 로드**: 컴포넌트 타입에 따라 사용 가능한 스킨 자동 감지
2. **실시간 미리보기**: 스킨 선택 시 즉시 컴포넌트에 반영
3. **옵션 연동**: 선택한 스킨에 따라 속성 패널 옵션 변경

## 주의사항 및 팁

### 필수 요구사항

1. **상품 데이터 검증**: 상품 정보가 없는 경우 적절한 처리
   ```jsx
   if (!product && !isAdminMode) {
     return <div>상품을 찾을 수 없습니다.</div>;
   }
   ```

2. **옵션 처리**: 필수 옵션 선택 검증
   ```jsx
   {option.required && <span style={{ color: '#ff0000' }}> *</span>}
   ```

3. **로딩 상태 처리**: 버튼 비활성화 및 로딩 표시
   ```jsx
   <button disabled={loading || product?.stock === 0}>
     {loading ? t('처리중...') : t('장바구니 담기')}
   </button>
   ```

### 성능 최적화

1. **이미지 최적화**: 적절한 크기와 포맷 사용
2. **조건부 렌더링**: 불필요한 렌더링 방지
3. **스타일 객체 캐싱**: 컴포넌트 외부에 정의

### 접근성 고려

1. **이미지 alt 속성**: 모든 이미지에 적절한 alt 텍스트 제공
2. **키보드 네비게이션**: 탭 순서 고려
3. **ARIA 속성**: 스크린 리더 지원

### 다국어 지원

```jsx
// 항상 t() 함수 사용
<button>{t('장바구니 담기')}</button>
<label>{t('수량')}</label>
<h2>{t('관련 상품')}</h2>
```

### 반응형 디자인

```jsx
// 모바일 감지 및 조건부 스타일
const isMobile = window.innerWidth < 768;
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
  gap: isMobile ? '20px' : '40px'
};
```

## 문제 해결

### 상품 데이터가 로드되지 않을 때

1. `product` 객체가 undefined인지 확인
2. 관리자 모드에서 더미 데이터 표시
3. 에러 바운더리 구현 고려

### 옵션 선택이 작동하지 않을 때

1. `handleOptionChange` 함수 호출 확인
2. `selectedOptions` 상태 업데이트 확인
3. 옵션 데이터 구조 검증

### 관련 상품이 표시되지 않을 때

1. `relatedProducts` 배열 확인
2. `showRelatedProducts` 옵션 확인
3. 상품 이미지 URL 검증

## 결론

이 가이드를 따라 자신만의 독특한 상품 상세 스킨을 만들 수 있습니다. 기본 템플릿을 시작으로 점진적으로 커스터마이징하며, 테스트를 통해 안정성을 확보하세요.

추가 지원이 필요하면 WithCookie 개발팀에 문의하거나 [공식 문서](https://docs.withcookie.com)를 참고하세요.

---

**버전**: 1.0.0  
**최종 업데이트**: 2024년 1월  
**작성자**: WithCookie 개발팀