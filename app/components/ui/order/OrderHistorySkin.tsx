import React from 'react';

// 스타일 import
import './order-history-skin-scoped.css';

// TypeScript 인터페이스 정의
interface OrderItem {
  id: number;
  count: number;
  unitPrice: string;
  options?: {
    options?: Array<{
      groupName: string;
      valueName: string;
    }>;
  };
  product: {
    id: number;
    title: string;
    config?: {
      img_url?: string;
      default_price?: number;
      discounted_price?: number;
    };
  };
}

interface Order {
  id: number;
  orderNumber?: string; // 선택사항 - 제공되지 않을 수 있음
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  shippingFee: number;
  paymentMethod: string;
  deliveryInfo?: {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address: string;
    addressDetail: string;
    deliveryMessage?: string;
    trackingNumber?: string;
    carrierName?: string;
  };
  carts: OrderItem[];
}

interface ComponentSkinProps {
  data?: {
    id?: string;
    style?: React.CSSProperties;
    componentProps?: {
      title?: string;
      emptyText?: string;
      itemsPerPage?: number;
    };
    orders?: Order[];
    loading?: boolean;
    error?: any;
    currentPage?: number;
    totalPages?: number;
    totalOrders?: number;
    searchQuery?: string;
    selectedStatus?: string;
    selectedDateRange?: string;
    selectedOrder?: Order | null;
    showOrderDetail?: boolean;
    isUserLoggedIn?: boolean;
    isAdminMode?: boolean;
    theme?: any;
    isMobile?: boolean;
    deviceType?: string;
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
    checkouts?: Order[];
    itemsPerPage?: number;
    title?: string;
    emptyText?: string;
    reviewModalOpen?: boolean;
    selectedProduct?: any;
    selectedOrderForReview?: any;
    deliveryModalOpen?: boolean;
    selectedCheckout?: any;
  };
  actions?: {
    setSearchQuery?: (query: string) => void;
    setSelectedStatus?: (status: string) => void;
    setSelectedDateRange?: (range: string) => void;
    handleViewDetail?: (order: Order) => void;
    handleCancelOrder?: (orderId: number) => void;
    handleTrackShipment?: (order: Order) => void;
    handleAddToCartAgain?: (order: Order) => void;
    handlePageChange?: (page: number) => void;
    setShowOrderDetail?: (show: boolean) => void;
    getStatusText?: (status: string) => string;
    getStatusInfo?: (status: string) => { text: string; class: string; icon: string };
    formatDate?: (date: string) => string;
    loadOrders?: (page: number, take: number) => void;
    openReviewModal?: (product: any, order: Order) => void;
    handleReviewSubmitted?: () => void;
    setReviewModalOpen?: (open: boolean) => void;
    openDeliveryModal?: (order: Order) => void;
    setDeliveryModalOpen?: (open: boolean) => void;
  };
  options?: any;
  mode?: 'production' | 'preview' | 'editor';
  utils?: {
    t?: (key: string) => string;
    navigate?: (path: string) => void;
    formatCurrency?: (amount: number, currency?: string) => string;
    formatDate?: (date: string | Date, format?: string) => string;
    getAssetUrl?: (path: string) => string;
    cx?: (...classes: (string | undefined | null | false)[]) => string;
  };
  app?: {
    user?: any | null;
    settings?: Record<string, any>;
    theme?: any;
  };
  editor?: {
    isSelected?: boolean;
    onSelect?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    dragHandleProps?: any;
  };
}

