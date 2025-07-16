interface Price {
    discountRate?: number;
    price: number;
    originalPrice?: number;
}

interface Review {
    starRating: number;
    reviewCount: number;
}

export interface ProductItemProps extends Price, Review {
    id: number;
    name: string;
    thumbnailUrl: string;
    badges?: string[];
    isFadeAnimation?: boolean;
}

export interface ProductSliderProps {
    data: ProductItemProps[];
    desktopSlidesPerView?: number;
    mobileSlidesPerView?: number;
}

export interface ReviewScoreProps extends Review {
    onCountClick?: () => void;
}

export interface ProductPriceProps extends Price {
    lineBreak?: boolean;
}

export interface ProductPurchaseProps {
    product: ProductItemProps;
    onBuyNow: () => void;
}

export interface ProductInfoProps extends ProductPurchaseProps {
    onReviewScrollTo: () => void;
}
