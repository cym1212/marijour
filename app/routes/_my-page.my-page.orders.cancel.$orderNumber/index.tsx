import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { OrderList, InfoDataListContainer, InfoDataList } from '@/components/ui/order';
import { ColorButton } from '@/components/ui';

import { ORDER_CANCEL_MOCK_DATA } from '@/constants/order';

import type { Route } from './+types';
import type { InfoDataListData } from '@/types/order';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

/**
 * meta 함수 - 페이지 메타데이터 설정
 *
 * 구조:
 * - SEO를 위한 title, description, keywords 설정
 * - React Router 7의 메타 함수 규칙 준수
 *
 * 반환값:
 * - 메타 태그 배열 (title, description, keywords)
 */
export function meta() {
    return [
        {
            title: '마이페이지 주문 취소 상세 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '고객 정보를 확인하고 주문 내역을 관리하세요',
        },
        {
            name: 'keywords',
            content: '마이페이지, 고객정보, 주문내역',
        },
    ];
}

export async function clientLoader({ request, params }: Route.LoaderArgs) {
    return {
        data: ORDER_CANCEL_MOCK_DATA,
    };
}

/**
 * MyPage 컴포넌트 - 마이페이지
 *
 * 기능:
 * - 고객 정보 표시
 * - 주문 내역 표시
 * - 문의 내역 표시
 */
export default function MyOrdersCancel({ loaderData }: Route.ComponentProps) {
    const { data } = loaderData;

    const cancelInfoDL: InfoDataListData[] = [
        { dt: '취소 일자', dd: data.cancelDate },
        { dt: '취소 사유', dd: data.cancelReason },
    ];

    const refundAccountDL: InfoDataListData[] = [
        { dt: '환불 계좌', dd: data.refundAccount },
        { dt: '환불 예금주', dd: data.refundDepositor },
    ];

    const orderPriceDL: InfoDataListData[] = [
        { dt: '주문 금액', dd: `${(data.totalPrice + data.deliveryFee).toLocaleString()}원`, isBold: true, isBetween: true },
        { dt: '상품 금액', dd: `${data.totalPrice.toLocaleString()}원`, isBetween: true, isSmall: true },
        { dt: '배송비', dd: `${data.deliveryFee.toLocaleString()}원`, isBetween: true, isSmall: true },
    ];

    const paymentAmountDL: InfoDataListData[] = [{ dt: '입금 금액', dd: `${(data.totalPrice + data.deliveryFee).toLocaleString()}원`, isBold: true, isBetween: true }];

    const refundAmountDL: InfoDataListData[] = [
        { dt: '환불 금액', dd: `${data.totalPrice.toLocaleString()}원`, isBold: true, isBetween: true },
        { dt: '환불 계좌', dd: data.refundAccount, isBetween: true, isSmall: true },
    ];

    useGSAP(() => {
        gsap.to('.myOrderCancelContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="myOrderCancelContainer">
            <div className="flex items-center gap-3 pt-1 pb-5">
                <h3 className="font-serif text-2xl leading-heading flex items-center gap-2">
                    <Link
                        to={`/my-page/orders/detail/${data.orderNumber}`}
                        className="p-1 lg:hidden"
                    >
                        <ArrowIcon rotate="-90" />
                    </Link>
                    <span>취소 상세</span>
                </h3>
            </div>
            <OrderList orders={[data]} />
            <InfoDataListContainer
                title="취소 정보"
                data={cancelInfoDL}
            />
            <InfoDataListContainer
                title="환불 계좌"
                data={refundAccountDL}
            />
            <div className="py-6 border-t border-black">
                <div>
                    <h4 className="font-bold">결제 정보</h4>
                </div>
                <div className="flex items-start gap-4 w-full mb-2 mt-6">
                    <InfoDataList data={orderPriceDL} />
                    <span className="w-[1px] h-[68px] mx-1 bg-black/20"></span>
                    <InfoDataList data={paymentAmountDL} />
                    <span className="w-[1px] h-[68px] mx-1 bg-black/20"></span>
                    <InfoDataList data={refundAmountDL} />
                </div>
            </div>
            <ColorButton
                colorType="grayLine"
                to="/my-page/orders"
                tailwind="w-[180px] mx-auto py-4 mt-6"
            >
                주문 목록 돌아가기
            </ColorButton>
        </div>
    );
}
