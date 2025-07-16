import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderDetailProps {
  order: Order;
  statusLabels: { [key in OrderStatus]?: string };
  dateFormat?: string;
  allowCancel?: boolean;
  allowReturn?: boolean;
  allowExchange?: boolean;
  returnPeriodDays?: number;
  exchangePeriodDays?: number;
  onBack: () => void;
  onAction: (action: string, orderId: number | string) => void;
  onTrackDelivery: (trackingNumber: string, carrier: string) => void;
  onWriteReview: (productId: number | string) => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({
  order,
  statusLabels,
  dateFormat = 'YYYY.MM.DD',
  allowCancel = true,
  allowReturn = true,
  allowExchange = true,
  returnPeriodDays = 7,
  exchangePeriodDays = 7,
  onBack,
  onAction,
  onTrackDelivery,
  onWriteReview
}) => {
  const formatDate = (date: string) => {
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

  const canCancel = allowCancel && ['pending_payment', 'payment_complete'].includes(order.status);
  const canReturn = allowReturn && order.status === 'delivered';
  const canExchange = allowExchange && order.status === 'delivered';
  const canTrack = ['shipping', 'delivered'].includes(order.status) && order.trackingNumber;

  return (
    <div className="order-detail">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4L6 10L12 16" />
          </svg>
          목록으로
        </button>
      </div>

      <div className="order-status-section">
        <h3>주문 상태</h3>
        <div className={`status-badge large ${getStatusClass(order.status)}`}>
          {statusLabels[order.status] || order.status}
        </div>
        {canTrack && (
          <button
            className="track-button"
            onClick={() => onTrackDelivery(order.trackingNumber!, order.trackingCompany || 'CJ대한통운')}
          >
            배송 추적하기
          </button>
        )}
      </div>

      <div className="order-info-section">
        <h3>주문 정보</h3>
        <dl className="info-list">
          <dt>주문번호</dt>
          <dd>{order.orderNumber}</dd>
          <dt>주문일자</dt>
          <dd>{formatDate(order.orderDate)}</dd>
          <dt>결제수단</dt>
          <dd>{order.paymentMethod}</dd>
        </dl>
      </div>

      <div className="order-items-section">
        <h3>주문 상품</h3>
        <div className="items-list">
          {order.items.map((item) => (
            <div key={item.id} className="item-card">
              {item.productImage && (
                <img 
                  src={item.productImage} 
                  alt={item.productName}
                  className="item-image"
                />
              )}
              <div className="item-info">
                <h4 className="item-name">{item.productName}</h4>
                {item.options && (
                  <p className="item-options">{item.options}</p>
                )}
                <div className="item-details">
                  <span className="item-quantity">수량: {item.quantity}개</span>
                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
              {order.status === 'delivered' && (
                <button
                  className="review-button"
                  onClick={() => onWriteReview(item.productId)}
                >
                  리뷰 작성
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {order.deliveryInfo && (
        <div className="delivery-info-section">
          <h3>배송 정보</h3>
          <dl className="info-list">
            <dt>수령인</dt>
            <dd>{order.deliveryInfo.recipientName}</dd>
            <dt>연락처</dt>
            <dd>{order.deliveryInfo.recipientPhone}</dd>
            <dt>배송지</dt>
            <dd>
              [{order.deliveryInfo.zipCode}] {order.deliveryInfo.address}
              {order.deliveryInfo.addressDetail && ` ${order.deliveryInfo.addressDetail}`}
            </dd>
            {order.deliveryInfo.deliveryMessage && (
              <>
                <dt>배송 메시지</dt>
                <dd>{order.deliveryInfo.deliveryMessage}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      <div className="payment-info-section">
        <h3>결제 정보</h3>
        <dl className="payment-list">
          <dt>상품 금액</dt>
          <dd>{formatPrice(order.totalAmount)}</dd>
          {order.discountAmount && order.discountAmount > 0 && (
            <>
              <dt>할인 금액</dt>
              <dd className="discount">-{formatPrice(order.discountAmount)}</dd>
            </>
          )}
          <dt>배송비</dt>
          <dd>{order.shippingFee > 0 ? formatPrice(order.shippingFee) : '무료'}</dd>
          <dt className="total">총 결제금액</dt>
          <dd className="total">{formatPrice(order.finalAmount)}</dd>
        </dl>
      </div>

      <div className="action-buttons">
        {canCancel && (
          <button
            className="action-button cancel"
            onClick={() => onAction('cancel', order.id)}
          >
            주문 취소
          </button>
        )}
        {canReturn && (
          <button
            className="action-button"
            onClick={() => onAction('return', order.id)}
          >
            반품 신청
          </button>
        )}
        {canExchange && (
          <button
            className="action-button"
            onClick={() => onAction('exchange', order.id)}
          >
            교환 신청
          </button>
        )}
        <button
          className="action-button primary"
          onClick={() => onAction('reorder', order.id)}
        >
          재구매
        </button>
      </div>
    </div>
  );
};