# 주문 내역 스킨 개발 가이드

이 가이드는 웹빌더의 주문 내역(OrderHistory) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 컴포넌트 개요

OrderHistory는 사용자의 주문 내역을 표시하고 관리하는 이커머스 컴포넌트입니다. 주문 상태 확인, 배송 추적, 주문 취소, 재구매 등의 기능을 제공하며, 검색과 필터링 기능도 포함되어 있습니다.

## 데이터 구조

### 주문 아이템 (OrderHistoryItem)

```typescript
interface OrderHistoryItem {
  id: string | number;              // 주문 ID
  orderDate: string;                // 주문 일자 (ISO 8601 형식)
  status: string;                   // 주문 상태
  totalAmount: number;              // 총 주문 금액
  shippingFee: number;              // 배송비
  shippingAddress: string;          // 배송 주소
  trackingNumber?: string;          // 운송장 번호
  items: Array<{                    // 주문 상품 목록
    name: string;                   // 상품명
    quantity: number;               // 수량
    price: number;                  // 가격
    image?: string;                 // 상품 이미지 URL
    productId?: string | number;    // 상품 ID
  }>;
}
```

### 주문 상태 종류

```typescript
type OrderStatus = 
  | 'pending'      // 결제 대기
  | 'processing'   // 처리중
  | 'shipped'      // 배송중
  | 'delivered'    // 배송완료
  | 'cancelled'    // 취소됨
  | 'refunded';    // 환불됨
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
    
    // OrderHistoryLogic에서 반환된 모든 필드가 직접 포함됨
    orders: OrderHistoryItem[];       // 현재 페이지의 주문 목록
    loading: boolean;                 // 로딩 상태
    currentPage: number;              // 현재 페이지 번호
    totalPages: number;               // 전체 페이지 수
    totalOrders: number;              // 전체 주문 수
    searchQuery: string;              // 검색어
    selectedStatus: string | null;    // 선택된 상태 필터
    selectedDateRange: string;        // 선택된 날짜 범위 ('all', 'week', 'month', '3months', '6months', 'year')
    selectedOrder: any;               // 선택된 주문 (상세보기용)
    showOrderDetail: boolean;         // 주문 상세 모달 표시 여부
    isUserLoggedIn: boolean;          // 사용자 로그인 상태
    isAdminMode: boolean;             // 관리자 모드 여부
    theme: Record<string, any>;       // 테마 정보
    
    // 기타 데이터
    [key: string]: any;
  };
  
  // OrderHistoryLogic에서 반환된 액션들
  actions: {
    setSearchQuery: (query: string) => void;                     // 검색어 설정
    setSelectedStatus: (status: string | null) => void;          // 상태 필터 설정
    setSelectedDateRange: (range: string) => void;               // 날짜 범위 설정
    handleViewDetail: (order: any) => void;                       // 주문 상세 보기
    handleCancelOrder: (orderId: string) => Promise<void>;        // 주문 취소
    handleTrackShipment: (trackingNumber: string) => void;        // 배송 추적
    handleReorder: (order: any) => Promise<void>;                 // 재구매
    handlePageChange: (page: number) => void;                     // 페이지 변경
    setShowOrderDetail: (show: boolean) => void;                  // 주문 상세 모달 토글
    getStatusText: (status: string) => string;                    // 상태 텍스트 가져오기
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    title?: string;                       // 제목
    emptyText?: string;                   // 주문 내역 없음 메시지
    itemsPerPage?: number;                // 페이지당 항목 수
    showPagination?: boolean;             // 페이지네이션 표시 여부
    showSearch?: boolean;                 // 검색 기능 표시 여부
    showFilter?: boolean;                 // 필터 기능 표시 여부
    showOrderDetail?: boolean;            // 주문 상세 버튼 표시 여부
    showCancelButton?: boolean;           // 주문 취소 버튼 표시 여부
    showTrackingButton?: boolean;         // 배송 추적 버튼 표시 여부
    primaryButtonColor?: string;          // 기본 버튼 색상
    secondaryButtonColor?: string;        // 보조 버튼 색상
    dangerButtonColor?: string;           // 위험 작업 버튼 색상
    statusColors?: {                      // 상태별 색상
      pending?: string;
      processing?: string;
      shipped?: string;
      delivered?: string;
      cancelled?: string;
      refunded?: string;
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

OrderHistory 컴포넌트는 다음과 같은 방식으로 데이터를 받습니다:

1. **Redux State**: 주문 목록은 Redux store의 order 상태에서 가져옵니다
2. **Property Panel**: 에디터에서 설정한 UI 옵션값 (options 객체로 전달)
3. **Local State**: 필터링, 검색, 페이지네이션 상태 (data 객체에 병합)
4. **Dummy Data**: 관리자 모드에서는 더미 데이터를 표시합니다

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MyOrderHistorySkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  const { t, cx, formatCurrency, formatDate } = utils;
  
  // 데이터 추출
  const { 
    orders,
    loading,
    currentPage,
    totalPages,
    totalOrders,
    searchQuery,
    selectedStatus,
    selectedDateRange,
    isUserLoggedIn,
    isAdminMode
  } = data;
  
  // 액션 추출
  const {
    setSearchQuery,
    setSelectedStatus,
    setSelectedDateRange,
    handleViewDetail,
    handleCancelOrder,
    handleTrackShipment,
    handleReorder,
    handlePageChange,
    getStatusText
  } = actions;
  
  // 옵션 추출
  const {
    title = t('주문 내역'),
    emptyText = t('주문 내역이 없습니다.'),
    showPagination = true,
    showSearch = true,
    showFilter = true,
    primaryButtonColor = '#007bff',
    statusColors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545',
      refunded: '#6c757d'
    }
  } = options;
  
  // 로그인 체크
  if (!isUserLoggedIn && !isAdminMode) {
    return (
      <div className={cx('order-history-container', options.className)}>
        <h1>{title}</h1>
        <div className="empty-state">
          <p>{t('로그인이 필요한 서비스입니다.')}</p>
          <button 
            onClick={() => utils.navigate('/login')}
            style={{ backgroundColor: primaryButtonColor }}
          >
            {t('로그인하기')}
          </button>
        </div>
      </div>
    );
  }
  
  // 로딩 상태
  if (loading) {
    return (
      <div className={cx('order-history-container', 'loading')}>
        <h1>{title}</h1>
        <div className="loading-spinner">
          {t('주문 내역을 불러오는 중...')}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cx('order-history-container', options.className)}>
      <h1>{title}</h1>
      
      {/* 필터 영역 */}
      {(showSearch || showFilter) && (
        <div className="filters">
          {showSearch && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('주문번호 또는 상품명 검색')}
              className="search-input"
            />
          )}
          
          {showFilter && (
            <>
              <select
                value={selectedStatus || ''}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                className="status-filter"
              >
                <option value="">{t('전체 상태')}</option>
                <option value="pending">{t('결제 대기')}</option>
                <option value="processing">{t('처리중')}</option>
                <option value="shipped">{t('배송중')}</option>
                <option value="delivered">{t('배송완료')}</option>
                <option value="cancelled">{t('취소됨')}</option>
                <option value="refunded">{t('환불됨')}</option>
              </select>
              
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="date-filter"
              >
                <option value="all">{t('전체 기간')}</option>
                <option value="week">{t('1주일')}</option>
                <option value="month">{t('1개월')}</option>
                <option value="3months">{t('3개월')}</option>
                <option value="6months">{t('6개월')}</option>
                <option value="year">{t('1년')}</option>
              </select>
            </>
          )}
        </div>
      )}
      
      {/* 주문 목록 */}
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>{emptyText}</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetail={() => handleViewDetail(order)}
              onCancel={() => handleCancelOrder(order.id)}
              onTrack={() => handleTrackShipment(order.trackingNumber)}
              onReorder={() => handleReorder(order)}
              getStatusText={getStatusText}
              statusColors={statusColors}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              t={t}
            />
          ))}
        </div>
      )}
      
      {/* 페이지네이션 */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          t={t}
        />
      )}
    </div>
  );
};

// 주문 카드 컴포넌트
const OrderCard: React.FC<{
  order: any;
  onViewDetail: () => void;
  onCancel: () => void;
  onTrack: () => void;
  onReorder: () => void;
  getStatusText: (status: string) => string;
  statusColors: Record<string, string>;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  t: (key: string) => string;
}> = ({ order, onViewDetail, onCancel, onTrack, onReorder, getStatusText, statusColors, formatCurrency, formatDate, t }) => {
  const canCancel = order.status === 'pending' || order.status === 'processing';
  const hasTracking = order.trackingNumber && (order.status === 'shipped' || order.status === 'delivered');
  
  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-info">
          <div className="order-id">{t('주문번호')}: {order.id}</div>
          <div className="order-date">{formatDate(order.orderDate)}</div>
          <div 
            className="order-status"
            style={{ backgroundColor: statusColors[order.status] }}
          >
            {getStatusText(order.status)}
          </div>
        </div>
        <div className="order-total">
          {formatCurrency(order.totalAmount)}
        </div>
      </div>
      
      <div className="order-items">
        {order.items.slice(0, 2).map((item: any, index: number) => (
          <div key={index} className="order-item">
            <img 
              src={item.image || '/images/product-placeholder.png'} 
              alt={item.name}
              onError={(e: any) => {
                e.target.src = '/images/product-placeholder.png';
              }}
            />
            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-details">
                {t('수량')}: {item.quantity} | {formatCurrency(item.price)}
              </div>
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="more-items">
            {t('외')} {order.items.length - 2}{t('개 상품')}
          </div>
        )}
      </div>
      
      <div className="order-actions">
        <button onClick={onViewDetail} className="btn-secondary">
          {t('주문 상세')}
        </button>
        
        {hasTracking && (
          <button onClick={onTrack} className="btn-primary">
            {t('배송 추적')}
          </button>
        )}
        
        {canCancel && (
          <button 
            onClick={() => {
              if (window.confirm(t('주문을 취소하시겠습니까?'))) {
                onCancel();
              }
            }} 
            className="btn-danger"
          >
            {t('주문 취소')}
          </button>
        )}
        
        <button onClick={onReorder} className="btn-primary">
          {t('재구매')}
        </button>
      </div>
    </div>
  );
};

// 페이지네이션 컴포넌트
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: (key: string) => string;
}> = ({ currentPage, totalPages, onPageChange, t }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };
  
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-btn"
      >
        {t('이전')}
      </button>
      
      {renderPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`page-btn ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-btn"
      >
        {t('다음')}
      </button>
    </div>
  );
};

