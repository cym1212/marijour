import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useNavigate } from 'react-router';

import { ColorButton } from '@/components/ui/button/ColorButton';
import { NoData } from '@/components/ui/NoData';

import { NOTICE_MOCK_DATA } from '@/constants/notice';

import type { Route } from './+types';

/**
 * meta 함수 - 페이지 메타데이터 설정
 */
export function meta() {
    return [
        {
            title: '공지사항 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '쇼핑몰의 중요한 공지사항을 확인하세요',
        },
        {
            name: 'keywords',
            content: '공지사항, 안내, 쇼핑몰, 이벤트',
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    const { id } = params;

    if (!id) {
        return { notice: null };
    }

    const noticeData = NOTICE_MOCK_DATA.find((item) => item.id === Number(id));

    return {
        notice: noticeData || null,
    };
}

/**
 * Notice 컴포넌트 - 공지사항 상세 페이지
 */
export default function NoticeT({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();

    const { notice } = loaderData;

    const handleGoToList = () => {
        navigate(-1);
    };

    useGSAP(() => {
        gsap.to('.noticeDetailContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="noticeDetailContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-10">
                <div className="font-serif text-3xl mb-5">
                    <h2>공지사항</h2>
                </div>

                {/* 공지사항 내용 */}
                {notice ? (
                    <div className="noticeDetail border-t border-black">
                        <div className="flex items-start md:items-center flex-col md:flex-row gap-1 md:gap-5 py-4 border-b border-black/10">
                            <h3 className="flex-1 font-bold">{notice.title}</h3>
                            <div className="flex items-center gap-3 md:gap-20 text-xs md:text-sm text-black/60">
                                <span className="text-black/60 text-sm">{notice.writer}</span>
                                <span className="text-black/60 text-sm">{notice.createAt}</span>
                            </div>
                        </div>
                        <div className="pt-8 swipermd:pt-10 pb-15 md:pb-20 border-b border-black/10">
                            <p>{notice.content}</p>
                        </div>
                        <div className="flex justify-center mt-8 md:mt-10">
                            <ColorButton
                                colorType="white"
                                ariaLabel="목록으로"
                                onClick={handleGoToList}
                                tailwind="w-full md:w-auto px-12 py-3"
                            >
                                목록으로
                            </ColorButton>
                        </div>
                    </div>
                ) : (
                    <div className="border-t border-black">
                        <NoData
                            title="공지사항을 찾을 수 없습니다"
                            description="요청하신 공지사항이 존재하지 않거나 삭제되었습니다."
                        />
                    </div>
                )}
            </section>
        </div>
    );
}
