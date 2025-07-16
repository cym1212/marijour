import { ComponentSkinProps } from '@wcbuilder/core';

export interface OrderItem {
  id: number;
  name: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
  options?: Array<{
    name: string;
    value: string;
  }>;
}

export interface OrdererInfo {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryInfo {
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  roadAddress: string;
  detailAddress: string;
  deliveryRequest: string;
  customRequest?: string;
}

export interface CouponInfo {
  id: string;
  code: string;
  name: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  minOrderAmount?: number;
  isUsed?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'virtual' | 'mobile' | 'simple';
  enabled: boolean;
}

export interface RefundAccount {
  holderName: string;
  bankCode: string;
  accountNumber: string;
}

export interface Bank {
  code: string;
  name: string;
}

export interface OrderSummary {
  totalProductAmount: number;
  productDiscountAmount: number;
  couponDiscountAmount: number;
  pointsDiscountAmount: number;
  deliveryFee: number;
  totalPaymentAmount: number;
}

export interface DeliveryRequest {
  value: string;
  label: string;
}

export interface OrderData {
  // Order items
  items: OrderItem[];
  
  // User info (pre-filled if logged in)
  ordererInfo?: Partial<OrdererInfo>;
  
  // Available options
  coupons?: CouponInfo[];
  availablePoints?: number;
  paymentMethods?: PaymentMethod[];
  banks?: Bank[];
  deliveryRequests?: DeliveryRequest[];
  
  // Delivery info
  deliveryFee?: number;
  freeShippingThreshold?: number;
  
  // UI options
  showSameAsOrderer?: boolean;
  showCoupon?: boolean;
  showPoints?: boolean;
  showRefundAccount?: boolean;
  requireTermsAgreement?: boolean;
  termsLinks?: Array<{
    id: string;
    label: string;
    url: string;
    required: boolean;
  }>;
}

export interface OrderFormData {
  deliveryInfo: DeliveryInfo;
  ordererInfo: OrdererInfo;
  selectedCouponId?: string;
  usedPoints: number;
  paymentMethodId: string;
  refundAccount?: RefundAccount;
  termsAgreed?: Record<string, boolean>;
  sameAsOrderer?: boolean;
}

export type OrderSkinProps = ComponentSkinProps<OrderData>;