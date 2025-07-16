import { Link } from 'react-router';

import { TextBadge } from '@/components/ui/Badge';
import { StarIcon } from '@/components/icons/StarIcon';
import { maskText } from '@/utils/string';

import type { ReviewItemProps, ReviewProduct } from '@/types/review';

/**
 * ReviewItem 컴포넌트 - 개별 리뷰 아이템
 *
 * 기능:
 * - 상품 정보 표시 (조건부)
 * - 리뷰 내용 및 이미지 표시
 * - 이미지 클릭 시 확대/축소 기능
 */
export function ReviewItem({ review, reviewId, isVisibleProductInfo, isExpanded, onImageClick }: ReviewItemProps) {
    return (
        <li
            key={reviewId}
            className="reviewItem opacity-0"
        >
            {/* 상품 정보 영역 */}
            {isVisibleProductInfo && (
                <ReviewProductInfo
                    productId={review.productId}
                    productImage={review.productImage}
                    productName={review.productName}
                    productOption={review.productOption}
                />
            )}

            {/* 리뷰 영역 */}
            <ReviewContent
                review={review}
                reviewId={reviewId}
                isVisibleProductInfo={isVisibleProductInfo}
                isExpanded={isExpanded}
                onImageClick={onImageClick}
            />
        </li>
    );
}

/**
 * ReviewProductInfo 컴포넌트 - 리뷰의 상품 정보 영역
 */
function ReviewProductInfo({ productId, productImage, productName, productOption }: ReviewProduct) {
    return (
        <div className="flex items-center gap-4 py-4 border-b border-black/10">
            <div className="w-[50px] md:w-[70px] h-[50px] md:h-[70px] shrink-0">
                <Link to={`/products/${productId}`}>
                    <img
                        src={productImage}
                        alt={productName}
                        className="w-full h-full object-cover"
                    />
                </Link>
            </div>
            <div className="space-y-1 md:space-y-2">
                <h3 className="text-sm font-bold">{productName}</h3>
                <p className="text-sm text-black/60">옵션 : {productOption}</p>
            </div>
        </div>
    );
}

/**
 * ReviewContent 컴포넌트 - 리뷰 내용 영역
 */
function ReviewContent({ review, reviewId, isVisibleProductInfo, isExpanded, onImageClick }: ReviewItemProps) {
    return (
        <div className="py-4 border-b border-black/10">
            {/* 베스트 뱃지 */}
            <div>{review.isBest && <TextBadge text="베스트 리뷰" />}</div>

            {/* 별점 */}
            <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                tailwind={`w-[14px] md:w-auto h-[14px] md:h-auto ${star <= review.rating ? 'text-black hover-black' : 'text-black/20 hover-black-20'}`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-black/80">{maskText(review.writer)}</p>
                </div>
                <p className="text-xs text-black/80">{review.createdAt}</p>
            </div>

            {/* 옵션 */}
            {!isVisibleProductInfo && <div className="text-xs text-black/60">옵션 : {review.productOption}</div>}

            {/* 내용 */}
            <div className={`flex items-start pt-1 md:pt-3 mb-2 gap-4 transition-all duration-300 ${isExpanded ? 'flex-col gap-4' : 'justify-between'}`}>
                <p className="text-sm">{review.contents}</p>
                <button
                    className={`object-cover transition-opacity duration-300 hover:opacity-80 ${isExpanded ? 'w-full max-w-[600px] h-auto' : 'aspect-[1/1] w-[75px] md:w-[94px] h-[75px] md:h-[94px]'}`}
                    type="button"
                    onClick={() => onImageClick(reviewId)}
                >
                    <img
                        src={review.reviewImage}
                        alt={review.productName}
                        className="w-full h-full object-cover"
                    />
                </button>
            </div>
        </div>
    );
}
