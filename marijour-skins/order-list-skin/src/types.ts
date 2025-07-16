export type OrderStatus = '입금 대기' | '배송 준비 중' | '배송 중' | '배송 완료' | '주문 취소';

export interface OrderListItem {
    id: number;
    name: string;
    thumbnailUrl: string;
    quantity: number;
    price: number;
    discountRate?: number;
    originalPrice?: number;
    orderStatus: OrderStatus;
}

export interface OrderListData {
    orderNumber: string;
    orderDate: string;
    items: OrderListItem[];
}

export interface OrderListSkinProps {
    data: {
        id: string;
        type: 'order-list';
        orders?: OrderListData[];
    };
    actions: {
        onOrderDetailClick?: (orderNumber: string) => void;
        onButtonClick?: (orderNumber: string, item: OrderListItem) => void;
        onItemClick?: (itemId: number) => void;
        onCancelOrder?: (orderNumber: string, itemName: string) => void;
    };
    options: {
        orders?: OrderListData[];
        buttonText?: string;
        buttonHref?: string;
        showButton?: boolean;
        showOrderStatus?: boolean;
        showOrderNumber?: boolean;
        showOrderDate?: boolean;
        enableOrderDetailLink?: boolean;
        enableItemLink?: boolean;
        orderDateFormat?: string;
        orderNumberPrefix?: string;
        emptyStateMessage?: string;
        itemImageSize?: 'sm' | 'md' | 'lg';
        itemLayout?: 'horizontal' | 'vertical';
        orderHeaderFontSize?: string;
        orderHeaderFontWeight?: string;
        orderHeaderColor?: string;
        orderDateFontSize?: string;
        orderDateColor?: string;
        orderNumberFontSize?: string;
        orderNumberColor?: string;
        orderStatusFontSize?: string;
        orderStatusColor?: string;
        buttonFontSize?: string;
        buttonColor?: string;
        buttonBgColor?: string;
        buttonHoverBgColor?: string;
        buttonBorderColor?: string;
        buttonBorderRadius?: string;
        buttonPadding?: string;
        backgroundColor?: string;
        borderColor?: string;
        borderRadius?: string;
        padding?: string;
        margin?: string;
        orderSpacing?: string;
        itemSpacing?: string;
        headerSpacing?: string;
        showBorder?: boolean;
        showOrderBorder?: boolean;
        showItemBorder?: boolean;
        layout?: 'list' | 'card';
        enableAnimation?: boolean;
        animationType?: 'fade' | 'slide' | 'scale';
        animationDuration?: number;
        animationDelay?: number;
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