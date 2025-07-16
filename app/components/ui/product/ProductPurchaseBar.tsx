import { ProductPrice } from '@/components/ui/product/ProductPrice';
import { ColorButton } from '@/components/ui/button/ColorButton';
import { CartButton } from '@/components/ui/button/CartButton';
import { CartIcon } from '@/components/icons';

import type { ProductPurchaseProps } from '@/types/product';

/**
 * ProductPurchaseBar 컴포넌트 - 하단 고정 구매 바
 *
 * 기능:
 * - 하단에 고정되어 표시되는 구매 인터페이스
 * - 상품 정보 요약 (데스크톱에서만 표시)
 * - 장바구니 및 구매 버튼
 */
export function ProductPurchaseBar({ product, onBuyNow }: ProductPurchaseProps) {
    return (
        <div className="productPurchaseBar fixed left-0 bottom-0 z-10000 bg-white/90 border-t border-black/20 w-full opacity-0 invisible">
            <div className="globalWrapper flex items-center justify-between py-4">
                <div className="hidden md:flex items-center gap-4">
                    <div className="w-[60px] h-[60px] shrink-0">
                        <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-sm font-bold">{product.name}</h2>
                        <ProductPrice
                            discountRate={product.discountRate}
                            price={product.price}
                            originalPrice={product.originalPrice}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <CartButton
                        colorType="white"
                        tailwind="p-3 md:p-4"
                    >
                        <CartIcon />
                    </CartButton>
                    <ColorButton
                        colorType="primary"
                        onClick={onBuyNow}
                        ariaLabel="구매 하기"
                        type="button"
                        tailwind="py-3 md:py-4 px-12 text-sm flex-1"
                    >
                        구매 하기
                    </ColorButton>
                </div>
            </div>
        </div>
    );
}
