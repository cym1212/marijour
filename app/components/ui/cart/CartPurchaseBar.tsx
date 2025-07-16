import { ColorButton } from '@/components/ui/button/ColorButton';

import type { CartPurchaseBarProps } from '@/types/cart';

/**
 * CartPurchaseBar 컴포넌트 - 하단 고정 구매 바
 *
 * 기능:
 * - 하단에 고정되어 표시되는 구매 인터페이스
 * - 상품 정보 요약 (모바일에서만 표시)
 * - 장바구니 및 구매 버튼
 */
export function CartPurchaseBar({ totalPrice, totalLength, deliveryFee, onOrder }: CartPurchaseBarProps) {
    return (
        <div className="cartPurchaseBar fixed left-1/2 bottom-0 z-10000 bg-[#F9F9F9] p-5 border border-black/10 -translate-x-1/2 w-[calc(100%-2.5rem)] opacity-0 invisible md:hidden">
            <div>
                <div className="flex items-center justify-between">
                    <span className="font-bold">총 결제 금액</span>
                    <span className="font-bold text-lg text-primary">{(totalPrice + deliveryFee).toLocaleString()}원</span>
                </div>
            </div>
            <div className="mt-5">
                <ColorButton
                    type="button"
                    colorType="primary"
                    tailwind="w-full px-4.5 py-3.5"
                    onClick={onOrder}
                    disabled={totalLength === 0}
                >
                    주문하기
                </ColorButton>
            </div>
        </div>
    );
}
