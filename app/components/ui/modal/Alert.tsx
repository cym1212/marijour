import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button/ColorButton';

import type { AlertProps } from '@/types/ui';

/**
 * Alert 컴포넌트 - 알림 모달
 *
 * 기능:
 * - 화면 중앙에 표시되는 Alert 모달
 * - 텍스트와 확인 버튼으로 구성
 * - 오버레이 없이 모달만 표시
 *
 * Props:
 * - isOpen: boolean - 모달 표시 여부
 * - title?: string - 모달 제목 (선택사항)
 * - message: string - 알림 메시지
 * - confirmText?: string - 확인 버튼 텍스트
 * - onClose?: () => void - 모달 닫기 핸들러
 */
export function Alert({ isOpen, title, message, confirmText = '확인', onClose }: AlertProps) {
    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    // 애니메이션
    useGSAP(() => {
        const modal = document.querySelector('.alertModal');

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
        const modal = document.querySelector('.alertModal');

        if (modal) {
            gsap.to(modal, {
                opacity: 0,
                scale: 0.8,
                y: -20,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    if (onClose) {
                        onClose();
                    }
                },
            });
        } else {
            // 모달이 없는 경우 바로 닫기
            if (onClose) {
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="alertModal bg-white border border-black/10 shadow-lg max-w-xs md:max-w-sm w-full">
                <div className="p-6 text-center">
                    {title && <h3 className="font-serif text-xl mb-4 text-black">{title}</h3>}
                    <p className="text-sm text-black/80 leading-relaxed mb-6 whitespace-pre-line">{message}</p>
                    <ColorButton
                        type="button"
                        colorType="primary"
                        tailwind="w-full px-4 py-3"
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </ColorButton>
                </div>
            </div>
        </div>,
        document.body
    );
}
