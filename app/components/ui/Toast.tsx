import { useRef } from 'react';
import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import type { ToastProps } from '@/types/ui';

gsap.registerPlugin(useGSAP);

/**
 * Toast 컴포넌트 - 알림 토스트
 *
 * 기능:
 * - 임시 알림 메시지 표시
 * - 자동 사라짐 애니메이션
 * - 액션 버튼 옵션 제공
 *
 * 파라미터:
 * @param isVisible - 토스트 표시 여부
 * @param onAnimationComplete - 애니메이션 완료 콜백
 * @param message - 표시할 메시지
 * @param duration - 표시 시간(ms)
 * @param actionButton - 액션 버튼 설정 (옵션)
 */
export function Toast({ isVisible, onAnimationComplete, message, duration = 3000, actionButton }: ToastProps) {
    const toastRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    // 토스트 애니메이션
    useGSAP(() => {
        if (!toastRef.current) return;

        if (isVisible) {
            const tl = gsap.timeline();
            timelineRef.current = tl; // 타임라인 참조 저장

            tl.set(toastRef.current, {
                y: -100,
                opacity: 0,
                scale: 0.9,
            })
                .to(toastRef.current, {
                    // 토스트 등장 애니메이션 (위에서 아래로)
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out',
                })
                .to(toastRef.current, {
                    // 토스트 닫기 애니메이션
                    delay: duration / 1000, // duration을 초 단위로 변환
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.out',
                    onComplete: onAnimationComplete,
                });
        }

        return () => {
            // 컴포넌트 언마운트 시 타임라인 정리
            if (timelineRef.current) {
                timelineRef.current.kill();
                timelineRef.current = null;
            }
        };
    }, [isVisible, duration]);

    if (!isVisible) return null;

    const handleActionClick = () => {
        // 진행 중인 애니메이션 중단
        if (timelineRef.current) {
            timelineRef.current.kill();
            timelineRef.current = null;
        }

        // 액션 버튼 클릭 핸들러 실행
        if (actionButton?.onClick) {
            actionButton.onClick();
            onAnimationComplete();
        }
    };

    return (
        <div className="fixed z-10000 top-15 left-0 right-0 flex justify-center">
            <div
                ref={toastRef}
                className="rounded-lg shadow-lg bg-white/95 pointer-events-auto border border-primary/40"
            >
                <div className="px-5 py-3">
                    <div className="flex items-center gap-6">
                        <p className="text-sm">{message}</p>
                        {actionButton && (
                            <div className="flex items-center shrink-0 bg-primary/80 hover:bg-primary/40 rounded px-2 py-1 transition-colors duration-300">
                                {actionButton.href ? (
                                    <Link
                                        to={actionButton.href}
                                        className="text-xs text-white font-bold"
                                        onClick={handleActionClick}
                                    >
                                        {actionButton.text}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleActionClick}
                                        className="text-xs text-white font-bold"
                                        aria-label={actionButton.text}
                                    >
                                        {actionButton.text}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
