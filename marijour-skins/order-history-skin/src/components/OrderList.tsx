import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderListProps {
  orders: Order[];
  statusLabels: { [key in OrderStatus]?: string };
  dateFormat?: string;
  onOrderSelect: (orderId: number | string) => void;
  onTrackDelivery: (trackingNumber: string, carrier: string) => void;
  onOrderAction: (action: string, orderId: number | string) => void;
  onWriteReview: (productId: number | string) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  statusLabels,
  dateFormat = 'YYYY.MM.DD',
  onOrderSelect,
  onTrackDelivery,
  onOrderAction,
  onWriteReview
}) => {
  const formatDate = (date: string) => {
    // 간단한 날짜 포맷팅
    return date.replace(/-/g, '.');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원';
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return 'status-pending';
      case 'payment_complete':
      case 'preparing':
        return 'status-preparing';
      case 'shipping':
        return 'status-shipping';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
      case 'refunded':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const canWriteReview = (status: OrderStatus) => {
    return status === 'delivered';
  };

  const canTrackDelivery = (status: OrderStatus) => {
    return ['shipping', 'delivered'].includes(status);
  };

  const canCancelOrder = (status: OrderStatus) => {
    return ['pending_payment', 'payment_complete'].includes(status);
  };

  return (
    <div className="order-list">
      {orders.map((order) => (
        <div key={order.id} className="order-item">
          <div className="order-header">
            <div className="order-info">
              <span className="order-date">{formatDate(order.orderDate)}</span>
              <span className="order-number">주문번호: {order.orderNumber}</span>
            </div>
            <button 
              className="detail-button"
              onClick={() => onOrderSelect(order.id)}
            >
              상세보기
            </button>
          </div>

          <div className="order-products">
            {order.items.map((item, index) => (
              <div key={item.id} className="product-item">
                {item.productImage && (
                  <img 
                    src={item.productImage} 
                    alt={item.productName}
                    className="product-image"
                  />
                )}
                <div className="product-info">
                  <h4 className="product-name">{item.productName}</h4>
                  {item.options && (
                    <p className="product-options">{item.options}</p>
                  )}
                  <div className="product-details">
                    <span className="product-quantity">{item.quantity}개</span>
                    <span className="product-price">{formatPrice(item.price)}</span>
                  </div>
                </div>
                <div className="product-status">
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <div className="product-actions">
                    {canTrackDelivery(order.status) && order.trackingNumber && (
                      <button
                        className="action-button"
                        onClick={() => onTrackDelivery(order.trackingNumber!, order.trackingCompany || 'CJ대한통운')}
                      >
                        배송조회
                      </button>
                    )}
                    {canWriteReview(order.status) && (
                      <button
                        className="action-button"
                        onClick={() => onWriteReview(item.productId)}
                      >
                        리뷰작성
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="order-summary">
              <span className="summary-label">결제금액</span>
              <span className="summary-amount">{formatPrice(order.finalAmount)}</span>
            </div>
            <div className="order-actions">
              {canCancelOrder(order.status) && (
                <button
                  className="action-button cancel"
                  onClick={() => onOrderAction('cancel', order.id)}
                >
                  주문취소
                </button>
              )}
              <button
                className="action-button"
                onClick={() => onOrderAction('reorder', order.id)}
              >
                재구매
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};