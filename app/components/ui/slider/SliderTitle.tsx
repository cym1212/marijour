/**
 * SliderTitle 컴포넌트 - 섹션 제목 및 설명
 * @param title - 섹션 제목
 * @param description - 섹션 설명
 */
import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { SliderTitleProps } from '@/types/ui';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function SliderTitle({ title, description }: SliderTitleProps) {
    const TextBoxRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!TextBoxRef.current) return;

        ScrollTrigger.batch(TextBoxRef.current.children, {
            start: 'top 95%',
            once: true,
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power2.out',
                }),
        });
    }, [TextBoxRef.current]);

    return (
        <div
            className="mb-5 md:mb-8"
            ref={TextBoxRef}
        >
            <h2 className="font-serif text-3xl leading-heading whitespace-pre-line opacity-0 translate-y-[15px]">{title}</h2>
            <p className="text-sm md:text-base text-black/80 leading-body whitespace-pre-line mt-2 md:mt-3 opacity-0 translate-y-[15px]">{description}</p>
        </div>
    );
}
