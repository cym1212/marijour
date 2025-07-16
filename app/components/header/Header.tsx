/**
 * Header 컴포넌트 - 사이트 상단 헤더
 * 스크롤에 따른 배경 투명도 변화 애니메이션 포함
 */
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Gnb } from '@/components/header/Gnb';
import { Menu } from '@/components/header/Menu';

gsap.registerPlugin(useGSAP, ScrollTrigger);
export function Header() {
    useGSAP(() => {
        const header = document.querySelector('#header');
        const logo = document.querySelector('#header .logo');
        if (header && logo) {
            // 로드 시 fade-in 애니메이션
            gsap.to(logo, {
                opacity: 1,
                duration: 0.9,
                ease: 'power2.out',
            });

            // 스크롤 시 배경 투명도 전환
            ScrollTrigger.create({
                trigger: header,
                start: 'top top',
                end: 'bottom top',
                onEnter: () => gsap.to(header, { backgroundColor: 'rgba(255, 255, 255, 0.95)', duration: 0.5 }),
                onEnterBack: () => gsap.to(header, { backgroundColor: 'rgba(255, 255, 255, 1)', duration: 0.5 }),
            });
        }
    }, []);

    return (
        <header
            id="header"
            className="sticky top-0 bg-white z-100001"
        >
            <div className="globalWrapper flex items-center justify-between">
                <Gnb />
                <div className="logo opacity-0">
                    <h1 className="text-[23px] font-serif leading-logo">
                        <Link to="/">Marijour</Link>
                    </h1>
                </div>
                <Menu />
            </div>
        </header>
    );
}
