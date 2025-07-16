import React from 'react';
import { DeliveryTracking as TrackingType, DeliveryStatus } from '../types';

interface DeliveryTrackingProps {
  tracking: TrackingType;
  deliveryStatusLabels: { [key in DeliveryStatus]?: string };
  onBack: () => void;
}

const DeliveryIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 16V13C16 12.4477 15.5523 12 15 12H1M16 16L20 20M16 16L20 12M9 12V5C9 4.44772 8.55228 4 8 4H1C0.447715 4 0 4.44772 0 5V15C0 15.5523 0.447715 16 1 16H8M9 16H1" />
    <circle cx="3.5" cy="18.5" r="1.5" />
    <circle cx="12.5" cy="18.5" r="1.5" />
  </svg>
);

export const DeliveryTracking: React.FC<DeliveryTrackingProps> = ({
  tracking,
  deliveryStatusLabels,
  onBack
}) => {
  const getStatusClass = (status: DeliveryStatus) => {
    switch (status) {
      case 'ready':
        return 'status-ready';
      case 'in_transit':
        return 'status-transit';
      case 'out_for_delivery':
        return 'status-out';
      case 'delivered':
        return 'status-delivered';
      case 'failed':
        return 'status-failed';
      default:
        return '';
    }
  };

  const isStatusCompleted = (currentStatus: DeliveryStatus, checkStatus: DeliveryStatus) => {
    const statusOrder: DeliveryStatus[] = ['ready', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const checkIndex = statusOrder.indexOf(checkStatus);
    return currentIndex >= checkIndex;
  };

  const formatDateTime = (timestamp: string) => {
    const [date, time] = timestamp.split(' ');
    return {
      date: date.replace(/-/g, '.'),
      time: time || ''
    };
  };

  return (
    <div className="delivery-tracking">
      <div className="tracking-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 4L6 10L12 16" />
          </svg>
          이전으로
        </button>
        <h3>배송 추적</h3>
      </div>

      <div className="tracking-info">
        <div className="tracking-number">
          <span className="label">운송장번호</span>
          <span className="value">{tracking.trackingNumber}</span>
        </div>
        <div className="carrier">
          <span className="label">택배사</span>
          <span className="value">{tracking.carrier}</span>
        </div>
      </div>

      <div className="tracking-status">
        <div className={`current-status ${getStatusClass(tracking.currentStatus)}`}>
          <DeliveryIcon />
          <span>{deliveryStatusLabels[tracking.currentStatus] || tracking.currentStatus}</span>
        </div>

        {tracking.estimatedDeliveryDate && (
          <div className="estimated-delivery">
            예상 도착일: {tracking.estimatedDeliveryDate}
          </div>
        )}
      </div>

      <div className="tracking-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${
                tracking.currentStatus === 'delivered' ? 100 :
                tracking.currentStatus === 'out_for_delivery' ? 75 :
                tracking.currentStatus === 'in_transit' ? 50 :
                tracking.currentStatus === 'ready' ? 25 : 0
              }%` 
            }}
          />
        </div>
        <div className="progress-steps">
          {(['ready', 'in_transit', 'out_for_delivery', 'delivered'] as DeliveryStatus[]).map((status) => (
            <div 
              key={status}
              className={`progress-step ${isStatusCompleted(tracking.currentStatus, status) ? 'completed' : ''}`}
            >
              <div className="step-circle" />
              <span className="step-label">{deliveryStatusLabels[status] || status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tracking-history">
        <h4>배송 상세 정보</h4>
        <div className="history-list">
          {tracking.statusHistory.map((event, index) => {
            const { date, time } = formatDateTime(event.timestamp);
            return (
              <div key={index} className="history-item">
                <div className="history-time">
                  <div className="date">{date}</div>
                  <div className="time">{time}</div>
                </div>
                <div className="history-content">
                  <div className={`history-status ${getStatusClass(event.status)}`}>
                    {deliveryStatusLabels[event.status] || event.status}
                  </div>
                  {event.location && (
                    <div className="history-location">{event.location}</div>
                  )}
                  <div className="history-description">{event.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};