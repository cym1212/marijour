import type { OrderData, OrderCompleteData, OrderListData, OrderDetailData, OrderCancelData } from '@/types/order';

export const ORDER_MOCK_DATA: OrderData = {
    items: [
        {
            id: 1,
            name: '레고트 누프레임 커플잔 2P',
            thumbnailUrl: '/images/product-1.jpg',
            discountRate: 20,
            price: 32000,
            originalPrice: 40000,
            quantity: 2,
        },
        {
            id: 2,
            name: '모던 스톤웨어 접시 세트',
            discountRate: 15,
            price: 25500,
            originalPrice: 30000,
            thumbnailUrl: '/images/product-2.jpg',
            quantity: 1,
        },
    ],
    deliveryFee: 3000,
    orderDate: '2025-05-05',
};

export const ORDER_COMPLETED_MOCK_DATA: OrderCompleteData = {
    orderNumber: 'ORD123456789',
    orderDate: '2025-05-05',
    paymentAccount: '신한은행 123-456-7890',
    paymentMethod: '무통장 입금',
    paymentDueDate: '2025-05-12',
    refundDepositor: '홍길동',
    refundAccount: '신한은행 987-654-3210',
    ordererName: '홍길동',
    ordererPhoneNumber: '010-1234-5678',
    ordererEmail: 'honggildong@example.com',
    recipientName: '홍길동',
    recipientPhoneNumber: '010-1234-5678',
    deliveryAddress: '서울특별시 강남구 테헤란로 123',
    deliveryRequest: '문 앞에 놓아주세요',
    items: [
        {
            id: 1,
            name: '레고트 누프레임 커플잔 2P',
            thumbnailUrl: '/images/product-1.jpg',
            discountRate: 20,
            price: 32000,
            originalPrice: 40000,
            quantity: 2,
        },
        {
            id: 2,
            name: '모던 스톤웨어 접시 세트',
            discountRate: 15,
            price: 25500,
            originalPrice: 30000,
            thumbnailUrl: '/images/product-2.jpg',
            quantity: 1,
        },
    ],
    totalPrice: 89500,
    totalOriginalPrice: 100000,
    totalDiscountAmount: 10500,
    couponDiscountAmount: 0,
    rewardDiscountAmount: 0,
    deliveryFee: 3000,
};

export const ORDER_HISTORY_MOCK_DATA: OrderListData[] = [
    {
        orderNumber: 'ORD123456789',
        orderDate: '2025-05-05',
        items: [
            {
                id: 1,
                name: '레고트 누프레임 커플잔 2P',
                thumbnailUrl: '/images/product-1.jpg',
                discountRate: 20,
                price: 32000,
                originalPrice: 40000,
                quantity: 2,
                orderStatus: '입금 대기',
            },
            {
                id: 2,
                name: '모던 스톤웨어 접시 세트',
                discountRate: 15,
                price: 25500,
                originalPrice: 30000,
                thumbnailUrl: '/images/product-2.jpg',
                quantity: 1,
                orderStatus: '입금 대기',
            },
        ],
    },
    {
        orderNumber: 'ORD987654321',
        orderDate: '2025-04-20',
        items: [
            {
                id: 3,
                name: '아로마 디퓨저 세트',
                thumbnailUrl: '/images/product-3.jpg',
                discountRate: 10,
                price: 45000,
                originalPrice: 50000,
                quantity: 1,
                orderStatus: '배송 완료',
            },
        ],
    },
];

export const ORDER_DETAIL_MOCK_DATA: OrderDetailData = {
    ...ORDER_COMPLETED_MOCK_DATA,
    items: ORDER_HISTORY_MOCK_DATA[0].items,
};

export const ORDER_CANCEL_MOCK_DATA: OrderCancelData = {
    ...ORDER_COMPLETED_MOCK_DATA,
    items: ORDER_HISTORY_MOCK_DATA[0].items,
    cancelReason: '변심으로 인한 취소',
    cancelDate: '2025-05-06',
};
