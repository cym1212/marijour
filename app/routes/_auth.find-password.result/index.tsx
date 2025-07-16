/**
 * 비밀번호 재설정 완료 페이지
 *
 * 기능:
 * - 비밀번호 재설정 성공 메시지 표시
 * - 로그인 페이지로 이동 버튼 제공
 * - 프로젝트 디자인 일관성 유지
 */
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button/ColorButton';
import { CheckIcon } from '@/components/icons';

gsap.registerPlugin(useGSAP);

/**
 * meta 함수 - 페이지 메타데이터 설정
 */
export function meta() {
    return [
        {
            title: '비밀번호 재설정 완료 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '비밀번호 재설정이 완료되었습니다. 새로운 비밀번호로 로그인하세요.',
        },
        {
            name: 'keywords',
            content: '비밀번호 재설정 완료, 로그인',
        },
    ];
}

export default function FindPasswordResult() {
    useGSAP(() => {
        gsap.to('.findPasswordResultContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });

        const tl = gsap.timeline();
        tl.to('.successIcon', {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'back.out(1.7)',
        }).to(
            '.successText',
            {
                opacity: 1,
                duration: 0.9,
                ease: 'power2.out',
            },
            '<'
        );
    });

    return (
        <div className="findPasswordResultContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="text-center">
                    {/* 성공 아이콘 */}
                    <div className="successIcon mb-6 flex justify-center -rotate-180 opacity-0">
                        <div className="w-13 md:w-16 h-13 md:h-16 bg-primary rounded-full flex items-center justify-center">
                            <CheckIcon tailwind="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="successText opacity-0">
                        <div className="font-serif text-3xl mb-4 text-center">
                            <h1>재설정 완료</h1>
                        </div>
                        <div className="mb-10">
                            <p className="text-black/70 leading-relaxed">
                                비밀번호가 성공적으로 재설정되었습니다.
                                <br />
                                새로운 비밀번호로 로그인해주세요.
                            </p>
                        </div>
                        <div className="w-full">
                            <ColorButton
                                type="button"
                                colorType="primary"
                                tailwind="w-full px-4.5 py-3.5"
                                to="/login"
                            >
                                로그인하기
                            </ColorButton>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
