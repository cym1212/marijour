import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * GlobalTopBanner 컴포넌트 - 글로벌 상단 배너
 *
 * 구조:
 * - 고정 배경색의 프로모션 배너
 * - 중앙 정렬된 텍스트 표시
 * - globalWrapper 클래스로 반응형 컨테이너 제공
 *
 * 애니메이션:
 * - useGSAP로 로드 시 텍스트 fade-in 효과
 * - power2.out 이징으로 부드러운 진입
 *
 * Props:
 * - text: string - 배너에 표시할 텍스트 내용
 */
export function GlobalTopBanner({ text }: { text: string }) {
    useGSAP(() => {
        // 로드 시 텍스트 fade-in 애니메이션
        const bannerTextBox = document.querySelector('#globalTopBanner > div');
        if (bannerTextBox) {
            gsap.to(bannerTextBox, {
                opacity: 1,
                duration: 0.9,
                ease: 'power2.out',
            });
        }
    }, []);

    return (
        <section
            id="globalTopBanner"
            className="bg-primary"
        >
            <div className="globalWrapper flex items-center justify-center opacity-0">
                <h4 className="py-2.5 px-[20px] leading-body text-white whitegap-pre-line">{text}</h4>
            </div>
        </section>
    );
}
