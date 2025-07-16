import { useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BannerImage } from '@/components/ui/banner/BannerImage';

import type { CenteredVisualBannerProps } from '@/types/ui';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * CenteredVisualBanner 컴포넌트 - 중앙 정렬 비주얼 배너
 *
 * 기능:
 * - 이미지 위에 중앙 정렬된 텍스트 및 버튼
 * - 스크롤 트리거 페이드인 애니메이션
 * - 오버레이 옵션 제공
 *
 * 파라미터:
 * @param src - 배너 이미지 경로
 * @param isOverlay - 오버레이 표시 여부
 * @param title - 배너 제목
 * @param description - 배너 설명
 * @param buttonText - 버튼 텍스트
 * @param buttonLink - 버튼 링크
 * @param isSmallText - 작은 텍스트 스타일 여부
 */

export function CenteredVisualBanner({ src, isOverlay, title, description, buttonText, buttonLink, isSmallText }: CenteredVisualBannerProps) {
    const bannerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: bannerRef.current,
            start: 'top 95%',
            once: true,
            onEnter: () =>
                gsap.to(bannerRef.current, {
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                }),
        });
    }, [bannerRef.current]);

    return (
        <div
            className="overflow-hidden flex justify-center items-center w-full h-full relative opacity-0"
            ref={bannerRef}
        >
            <BannerImage
                src={src}
                isOverlay={isOverlay}
            />
            <div className="globalWrapper absolute left-0 top-0 w-full h-full py-[7.5vh] flex flex-col items-center justify-center text-center text-black">
                <div>
                    <h2 className={`font-serif leading-heading whitespace-pre-line ${isSmallText ? 'text-xl' : 'text-3xl'}`}>{title}</h2>
                    <p className={`leading-body whitespace-pre-line mt-3 ${isSmallText ? 'text-sm' : 'text-base'}`}>{description}</p>
                </div>
                {buttonText && buttonLink && (
                    <button
                        className="bg-primary px-4 pt-2.5 pb-3.5 hover-bg-primary-80 mt-6.5"
                        type="button"
                        aria-label={buttonText}
                    >
                        <Link
                            to={buttonLink}
                            className="text-sm text-white"
                        >
                            {buttonText}
                        </Link>
                    </button>
                )}
            </div>
        </div>
    );
}
