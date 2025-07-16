/**
 * ProductPrice 컴포넌트 - 상품 가격 정보 표시
 * @param discountRate - 할인율 (%)
 * @param price - 판매 가격
 * @param originalPrice - 원가 (할인 전 가격)
 * @param lineBreak - 원가를 다음 줄로 표시할지 여부
 */
import type { ProductPriceProps } from '@/types/product';

export function ProductPrice({ discountRate, price, originalPrice, lineBreak }: ProductPriceProps) {
    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {discountRate && <em className="text-xs text-primary font-bold bg-primary/10 px-1 py-0.5 rounded">{discountRate}%</em>}
            <p className="font-bold">{price.toLocaleString()}원</p>
            {originalPrice && <del className={`text-sm font-bold text-black/40 ${lineBreak ? 'w-full md:w-auto -mt-0.5 md:mt-0' : 'w-auto'}`}>{originalPrice.toLocaleString()}원</del>}
        </div>
    );
}
