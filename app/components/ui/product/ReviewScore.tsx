/**
 * ReviewScore 컴포넌트 - 상품 리뷰 점수 및 개수 표시
 * @param starRating - 별점 (숫자)
 * @param reviewCount - 리뷰 개수
 * @param onCountClick - 리뷰 개수 클릭 시 실행할 함수 (선택적)
 */
import { StarIcon } from '@/components/icons/StarIcon';

import type { ReviewScoreProps } from '@/types/product';

export function ReviewScore({ starRating, reviewCount, onCountClick }: ReviewScoreProps) {
    return (
        <div className="flex items-center gap-1">
            <StarIcon tailwind="text-primary w-[12px] h-[12px]" />
            <p className="text-xs font-bold text-primary">{starRating}</p>
            {onCountClick ? (
                <button
                    className="text-xs text-black/60 underline"
                    type="button"
                    aria-label="리뷰"
                    onClick={onCountClick}
                >
                    {reviewCount}개 리뷰
                </button>
            ) : (
                <p className="text-xs text-black/60">({reviewCount})</p>
            )}
        </div>
    );
}
