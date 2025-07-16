# 외부 상품목록 스킨 개발 가이드

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

WithCookie WebBuilder의 상품목록(ProductList) 컴포넌트는 외부 스킨을 지원합니다. 이를 통해 개발자는 자신만의 독특한 상품 목록 UI를 만들어 적용할 수 있습니다. 이 가이드는 외부 상품목록 스킨을 개발하는 전체 과정을 상세히 설명합니다.

### 외부 스킨의 장점
- **커스터마이징**: 프로젝트에 맞는 고유한 디자인 적용
- **재사용성**: 한 번 만든 스킨을 여러 프로젝트에서 사용
- **독립적 개발**: WithCookie 코드 수정 없이 별도 개발
- **쉬운 배포**: CDN을 통한 간편한 배포 및 업데이트

### 상품목록 컴포넌트의 특징
- 다양한 레이아웃 옵션 (2열, 3열, 4열, 6열)
- 카테고리 및 상품 필터링
- 정렬 및 검색 기능
- 페이지네이션
- 장바구니 연동
- 재고 상태 표시

## 시작하기

### 1. 프로젝트 생성

```bash
# 프로젝트 디렉토리 생성
mkdir my-productlist-skin
cd my-productlist-skin

# package.json 초기화
npm init -y

# 필요한 패키지 설치
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-react
```

### 2. 프로젝트 구조

```
my-productlist-skin/
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
    filename: 'my-productlist-skin.umd.js',
    library: 'MyCustomProductListSkin',
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
  "name": "my-productlist-skin",
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

웹빌더 속성 패널의 모든 옵션을 활용하고, 기본 스킨과 동일한 디자인을 구현한 완전한 템플릿입니다:

```jsx
import React from 'react';

