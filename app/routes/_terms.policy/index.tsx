import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { PolicyContents } from '@/components/terms';

gsap.registerPlugin(useGSAP);

/**
 * meta 함수 - 이용약관 페이지 메타데이터 설정
 */
export function meta() {
    return [
        {
            title: '이용약관 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '서비스 이용약관을 확인하세요',
        },
        {
            name: 'keywords',
            content: '이용약관, 서비스 약관, 정책',
        },
    ];
}

// 페이지네이션을 위한 데이터 분할
/**
 * Policy 컴포넌트 - 이용약관 페이지
 */
export default function Policy() {
    useGSAP(() => {
        gsap.to('.policyContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="policyContainer opacity-0">
            <section className="globalWrapper w-full pt-10 pb-15">
                <PolicyContents />
            </section>
        </div>
    );
}