// 더미 데이터
const DUMMY_ORDERS: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2024-0001',
    status: 'delivered',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    totalAmount: 157000,
    shippingFee: 3000,
    paymentMethod: '신용카드',
    deliveryInfo: {
      recipientName: '홍길동',
      recipientPhone: '010-1234-5678',
      zipCode: '06234',
      address: '서울특별시 강남구 테헤란로 123',
      addressDetail: '위워크빌딩 12층',
      deliveryMessage: '부재시 경비실에 맡겨주세요',
      trackingNumber: '1234567890',
      carrierName: 'CJ대한통운'
    },
    carts: [
      {
        id: 1,
        count: 2,
        unitPrice: '32000',
        product: {
          id: 1,
          title: '레고트 누프레임 커플잔 2P',
          config: {
            img_url: 'https://via.placeholder.com/100x100/f0f0f0/666?text=Product+1',
            default_price: 40000,
            discounted_price: 32000
          }
        }
      },
      {
        id: 2,
        count: 3,
        unitPrice: '30000',
        options: {
          options: [
            { groupName: '색상', valueName: '블루' },
            { groupName: '사이즈', valueName: 'M' }
          ]
        },
        product: {
          id: 2,
          title: '프리미엄 텀블러',
          config: {
            img_url: 'https://via.placeholder.com/100x100/f0f0f0/666?text=Product+2',
            default_price: 35000,
            discounted_price: 30000
          }
        }
      }
    ]
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-0002',
    status: 'shipped',
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-21T09:10:00Z',
    totalAmount: 28000,
    shippingFee: 3000,
    paymentMethod: '계좌이체',
    deliveryInfo: {
      recipientName: '김철수',
      recipientPhone: '010-9876-5432',
      zipCode: '04524',
      address: '서울특별시 중구 세종대로 110',
      addressDetail: '서울시청 본관',
      trackingNumber: '9876543210',
      carrierName: '한진택배'
    },
    carts: [
      {
        id: 3,
        count: 1,
        unitPrice: '25000',
        product: {
          id: 3,
          title: '모던 스톤웨어 접시 세트',
          config: {
            img_url: 'https://via.placeholder.com/100x100/f0f0f0/666?text=Product+3',
            default_price: 30000,
            discounted_price: 25000
          }
        }
      }
    ]
  }
];

/**
 * OrderHistorySkin 컴포넌트
 */
