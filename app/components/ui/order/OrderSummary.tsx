import { ColorButton } from '@/components/ui/button/ColorButton';

import type { OrderSummaryProps } from '@/types/order';

/**
 * OrderSummary 컴포넌트 - 주문 정보 요약
 *
 * 기능:
 * - 총 상품 금액 표시
 * - 총 할인 금액 표시
 * - 배송비 정보 표시
 * - 총 결제 금액 계산 및 표시
 * - 주문하기 버튼
 */
export function OrderSummary({ totalPrice, totalOriginalPrice, totalDiscountAmount, deliveryFee, onOrder, couponDiscountAmount = 0, rewardDiscountAmount = 0, buttons }: OrderSummaryProps) {
    const productDiscountAmount = totalDiscountAmount - couponDiscountAmount - rewardDiscountAmount;
    const actualProductPrice = totalOriginalPrice - productDiscountAmount; // 할인 적용된 상품 금액

    return (
        <div className="orderSummary bg-black/3 p-5 border border-black/10">
            <h3 className="font-bold text-lg mb-4">주문 정보</h3>
            <div className="space-y-3">
                {/* 총 상품 금액 섹션 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-black/70">총 상품 금액</span>
                        <span className="text-sm font-medium">{totalOriginalPrice.toLocaleString()}원</span>
                    </div>

                    {/* 상품 금액 (할인 적용 후) */}
                    <div className="flex items-center justify-between pl-3">
                        <span className="text-sm">상품 금액</span>
                        <span className="text-sm">{actualProductPrice.toLocaleString()}원</span>
                    </div>

                    {/* 상품 할인 */}
                    {productDiscountAmount > 0 && (
                        <div className="flex items-center justify-between pl-3">
                            <span className="text-sm">상품 할인</span>
                            <span className="text-sm text-error">-{productDiscountAmount.toLocaleString()}원</span>
                        </div>
                    )}

                    {/* 쿠폰 할인 */}
                    {couponDiscountAmount > 0 && (
                        <div className="flex items-center justify-between pl-3">
                            <span className="text-sm">쿠폰 할인</span>
                            <span className="text-sm text-error">-{couponDiscountAmount.toLocaleString()}원</span>
                        </div>
                    )}

                    {/* 적립금 할인 */}
                    {rewardDiscountAmount > 0 && (
                        <div className="flex items-center justify-between pl-3">
                            <span className="text-sm">적립금 할인</span>
                            <span className="text-sm text-error">-{rewardDiscountAmount.toLocaleString()}원</span>
                        </div>
                    )}
                </div>

                {/* 배송비 */}
                <div className="flex items-center justify-between pt-2 border-t border-black/10">
                    <span className="text-sm">배송비</span>
                    <span className="text-sm">{deliveryFee.toLocaleString()}원</span>
                </div>

                {/* 총 결제 금액 */}
                <div className="totalPrice border-t border-black/10 pt-3">
                    <div className="flex items-center justify-between">
                        <span className="font-bold">총 결제 금액</span>
                        <span className="font-bold text-lg text-primary">{(totalPrice + deliveryFee).toLocaleString()}원</span>
                    </div>
                </div>
            </div>
            <div className="mt-5 space-y-2">
                {buttons ? (
                    buttons
                ) : (
                    <ColorButton
                        type="button"
                        colorType="primary"
                        tailwind="w-full px-4.5 py-3.5"
                        onClick={onOrder}
                    >
                        주문하기
                    </ColorButton>
                )}
            </div>
        </div>
    );
}
