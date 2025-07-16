import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useState, useEffect } from 'react';

import { ArrowIcon } from '@/components/icons';

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
            title: '마이페이지 - 쇼핑몰',
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

/**
 * MyPage 컴포넌트 - 마이페이지
 *
 * 기능:
 * - 고객 정보 표시
 * - 주문 내역 표시
 * - 문의 내역 표시
 */
export default function MyOrders() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [hasDetailParam, setHasDetailParam] = useState(false);
    const [isSubPage, setIsSubPage] = useState(false);

    // URL depth 감지 (2뎁스 이상인지 확인)
    useEffect(() => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        // /my-page/orders/cancel 같은 경우 pathSegments는 ['my-page', 'orders', 'cancel']
        // 2뎁스 이상이면 true (my-page 제외하고 2개 이상의 세그먼트)
        const isDeepPage = pathSegments.length > 2;
        setIsSubPage(isDeepPage);
    }, [location.pathname]);

    // detail 파라미터 변경 감지
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const detailExists = searchParams.has('detail');
        setHasDetailParam(detailExists);
    }, [location.search]);

    // 화면 크기 감지
    useEffect(() => {
        const checkScreenSize = () => {
            const newIsMobile = window.innerWidth <= 1024;
            setIsMobile(newIsMobile);

            // 데스크톱으로 변경되었을 때 detail 파라미터 제거
            if (!newIsMobile) {
                const searchParams = new URLSearchParams(location.search);
                if (searchParams.has('detail')) {
                    searchParams.delete('detail');
                    const newSearch = searchParams.toString();
                    const newUrl = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
                    navigate(newUrl, { replace: true });
                }
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, [location.search, location.pathname, navigate]);

    const myPageMenu = [
        {
            name: '주문 배송 조회',
            path: '/my-page/orders',
        },
        {
            name: '문의 내역',
            path: '/my-page/qna',
        },
        {
            name: '회원정보 수정',
            path: '/my-page/info',
        },
    ];

    useGSAP(() => {
        // 페이지 변경 시 opacity를 0으로 설정 후 1로 애니메이션
        gsap.set('.myOrderContainer', { opacity: 0 });
        gsap.to('.myOrderContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    }, [location.pathname]); // location.pathname 의존성 추가

    useGSAP(() => {});

    return (
        <div className="myOrderContainer opacity-0">
            <div className="globalWrapper flex items-start justify-between gap-15 w-full pt-8 md:py-10 mb-5 md:mb-10">
                <section className={`w-full lg:w-auto flex flex-col gap-10 items-start lg:flex ${isSubPage ? 'hidden' : hasDetailParam ? 'hidden' : 'block'}`}>
                    <div className="flex items-center gap-3 font-serif text-3xl">
                        <h2>마이페이지</h2>
                    </div>
                    <nav className="w-full">
                        <ul className="flex flex-col gap-1">
                            {myPageMenu.map((menu) => (
                                <li
                                    key={menu.name}
                                    className={`py-2 ${location.pathname.includes(menu.path) ? 'lg:text-primary lg:font-bold' : 'text-black lg:text-black/60 hover-black-80'}`}
                                >
                                    <Link
                                        to={isMobile ? `${menu.path}?detail=true` : menu.path}
                                        className="w-full flex items-center justify-between"
                                    >
                                        <span>{menu.name}</span>
                                        <ArrowIcon
                                            tailwind="w-4 h-4 block lg:hidden"
                                            rotate="90"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </section>
                <section className={`flex-1 ${isSubPage ? 'block' : hasDetailParam ? 'block' : 'hidden'} lg:block`}>
                    <Outlet key={location.search} />
                </section>
            </div>
        </div>
    );
}