const MyCustomProductListSkin = ({ 
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
  
  // 상품목록 로직에서 제공하는 데이터
  const {
    products = [],           // 상품 목록
    loading = false,         // 로딩 상태
    totalProducts = 0,       // 총 상품 개수
    currentPage = 1,         // 현재 페이지
    totalPages = 1,          // 총 페이지 수
    selectedCategory = null, // 선택된 카테고리
    searchQuery = '',        // 검색어
    sortBy = 'created',      // 정렬 기준
    sortOrder = 'desc',      // 정렬 순서
    itemsPerRow = 4,         // 한 줄당 상품 수
    showStock = false,       // 재고 표시 여부
    isUserLoggedIn = false,  // 로그인 상태
    isAdminMode = false,     // 관리자 모드
    theme = {}               // 테마 정보
  } = data;
  
  // 상품목록 로직에서 제공하는 액션
  const {
    handleAddToCart,         // 장바구니 추가
    handleCategoryChange,    // 카테고리 변경
    handleSearch,            // 검색
    handleSortChange,        // 정렬 변경
    handlePageChange         // 페이지 변경
  } = actions;
  
  // 속성 패널에서 설정한 옵션
  const {
    // 레이아웃 설정
    order,
    lg = 12,
    className = 'padding-tb-40',
    itemsPerPage = 20,
    
    // 필터링 설정
    categoryId,
    include_product_ids,
    exclude_product_ids,
    include_category_ids,
    exclude_category_ids,
    excludeIndexes,
    
    // 표시 설정
    showPrice = true,
    showAddToCart = true,
    showPagination = true,
    
    // 스타일 설정
    backgroundColor = '#ffffff',
    padding = '20px',
    borderRadius = '8px',
    priceColor = '#ff6b6b',
    cartButtonColor = '#007bff',
    stockTextColor = '#28a745'
  } = options;
  
  // 반응형 그리드 컬럼 계산
  const getGridColumns = () => {
    if (window.innerWidth < 768) return 2;  // 모바일
    if (window.innerWidth < 992) return 2;  // 태블릿
    return itemsPerRow || 4;  // PC
  };
  
  const [gridColumns, setGridColumns] = React.useState(getGridColumns());
  
  React.useEffect(() => {
    const handleResize = () => setGridColumns(getGridColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerRow]);
  
  // 컨테이너 스타일
  const containerStyle = {
    backgroundColor,
    padding,
    borderRadius,
    className
  };
  
  // 그리드 스타일
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gap: '20px',
    marginBottom: '40px'
  };
  
  // 상품 카드 스타일
  const productCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };
  
  // 로딩 상태
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <div className="spinner-border" role="status">
            <span className="sr-only">{t('로딩 중...')}</span>
          </div>
          <p style={{ marginTop: '10px' }}>{t('상품을 불러오는 중입니다...')}</p>
        </div>
      </div>
    );
  }
  
  // 상품이 없을 때
  if (products.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>{searchQuery ? t('검색 결과가 없습니다.') : t('등록된 상품이 없습니다.')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div style={containerStyle}>
      {/* 헤더 섹션 */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
            {t('상품 목록')} 
            <span style={{ fontSize: '16px', color: '#666', marginLeft: '10px' }}>
              ({totalProducts}{t('개')})
            </span>
          </h2>
          
          {/* 검색 박스 */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder={t('상품 검색...')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                width: '200px'
              }}
            />
            
            {/* 정렬 선택 */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                handleSortChange(newSortBy, newSortOrder);
              }}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="created-desc">{t('최신순')}</option>
              <option value="created-asc">{t('오래된순')}</option>
              <option value="price-asc">{t('가격 낮은순')}</option>
              <option value="price-desc">{t('가격 높은순')}</option>
              <option value="name-asc">{t('이름순')}</option>
              <option value="stock-desc">{t('재고 많은순')}</option>
            </select>
          </div>
        </div>
        
        {/* 카테고리 필터 (카테고리가 있는 경우만 표시) */}
        {categoryId && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => handleCategoryChange(null)}
              style={{
                padding: '6px 16px',
                marginRight: '10px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: selectedCategory === null ? cartButtonColor : '#f0f0f0',
                color: selectedCategory === null ? '#fff' : '#333',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('전체')}
            </button>
            {/* 실제 카테고리 목록은 props에서 제공받아야 함 */}
          </div>
        )}
      </div>
      
      {/* 상품 그리드 */}
      <div style={gridStyle}>
        {products.map((product) => {
          const productPrice = product.price || product.newPrice || 0;
          const productOldPrice = product.oldPrice || 0;
          const hasDiscount = productOldPrice > productPrice;
          const discountRate = hasDiscount ? Math.round((1 - productPrice / productOldPrice) * 100) : 0;
          const productStock = product.stock || product.stockCount || 0;
          const isInStock = product.isInStock !== false && productStock > 0;
          
          return (
            <div
              key={product.id}
              style={productCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* 상품 이미지 */}
              <div style={{ 
                position: 'relative',
                paddingBottom: '100%', // 1:1 비율
                backgroundColor: '#f5f5f5',
                overflow: 'hidden'
              }}>
                <img
                  src={product.image || '/images/product-placeholder.png'}
                  alt={product.title || product.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = '/images/product-placeholder.png';
                  }}
                />
                
                {/* 세일 라벨 */}
                {product.sale && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#ff4757',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {product.sale}
                  </div>
                )}
                
                {/* 할인율 표시 */}
                {hasDiscount && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: priceColor,
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    -{discountRate}%
                  </div>
                )}
                
                {/* 품절 오버레이 */}
                {!isInStock && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      padding: '10px 20px',
                      borderRadius: '4px'
                    }}>
                      {t('품절')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* 상품 정보 */}
              <div style={{ 
                padding: '15px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* 상품명 */}
                <h3 style={{
                  margin: '0 0 10px',
                  fontSize: '16px',
                  fontWeight: '500',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  color: '#333'
                }}>
                  {product.title || product.name}
                </h3>
                
                {/* 설명 (있는 경우) */}
                {product.description && (
                  <p style={{
                    margin: '0 0 10px',
                    fontSize: '13px',
                    color: '#666',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>
                )}
                
                {/* 가격 정보 */}
                {showPrice && (
                  <div style={{ marginTop: 'auto', marginBottom: '10px' }}>
                    {hasDiscount && (
                      <div style={{
                        fontSize: '14px',
                        color: '#999',
                        textDecoration: 'line-through',
                        marginBottom: '2px'
                      }}>
                        {formatCurrency(productOldPrice)}
                      </div>
                    )}
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: priceColor
                    }}>
                      {formatCurrency(productPrice)}
                    </div>
                  </div>
                )}
                
                {/* 재고 표시 */}
                {showStock && (
                  <div style={{
                    fontSize: '13px',
                    color: isInStock ? stockTextColor : '#dc3545',
                    marginBottom: '10px'
                  }}>
                    {isInStock ? 
                      `${t('재고')}: ${productStock}${t('개')}` : 
                      t('품절')
                    }
                  </div>
                )}
                
                {/* 평점 (있는 경우) */}
                {product.rating && (
                  <div style={{ 
                    fontSize: '13px',
                    marginBottom: '10px'
                  }}>
                    <span style={{ color: '#ffc107' }}>
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </span>
                    <span style={{ color: '#666', marginLeft: '5px' }}>
                      ({product.rating})
                    </span>
                  </div>
                )}
                
                {/* 장바구니 버튼 */}
                {showAddToCart && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isInStock) {
                        handleAddToCart(product);
                      }
                    }}
                    disabled={!isInStock || loading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: isInStock ? cartButtonColor : '#ccc',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: isInStock && !loading ? 'pointer' : 'not-allowed',
                      transition: 'background-color 0.2s',
                      marginTop: '10px'
                    }}
                    onMouseEnter={(e) => {
                      if (isInStock && !loading) {
                        e.currentTarget.style.backgroundColor = '#0056b3';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isInStock && !loading) {
                        e.currentTarget.style.backgroundColor = cartButtonColor;
                      }
                    }}
                  >
                    {!isInStock ? 
                      t('품절') : 
                      loading ? t('처리중...') : t('장바구니 담기')
                    }
                  </button>
                )}
                
                {/* 로그인 필요 메시지 */}
                {!isUserLoggedIn && showAddToCart && (
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    textAlign: 'center',
                    marginTop: '5px'
                  }}>
                    {t('로그인 후 구매 가능')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 페이지네이션 */}
      {showPagination && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '40px'
        }}>
          {/* 이전 페이지 */}
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: currentPage === 1 ? '#ccc' : '#333',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {t('이전')}
          </button>
          
          {/* 페이지 번호 */}
          {(() => {
            const pageNumbers = [];
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage < maxVisiblePages - 1) {
              startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            // 첫 페이지
            if (startPage > 1) {
              pageNumbers.push(
                <button
                  key={1}
                  onClick={() => handlePageChange(1)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    color: '#333',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  1
                </button>
              );
              
              if (startPage > 2) {
                pageNumbers.push(
                  <span key="dots1" style={{ padding: '0 5px', color: '#666' }}>...</span>
                );
              }
            }
            
            // 중간 페이지들
            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: currentPage === i ? cartButtonColor : '#fff',
                    color: currentPage === i ? '#fff' : '#333',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: currentPage === i ? 'bold' : 'normal'
                  }}
                >
                  {i}
                </button>
              );
            }
            
            // 마지막 페이지
            if (endPage < totalPages) {
              if (endPage < totalPages - 1) {
                pageNumbers.push(
                  <span key="dots2" style={{ padding: '0 5px', color: '#666' }}>...</span>
                );
              }
              
              pageNumbers.push(
                <button
                  key={totalPages}
                  onClick={() => handlePageChange(totalPages)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    color: '#333',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {totalPages}
                </button>
              );
            }
            
            return pageNumbers;
          })()}
          
          {/* 다음 페이지 */}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: currentPage === totalPages ? '#ccc' : '#333',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {t('다음')}
          </button>
        </div>
      )}
      
      {/* 모바일에서 "더보기" 버튼 (페이지네이션 대신) */}
      {showPagination && totalPages > 1 && window.innerWidth < 768 && currentPage < totalPages && (
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              padding: '12px 30px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: cartButtonColor,
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {t('더보기')}
          </button>
        </div>
      )}
    </div>
  );
};