const OrderHistorySkin: React.FC<ComponentSkinProps> = ({
  data = {},
  actions = {},
  utils = {},
  mode = 'production'
}) => {
  // 데이터 추출
  const {
    orders = [],
    loading = false,
    error = null,
    currentPage = 1,
    totalPages = 1,
    totalOrders = 0,
    searchQuery = '',
    selectedStatus = '',
    selectedDateRange = '',
    showOrderDetail = false,
    selectedOrder = null,
    isUserLoggedIn = true,
    isAdminMode = false,
    isMobile = false,
    title = '주문 내역',
    emptyText = '주문 내역이 없습니다.',
    reviewModalOpen = false,
    deliveryModalOpen = false,
    selectedProduct,
    selectedOrderForReview,
    selectedCheckout
  } = data;

  // 액션 추출
  const {
    setSearchQuery = () => {},
    setSelectedStatus = () => {},
    setSelectedDateRange = () => {},
    handleViewDetail = () => {},
    handleCancelOrder = () => {},
    handleTrackShipment = () => {},
    handleAddToCartAgain = () => {},
    handlePageChange = () => {},
    getStatusInfo = (status: string) => {
      const statusMap: Record<string, { text: string; class: string; icon: string }> = {
        // 실제 사용되는 상태값 (대문자)
        REQUESTED: { text: '주문 요청됨', class: 'requested', icon: '📋' },
        PENDING: { text: '결제 대기 중', class: 'pending', icon: '⏳' },
        PREPARING: { text: '상품 준비 중', class: 'preparing', icon: '📦' },
        PAID: { text: '결제 완료', class: 'paid', icon: '💰' },
        SHIPPING: { text: '배송 중', class: 'shipping', icon: '🚚' },
        ARRIVED: { text: '배송 도착', class: 'arrived', icon: '🏠' },
        FINISHED: { text: '배송 완료', class: 'finished', icon: '✅' },
        ISSUE: { text: '배송 문제 발생', class: 'issue', icon: '⚠️' },
        CANCELLED: { text: '주문 취소됨', class: 'cancelled', icon: '❌' },
        CANCELED: { text: '주문 취소됨', class: 'cancelled', icon: '❌' }, // 미국식 철자
        REFUNDED: { text: '환불 완료', class: 'refunded', icon: '💸' },
        // 하위 호환성을 위한 소문자 상태값
        pending: { text: '결제 대기', class: 'pending', icon: '🕐' },
        processing: { text: '처리중', class: 'processing', icon: '📦' },
        shipped: { text: '배송중', class: 'shipped', icon: '🚚' },
        delivered: { text: '배송 완료', class: 'delivered', icon: '✅' },
        cancelled: { text: '취소됨', class: 'cancelled', icon: '❌' }
      };
      return statusMap[status] || { text: status, class: '', icon: '❓' };
    },
    openReviewModal = () => {},
    setReviewModalOpen = () => {},
    openDeliveryModal = () => {},
    setDeliveryModalOpen = () => {}
  } = actions;

  // 유틸 추출
  const {
    t = (key: string) => key,
    navigate = () => {},
    formatCurrency = (amount: number) => `${amount.toLocaleString()}원`,
    formatDate = (date: string | Date) => {
      const d = new Date(date);
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    }
  } = utils;

  // 관리자 모드일 때 더미 데이터 사용
  const actualOrders = (isAdminMode && orders.length === 0) ? DUMMY_ORDERS : orders;

  // 로딩 상태
  if (loading) {
    return (
      <div className="oh-skin-container">
        <div className="oh-skin-loading">
          <p>{t('주문 내역을 불러오는 중입니다...')}</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="oh-skin-container">
        <div className="oh-skin-error">
          <p>{t('주문 내역을 불러오는데 실패했습니다')}</p>
          <button onClick={() => window.location.reload()} className="oh-skin-retry-btn">
            {t('다시 시도')}
          </button>
        </div>
      </div>
    );
  }

  // 로그인 필요
  if (!isUserLoggedIn && !isAdminMode) {
    return (
      <div className="oh-skin-container">
        <div className="oh-skin-login-required">
          <p>{t('주문 내역을 확인하려면 로그인이 필요합니다.')}</p>
          <button onClick={() => navigate('/login')} className="oh-skin-login-btn">
            {t('로그인')}
          </button>
        </div>
      </div>
    );
  }

  // 주문이 없는 경우
  if (!actualOrders || actualOrders.length === 0) {
    return (
      <div className="oh-skin-container">
        <h2 className="oh-skin-title">{title}</h2>
        <div className="oh-skin-empty">
          <p>{emptyText}</p>
          <button onClick={() => navigate('/shop')} className="oh-skin-continue-btn">
            {t('쇼핑 계속하기')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="oh-skin-flex-1 oh-skin-hidden oh-skin-lg-block">
      <div className="oh-skin-myOrderContainer">
        <div className="oh-skin-flex oh-skin-items-center oh-skin-gap-3 oh-skin-pt-1 oh-skin-pb-5">
          <h3 className="oh-skin-font-serif oh-skin-text-2xl oh-skin-leading-heading oh-skin-flex oh-skin-items-center oh-skin-gap-2">
            <a className="oh-skin-p-1 oh-skin-lg-hidden" href="/my-page/orders" data-discover="true">
              <svg width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="oh-skin-hover-primary" style={{ transform: 'rotate(-90deg)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
              </svg>
            </a>
            <span>{title}</span>
          </h3>
        </div>
        
        {/* 주문 목록 */}
        <ul className="oh-skin-flex oh-skin-flex-col oh-skin-gap-42">
          {actualOrders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            
            return (
              <li key={order.id} className="oh-skin-border-t oh-skin-border-black">
                <div className="oh-skin-flex oh-skin-items-center oh-skin-gap-2 oh-skin-py-4">
                  <p className="oh-skin-font-bold">{formatDate(order.createdAt)}</p>
                  <span className="oh-skin-w-1px oh-skin-h-14px oh-skin-mx-1 oh-skin-bg-black-20"></span>
                  <a 
                    className="oh-skin-flex oh-skin-items-center oh-skin-gap-1 oh-skin-text-sm oh-skin-text-black-60 oh-skin-hover-primary" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewDetail(order);
                    }}
                  >
                    <span>주문 번호 : {order.orderNumber || order.id}</span>
                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="oh-skin-hover-primary oh-skin-w-16 oh-skin-h-16" style={{ transform: 'rotate(90deg)' }}>
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
                    </svg>
                  </a>
                </div>
                
                <ul>
                  {order.carts.map(cartItem => (
                    <li key={cartItem.id} className="oh-skin-flex oh-skin-items-center oh-skin-justify-between oh-skin-gap-5 oh-skin-border-t oh-skin-border-black-10 oh-skin-py-4">
                      <div className="oh-skin-flex-1">
                        <div className="oh-skin-flex oh-skin-items-center oh-skin-gap-4">
                          <div className="oh-skin-w-50 oh-skin-md-w-70 oh-skin-h-50 oh-skin-md-h-70 oh-skin-shrink-0">
                            <a href={`/products/${cartItem.product?.id}`} data-discover="true">
                              <img 
                                alt={cartItem.product?.title} 
                                className="oh-skin-w-full oh-skin-h-full oh-skin-object-cover" 
                                src={cartItem.product?.config?.img_url || 'https://via.placeholder.com/70x70'}
                              />
                            </a>
                          </div>
                          <div className="oh-skin-space-y-1 oh-skin-md-space-y-2">
                            <p className="oh-skin-text-sm oh-skin-font-bold oh-skin-line-clamp-2">{cartItem.product?.title}</p>
                            <div className="oh-skin-flex oh-skin-items-center oh-skin-gap-1 oh-skin-text-sm">
                              <p>{cartItem.count}개</p>
                              <span className="oh-skin-w-1px oh-skin-h-14px oh-skin-mx-1 oh-skin-bg-black-20"></span>
                              <p>{formatCurrency(Number(cartItem.unitPrice) * cartItem.count)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="oh-skin-flex oh-skin-items-center oh-skin-gap-15">
                        <p className="oh-skin-text-primary oh-skin-font-bold">{statusInfo.text}</p>
                        {(order.status === 'pending' || order.status === 'PENDING') && (
                          <button 
                            type="button" 
                            className="oh-skin-flex oh-skin-items-center oh-skin-justify-center oh-skin-border oh-skin-hover-bg-primary-90 oh-skin-transition-colors oh-skin-bg-white oh-skin-text-black-80 oh-skin-border-black-20 oh-skin-hover-bg-primary-10 oh-skin-text-sm oh-skin-px-6 oh-skin-py-1-5"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            주문 취소
                          </button>
                        )}
                        {(order.status === 'delivered' || order.status === 'DELIVERED' || order.status === 'FINISHED') && (
                          <button 
                            type="button" 
                            className="oh-skin-flex oh-skin-items-center oh-skin-justify-center oh-skin-border oh-skin-hover-bg-primary-90 oh-skin-transition-colors oh-skin-bg-white oh-skin-text-black-80 oh-skin-border-black-20 oh-skin-hover-bg-primary-10 oh-skin-text-sm oh-skin-px-6 oh-skin-py-1-5"
                            onClick={() => openReviewModal(cartItem.product, order)}
                          >
                            리뷰 작성
                          </button>
                        )}
                        {(order.status === 'shipped' || order.status === 'delivered' || 
                          order.status === 'SHIPPING' || order.status === 'ARRIVED' || order.status === 'FINISHED') && (
                          <button 
                            type="button" 
                            className="oh-skin-flex oh-skin-items-center oh-skin-justify-center oh-skin-border oh-skin-hover-bg-primary-90 oh-skin-transition-colors oh-skin-bg-white oh-skin-text-black-80 oh-skin-border-black-20 oh-skin-hover-bg-primary-10 oh-skin-text-sm oh-skin-px-6 oh-skin-py-1-5"
                            onClick={() => openDeliveryModal(order)}
                          >
                            배송 조회
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav className="oh-skin-flex oh-skin-items-center oh-skin-justify-center oh-skin-space-x-3 oh-skin-mt-10" aria-label="페이지네이션">
            {/* 첫 페이지로 이동 */}
            <button
              type="button"
              className={`oh-skin-p-2 ${currentPage === 1 ? 'oh-skin-text-black-40 oh-skin-cursor-not-allowed' : 'oh-skin-text-black oh-skin-hover-black-40'}`}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="첫 페이지로 이동"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.292 9.209a1.036 1.036 0 0 1 1.414 0L17 15.202a.69.69 0 0 1 0 1.01.777.777 0 0 1-1.06 0l-5.94-5.656-5.94 5.656a.777.777 0 0 1-1.06 0 .69.69 0 0 1 0-1.01l6.293-5.993Z" fill="currentColor"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.292 3.494a1.036 1.036 0 0 1 1.414 0L17 9.487a.69.69 0 0 1 0 1.01.777.777 0 0 1-1.06 0l-5.94-5.656-5.94 5.656a.777.777 0 0 1-1.06 0 .69.69 0 0 1 0-1.01l6.293-5.993Z" fill="currentColor"></path>
              </svg>
            </button>

            {/* 이전 페이지 */}
            <button
              type="button"
              className={`oh-skin-p-2 ${currentPage === 1 ? 'oh-skin-text-black-40 oh-skin-cursor-not-allowed' : 'oh-skin-text-black oh-skin-hover-black-40'}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="이전 페이지"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-90deg)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
              </svg>
            </button>

            {/* 페이지 번호들 */}
            <div className="oh-skin-flex oh-skin-items-center oh-skin-space-x-1">
              {(() => {
                const maxVisiblePages = 5;
                const pages: number[] = [];
                
                if (totalPages <= maxVisiblePages) {
                  // 전체 페이지가 5개 이하면 모든 페이지 표시
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // 현재 페이지를 중심으로 페이지 범위 계산
                  const halfVisible = Math.floor(maxVisiblePages / 2);
                  let startPage = currentPage - halfVisible;
                  let endPage = currentPage + halfVisible;
                  
                  // 시작 페이지가 1보다 작으면 조정
                  if (startPage < 1) {
                    startPage = 1;
                    endPage = maxVisiblePages;
                  }
                  
                  // 끝 페이지가 전체 페이지보다 크면 조정
                  if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = totalPages - maxVisiblePages + 1;
                    if (startPage < 1) startPage = 1;
                  }
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(i);
                  }
                }
                
                return pages.map(pageNum => (
                  <button
                    key={pageNum}
                    type="button"
                    className={`oh-skin-text-sm ${pageNum === currentPage ? 'oh-skin-font-bold oh-skin-text-primary' : 'oh-skin-text-black-40 oh-skin-hover-primary'}`}
                    style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`${pageNum}페이지로 이동`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
            </div>

            {/* 다음 페이지 */}
            <button
              type="button"
              className={`oh-skin-p-2 ${currentPage === totalPages ? 'oh-skin-text-black-40 oh-skin-cursor-not-allowed' : 'oh-skin-text-black oh-skin-hover-black-40'}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="다음 페이지"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(90deg)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
              </svg>
            </button>

            {/* 마지막 페이지로 이동 */}
            <button
              type="button"
              className={`oh-skin-p-2 ${currentPage === totalPages ? 'oh-skin-text-black-40 oh-skin-cursor-not-allowed' : 'oh-skin-text-black oh-skin-hover-black-40'}`}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="마지막 페이지로 이동"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(90deg)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.292 9.209a1.036 1.036 0 0 1 1.414 0L17 15.202a.69.69 0 0 1 0 1.01.777.777 0 0 1-1.06 0l-5.94-5.656-5.94 5.656a.777.777 0 0 1-1.06 0 .69.69 0 0 1 0-1.01l6.293-5.993Z" fill="currentColor"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M9.292 3.494a1.036 1.036 0 0 1 1.414 0L17 9.487a.69.69 0 0 1 0 1.01.777.777 0 0 1-1.06 0l-5.94-5.656-5.94 5.656a.777.777 0 0 1-1.06 0 .69.69 0 0 1 0-1.01l6.293-5.993Z" fill="currentColor"></path>
              </svg>
            </button>
          </nav>
        )}
      </div>
    </section>
  );
};

export default OrderHistorySkin;