export default MyOrderHistorySkin;
```

## 주문 상태 처리

### 상태별 스타일링

```typescript
// 상태별 색상 매핑
const getStatusStyle = (status: string, statusColors: Record<string, string>) => {
  return {
    backgroundColor: statusColors[status] || '#6c757d',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  };
};

// 상태별 아이콘
const getStatusIcon = (status: string) => {
  const icons = {
    pending: '⏳',
    processing: '⚙️',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌',
    refunded: '💰'
  };
  return icons[status] || '📦';
};

// 상태별 액션 활성화
const getAvailableActions = (status: string) => {
  return {
    canCancel: status === 'pending' || status === 'processing',
    canTrack: status === 'shipped' || status === 'delivered',
    canReturn: status === 'delivered',
    canReview: status === 'delivered'
  };
};
```

## 검색 및 필터링

### 실시간 검색

```typescript
// 디바운스된 검색
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// 검색 컴포넌트
const SearchBox = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="주문번호, 상품명으로 검색"
      className="search-input"
    />
  );
};
```

### 복합 필터

```typescript
// 필터 컴포넌트
const OrderFilters = ({ filters, onChange }: {
  filters: {
    status: string | null;
    dateRange: string;
    priceRange?: [number, number];
  };
  onChange: (filters: any) => void;
}) => {
  return (
    <div className="filters-container">
      {/* 상태 필터 */}
      <select
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value || null })}
      >
        <option value="">전체 상태</option>
        {/* 상태 옵션들 */}
      </select>
      
      {/* 날짜 범위 필터 */}
      <select
        value={filters.dateRange}
        onChange={(e) => onChange({ ...filters, dateRange: e.target.value })}
      >
        <option value="all">전체 기간</option>
        <option value="today">오늘</option>
        <option value="week">1주일</option>
        <option value="month">1개월</option>
        <option value="custom">직접 선택</option>
      </select>
      
      {/* 가격 범위 필터 */}
      <div className="price-range">
        <input
          type="number"
          placeholder="최소 금액"
          value={filters.priceRange?.[0] || ''}
          onChange={(e) => onChange({
            ...filters,
            priceRange: [Number(e.target.value), filters.priceRange?.[1] || 0]
          })}
        />
        <span>~</span>
        <input
          type="number"
          placeholder="최대 금액"
          value={filters.priceRange?.[1] || ''}
          onChange={(e) => onChange({
            ...filters,
            priceRange: [filters.priceRange?.[0] || 0, Number(e.target.value)]
          })}
        />
      </div>
    </div>
  );
};
```

## 주문 상세 모달

### 상세 정보 표시

```typescript
const OrderDetailModal = ({ order, onClose }: {
  order: any;
  onClose: () => void;
}) => {
  if (!order) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>주문 상세 정보</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* 주문 정보 */}
          <section className="order-info-section">
            <h3>주문 정보</h3>
            <dl>
              <dt>주문번호</dt>
              <dd>{order.id}</dd>
              <dt>주문일시</dt>
              <dd>{formatDate(order.orderDate)}</dd>
              <dt>주문상태</dt>
              <dd>
                <span style={getStatusStyle(order.status)}>
                  {getStatusText(order.status)}
                </span>
              </dd>
            </dl>
          </section>
          
          {/* 배송 정보 */}
          <section className="shipping-info-section">
            <h3>배송 정보</h3>
            <dl>
              <dt>배송지</dt>
              <dd>{order.shippingAddress}</dd>
              {order.trackingNumber && (
                <>
                  <dt>운송장번호</dt>
                  <dd>
                    {order.trackingNumber}
                    <button onClick={() => handleTrackShipment(order.trackingNumber)}>
                      배송추적
                    </button>
                  </dd>
                </>
              )}
            </dl>
          </section>
          
          {/* 상품 목록 */}
          <section className="items-section">
            <h3>주문 상품</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>상품</th>
                  <th>수량</th>
                  <th>단가</th>
                  <th>금액</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <div className="item-cell">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3}>배송비</td>
                  <td>{formatCurrency(order.shippingFee)}</td>
                </tr>
                <tr>
                  <td colSpan={3}><strong>총 결제금액</strong></td>
                  <td><strong>{formatCurrency(order.totalAmount)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};