// UMD 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyCustomProductListSkin;
} else {
  window.MyCustomProductListSkin = MyCustomProductListSkin;
}
```

## 웹빌더 속성 패널 연동

### 상품목록 컴포넌트 속성 패널에서 설정 가능한 옵션들

웹빌더 에디터에서 상품목록 컴포넌트를 선택하면 우측 속성 패널에서 다음 옵션들을 실시간으로 설정할 수 있습니다:

#### 레이아웃 설정
- **순서**: 컴포넌트 순서 (숫자)
- **그리드 크기**: 1-12 사이의 값 (기본값: 12)
- **CSS 클래스**: 추가 CSS 클래스명 (기본값: 'padding-tb-40')
- **한 줄당 상품 수**: 2개, 3개, 4개, 6개 중 선택 (기본값: 4개)

#### 상품 필터링
- **카테고리 ID**: 특정 카테고리의 상품만 표시
- **포함할 상품 ID**: 콤마로 구분된 상품 ID 목록
- **제외할 상품 ID**: 콤마로 구분된 상품 ID 목록
- **포함할 카테고리 ID**: 콤마로 구분된 카테고리 ID 목록
- **제외할 카테고리 ID**: 콤마로 구분된 카테고리 ID 목록
- **제외할 인덱스**: 콤마로 구분된 상품 인덱스

#### 표시 설정
- **재고 표시**: 재고 수량 표시 여부 (체크박스)
- **페이지당 상품 수**: 1-100 사이의 값 (기본값: 20)

#### 스타일 설정
- **배경색**: 컨테이너 배경색 (색상 선택기)
- **여백**: 컨테이너 여백 (예: '20px')
- **테두리 둥글기**: 컨테이너 모서리 둥글기 (예: '8px')

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

#### 구현 원리
```jsx
// 1. 속성 패널에서 옵션 변경 시 (ProductListProperties.js)
const handleItemsPerRowChange = (value) => {
  handleComponentPropsChange('itemsPerRow', value);
  // 즉시 프리뷰에 반영됨
};

// 2. 스킨에서 실시간으로 받는 방식
const MyProductListSkin = ({ data, options }) => {
  const {
    itemsPerRow = 4,
    backgroundColor = '#ffffff',
    showStock = false
    // ... 기타 옵션들
  } = options;
  
  // options가 변경되면 React가 자동으로 리렌더링
  return (
    <div style={{ backgroundColor }}>
      {/* 상품 그리드 */}
    </div>
  );
};
```

### 속성 패널 ↔ options/data 완전 매핑표

| 속성 패널 섹션 | 속성명 | 데이터 위치 | 타입 | 기본값 | 설명 |
|---|---|---|---|---|---|
| **레이아웃** | | | | | |
| | 순서 | `options.order` | number | - | 컴포넌트 순서 |
| | 그리드 크기 | `options.lg` | number | 12 | 1-12 |
| | CSS 클래스 | `options.className` | string | 'padding-tb-40' | 추가 클래스명 |
| | 한 줄당 상품 수 | `data.itemsPerRow` | number | 4 | 2,3,4,6 |
| **필터링** | | | | | |
| | 카테고리 ID | `options.categoryId` | string | - | 특정 카테고리 |
| | 포함할 상품 | `options.include_product_ids` | string | - | 콤마 구분 |
| | 제외할 상품 | `options.exclude_product_ids` | string | - | 콤마 구분 |
| | 포함할 카테고리 | `options.include_category_ids` | string | - | 콤마 구분 |
| | 제외할 카테고리 | `options.exclude_category_ids` | string | - | 콤마 구분 |
| | 제외할 인덱스 | `options.excludeIndexes` | string | - | 콤마 구분 |
| **표시** | | | | | |
| | 재고 표시 | `data.showStock` | boolean | false | 재고 수량 표시 |
| | 페이지당 상품 수 | `options.itemsPerPage` | number | 20 | 1-100 |
| | 가격 표시 | `options.showPrice` | boolean | true | 가격 표시 여부 |
| | 장바구니 버튼 | `options.showAddToCart` | boolean | true | 버튼 표시 여부 |
| | 페이지네이션 | `options.showPagination` | boolean | true | 페이지네이션 표시 |
| **스타일** | | | | | |
| | 배경색 | `options.backgroundColor` | string | '#ffffff' | 컨테이너 배경 |
| | 여백 | `options.padding` | string | '20px' | 컨테이너 여백 |
| | 테두리 둥글기 | `options.borderRadius` | string | '8px' | 모서리 둥글기 |
| | 가격 색상 | `options.priceColor` | string | '#ff6b6b' | 가격 텍스트 색상 |
| | 버튼 색상 | `options.cartButtonColor` | string | '#007bff' | 장바구니 버튼 색상 |
| | 재고 색상 | `options.stockTextColor` | string | '#28a745' | 재고 텍스트 색상 |

## Props 상세 설명

### data 객체 - 제공되는 데이터

| 속성 | 타입 | 설명 |
|------|------|------|
| `products` | `Product[]` | 현재 페이지의 상품 목록 |
| `loading` | `boolean` | 상품 로딩 상태 |
| `totalProducts` | `number` | 총 상품 개수 |
| `selectedCategory` | `string \| null` | 선택된 카테고리 ID |
| `searchQuery` | `string` | 현재 검색어 |
| `currentPage` | `number` | 현재 페이지 번호 (1부터 시작) |
| `totalPages` | `number` | 총 페이지 개수 |
| `sortBy` | `string` | 정렬 기준 (`name`, `price`, `created`, `stock`) |
| `sortOrder` | `string` | 정렬 순서 (`asc`, `desc`) |
| `itemsPerRow` | `number` | 한 줄에 표시할 상품 개수 |
| `showStock` | `boolean` | 재고 표시 여부 |
| `isUserLoggedIn` | `boolean` | 사용자 로그인 상태 |
| `isAdminMode` | `boolean` | 관리자/에디터 모드 여부 |
| `theme` | `object` | 테마 정보 (primaryColor, secondaryColor 등) |

#### 상품 객체 구조 (Product)
```typescript
interface Product {
  id: number | string;           // 상품 ID
  title: string;                 // 상품 제목
  name: string;                  // 상품 이름
  description?: string;          // 상품 설명
  image?: string;                // 메인 이미지 URL
  imageTwo?: string;             // 보조 이미지 URL (호버용)
  price: number;                 // 현재 가격
  oldPrice?: number;             // 이전 가격 (할인 표시용)
  newPrice: number;              // 현재 가격
  sale?: string;                 // 세일 라벨 (NEW, SALE 등)
  stock?: number;                // 재고 수량
  stockCount?: number;           // 재고 수량
  isInStock?: boolean;           // 재고 여부
  rating?: number;               // 평점 (1-5)
  category_id?: string;          // 카테고리 ID
  created_at?: string;           // 생성일
}
```

### actions 객체

| 함수 | 설명 | 사용법 |
|------|------|--------|
| `handleAddToCart` | 상품을 장바구니에 추가 | `handleAddToCart(product)` |
| `handleCategoryChange` | 카테고리 필터 변경 | `handleCategoryChange(categoryId)` |
| `handleSearch` | 상품 검색 | `handleSearch(query)` |
| `handleSortChange` | 정렬 기준 변경 | `handleSortChange(sortBy, sortOrder)` |
| `handlePageChange` | 페이지 변경 | `handlePageChange(pageNumber)` |

### 액션 상세 설명

#### 1. handleAddToCart
- **목적**: 상품을 장바구니에 추가
- **API 호출**: Redux 'cart/addItem' 액션 디스패치
- **사용법**: 
```jsx
<button onClick={() => handleAddToCart(product)}>
  장바구니 담기
