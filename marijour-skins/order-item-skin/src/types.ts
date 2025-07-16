export interface OrderItem {
    id: number;
    name: string;
    thumbnailUrl: string;
    quantity: number;
    price: number;
    discountRate?: number;
    originalPrice?: number;
}

export interface OrderItemSkinProps {
    data: {
        id: string;
        type: 'order-item';
        orderItem?: OrderItem;
    };
    actions: {
        onItemClick?: (itemId: number) => void;
        onImageClick?: (itemId: number) => void;
    };
    options: {
        orderItem?: OrderItem;
        enableProductLink?: boolean;
        enableImageClick?: boolean;
        showQuantity?: boolean;
        showPrice?: boolean;
        showTotalPrice?: boolean;
        showSeparator?: boolean;
        imageSize?: 'sm' | 'md' | 'lg';
        imageAspectRatio?: string;
        productNameMaxLines?: number;
        productNameFontSize?: string;
        productNameFontWeight?: string;
        productNameColor?: string;
        quantityFontSize?: string;
        quantityColor?: string;
        priceFontSize?: string;
        priceColor?: string;
        separatorColor?: string;
        separatorWidth?: string;
        backgroundColor?: string;
        padding?: string;
        margin?: string;
        borderRadius?: string;
        itemSpacing?: string;
        contentSpacing?: string;
        layout?: 'horizontal' | 'vertical';
        imagePosition?: 'left' | 'top';
        textAlign?: 'left' | 'center' | 'right';
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