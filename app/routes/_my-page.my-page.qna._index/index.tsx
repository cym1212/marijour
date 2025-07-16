import { Link } from 'react-router';
import { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { QnaList } from '@/components/ui/qna';
import { ColorButton } from '@/components/ui';
import { QnaModal } from '@/components/ui/modal';

import { QNA_MOCK_DATA } from '@/constants/qna';

import type { Route } from './+types';
import type { Qna } from '@/types/qna';

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
        data: QNA_MOCK_DATA,
    };
}

/**
 * MyQna 컴포넌트 - 마이페이지
 *
 * 기능:
 * - 고객 정보 표시
 * - 주문 내역 표시
 * - 문의 내역 표시
 */
export default function MyQna({ loaderData }: Route.ComponentProps) {
    const { data } = loaderData;
    const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);

    // 문의하기 모달 열기
    const handleOpenQnaModal = () => {
        setIsQnaModalOpen(true);
    };

    // 문의하기 모달 닫기
    const handleCloseQnaModal = () => {
        setIsQnaModalOpen(false);
    };

    // 문의 제출 핸들러
    const handleSubmitQna = (qnaData: Partial<Qna>) => {
        // 실제로는 API 호출
        alert('문의가 성공적으로 등록되었습니다.');
    };

    useGSAP(() => {
        gsap.to('.myQnaContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    }, []);

    return (
        <div className="myQnaContainer">
            <div className="flex items-center gap-3 pt-1 pb-5">
                <h3 className="font-serif text-2xl leading-heading flex items-center gap-2">
                    <Link
                        to="/my-page/orders"
                        className="p-1 lg:hidden"
                    >
                        <ArrowIcon rotate="-90" />
                    </Link>
                    <span>문의 ({data.length})</span>
                </h3>
            </div>
            <div className="flex items-center justify-between py-4 border-t border-black">
                <h4 className="font-bold">도움이 필요하신가요?</h4>
                <ColorButton
                    type="button"
                    colorType="primary"
                    tailwind="text-sm p-3"
                    onClick={handleOpenQnaModal}
                >
                    문의하기
                </ColorButton>
            </div>
            {data.length === 0 ? <EmptyData /> : <QnaList qnas={data} />}

            {/* 문의하기 모달 */}
            <QnaModal
                isOpen={isQnaModalOpen}
                onClose={handleCloseQnaModal}
                onSubmit={handleSubmitQna}
            />
        </div>
    );
}

function EmptyData() {
    return (
        <div className="w-full flex items-center justify-center py-[80px] border-b border-black/10">
            <p className="text-black/80 text-sm">문의 내역이 없습니다.</p>
        </div>
    );
}
