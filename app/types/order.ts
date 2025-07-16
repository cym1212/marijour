export interface OrderItem {
    id: number;
    name: string;
    thumbnailUrl: string;
    quantity: number;
    price: number;
    discountRate: number;
    originalPrice: number;
}

export interface OrderData {
    items: OrderItem[];
    deliveryFee: number;
    orderDate: string;
}

export interface DeliveryInfoSectionProps {
    // 상태 값들
    recipient: string;
    deliveryPhoneNumber: string;
    zonecode: string;
    roadAddress: string;
    detailAddress: string;
    deliveryRequest: string;
    customDeliveryRequest: string;

    // 에러 상태
    errors: Record<string, string>;

    // 핸들러들
    handleRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRecipientBlur: () => void;
    handleDeliveryPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeliveryPhoneNumberBlur: () => void;
    handleSearchAddress: () => void;
    handleDetailAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeliveryRequestChange: (value: string) => void;
    handleCustomDeliveryRequestChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // 옵션들
    deliveryRequestOptions: Array<{ value: string; label: string }>;
}

export interface OrdererInfoSectionProps {
    // 상태 값들
    name: string;
    email: string;
    orderPhoneNumber: string;

    // 로그인 관련
    isLoggedIn: boolean;
    userInfo: { name: string; email: string } | null;

    // 에러 상태
    errors: Record<string, string>;

    // 핸들러들
    handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNameBlur: () => void;
    handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEmailBlur: () => void;
    handleOrderPhoneNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleOrderPhoneNumberBlur: () => void;
}
export interface OrderItemsSectionProps {
    items: OrderItem[];
}

export interface Coupon {
    id: string;
    name: string;
    discountAmount: number;
    discountType: 'percentage' | 'amount';
    expiryDate: string;
}

export interface CouponRewardSectionProps {
    // 상태 값들
    coupon: string;
    reward: string;

    // 에러 상태
    errors: Record<string, string>;

    // 핸들러들
    handleSearchCoupon: () => void;
    handleSearchReward: () => void;
    handleRewardChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // 쿠폰 목록
    availableCoupons: Coupon[];
}

export interface PaymentMethodSectionProps {
    // 상태 값들
    paymentMethod: string;
    paymentBank: string;

    // 에러 상태
    errors: Record<string, string>;

    // 핸들러들
    handlePaymentMethodChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePaymentBankChange: (value: string) => void;
}

export interface RefundAccountSectionProps {
    // 상태 값들
    depositor: string;
    refundBank: string;
    accountNumber: string;

    // 에러 상태
    errors: Record<string, string>;

    // 핸들러들
    handleDepositorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDepositorBlur: () => void;
    handleRefundBankChange: (value: string) => void;
    handleAccountNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleAccountNumberBlur: () => void;
}

export interface OrderSummaryProps {
    totalPrice: number;
    totalOriginalPrice: number;
    totalDiscountAmount: number;
    couponDiscountAmount: number;
    rewardDiscountAmount: number;
    deliveryFee: number;
    onOrder?: () => void;
    buttons?: React.ReactNode;
}

export interface OrderCompleteData extends Omit<OrderSummaryProps, 'onOrder'> {
    orderNumber: string;
    orderDate: string;
    paymentAccount: string;
    paymentMethod: string;
    paymentDueDate: string;
    refundDepositor: string;
    refundAccount: string;
    ordererName: string;
    ordererPhoneNumber: string;
    ordererEmail: string;
    recipientName: string;
    recipientPhoneNumber: string;
    deliveryAddress: string;
    deliveryRequest: string;
    items: OrderItem[];
}

export type OrderStatus = '입금 대기' | '배송 준비 중' | '배송 중' | '배송 완료' | '주문 취소';

export type OrderListItem = OrderItem & { orderStatus: OrderStatus };

export interface OrderListData {
    orderNumber: string;
    orderDate: string;
    items: OrderListItem[];
}

export interface OrderListProps {
    orders: OrderListData[];
    button?: React.ReactNode;
    btnText?: string;
    btnHandler?: (orderNumber: string, item: OrderListItem) => void;
    btnHref?: string;
    onCancelOrder?: (orderNumber: string, itemName: string) => void;
}

export interface OrderDetailData extends Omit<OrderCompleteData, 'items'> {
    items: OrderListData['items'];
}

export interface InfoDataListData {
    dt: string;
    dd: string;
    isBold?: boolean;
    isBetween?: boolean;
    isSmall?: boolean;
}

export interface InfoDataListContainerProps {
    title: string;
    data: InfoDataListData[];
}

export interface OrderCancelData extends OrderDetailData {
    cancelReason: string;
    cancelDate: string;
}
