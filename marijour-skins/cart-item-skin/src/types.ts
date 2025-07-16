export interface CartItem {
    id: number;
    thumbnailUrl: string;
    name: string;
    quantity: number;
    price: number;
    discountRate: number;
    originalPrice: number;
}

export interface CartItemSkinProps {
    data: {
        id: string;
        type: 'cart-item';
        cartItem?: CartItem;
    };
    actions: {
        onSelect?: (itemId: number, checked: boolean) => void;
        onQuantityChange?: (itemId: number, newQuantity: number) => void;
        onDelete?: (itemId: number) => void;
        onItemClick?: (itemId: number) => void;
    };
    options: {
        cartItem?: CartItem;
        isSelected?: boolean;
        enableSelection?: boolean;
        enableQuantityControl?: boolean;
        enableDelete?: boolean;
        enableProductLink?: boolean;
        checkboxSize?: 'sm' | 'md' | 'lg';
        imageSize?: 'sm' | 'md' | 'lg';
        imageAspectRatio?: string;
        productNameMaxLines?: number;
        productNameFontSize?: string;
        productNameFontWeight?: string;
        productNameColor?: string;
        priceFontSize?: string;
        priceFontWeight?: string;
        priceColor?: string;
        totalPriceFontSize?: string;
        totalPriceFontWeight?: string;
        totalPriceColor?: string;
        quantityButtonSize?: 'sm' | 'md' | 'lg';
        quantityButtonColor?: string;
        quantityButtonBgColor?: string;
        quantityButtonBorderColor?: string;
        deleteButtonSize?: 'sm' | 'md' | 'lg';
        deleteButtonColor?: string;
        deleteButtonHoverColor?: string;
        borderColor?: string;
        backgroundColor?: string;
        padding?: string;
        margin?: string;
        borderRadius?: string;
        showBorder?: boolean;
        showDiscountRate?: boolean;
        showOriginalPrice?: boolean;
        layout?: 'horizontal' | 'vertical';
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