import type { CartItem } from '@/types/cart';

export const CART_MOCK_DATA: CartItem[] = [
    {
        id: 1,
        name: '레고트 누프레임 커플잔 2P',
        discountRate: 20,
        price: 32000,
        originalPrice: 40000,
        thumbnailUrl: '/images/product-1.jpg',
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
    {
        id: 3,
        name: '에코 우드 컵 4P 세트',
        discountRate: 10,
        price: 18000,
        originalPrice: 20000,
        thumbnailUrl: '/images/product-3.jpg',
        quantity: 1,
    },
];
