import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button/ColorButton';

import type { ConfirmProps } from '@/types/ui';

/**
 * Confirm 컴포넌트 - 확인/취소 모달
 *
 * 기능:
 * - 화면 중앙에 표시되는 확인/취소 모달
 * - 메시지와 두 개의 버튼(확인/취소)으로 구성
 * - 오버레이와 함께 모달 표시
 *
 * Props:
 * - isOpen: boolean - 모달 표시 여부
 * - title?: string - 모달 제목 (선택사항)
 * - message: string - 확인 메시지
 * - confirmText?: string - 확인 버튼 텍스트
 * - cancelText?: string - 취소 버튼 텍스트
 * - onConfirm: () => void - 확인 버튼 클릭 핸들러
 * - onCancel: () => void - 취소 버튼 클릭 핸들러
 */
export function Confirm({ isOpen, title, message, confirmText = '확인', cancelText = '취소', onConfirm, onCancel }: ConfirmProps) {
    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onCancel]);

    // 애니메이션
    useGSAP(() => {
        const modal = document.querySelector('.confirmModal');

        if (isOpen) {
            gsap.fromTo(
                modal,
                {
                    opacity: 0,
                    scale: 0.8,
                    y: -20,
                },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                }
            );
        }
    }, [isOpen]);

    const handleConfirm = () => {
        const modal = document.querySelector('.confirmModal');

        if (modal) {
            gsap.to(modal, {
                opacity: 0,
                scale: 0.8,
                y: -20,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    onConfirm();
                },
            });
        }
    };

    const handleCancel = () => {
        const modal = document.querySelector('.confirmModal');

        if (modal) {
            gsap.to(modal, {
                opacity: 0,
                scale: 0.8,
                y: -20,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    onCancel();
                },
            });
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="confirmModal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md mx-auto border border-black/10 shadow-lg">
                <div className="p-6 text-center">
                    {title && <h3 className="font-serif text-xl mb-4 text-black">{title}</h3>}
                    <p className="text-sm text-black/80 leading-relaxed mb-6 whitespace-pre-line">{message}</p>

                    {/* 버튼 영역 */}
                    <div className="flex flex-col gap-3">
                        <ColorButton
                            type="button"
                            colorType="primary"
                            tailwind="w-full px-4 py-3"
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </ColorButton>
                        <ColorButton
                            type="button"
                            colorType="grayLine"
                            tailwind="w-full px-4 py-3"
                            onClick={handleCancel}
                        >
                            {cancelText}
                        </ColorButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
