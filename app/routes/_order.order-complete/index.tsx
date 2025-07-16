import { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { OrderItemsSection, OrderSummary, InfoDataList, InfoDataListContainer } from '@/components/ui/order';
import { ColorButton } from '@/components/ui/button';

import { ORDER_COMPLETED_MOCK_DATA } from '@/constants/order';

import type { Route } from './+types';
import type { InfoDataListData } from '@/types/order';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

export function meta() {
    return [
        {
            title: '주문 완료 - Marijour',
        },
        {
            name: 'description',
            content: '주문이 성공적으로 완료되었습니다. 주문 정보를 확인하세요.',
        },
        {
            name: 'keywords',
            content: '주문완료, 결제완료, 주문확인, 마리쥬르',
        },
    ];
}

export async function clientLoader({ request, params }: Route.LoaderArgs) {
    return {
        data: ORDER_COMPLETED_MOCK_DATA,
    };
}

/**
 * OrderComplete 페이지 - 주문 완료
 * 주문 완료 후 주문 정보 확인 페이지
 */
export default function OrderComplete({ loaderData }: Route.ComponentProps) {
    const { data } = loaderData;

    // 쿠폰/적립금 상태 관리
    const [coupon, setCoupon] = useState<string>('');
    const [reward, setReward] = useState<string>('0');

    // 임시: 사용 가능한 쿠폰 목록 (추후 API에서 가져올 예정)
    const [availableCoupons] = useState([
        {
            id: '1',
            name: '신규회원 10% 할인',
            discountAmount: 10,
            discountType: 'percentage' as const,
            expiryDate: '2024.12.31',
        },
        {
            id: '2',
            name: '5000원 즉시할인',
            discountAmount: 5000,
            discountType: 'amount' as const,
            expiryDate: '2024.11.30',
        },
    ]);

    const paymentInfoDL: InfoDataListData[] = [
        { dt: '입금 금액', dd: `${(data.totalPrice + data.deliveryFee).toLocaleString()}원`, isBetween: true, isBold: true },
        { dt: '입금 계좌', dd: data.paymentAccount, isBetween: true },
        { dt: '입금 기한', dd: `${data.paymentDueDate}까지`, isBetween: true },
    ];

    const deliveryInfoDL: InfoDataListData[] = [
        { dt: '수령인', dd: data.recipientName },
        { dt: '휴대폰 번호', dd: data.recipientPhoneNumber },
        { dt: '배송지 주소', dd: data.deliveryAddress },
        { dt: '배송 요청사항', dd: data.deliveryRequest || '없음' },
    ];

    const paymentMethodDL: InfoDataListData[] = [
        { dt: '총 결제금액', dd: `${(data.totalPrice + data.deliveryFee).toLocaleString()}원` },
        { dt: '결제 수단', dd: data.paymentMethod },
    ];

    const refundAccountDL: InfoDataListData[] = [
        { dt: '환불 계좌', dd: data.refundAccount },
        { dt: '환불 예금주', dd: data.refundDepositor },
    ];

    // 주문 요약 계산
    const calculateOrderSummary = () => {
        const totalOriginalPrice = data.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
        const productDiscountAmount = data.items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0);
        const totalPrice = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // 쿠폰 할인 계산
        let couponDiscountAmount = 0;
        if (coupon) {
            const selectedCoupon = availableCoupons.find((c) => c.name === coupon);
            if (selectedCoupon) {
                if (selectedCoupon.discountType === 'percentage') {
                    couponDiscountAmount = Math.floor(totalPrice * (selectedCoupon.discountAmount / 100));
                } else {
                    couponDiscountAmount = selectedCoupon.discountAmount;
                }
            }
        }

        // 적립금 할인
        const rewardDiscountAmount = parseInt(reward) || 0;

        // 총 할인 금액
        const totalDiscountAmount = productDiscountAmount + couponDiscountAmount + rewardDiscountAmount;

        // 최종 결제 금액
        const finalPrice = Math.max(0, totalPrice - couponDiscountAmount - rewardDiscountAmount);

        return {
            totalOriginalPrice,
            totalDiscountAmount,
            totalPrice: finalPrice,
            deliveryFee: data.deliveryFee,
            couponDiscountAmount,
            rewardDiscountAmount,
        };
    };

    const orderSummary = calculateOrderSummary();

    useGSAP(() => {
        gsap.to('.orderCompleteContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="orderCompleteContainer opacity-0">
            <section className="globalWrapper w-full pt-8 md:py-10 flex flex-col md:flex-row gap-10 items-center justify-between mb-5 md:mb-10">
                <div className="flex items-center gap-3 font-serif text-3xl">
                    <h2>주문 완료</h2>
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-black/40">장바구니</p>
                    <span>
                        <ArrowIcon
                            tailwind="w-[16px] h-[16px] text-black/40 hover-black-40"
                            rotate="90"
                        />
                    </span>
                    <p className="text-black/40">주문서 작성</p>
                    <span>
                        <ArrowIcon
                            tailwind="w-[16px] h-[16px] text-black/40 hover-black-40"
                            rotate="90"
                        />
                    </span>
                    <p className="text-primary font-bold">주문 완료</p>
                </div>
            </section>
            <section className="globalWrapper mb-10">
                <div className="flex flex-col items-center justify-center bg-primary/10 py-12 md:py-18 px-5 md:px-10">
                    <div className="max-w-[420px] w-full text-center">
                        <h3 className="text-2xl font-serif mb-2">주문이 접수되었어요</h3>
                        <p className="text-black/80 mb-4">아래 계좌를 확인하여 입금을 완료해주세요!</p>
                        <div className="bg-primary/80 px-4 py-3 rounded-full text-center mb-6">
                            <p className="text-white text-sm">주문번호: {data.orderNumber}</p>
                        </div>
                        <div className="px-5 md:px-10">
                            <InfoDataList data={paymentInfoDL} />
                        </div>
                    </div>
                </div>
            </section>
            <section className="globalWrapper mb-20 relative flex flex-col md:flex-row items-start justify-between gap-5">
                <div className="flex-1 w-full">
                    {/* 배송 정보 */}
                    <InfoDataListContainer
                        title="배송 정보"
                        data={deliveryInfoDL}
                    />

                    {/* 주문상품 정보 */}
                    <OrderItemsSection
                        items={data.items.map((item) => ({
                            ...item,
                            id: item.id,
                        }))}
                    />

                    {/* 결제수단 정보 */}
                    <InfoDataListContainer
                        title="결제수단 정보"
                        data={paymentMethodDL}
                    />

                    {/* 환불 계좌 */}
                    <InfoDataListContainer
                        title="환불 계좌"
                        data={refundAccountDL}
                    />
                </div>
                <div className="w-full md:w-[360px] md:shrink-0 md:sticky md:top-[60px] border-t border-black pt-6 md:border-t-0 md:pt-0">
                    <OrderSummary
                        totalPrice={orderSummary.totalPrice}
                        totalOriginalPrice={orderSummary.totalOriginalPrice}
                        totalDiscountAmount={orderSummary.totalDiscountAmount}
                        deliveryFee={orderSummary.deliveryFee}
                        couponDiscountAmount={orderSummary.couponDiscountAmount}
                        rewardDiscountAmount={orderSummary.rewardDiscountAmount}
                        buttons={
                            <>
                                <ColorButton
                                    type="button"
                                    colorType="primary"
                                    tailwind="w-full px-4.5 py-3.5"
                                    to={`/my-page/orders/detail/${data.orderNumber}`}
                                >
                                    주문상세 보기
                                </ColorButton>
                                <ColorButton
                                    type="button"
                                    colorType="white"
                                    tailwind="w-full px-4.5 py-3.5"
                                    to="/"
                                >
                                    메인으로 이동
                                </ColorButton>
                            </>
                        }
                    />
                </div>
            </section>
        </div>
    );
}
