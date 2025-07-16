import { Link } from 'react-router';
import { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { OrderList } from '@/components/ui/order';
import { Confirm } from '@/components/ui/modal';

import { ORDER_HISTORY_MOCK_DATA } from '@/constants/order';

import type { Route } from './+types';
import type { OrderListItem } from '@/types/order';

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
            title: '마이페이지 주문 배송 조회 - 쇼핑몰',
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
        data: ORDER_HISTORY_MOCK_DATA,
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
export default function MyOrders({ loaderData }: Route.ComponentProps) {
    const { data } = loaderData;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedOrderInfo, setSelectedOrderInfo] = useState<{
        orderNumber: string;
        item: OrderListItem;
    } | null>(null);

    // 주문 취소 확인 모달 열기
    const handleOpenCancelConfirm = (orderNumber: string, item: OrderListItem) => {
        setSelectedOrderInfo({ orderNumber, item });
        setIsConfirmOpen(true);
    };

    // 주문 취소 확인
    const handleConfirmCancel = () => {
        if (selectedOrderInfo) {
            // 실제 주문 취소 API 호출 로직
            alert(`주문이 취소되었습니다.\n주문번호: ${selectedOrderInfo.orderNumber}`);
        }
        setIsConfirmOpen(false);
        setSelectedOrderInfo(null);
    };

    // 주문 취소 취소
    const handleCancelCancel = () => {
        setIsConfirmOpen(false);
        setSelectedOrderInfo(null);
    };

    useGSAP(() => {
        gsap.to('.myOrderContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    }, []);

    return (
        <div className="myOrderContainer">
            <div className="flex items-center gap-3 pt-1 pb-5">
                <h3 className="font-serif text-2xl leading-heading flex items-center gap-2">
                    <Link
                        to="/my-page/orders"
                        className="p-1 lg:hidden"
                    >
                        <ArrowIcon rotate="-90" />
                    </Link>
                    <span>주문 배송 조회</span>
                </h3>
            </div>
            {data.length === 0 ? (
                <EmptyData />
            ) : (
                <OrderList
                    orders={data}
                    btnText="주문 취소"
                    btnHandler={handleOpenCancelConfirm}
                />
            )}

            {/* 주문 취소 확인 모달 */}
            <Confirm
                isOpen={isConfirmOpen}
                message={`입금 전 취소 요청 시 주문한 모든 상품에 대한\n전체 취소만 가능합니다.`}
                confirmText="전체 취소 요청"
                cancelText="취소"
                onConfirm={handleConfirmCancel}
                onCancel={handleCancelCancel}
            />
        </div>
    );
}

function EmptyData() {
    return (
        <div className="w-full flex items-center justify-center py-[80px] border-b border-black/10">
            <p className="text-black/80 text-sm">주문을 진행해 주세요.</p>
        </div>
    );
}
