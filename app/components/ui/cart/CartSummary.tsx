import { ColorButton } from '@/components/ui/button/ColorButton';

import type { CartSummaryProps } from '@/types/cart';

/**
 * CartSummary 컴포넌트 - 장바구니 주문 정보 요약
 *
 * 기능:
 * - 총 상품 금액 표시
 * - 총 할인 금액 표시
 * - 배송비 정보 표시
 * - 총 결제 금액 계산 및 표시
 * - 주문하기 버튼
 */
export function CartSummary({ selectedItemsCount, totalPrice, totalOriginalPrice, totalDiscountAmount, deliveryFee, onOrder }: CartSummaryProps) {
    return (
        <div className="cartSummary bg-black/3 p-5 border border-black/10">
            <h3 className="font-bold text-lg mb-4">주문 정보</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm">총 상품 금액</span>
                    <span className="text-sm">{totalOriginalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm">총 할인 금액</span>
                    <span className="text-sm text-error">-{totalDiscountAmount.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm">배송비</span>
                    <span className="text-sm">{deliveryFee.toLocaleString()}원</span>
                </div>
                <div className="totalPrice border-t border-black/10 pt-3">
                    <div className="flex items-center justify-between">
                        <span className="font-bold">총 결제 금액</span>
                        <span className="font-bold text-lg text-primary">{(totalPrice + deliveryFee).toLocaleString()}원</span>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <ColorButton
                    type="button"
                    colorType="primary"
                    tailwind="w-full px-4.5 py-3.5"
                    onClick={onOrder}
                    disabled={selectedItemsCount === 0}
                >
                    주문하기
                </ColorButton>
            </div>
        </div>
    );
}