</button>
```

#### 2. handleCategoryChange
- **목적**: 카테고리별 상품 필터링
- **매개변수**: `null` 전달 시 전체 카테고리 표시
- **사용법**:
```jsx
<button onClick={() => handleCategoryChange('category-1')}>
  카테고리 1
</button>
<button onClick={() => handleCategoryChange(null)}>
  전체
</button>
```

#### 3. handleSearch
- **목적**: 상품 검색 (이름, 설명 기준)
- **실시간 필터링**: 입력 즉시 상품 목록 업데이트
- **사용법**:
```jsx
<input 
  type="text"
  placeholder="상품 검색..."
  onChange={(e) => handleSearch(e.target.value)}
/>
```

#### 4. handleSortChange
- **목적**: 상품 정렬 기준 변경
- **정렬 기준**: `name`, `price`, `created`, `stock`
- **정렬 순서**: `asc` (오름차순), `desc` (내림차순)
- **사용법**:
```jsx
<select onChange={(e) => {
  const [sortBy, sortOrder] = e.target.value.split('-');
  handleSortChange(sortBy, sortOrder);
}}>
  <option value="name-asc">이름 오름차순</option>
  <option value="price-desc">가격 높은순</option>
  <option value="created-desc">최신순</option>
</select>
```

#### 5. handlePageChange
- **목적**: 페이지네이션
- **자동 스크롤**: 페이지 변경 시 화면 상단으로 스크롤
- **사용법**:
```jsx
{Array.from({ length: totalPages }, (_, i) => (
  <button 
    key={i + 1}
    onClick={() => handlePageChange(i + 1)}
    className={currentPage === i + 1 ? 'active' : ''}
  >
    {i + 1}
  </button>
))}
```

### options 객체

속성 패널에서 설정한 모든 옵션이 `options` 객체를 통해 스킨으로 전달됩니다:

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `order` | `number` | - | 컴포넌트 순서 |
| `lg` | `number` | 12 | 그리드 크기 (1-12) |
| `className` | `string` | 'padding-tb-40' | CSS 클래스명 |
| `itemsPerPage` | `number` | 20 | 페이지당 상품 수 |
| `categoryId` | `string` | - | 특정 카테고리 ID |
| `include_product_ids` | `string` | - | 포함할 상품 ID (콤마 구분) |
| `exclude_product_ids` | `string` | - | 제외할 상품 ID (콤마 구분) |
| `include_category_ids` | `string` | - | 포함할 카테고리 ID (콤마 구분) |
| `exclude_category_ids` | `string` | - | 제외할 카테고리 ID (콤마 구분) |
| `excludeIndexes` | `string` | - | 제외할 인덱스 (콤마 구분) |
| `showPrice` | `boolean` | true | 가격 표시 여부 |
| `showStock` | `boolean` | true | 재고 표시 여부 |
| `showAddToCart` | `boolean` | true | 장바구니 버튼 표시 |
| `showPagination` | `boolean` | true | 페이지네이션 표시 |
| `sortBy` | `string` | 'created' | 기본 정렬 기준 |
| `sortOrder` | `string` | 'desc' | 기본 정렬 순서 |
| `backgroundColor` | `string` | '#ffffff' | 컨테이너 배경색 |
| `padding` | `string` | '20px' | 컨테이너 여백 |
| `borderRadius` | `string` | '8px' | 모서리 둥글기 |
| `priceColor` | `string` | '#ff6b6b' | 가격 텍스트 색상 |
| `cartButtonColor` | `string` | '#007bff' | 장바구니 버튼 색상 |
| `stockTextColor` | `string` | '#28a745' | 재고 텍스트 색상 |

### utils 객체

| 함수 | 설명 | 예시 |
|------|------|------|
| `t(key)` | 다국어 번역 | `t('상품 목록')` |
| `cx(...classes)` | 클래스명 조합 | `cx('base', isActive && 'active')` |
| `navigate(path)` | 페이지 이동 | `navigate('/product/123')` |
| `formatCurrency(amount)` | 통화 포맷 | `formatCurrency(10000)` |
| `formatDate(date)` | 날짜 포맷 | `formatDate(new Date())` |
| `getAssetUrl(path)` | 에셋 URL 생성 | `getAssetUrl('/images/logo.png')` |

### 기타 Props

| 속성 | 타입 | 설명 |
|------|------|------|
| `mode` | `'editor' \| 'preview' \| 'production'` | 현재 렌더링 모드 |
| `app` | `object` | 앱 전역 정보 (user, company 등) |
| `editor` | `object` | 에디터 모드에서만 제공되는 추가 정보 |

## 스타일링 가이드

```jsx
const ProductListSkin = ({ data, actions, utils }) => {
  const { t } = utils;
  
  // 데이터 구조분해
  const {
    products = [],
    loading = false,
    currentPage = 1,
    totalPages = 1,
    totalProducts = 0,
    selectedCategory = null,
    searchQuery = '',
    sortBy = 'created',
    sortOrder = 'desc',
    itemsPerRow = 4,
    showStock = true,
    isUserLoggedIn = false,
    theme = {}
  } = data;
  
  // 액션 구조분해
  const {
    handleAddToCart,
    handleCategoryChange,
    handleSearch,
    handleSortChange,
    handlePageChange
  } = actions;
  
  // 테마 색상
  const primaryColor = theme?.primaryColor || '#007bff';
  const secondaryColor = theme?.secondaryColor || '#6c757d';
  
  // 로딩 중일 때
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>{t('상품을 불러오는 중...')}</div>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px' }}>
      {/* 헤더 섹션 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ margin: 0 }}>
          {t('상품 목록')} ({totalProducts}개)
        </h2>
        
        {/* 검색 입력 */}
        <input
          type="text"
          placeholder={t('상품 검색...')}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '200px'
          }}
        />
      </div>
      
      {/* 필터 및 정렬 섹션 */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {/* 카테고리 필터 */}
        <div>
          <button
            onClick={() => handleCategoryChange(null)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: selectedCategory === null ? primaryColor : '#f8f9fa',
              color: selectedCategory === null ? 'white' : '#333',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            {t('전체')}
          </button>
          
          {/* 실제 카테고리 목록은 서버에서 제공받아야 함 */}
          <button
            onClick={() => handleCategoryChange('electronics')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: selectedCategory === 'electronics' ? primaryColor : '#f8f9fa',
              color: selectedCategory === 'electronics' ? 'white' : '#333',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            {t('전자제품')}
          </button>
        </div>
        
        {/* 정렬 선택 */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split('-');
            handleSortChange(newSortBy, newSortOrder);
          }}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          <option value="created-desc">{t('최신순')}</option>
          <option value="created-asc">{t('오래된순')}</option>
          <option value="price-asc">{t('가격 낮은순')}</option>
          <option value="price-desc">{t('가격 높은순')}</option>
          <option value="name-asc">{t('이름 순')}</option>
        </select>
      </div>
      
      {/* 상품이 없는 경우 */}
      {products.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px',
          color: '#666'
        }}>
          {searchQuery ? 
            t('검색 결과가 없습니다.') : 
            t('등록된 상품이 없습니다.')
          }
        </div>
      ) : (
        <>
          {/* 상품 그리드 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
            gap: '20px',
            marginBottom: '30px'
          }}>
            {products.map(product => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* 상품 이미지 */}
                <div style={{ 
                  position: 'relative',
                  paddingBottom: '75%', // 4:3 비율
                  overflow: 'hidden'
                }}>
                  <img
                    src={product.image || '/images/product-placeholder.png'}
                    alt={product.title || product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* 세일 라벨 */}
                  {product.sale && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: '#ff4757',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {product.sale}
                    </div>
                  )}
                </div>
                
                {/* 상품 정보 */}
                <div style={{ padding: '15px' }}>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.title || product.name}
                  </h3>
                  
                  {/* 가격 */}
                  <div style={{ marginBottom: '10px' }}>
                    {product.oldPrice && product.oldPrice !== product.price && (
                      <span style={{
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '14px',
                        marginRight: '8px'
                      }}>
                        {product.oldPrice.toLocaleString()}원
                      </span>
                    )}
                    <span style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: primaryColor
                    }}>
                      {(product.price || product.newPrice).toLocaleString()}원
                    </span>
                  </div>
                  
                  {/* 재고 정보 */}
                  {showStock && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: product.isInStock ? '#28a745' : '#dc3545',
                      marginBottom: '10px'
                    }}>
                      {product.isInStock ? 
                        `재고: ${product.stock || product.stockCount || 0}개` : 
                        '품절'
                      }
                    </div>
                  )}
                  
                  {/* 평점 */}
                  {product.rating && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#ffc107',
                      marginBottom: '10px'
                    }}>
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                      <span style={{ color: '#666', marginLeft: '4px' }}>
                        ({product.rating})
                      </span>
                    </div>
                  )}
                  
                  {/* 장바구니 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={!product.isInStock || loading}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: product.isInStock ? primaryColor : '#ccc',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: product.isInStock && !loading ? 'pointer' : 'not-allowed',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (product.isInStock && !loading) {
                        e.currentTarget.style.backgroundColor = '#0056b3';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (product.isInStock && !loading) {
                        e.currentTarget.style.backgroundColor = primaryColor;
                      }
                    }}
                  >
                    {!product.isInStock ? 
                      t('품절') : 
                      loading ? t('처리중...') : t('장바구니 담기')
                    }
                  </button>
                  
                  {/* 로그인 필요 메시지 */}
                  {!isUserLoggedIn && (
                    <div style={{
                      fontSize: '11px',
                      color: '#666',
                      textAlign: 'center',
                      marginTop: '5px'
                    }}>
                      {t('로그인 후 구매 가능')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              marginTop: '30px'
            }}>
              {/* 이전 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: currentPage === 1 ? '#f8f9fa' : 'white',
                  color: currentPage === 1 ? '#ccc' : '#333',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                {t('이전')}
              </button>
              
              {/* 페이지 번호들 */}
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 5);
                const pageNum = startPage + i;
                
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: currentPage === pageNum ? primaryColor : 'white',
                      color: currentPage === pageNum ? 'white' : '#333',
                      cursor: 'pointer',
                      fontWeight: currentPage === pageNum ? 'bold' : 'normal'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {/* 다음 페이지 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: currentPage === totalPages ? '#f8f9fa' : 'white',
                  color: currentPage === totalPages ? '#ccc' : '#333',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                {t('다음')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ✅ UMD 내보내기 (필수)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductListSkin;
} else {
  window.ProductListSkin = ProductListSkin; // 관리자에서 설정한 정확한 이름 사용
}
```

## 📱 반응형 디자인 예시

```jsx
const ResponsiveProductListSkin = ({ data, actions, utils }) => {
  const { itemsPerRow } = data;
  
  // 화면 크기별 그리드 컬럼 설정
  const getGridColumns = () => {
    if (window.innerWidth < 576) return 1; // 모바일: 1열
    if (window.innerWidth < 768) return 2; // 태블릿: 2열
    if (window.innerWidth < 992) return 3; // 작은 데스크탑: 3열
    return itemsPerRow || 4; // 큰 화면: 설정값 또는 4열
  };
  
  const [gridColumns, setGridColumns] = React.useState(getGridColumns());
  
  React.useEffect(() => {
    const handleResize = () => setGridColumns(getGridColumns());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerRow]);
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
      gap: window.innerWidth < 576 ? '15px' : '20px'
    }}>
      {/* 상품 렌더링... */}
    </div>
  );
};
```

## 🚨 주의사항

### 1. **절대 하지 말아야 할 것**
```jsx
// ❌ 직접 API 호출 금지
const fetchProducts = async () => {
  const response = await fetch('/api/products');
  // ...
};

