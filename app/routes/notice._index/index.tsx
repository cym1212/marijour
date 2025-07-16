import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Pagination } from '@/components/ui/Pagination';
import { NoData } from '@/components/ui/NoData';
import { NoticeIcon } from '@/components/icons';

import { NOTICE_MOCK_DATA } from '@/constants/notice';

import type { Route } from './+types';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function meta() {
    return [
        {
            title: '공지사항 - Marijour',
        },
        {
            name: 'description',
            content: '마리쥬르의 중요한 공지사항과 이벤트 소식을 확인하세요',
        },
        {
            name: 'keywords',
            content: '공지사항, 안내, 이벤트, 마리쥬르, 소식',
        },
    ];
}

export async function clientLoader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const itemsPerPage = 10;

    // 페이지 유효성 검사
    const totalPages = Math.ceil(NOTICE_MOCK_DATA.length / itemsPerPage);
    const validPage = Math.max(1, Math.min(page, totalPages));

    // 페이지네이션을 위한 데이터 분할
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = NOTICE_MOCK_DATA.slice(startIndex, endIndex);

    return {
        data: currentData,
        currentPage: validPage,
        totalPages: totalPages,
    };
}

/**
 * Notice 컴포넌트 - 공지사항 목록 페이지
 */
export default function Notice({ loaderData }: Route.ComponentProps) {
    const { data, currentPage, totalPages } = loaderData;

    useGSAP(() => {
        gsap.to('.noticeContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    useGSAP(() => {
        const noticeItems = gsap.utils.toArray('.noticeList .noticeItem') as Element[];

        if (noticeItems.length === 0) return;

        ScrollTrigger.batch(noticeItems, {
            start: 'top 95%',
            once: true,
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'power2.out',
                }),
        });
    }, [data]);

    return (
        <div className="noticeContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-10">
                <div className="font-serif text-3xl mb-5">
                    <h2>공지사항</h2>
                </div>

                {/* 공지사항 목록 */}
                {data.length > 0 ? (
                    <div className="noticeList border-t border-black">
                        <ul>
                            {data.map((notice) => (
                                <li
                                    key={notice.id}
                                    className="noticeItem opacity-0 hover:bg-black/3 transition-colors duration-300"
                                >
                                    <Link
                                        to={`/notice/${notice.id}`}
                                        className="flex items-start md:items-center flex-col md:flex-row gap-2 md:gap-5 py-4 border-b border-black/10"
                                    >
                                        <div className="flex-1">
                                            <h3 className="mb-1.5 text-sm">{notice.title}</h3>
                                            <p className="text-black/60 text-xs line-clamp-2 leading-logo">{notice.content}</p>
                                        </div>
                                        <div className="flex items-center gap-3 md:gap-20 text-xs md:text-sm text-black/60">
                                            <span>{notice.writer}</span>
                                            <span>{notice.createAt}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <NoData
                        icon={<NoticeIcon tailwind="w-full h-full" />}
                        title="등록된 공지사항이 없습니다"
                        description="새로운 공지사항이 등록되면 여기에 표시됩니다."
                    />
                )}

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            maxVisiblePages={5}
                            baseUrl="/notice"
                            queryParamName="page"
                        />
                    </div>
                )}
            </section>
        </div>
    );
}
