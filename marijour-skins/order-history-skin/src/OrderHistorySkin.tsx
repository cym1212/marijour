import React, { useState, useEffect, useRef } from 'react';
import { OrderHistorySkinProps, Order } from './types';
import { OrderFilter } from './components/OrderFilter';
import { OrderList } from './components/OrderList';
import { OrderDetail } from './components/OrderDetail';
import { DeliveryTracking } from './components/DeliveryTracking';
import { EmptyState } from './components/EmptyState';
import './order-history-skin.scss';

const OrderHistorySkin: React.FC<OrderHistorySkinProps> = ({ 
  data, 
  actions, 
  options = {},
  utils 
}) => {
  const {
    orders = [],
    currentFilter = {},
    currentPage = 1,
    totalPages = 1,
    pageSize = 10,
    selectedOrderId,
    viewMode = 'list',
    showDeliveryTracking = false
  } = data || {};

  const {
    dateFormat = 'YYYY.MM.DD',
    showFilter = true,
    showPagination = true,
    allowCancel = true,
    allowReturn = true,
    allowExchange = true,
    returnPeriodDays = 7,
    exchangePeriodDays = 7,
    emptyMessage = '주문 내역이 없습니다.',
    statusLabels = {
      pending_payment: '입금 대기',
      payment_complete: '결제 완료',
      preparing: '배송 준비중',
      shipping: '배송중',
      delivered: '배송 완료',
      cancelled: '주문 취소',
      refunded: '환불 완료',
      exchange_requested: '교환 요청',
      return_requested: '반품 요청'
    },
    deliveryStatusLabels = {
      ready: '배송 준비',
      in_transit: '배송중',
      out_for_delivery: '배송 출발',
      delivered: '배송 완료',
      failed: '배송 실패'
    }
  } = options;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 페이지 진입 애니메이션
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '1';
    }
  }, []);

  // 선택된 주문 업데이트
  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find(o => o.id === selectedOrderId);
      setSelectedOrder(order || null);
    }
  }, [selectedOrderId, orders]);

  const handleFilterChange = (filter: any) => {
    if (actions?.onFilterChange) {
      actions.onFilterChange(filter);
    }
  };

  const handlePageChange = (page: number) => {
    if (actions?.onPageChange) {
      actions.onPageChange(page);
    }
  };

  const handleOrderSelect = (orderId: number | string) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order || null);
    if (actions?.onOrderSelect) {
      actions.onOrderSelect(orderId);
    }
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    setShowTracking(false);
    if (actions?.onViewModeChange) {
      actions.onViewModeChange('list');
    }
  };

  const handleTrackDelivery = (trackingNumber: string, carrier: string) => {
    setShowTracking(true);
    // Mock tracking data - 실제로는 API 호출
    setTrackingInfo({
      trackingNumber,
      carrier,
      currentStatus: 'in_transit',
      statusHistory: [
        {
          timestamp: '2024-01-20 09:00',
          status: 'ready',
          location: '서울 강남 물류센터',
          description: '상품이 준비되었습니다.'
        },
        {
          timestamp: '2024-01-20 14:00',
          status: 'in_transit',
          location: '서울 강남 물류센터',
          description: '상품이 배송 시작되었습니다.'
        }
      ]
    });
    
    if (actions?.onTrackDelivery) {
      actions.onTrackDelivery(trackingNumber, carrier);
    }
  };

  const handleOrderAction = (action: string, orderId: number | string) => {
    switch (action) {
      case 'cancel':
        if (actions?.onOrderCancel) {
          actions.onOrderCancel(orderId);
        }
        break;
      case 'return':
        if (actions?.onOrderReturn) {
          actions.onOrderReturn(orderId);
        }
        break;
      case 'exchange':
        if (actions?.onOrderExchange) {
          actions.onOrderExchange(orderId);
        }
        break;
      case 'reorder':
        if (actions?.onReorder) {
          actions.onReorder(orderId);
        }
        break;
    }
  };

  const handleWriteReview = (productId: number | string) => {
    if (actions?.onWriteReview) {
      actions.onWriteReview(productId);
    } else if (utils?.navigate) {
      utils.navigate(`/review/write/${productId}`);
    }
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          처음
        </button>
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        {pages}
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
        <button
          className="page-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          마지막
        </button>
      </div>
    );
  };

  return (
    <div className="order-history-skin" ref={containerRef}>
      <div className="order-history-header">
        <h2 className="page-title">주문/배송 조회</h2>
      </div>

      {showFilter && !selectedOrder && !showTracking && (
        <OrderFilter
          filter={currentFilter}
          onChange={handleFilterChange}
          statusLabels={statusLabels}
        />
      )}

      {showTracking && trackingInfo ? (
        <DeliveryTracking
          tracking={trackingInfo}
          deliveryStatusLabels={deliveryStatusLabels}
          onBack={() => setShowTracking(false)}
        />
      ) : selectedOrder ? (
        <OrderDetail
          order={selectedOrder}
          statusLabels={statusLabels}
          dateFormat={dateFormat}
          allowCancel={allowCancel}
          allowReturn={allowReturn}
          allowExchange={allowExchange}
          returnPeriodDays={returnPeriodDays}
          exchangePeriodDays={exchangePeriodDays}
          onBack={handleBackToList}
          onAction={handleOrderAction}
          onTrackDelivery={handleTrackDelivery}
          onWriteReview={handleWriteReview}
        />
      ) : orders.length > 0 ? (
        <>
          <OrderList
            orders={orders}
            statusLabels={statusLabels}
            dateFormat={dateFormat}
            onOrderSelect={handleOrderSelect}
            onTrackDelivery={handleTrackDelivery}
            onOrderAction={handleOrderAction}
            onWriteReview={handleWriteReview}
          />
          {renderPagination()}
        </>
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </div>
  );
};

export default OrderHistorySkin;