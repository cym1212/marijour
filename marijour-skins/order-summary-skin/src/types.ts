export interface OrderSummaryData {
    totalPrice: number;
    totalOriginalPrice: number;
    totalDiscountAmount: number;
    couponDiscountAmount: number;
    rewardDiscountAmount: number;
    deliveryFee: number;
}

export interface OrderSummarySkinProps {
    data: {
        id: string;
        type: 'order-summary';
        summary?: OrderSummaryData;
    };
    actions: {
        onOrder?: () => void;
        onCouponApply?: () => void;
        onRewardApply?: () => void;
    };
    options: {
        summary?: OrderSummaryData;
        title?: string;
        showTitle?: boolean;
        showTotalOriginalPrice?: boolean;
        showProductPrice?: boolean;
        showProductDiscount?: boolean;
        showCouponDiscount?: boolean;
        showRewardDiscount?: boolean;
        showDeliveryFee?: boolean;
        showOrderButton?: boolean;
        orderButtonText?: string;
        customButtons?: React.ReactNode;
        titleFontSize?: string;
        titleFontWeight?: string;
        titleColor?: string;
        labelFontSize?: string;
        labelColor?: string;
        sublabelFontSize?: string;
        sublabelColor?: string;
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
        sublabelIndent?: string;
        showBorder?: boolean;
        showSectionBorders?: boolean;
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