// ❌ 직접 상태 관리 금지
const [products, setProducts] = useState([]);

// ❌ Redux 직접 접근 금지
const dispatch = useDispatch();
```

### 2. **필수 체크사항**
- [ ] `data` 및 `actions` props 구조분해 시 기본값 설정
- [ ] 모든 버튼 클릭 시 `actions`의 함수 사용
- [ ] 이미지 로딩 실패 시 placeholder 이미지 표시
- [ ] 로딩 상태 처리
- [ ] 상품이 없을 때 메시지 표시
- [ ] UMD 내보내기 구현

### 3. **성능 최적화**
```jsx
// ✅ 이미지 lazy loading
<img
  src={product.image}
  loading="lazy"
  alt={product.title}
/>

// ✅ 큰 목록 처리 시 가상화 고려
// React.memo 사용으로 불필요한 리렌더링 방지
const ProductItem = React.memo(({ product, onAddToCart }) => {
  // 상품 아이템 렌더링
});
```

## 🔧 디버깅 가이드

### 상품이 표시되지 않는 경우
```jsx
console.log('🔍 디버깅 정보:', {
  products: data?.products,
  loading: data?.loading,
  totalProducts: data?.totalProducts
});
```

### 장바구니 추가가 안되는 경우
```jsx
const debugAddToCart = (product) => {
  console.log('🛒 장바구니 추가 시도:', product);
  console.log('🛒 actions.handleAddToCart:', actions?.handleAddToCart);
  
  if (!actions?.handleAddToCart) {
    console.error('❌ handleAddToCart 액션이 없습니다!');
    return;
  }
  
  actions.handleAddToCart(product);
};
```

### 필터링이 안되는 경우
```jsx
const debugFilter = (categoryId) => {
  console.log('🔍 카테고리 변경:', categoryId);
  console.log('🔍 현재 선택된 카테고리:', data?.selectedCategory);
  console.log('🔍 actions.handleCategoryChange:', actions?.handleCategoryChange);
  
  actions?.handleCategoryChange?.(categoryId);
};
```

## 📋 체크리스트

스킨 개발 완료 시 다음 항목들을 확인하세요:

### 기본 기능
- [ ] 상품 목록 표시
- [ ] 이미지 표시 (placeholder 포함)
- [ ] 가격 표시 (할인가 포함)
- [ ] 장바구니 추가 버튼
- [ ] 재고 상태 표시

### 필터링 및 정렬
- [ ] 카테고리 필터
- [ ] 검색 기능
- [ ] 정렬 기능 (이름, 가격, 최신순 등)

### 페이지네이션
- [ ] 페이지 번호 표시
- [ ] 이전/다음 버튼
- [ ] 현재 페이지 하이라이트

### 상태 처리
- [ ] 로딩 상태 표시
- [ ] 빈 상품 목록 메시지
- [ ] 검색 결과 없음 메시지
- [ ] 품절 상품 처리

### 사용자 경험
- [ ] 반응형 디자인
- [ ] 호버 효과
- [ ] 로그인 필요 메시지
- [ ] 성공/실패 메시지

### 기술적 요구사항
- [ ] UMD 내보내기
- [ ] 기본값 설정
- [ ] 에러 처리
- [ ] 다국어 지원 (`utils.t` 사용)

이 가이드를 따라 개발하면 WithCookie WebBuilder에서 완전히 작동하는 ProductList 외부 스킨을 만들 수 있습니다.

## 스타일링 가이드

### 1. 인라인 스타일 사용

```jsx
const productCardStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.3s ease'
};

