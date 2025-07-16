export type OrderStatus = 
  | 'pending_payment'
  | 'payment_complete'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'exchange_requested'
  | 'return_requested';

export type DeliveryStatus = 
  | 'ready'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed';

export interface OrderItem {
  id: number | string;
  productId: number | string;
  productName: string;
  productImage?: string;
  options?: string;
  quantity: number;
  price: number;
  status?: OrderStatus;
}

export interface Order {
  id: number | string;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount?: number;
  finalAmount: number;
  paymentMethod: string;
  deliveryInfo?: DeliveryInfo;
  trackingNumber?: string;
  trackingCompany?: string;
}

export interface DeliveryInfo {
  recipientName: string;
  recipientPhone: string;
  address: string;
  addressDetail?: string;
  zipCode: string;
  deliveryMessage?: string;
}

export interface DeliveryTracking {
  trackingNumber: string;
  carrier: string;
  currentStatus: DeliveryStatus;
  statusHistory: DeliveryEvent[];
  estimatedDeliveryDate?: string;
}

export interface DeliveryEvent {
  timestamp: string;
  status: DeliveryStatus;
  location?: string;
  description: string;
}

export interface OrderFilter {
  startDate?: string;
  endDate?: string;
  status?: OrderStatus[];
  searchKeyword?: string;
}

export interface OrderHistoryData {
  orders: Order[];
  currentFilter?: OrderFilter;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  selectedOrderId?: number | string;
  viewMode?: 'list' | 'detail';
  showDeliveryTracking?: boolean;
}

export interface OrderHistoryActions {
  onFilterChange?: (filter: OrderFilter) => void;
  onPageChange?: (page: number) => void;
  onOrderSelect?: (orderId: number | string) => void;
  onViewModeChange?: (mode: 'list' | 'detail') => void;
  onOrderCancel?: (orderId: number | string) => void;
  onOrderReturn?: (orderId: number | string) => void;
  onOrderExchange?: (orderId: number | string) => void;
  onTrackDelivery?: (trackingNumber: string, carrier: string) => void;
  onReorder?: (orderId: number | string) => void;
  onWriteReview?: (productId: number | string) => void;
}

export interface OrderHistoryOptions {
  dateFormat?: string;
  showFilter?: boolean;
  showPagination?: boolean;
  allowCancel?: boolean;
  allowReturn?: boolean;
  allowExchange?: boolean;
  returnPeriodDays?: number;
  exchangePeriodDays?: number;
  emptyMessage?: string;
  statusLabels?: {
    [key in OrderStatus]?: string;
  };
  deliveryStatusLabels?: {
    [key in DeliveryStatus]?: string;
  };
}

export interface ComponentSkinProps<T = any> {
  data: T;
  actions?: any;
  options?: any;
  utils?: {
    navigate?: (path: string) => void;
    [key: string]: any;
  };
  mode?: 'view' | 'edit';
  app?: any;
  editor?: any;
}

export interface OrderHistorySkinProps extends ComponentSkinProps<OrderHistoryData> {
  actions?: OrderHistoryActions;
  options?: OrderHistoryOptions;
}