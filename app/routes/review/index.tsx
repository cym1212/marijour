import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ReviewList } from '@/components/ui/review/ReviewList';
import { Pagination } from '@/components/ui/Pagination';
import { NoData } from '@/components/ui/NoData';
import { ReviewIcon } from '@/components/icons';

import { REVIEW_MOCK_DATA } from '@/constants/review';

import type { Route } from './+types';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

export function meta() {
    return [
        {
            title: '리뷰 - Marijour',
        },
        {
            name: 'description',
            content: '마리쥬르 상품에 대한 고객 리뷰를 확인하고 구매 후기를 읽어보세요',
        },
        {
            name: 'keywords',
            content: '리뷰, 후기, 평점, 고객리뷰, 상품평, 마리쥬르',
        },
    ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const itemsPerPage = 5;

    // 페이지 유효성 검사
    const totalPages = Math.ceil(REVIEW_MOCK_DATA.length / itemsPerPage);
    const validPage = Math.max(1, Math.min(page, totalPages));

    // 페이지네이션을 위한 데이터 분할
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = REVIEW_MOCK_DATA.slice(startIndex, endIndex);

    return {
        data: currentData,
        currentPage: validPage,
        totalPages: totalPages,
    };
}

/**
 * Review 페이지 - 고객 리뷰 목록
 * 페이지네이션 기능과 애니메이션 포함
 */
export default function Review({ loaderData }: Route.ComponentProps) {
    const { data, currentPage, totalPages } = loaderData;

    useGSAP(() => {
        gsap.to('.reviewContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="reviewContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-10">
                <div className="font-serif text-3xl mb-5">
                    <h2>리뷰</h2>
                </div>

                {data.length > 0 ? (
                    <ReviewList
                        data={data}
                        isVisibleProductInfo={true}
                    />
                ) : (
                    <div className="border-t border-black">
                        <NoData
                            icon={<ReviewIcon tailwind="w-full h-full" />}
                            title="등록된 리뷰가 없습니다"
                            description="고객님들의 소중한 리뷰를 기다리고 있습니다."
                        />
                    </div>
                )}

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            maxVisiblePages={5}
                            baseUrl="/review"
                            queryParamName="page"
                        />
                    </div>
                )}
            </section>
        </div>
    );
}