<div style={productCardStyle}>
  {/* 상품 내용 */}
</div>
```

### 2. CSS 파일 분리 (권장)

**dist/my-productlist-skin.css**
```css
.product-list-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
}

.product-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.product-list-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.product-list-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 40px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.product-image-wrapper {
  position: relative;
  padding-bottom: 100%; /* 1:1 비율 */
  background-color: #f5f5f5;
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-sale-label {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #ff4757;
  color: #fff;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-discount-label {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff6b6b;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.product-out-of-stock {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin-top: auto;
  margin-bottom: 10px;
}

.product-old-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 2px;
}

.product-current-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
}

.product-stock {
  font-size: 13px;
  margin-bottom: 10px;
}

.product-stock.in-stock {
  color: #28a745;
}

.product-stock.out-of-stock {
  color: #dc3545;
}

.add-to-cart-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background-color: #007bff;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
}

.add-to-cart-button:hover {
  background-color: #0056b3;
}

.add-to-cart-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}

.pagination-button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.pagination-button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-button.active {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border-color: #007bff;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .product-list-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 15px;
  }
  
  .product-list-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination {
    display: none;
  }
  
  .load-more-button {
    display: block;
    width: 100%;
    padding: 12px;
    margin-top: 30px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
}

@media (min-width: 769px) {
  .load-more-button {
    display: none;
  }
}
```

**스킨 등록 시 CSS 파일 포함**
```javascript
registerComponentSkin({
  id: 'my-custom-productlist',
  name: '나의 커스텀 상품목록',
  componentTypes: ['product-list'],
  umdUrl: 'https://cdn.example.com/my-productlist-skin.umd.js',
  cssUrls: [
    'https://cdn.example.com/my-productlist-skin.css'  // CSS 파일 추가
  ],
  globalName: 'MyCustomProductListSkin'
});
```

### 3. 반응형 디자인

```jsx
const getGridColumns = () => {
  if (window.innerWidth < 576) return 1; // 모바일: 1열
  if (window.innerWidth < 768) return 2; // 태블릿: 2열
  if (window.innerWidth < 992) return 3; // 작은 데스크탑: 3열
  return itemsPerRow || 4; // 큰 화면: 설정값 또는 4열
};

