import { ComponentSkinProps } from '@wcbuilder/core';

export interface CartItem {
  id: number;
  name: string;
  thumbnailUrl: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  quantity: number;
  options?: Array<{
    name: string;
    value: string;
  }>;
  stock?: number;
}

export interface CouponInfo {
  id: string;
  code: string;
  name: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  minOrderAmount?: number;
}

export interface DeliveryInfo {
  fee: number;
  freeShippingThreshold?: number;
  message?: string;
  regions?: Array<{
    name: string;
    additionalFee: number;
  }>;
}

export interface CartData {
  items: CartItem[];
  selectedItemIds?: number[];
  coupons?: CouponInfo[];
  availablePoints?: number;
  usedPoints?: number;
  deliveryInfo?: DeliveryInfo;
  showCoupon?: boolean;
  showPoints?: boolean;
  emptyMessage?: string;
  emptySubMessage?: string;
  emptyButtonText?: string;
  emptyButtonLink?: string;
}

export interface CartSummaryData {
  selectedCount: number;
  totalOriginalPrice: number;
  totalDiscountAmount: number;
  couponDiscountAmount: number;
  pointsDiscountAmount: number;
  deliveryFee: number;
  totalPrice: number;
}

export type CartSkinProps = ComponentSkinProps<CartData>;