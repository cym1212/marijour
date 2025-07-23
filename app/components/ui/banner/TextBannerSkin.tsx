import React, { useRef, useEffect } from 'react';

// 스타일 import
import './text-banner-skin-scoped.css';

// Base64 이미지 import
import { TEXT_BANNER_IMAGES } from './text-banner-images';

// Mock 데이터 (번들에 포함) - base64 이미지 사용
const TEXT_BANNER_DATA = [
    {
        id: 1,
        title: '지속 가능한 환경을 위해',
        description: '5만원 이상 구매시 에코 네트백을 드려요.',
        imageUrl: {
            desktop: TEXT_BANNER_IMAGES['1'],
            mobile: TEXT_BANNER_IMAGES['1'],
        },
        buttonLink: '/shop',
    },
    {
        id: 2,
        title: '신제품 출시 5% 할인',
        description: '신제품 출시 기념 5% 할인',
        imageUrl: {
            desktop: TEXT_BANNER_IMAGES['2'],
            mobile: TEXT_BANNER_IMAGES['2'],
        },
        buttonLink: '/shop',
    },
];

// BannerImage 컴포넌트를 번들에 포함
const BannerImage = ({ src, isOverlay }: { src: { desktop: string; mobile: string }; isOverlay?: boolean }) => {
    const { desktop, mobile } = src;

    return (
        <div className="tb-skin-bannerImage tb-skin-relative tb-skin-w-full tb-skin-h-full">
            {/* 데스크톱 이미지 */}
            <div
                className="tb-skin-bannerImageMedia tb-skin-hidden tb-skin-lg-block tb-skin-w-full tb-skin-h-full tb-skin-bg-no-repeat tb-skin-bg-center tb-skin-bg-cover tb-skin-transition-transform tb-skin-duration-300 tb-skin-ease-out tb-skin-group-hover-scale-105"
                style={{ backgroundImage: `url(${desktop})` }}
            ></div>
            {/* 모바일 이미지 */}
            <div
                className="tb-skin-bannerImageMedia tb-skin-block tb-skin-lg-hidden tb-skin-w-full tb-skin-h-full tb-skin-bg-no-repeat tb-skin-bg-center tb-skin-bg-cover tb-skin-transition-transform tb-skin-duration-300 tb-skin-ease-out tb-skin-group-hover-scale-105"
                style={{ backgroundImage: `url(${mobile})` }}
            ></div>
            {isOverlay && <div className="tb-skin-bannerImageOverlay tb-skin-absolute tb-skin-top-0 tb-skin-left-0 tb-skin-w-full tb-skin-h-full tb-skin-bg-black-50"></div>}
        </div>
    );
};

// TextBanner 개별 컴포넌트
const TextBanner = ({ title, description, src, buttonLink }: { title: string; description: string; src: { desktop: string; mobile: string }; buttonLink: string }) => {
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!bannerRef.current) return;

        // 간단한 페이드인 애니메이션 (GSAP 대신)
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('tb-skin-animate-fadein');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(bannerRef.current);
        
        return () => observer.disconnect();
    }, []);

    return (
        <div
            className="tb-skin-group tb-skin-relative tb-skin-w-full tb-skin-h-full tb-skin-overflow-hidden tb-skin-opacity-0"
            ref={bannerRef}
        >
            <BannerImage src={src} />
            <a
                href={buttonLink}
                className="tb-skin-flex tb-skin-flex-col tb-skin-items-start tb-skin-justify-center tb-skin-w-full tb-skin-h-full tb-skin-block tb-skin-absolute tb-skin-top-0 tb-skin-left-0"
            >
                <div className="tb-skin-pl-5 tb-skin-md-pl-10">
                    <h3 className="tb-skin-font-serif tb-skin-text-2xl tb-skin-leading-heading tb-skin-whitespace-pre-line">{title}</h3>
                    <p className="tb-skin-font-pretendard tb-skin-text-sm tb-skin-leading-body tb-skin-whitespace-pre-line tb-skin-mt-1 tb-skin-md-mt-2-5">{description}</p>
                </div>
            </a>
        </div>
    );
};

/**
 * TextBannerSkin 컴포넌트 - 텍스트 배너 섹션 UMD 버전
 *
 * 기능:
 * - 2개의 텍스트 배너를 그리드 레이아웃으로 표시
 * - 반응형 디자인 (모바일 1열, 데스크톱 2열)
 * - hover 애니메이션 효과
 * - 이미지 base64 인코딩으로 번들에 포함
 */
export function TextBannerSection() {
    return (
        <section className="tb-skin-grid tb-skin-grid-cols-1 tb-skin-md-grid-cols-2 tb-skin-gap-3 tb-skin-md-gap-5 tb-skin-globalWrapper tb-skin-py-5 tb-skin-md-py-10">
            {TEXT_BANNER_DATA.map((banner) => (
                <div key={banner.id} className="tb-skin-w-full tb-skin-aspect-3-1">
                    <TextBanner
                        title={banner.title}
                        description={banner.description}
                        src={banner.imageUrl}
                        buttonLink={banner.buttonLink}
                    />
                </div>
            ))}
        </section>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(TextBannerSection as any).SAMPLE_DATA = TEXT_BANNER_DATA;

export default TextBannerSection;