// 화면 크기 변경 감지
React.useEffect(() => {
  const handleResize = () => setGridColumns(getGridColumns());
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [itemsPerRow]);
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

### 3. 배포 옵션

#### GitHub Pages
```bash
# gh-pages 설치
npm install --save-dev gh-pages

# package.json에 스크립트 추가
"deploy": "gh-pages -d dist"

# 배포
npm run deploy
```

#### AWS S3
```bash
# AWS CLI 사용
aws s3 cp dist/my-productlist-skin.umd.js s3://my-bucket/skins/ --acl public-read
aws s3 cp dist/my-productlist-skin.css s3://my-bucket/skins/ --acl public-read
```

#### CDN (jsDelivr + GitHub)
```
# JavaScript 파일
https://cdn.jsdelivr.net/gh/username/repo@version/dist/my-productlist-skin.umd.js

# CSS 파일
https://cdn.jsdelivr.net/gh/username/repo@version/dist/my-productlist-skin.css
```

### 4. CORS 설정

외부 스킨 호스팅 시 CORS 헤더 설정 필요:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## 테스트 방법

### 1. 로컬 테스트

```javascript
// 개발 환경에서 테스트용 등록
import { registerComponentSkin } from '@withcookie/webbuilder';

if (process.env.NODE_ENV === 'development') {
  registerComponentSkin({
    id: 'my-custom-productlist-dev',
    name: '개발용: 나의 커스텀 상품목록',
    componentTypes: ['product-list'],
    umdUrl: 'http://localhost:3001/my-productlist-skin.umd.js',
    cssUrls: ['http://localhost:3001/my-productlist-skin.css'],
    globalName: 'MyCustomProductListSkin'
  });
}
```

### 2. 브라우저 콘솔 확인

```javascript
// 스킨이 로드되었는지 확인
console.log(window.MyCustomProductListSkin);

// Props 구조 확인
const TestSkin = (props) => {
  console.log('Props:', props);
  console.log('Products:', props.data.products);
  console.log('Options:', props.options);
  
  return window.MyCustomProductListSkin(props);
};
```

### 3. 에러 디버깅

```jsx
// 개발 중 디버깅을 위한 로그
const MyCustomProductListSkin = (props) => {
  console.log('Received props:', props);
  console.log('Products:', props.data?.products);
  console.log('Current page:', props.data?.currentPage);
  console.log('Total pages:', props.data?.totalPages);
  console.log('Options:', props.options);
  
  // ... 나머지 코드
};
```

## 실전 예제

### 1. 미니멀한 상품 목록

```jsx
const MinimalProductListSkin = ({ data, actions, options, utils }) => {
  const { t, formatCurrency } = utils;
  const { products, handleAddToCart } = { ...data, ...actions };
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '10px',
      padding: '20px'
    }}>
      {products.map(product => (
        <div key={product.id} style={{ 
          padding: '10px',
          border: '1px solid #eee',
          textAlign: 'center'
        }}>
          <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
          />
          <h4>{product.name}</h4>
          <p>{formatCurrency(product.price)}</p>
          <button onClick={() => handleAddToCart(product)}>
            {t('구매')}
          </button>
        </div>
      ))}
    </div>
  );
};
```

### 2. 리스트형 상품 목록

```jsx
const ListViewProductSkin = ({ data, actions, options, utils }) => {
  const { t, formatCurrency } = utils;
  const { products, handleAddToCart } = { ...data, ...actions };
  
  return (
    <div style={{ padding: '20px' }}>
      {products.map(product => (
        <div key={product.id} style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          borderBottom: '1px solid #eee',
          alignItems: 'center'
        }}>
          <img 
            src={product.image} 
            alt={product.name}
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
          <div style={{ flex: 1 }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b6b' }}>
              {formatCurrency(product.price)}
            </div>
            <button 
              onClick={() => handleAddToCart(product)}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {t('장바구니 담기')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 3. 이미지 호버 효과 상품 목록

```jsx
const HoverEffectProductSkin = ({ data, actions, options, utils }) => {
  const { products } = data;
  const { handleAddToCart } = actions;
  const [hoveredId, setHoveredId] = React.useState(null);
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
      {products.map(product => (
        <div 
          key={product.id}
          onMouseEnter={() => setHoveredId(product.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <img 
            src={hoveredId === product.id && product.imageTwo ? product.imageTwo : product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              transition: 'transform 0.3s',
              transform: hoveredId === product.id ? 'scale(1.1)' : 'scale(1)'
            }}
          />
          
          {/* 호버 시 표시되는 버튼 */}
          {hoveredId === product.id && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px',
              background: 'rgba(0,0,0,0.8)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s'
            }}>
              <button
                onClick={() => handleAddToCart(product)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                장바구니 담기
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

## 속성 패널에서 스킨 선택하기

WithCookie WebBuilder는 에디터의 속성 패널에서 손쉽게 스킨을 선택할 수 있는 UI를 제공합니다.

### 스킨 선택 UI

상품목록 컴포넌트를 선택하면 속성 패널 상단에 "컴포넌트 스킨" 섹션이 표시됩니다:

```
┌─────────────────────────────────┐
│ 🛡️ 컴포넌트 스킨                │
├─────────────────────────────────┤
│ [기본 스킨          ▼]         │
│                                 │
│ 사용 가능한 스킨:              │
│ • 기본 스킨                    │
│ • 나의 커스텀 상품목록         │
│ • 미니멀 상품목록              │
│                                 │
│ [🛒 더 많은 스킨 구매하기]      │
└─────────────────────────────────┘
```

### 구현 방식

WithCookie는 공통 스킨 선택 컴포넌트인 `SkinSelector`를 제공합니다:

```jsx
// ProductListProperties.js에서 사용 예시
import { SkinSelector } from '../CommonProperties';

const ProductListProperties = () => {
  // ... 기타 코드
  
  return (
    <>
      {/* 스킨 선택 UI - 공통 컴포넌트 사용 */}
      <SkinSelector 
        selectedComponent={selectedComponent}
        onSkinChange={(skinId) => handleComponentPropsChange('skin', skinId)}
      />
      
      {/* 나머지 속성 설정 UI */}
    </>
  );
};
```

### 스킨 적용 과정

1. **스킨 선택**: 속성 패널에서 원하는 스킨 선택
2. **즉시 반영**: 선택과 동시에 에디터 캔버스에 실시간 반영
3. **설정 저장**: 선택된 스킨 ID가 컴포넌트 속성에 저장
4. **프로덕션 적용**: 배포 시 선택된 스킨으로 렌더링

## 주의사항 및 팁

### 필수 요구사항

1. **UMD 내보내기**: 반드시 UMD 형식으로 내보내기
   ```jsx
   if (typeof module !== 'undefined' && module.exports) {
     module.exports = MyCustomProductListSkin;
   } else {
     window.MyCustomProductListSkin = MyCustomProductListSkin;
   }
   ```

2. **이벤트 핸들러**: 제공된 핸들러 사용
   ```jsx
   // ✅ 올바른 방법
   <button onClick={() => handleAddToCart(product)}>
   
   // ❌ 잘못된 방법
   <button onClick={async () => {
     await fetch('/api/cart/add', ...);
   }}>
   ```

3. **기본값 설정**: 모든 prop에 기본값 설정
   ```jsx
   const {
     products = [],
     loading = false,
     // ... 기타 기본값들
   } = data;
   ```

### 성능 최적화

1. **이미지 최적화**
   ```jsx
   <img
     src={product.image}
     loading="lazy"  // Lazy loading
     alt={product.name}
   />
   ```

2. **조건부 렌더링**
   ```jsx
   {showPrice && <div>{formatCurrency(product.price)}</div>}
   {showStock && product.stock > 0 && <div>재고: {product.stock}개</div>}
   ```

3. **메모이제이션**
   ```jsx
   const ProductCard = React.memo(({ product, onAddToCart }) => {
     // 상품 카드 컴포넌트
   });
   ```

### 접근성 고려

1. **대체 텍스트**: 이미지에 alt 속성 필수
2. **키보드 네비게이션**: 버튼과 링크에 포커스 가능
3. **스크린 리더**: ARIA 속성 활용

### 다국어 지원

```jsx
// 항상 t() 함수 사용
<h2>{t('상품 목록')}</h2>
<button>{t('장바구니 담기')}</button>

// 동적 메시지
<div>{searchQuery ? t('검색 결과가 없습니다.') : t('등록된 상품이 없습니다.')}</div>
```

### 브라우저 호환성

1. **CSS Grid 폴리필**: 구형 브라우저 지원
2. **Flexbox 대체안**: Grid를 지원하지 않는 경우
3. **벤더 프리픽스**: 필요시 추가

## API 호출 처리

### ❌ 하지 말아야 할 것

스킨에서 직접 API를 호출하지 마세요:

```jsx
// 잘못된 예시
const MyProductListSkin = ({ data, actions, utils }) => {
  const handleAddToCart = async (product) => {
    // ❌ 스킨에서 직접 API 호출하지 마세요
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId: product.id })
      });
      // ...
    } catch (error) {
      // ...
    }
  };
};
```

### ✅ 올바른 방법

Logic에서 제공하는 액션 사용:

```jsx
// 올바른 예시
const MyProductListSkin = ({ data, actions, utils }) => {
  // ✅ Logic에서 제공하는 액션 사용
  const { handleAddToCart } = actions;
  
  return (
    <button onClick={() => handleAddToCart(product)}>
      {장바구니 담기}
    </button>
  );
};
```

## 문제 해결

### 스킨이 로드되지 않을 때

1. 브라우저 개발자 도구 > Network 탭 확인
2. CORS 에러 확인
3. 전역 변수명 확인: `window.MyCustomProductListSkin`
4. UMD 빌드 설정 확인

### 상품이 표시되지 않을 때

1. `data.products` 확인
2. 로딩 상태 확인
3. 필터링 옵션 확인

### 장바구니 추가가 안 될 때

1. `actions.handleAddToCart` 함수 존재 확인
2. 상품 재고 확인
3. 로그인 상태 확인

### Props가 undefined일 때

1. 컴포넌트 등록 시 globalName 확인
2. 빌드 설정의 library 이름 확인
3. 개발자 도구에서 props 로깅

## 결론

이 가이드를 따라 자신만의 독특한 상품목록 스킨을 만들 수 있습니다. 기본 템플릿을 시작으로 점진적으로 커스터마이징하며, 테스트를 통해 안정성을 확보하세요.

중요한 점은:
- 속성 패널의 모든 설정이 실시간으로 반영되도록 구현
- 다양한 레이아웃 옵션 (2열, 3열, 4열, 6열) 지원
- 필터링, 정렬, 검색, 페이지네이션 기능 구현
- 반응형 디자인과 접근성 고려

추가 지원이 필요하면 WithCookie 개발팀에 문의하거나 [공식 문서](https://docs.withcookie.com)를 참고하세요.

---

**버전**: 1.0.0  
**최종 업데이트**: 2024년 12월  
**작성자**: WithCookie 개발팀