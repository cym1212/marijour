export interface CartItem {
    id: number;
    thumbnailUrl: string;
    name: string;
    quantity: number;
    price: number;
    discountRate: number;
    originalPrice: number;
}

export interface CartPurchaseBarProps {
    totalPrice: number;
    totalLength: number;
    deliveryFee: number;
    onOrder: () => void;
}

export interface CartSummaryProps {
    selectedItemsCount: number;
    totalPrice: number;
    totalOriginalPrice: number;
    totalDiscountAmount: number;
    deliveryFee: number;
    onOrder: () => void;
    couponDiscountAmount?: number;
    rewardDiscountAmount?: number;
}

export interface CartItemProps {
    item: CartItem;
    isSelected: boolean;
    onSelect: (itemId: number, checked: boolean) => void;
    onQuantityChange: (itemId: number, newQuantity: number) => void;
    onDelete: (itemId: number) => void;
}
