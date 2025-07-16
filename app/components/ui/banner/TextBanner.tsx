/**
 * TextBanner 컴포넌트 - 텍스트 오버레이 배너
 * @param title - 배너 제목
 * @param description - 배너 설명
 * @param src - 배경 이미지 (desktop, mobile)
 * @param buttonLink - 클릭 시 이동할 링크
 */
import { useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { BannerImage } from '@/components/ui/banner/BannerImage';

import type { TextBannerProps } from '@/types/ui';

gsap.registerPlugin(useGSAP, ScrollTrigger);
export function TextBanner({ title, description, src, buttonLink }: TextBannerProps) {
    const { desktop, mobile } = src;
    const bannerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!bannerRef.current) return;

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
            className="group/bannerImage relative w-full h-full overflow-hidden opacity-0"
            ref={bannerRef}
        >
            <BannerImage src={{ desktop, mobile }} />
            <Link
                to={buttonLink}
                className="flex flex-col items-start justify-center w-full h-full block absolute top-0 left-0"
            >
                <div className="pl-5 md:pl-10">
                    <h3 className="font-serif text-2xl leading-heading whitespace-pre-line">{title}</h3>
                    <p className="font-pretendard text-sm leading-body whitespace-pre-line mt-1 md:mt-2.5">{description}</p>
                </div>
            </Link>
        </div>
    );
}
