import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { CommentIcon } from '@/components/icons';

import { QNA_MOCK_DATA } from '@/constants/qna';

import type { Route } from './+types';

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
    const { qnaId } = params;
    return {
        qna: QNA_MOCK_DATA[0],
    };
}

/**
 * MyQnaDetail 컴포넌트 - 마이페이지
 *
 * 기능:
 * - 고객 정보 표시
 * - 주문 내역 표시
 * - 문의 내역 표시
 */
export default function MyQnaDetail({ loaderData }: Route.ComponentProps) {
    const { qna } = loaderData;

    useGSAP(() => {
        gsap.to('.myQnaDetailContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    }, []);

    return (
        <div className="myQnaDetailContainer">
            <div className="flex items-center gap-3 pt-1 pb-5">
                <h3 className="font-serif text-2xl leading-heading flex items-center gap-2">
                    <Link
                        to="/my-page/qna"
                        className="p-1 lg:hidden"
                    >
                        <ArrowIcon rotate="-90" />
                    </Link>
                    <span>문의</span>
                </h3>
            </div>
            <div className="py-4 border-t border-black">
                <p className={`font-bold text-sm mb-2 ${qna.status === '답변 대기' ? 'text-black/40' : 'text-primary'}`}>{qna.status}</p>
                <p className="flex items-center gap-1 text-black">
                    <span className="font-bold">{qna.category}</span>
                    <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                    <span>{qna.title}</span>
                </p>
            </div>
            <div className="w-full border-y border-black/10 py-6">
                <div className="mb-2">
                    <p className="line-clamp-1">{qna.content}</p>
                </div>
                <div className="text-xs text-black/60 mb-5">{qna.createAt}</div>
                <div className="flex items-center gap-2 text-sm text-black/80">
                    <CommentIcon tailwind="w-[16px] h-[16px]" />
                    <p>댓글 {qna.comments.length}</p>
                </div>
            </div>
            <div className="w-full">
                {qna.comments.map((comment) => (
                    <div
                        key={comment.qnaId}
                        className="border-b border-black/10 py-6"
                    >
                        <p className="flex items-center gap-1 text-black text-xs">
                            <span className="font-bold">{comment.writer}</span>
                            <span className="w-[1px] h-[0.675rem] mx-1 bg-black/20"></span>
                            <span>{comment.createAt}</span>
                        </p>
                        <p className="mt-2">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
