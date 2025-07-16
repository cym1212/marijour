import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { PrivacyContents } from '@/components/terms';

gsap.registerPlugin(useGSAP);

/**
 * meta 함수 - 검색 페이지 메타데이터 설정
 */
export function meta() {
    return [
        {
            title: '검색 결과 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '상품 검색 결과를 확인하세요',
        },
        {
            name: 'keywords',
            content: '검색, 상품검색, 쇼핑몰',
        },
    ];
}

// 페이지네이션을 위한 데이터 분할
/**
 * Privacy 컴포넌트 - 개인정보 처리방침 페이지
 */
export default function Privacy() {
    useGSAP(() => {
        gsap.to('.privacyContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="privacyContainer opacity-0">
            <section className="globalWrapper w-full pt-10 pb-15">
                <PrivacyContents />
            </section>
        </div>
    );
}