```

## 반응형 디자인

### 모바일 대응

```css
/* 모바일 스타일 */
@media (max-width: 768px) {
  .order-card {
    padding: 16px;
  }
  
  .order-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .order-info {
    flex-direction: column;
    gap: 8px;
  }
  
  .order-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .order-actions button {
    width: 100%;
  }
  
  .filters {
    flex-direction: column;
    gap: 12px;
  }
  
  .filters > * {
    width: 100%;
  }
  
  .order-item {
    flex-direction: row;
    gap: 12px;
  }
  
  .order-item img {
    width: 60px;
    height: 60px;
  }
}

/* 태블릿 스타일 */
@media (max-width: 1024px) {
  .order-list {
    gap: 16px;
  }
  
  .order-actions {
    flex-wrap: wrap;
  }
}
```

## 성능 최적화

### 가상 스크롤

```typescript
// 대량 주문 목록을 위한 가상 스크롤
import { FixedSizeList } from 'react-window';

const VirtualOrderList = ({ orders, itemHeight = 200 }: {
  orders: any[];
  itemHeight?: number;
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <OrderCard order={orders[index]} {...otherProps} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={orders.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

### 이미지 최적화

```typescript
// 이미지 지연 로딩
const LazyImage = ({ src, alt, fallback }: {
  src: string;
  alt: string;
  fallback: string;
}) => {
  const [imageSrc, setImageSrc] = useState(fallback);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setImageSrc(fallback);
      setIsLoading(false);
    };
    img.src = src;
  }, [src, fallback]);
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`product-image ${isLoading ? 'loading' : ''}`}
    />
  );
};
```

## 접근성 고려사항

```typescript
// 접근성 향상
const AccessibleOrderHistory = () => (
  <div role="region" aria-label="주문 내역">
    <h1 id="order-history-title">주문 내역</h1>
    
    {/* 검색 영역 */}
    <div role="search" aria-label="주문 검색">
      <label htmlFor="order-search" className="sr-only">
        주문 검색
      </label>
      <input
        id="order-search"
        type="search"
        placeholder="주문번호 또는 상품명 검색"
        aria-describedby="search-help"
      />
      <span id="search-help" className="sr-only">
        주문번호나 상품명으로 검색할 수 있습니다
      </span>
    </div>
    
    {/* 주문 목록 */}
    <ul role="list" aria-label="주문 목록">
      {orders.map(order => (
        <li key={order.id} role="listitem">
          <article aria-labelledby={`order-${order.id}-title`}>
            <h2 id={`order-${order.id}-title`}>
              주문번호 {order.id}
            </h2>
            {/* 주문 내용 */}
          </article>
        </li>
      ))}
    </ul>
    
    {/* 페이지네이션 */}
    <nav aria-label="주문 목록 페이지 네비게이션">
      {/* 페이지 버튼들 */}
    </nav>
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
    filename: 'order-history-skin.js',
    library: 'OrderHistoryCustomSkin',
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
  id: 'custom-order-history',
  name: '커스텀 주문 내역',
  componentTypes: ['order_history'],
  umdUrl: 'https://cdn.example.com/skins/order-history-skin.js',
  globalName: 'OrderHistoryCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/order-history-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '모던한 디자인의 주문 내역',
  version: '1.0.0',
  author: 'Your Name'
});
```

#### API 기반 자동 등록
위드쿠키 스킨 마켓플레이스에 등록하면 자동으로 사용 가능합니다.

## 주의사항

1. **로그인 상태**: 비로그인 사용자에게는 로그인 유도 화면을 표시해야 합니다
2. **관리자 모드**: 에디터 모드에서는 더미 데이터가 표시됩니다
3. **주문 취소**: 취소 가능한 상태(pending, processing)에서만 취소 버튼을 표시합니다
4. **배송 추적**: trackingNumber가 있고 배송 상태일 때만 추적 버튼을 표시합니다
5. **성능**: 주문 목록이 많을 경우 가상 스크롤 구현을 고려하세요
6. **에러 처리**: API 호출 실패 시 적절한 에러 메시지를 표시하세요
7. **날짜 형식**: 로케일에 맞는 날짜 형식을 사용하세요

## 액션 상세 설명

### setSearchQuery
- **용도**: 검색어 설정
- **매개변수**: `query: string`
- **동작**: 주문번호나 상품명으로 필터링

### setSelectedStatus
- **용도**: 상태 필터 설정
- **매개변수**: `status: string | null`
- **동작**: 특정 상태의 주문만 표시

### setSelectedDateRange
- **용도**: 날짜 범위 필터 설정
- **매개변수**: `range: string` ('all', 'week', 'month', '3months', '6months', 'year')
- **동작**: 선택한 기간의 주문만 표시

### handleViewDetail
- **용도**: 주문 상세 정보 표시
- **매개변수**: `order: any`
- **동작**: 상세 모달 표시 또는 페이지 이동

### handleCancelOrder
- **용도**: 주문 취소
- **매개변수**: `orderId: string`
- **반환**: `Promise<void>`
- **동작**: 주문 취소 API 호출 및 상태 업데이트

### handleTrackShipment
- **용도**: 배송 추적
- **매개변수**: `trackingNumber: string`
- **동작**: 배송 추적 페이지로 이동

### handleReorder
- **용도**: 재구매
- **매개변수**: `order: any`
- **반환**: `Promise<void>`
- **동작**: 주문 상품을 장바구니에 추가하고 장바구니 페이지로 이동

### handlePageChange
- **용도**: 페이지 변경
- **매개변수**: `page: number`
- **동작**: 선택한 페이지로 이동 및 스크롤 초기화

### getStatusText
- **용도**: 상태 텍스트 가져오기
- **매개변수**: `status: string`
- **반환**: `string`
- **동작**: 영문 상태를 한글로 변환

## 스타일링 팁

### CSS 구조
```css
.order-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.order-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.order-actions {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}
```