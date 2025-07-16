export interface CartSummaryData {
    selectedItemsCount: number;
    totalPrice: number;
    totalOriginalPrice: number;
    totalDiscountAmount: number;
    deliveryFee: number;
    couponDiscountAmount?: number;
    rewardDiscountAmount?: number;
}

export interface CartSummarySkinProps {
    data: {
        id: string;
        type: 'cart-summary';
        summary?: CartSummaryData;
    };
    actions: {
        onOrder?: () => void;
        onCouponApply?: () => void;
        onRewardApply?: () => void;
    };
    options: {
        summary?: CartSummaryData;
        title?: string;
        showTitle?: boolean;
        showOriginalPrice?: boolean;
        showDiscountAmount?: boolean;
        showDeliveryFee?: boolean;
        showCouponDiscount?: boolean;
        showRewardDiscount?: boolean;
        showOrderButton?: boolean;
        orderButtonText?: string;
        orderButtonDisabled?: boolean;
        titleFontSize?: string;
        titleFontWeight?: string;
        titleColor?: string;
        labelFontSize?: string;
        labelColor?: string;
        valueFontSize?: string;
        valueColor?: string;
        discountColor?: string;
        totalPriceFontSize?: string;
        totalPriceColor?: string;
        buttonFontSize?: string;
        buttonFontWeight?: string;
        buttonColor?: string;
        buttonBgColor?: string;
        buttonHoverBgColor?: string;
        buttonDisabledBgColor?: string;
        buttonBorderRadius?: string;
        buttonPadding?: string;
        backgroundColor?: string;
        borderColor?: string;
        borderRadius?: string;
        padding?: string;
        margin?: string;
        itemSpacing?: string;
        showBorder?: boolean;
        layout?: 'vertical' | 'horizontal';
        enableAnimation?: boolean;
        animationType?: 'fade' | 'slide' | 'scale';
        animationDuration?: number;
    };
    mode: 'edit' | 'production';
    utils: {
        t: (key: string, params?: any) => string;
        navigate: (path: string) => void;
        cx: (...classes: string[]) => string;
        getAssetUrl: (path: string) => string;
        formatCurrency: (amount: number) => string;
        formatDate: (date: string) => string;
        showToast: (message: string, options?: any) => void;
    };
    app?: any;
    editor?: any;
}

export interface ComponentSkinProps {
    data: any;
    actions: any;
    options: any;
    mode: 'edit' | 'production';
    utils: any;
    app?: any;
    editor?: any;
}