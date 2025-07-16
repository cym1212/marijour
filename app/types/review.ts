export interface ReviewProduct {
    productId: number;
    productImage: string;
    productName: string;
    productOption: string;
}

export interface Review extends ReviewProduct {
    isBest: boolean;
    rating: number;
    contents: string;
    writer: string;
    reviewImage: string;
    createdAt: string;
}

export interface ReviewItemProps {
    review: Review;
    reviewId: string;
    isVisibleProductInfo: boolean;
    isExpanded: boolean;
    onImageClick: (reviewId: string) => void;
}
