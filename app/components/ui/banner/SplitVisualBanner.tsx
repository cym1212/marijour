import { useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BannerImage } from '@/components/ui/banner/BannerImage';

import type { SplitVisualBannerProps } from '@/types/ui';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * SplitVisualBanner 컴포넌트 - 분할 레이아웃 배너
 *
 * 기능:
 * - 이미지와 텍스트가 좌우로 분할된 배너
 * - 이미지 위치 조정 가능 (좌/우)
 * - 개별 요소별 스크롤 트리거 애니메이션
 *
 * 파라미터:
 * @param src - 배너 이미지 경로
 * @param isOverlay - 오버레이 표시 여부
 * @param title - 배너 제목
 * @param description - 배너 설명
 * @param buttonText - 버튼 텍스트
 * @param buttonLink - 버튼 링크
 * @param imageDirection - 이미지 위치 ('left' | 'right')
 */
export function SplitVisualBanner({ src, isOverlay, title, description, buttonText, buttonLink, imageDirection = 'left' }: SplitVisualBannerProps) {
    const imageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: imageRef.current,
            start: 'top 95%',
            once: true,
            onEnter: () =>
                gsap.to(imageRef.current, {
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                }),
        });

        ScrollTrigger.batch([titleRef.current, descRef.current], {
            start: 'top 95%',
            once: true,
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.1,
                    ease: 'power2.out',
                }),
        });

        if (btnRef.current) {
            ScrollTrigger.create({
                trigger: btnRef.current,
                start: 'top 95%',
                once: true,
                onEnter: () =>
                    gsap.to(btnRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: 'power2.out',
                    }),
            });
        }
    }, [imageRef.current, titleRef.current, descRef.current, btnRef.current]);

    return (
        <div className="overflow-hidden flex flex-wrap justify-between w-full h-full relative gap-[32px] md:gap-0">
            <div
                className={`w-full md:w-[50%] h-full aspect-square opacity-0 ${imageDirection === 'left' ? 'md:order-0' : 'md:order-1'}`}
                ref={imageRef}
            >
                <BannerImage
                    src={src}
                    isOverlay={isOverlay}
                />
            </div>
            <div className="w-full md:w-[50%] flex flex-col items-start justify-end text-black md:p-[5%]">
                <div>
                    <h2
                        className="font-serif text-3xl leading-heading whitespace-pre-line transform translate-y-[15px] opacity-0"
                        ref={titleRef}
                    >
                        {title}
                    </h2>
                    <p
                        className="leading-body whitespace-pre-line mt-3 transform translate-y-[15px] opacity-0"
                        ref={descRef}
                    >
                        {description}
                    </p>
                </div>
                {buttonText && buttonLink && (
                    <button
                        className="bg-primary px-4 pt-2.5 pb-3.5 hover-bg-primary-80 mt-6.5 transform translate-y-[15px] opacity-0"
                        type="button"
                        aria-label={buttonText}
                        ref={btnRef}
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
