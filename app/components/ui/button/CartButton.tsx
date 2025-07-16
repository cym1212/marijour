import { useState } from 'react';
import { useNavigate } from 'react-router';

import { ColorButton } from '@/components/ui/button/ColorButton';
import { Toast } from '@/components/ui/Toast';

import type { ToastInstance, CartButtonProps } from '@/types/ui';

export function CartButton({ children, colorType, tailwind, onAddProductCallBack }: CartButtonProps) {
    const [toasts, setToasts] = useState<ToastInstance[]>([]);

    const navigate = useNavigate();

    // 장바구니에 상품 추가
    function handleAddCart(e: React.MouseEvent) {
        e.preventDefault(); // Link 이동 방지
        e.stopPropagation(); // 이벤트 버블링 방지

        // 새로운 Toast 인스턴스 생성
        const newToast: ToastInstance = {
            id: `toast-${Date.now()}-${Math.random()}`,
            isVisible: true,
        };

        setToasts((prev) => [...prev, newToast]);
        onAddProductCallBack?.(); // 상품 추가 콜백 호출
    }

    // 토스트 알림 닫기 핸들러
    function handleCloseToast(toastId: string) {
        setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
    }

    // 장바구니로 이동하는 핸들러
    function handleCartRedirect() {
        navigate('/cart');
    }

    return (
        <>
            <ColorButton
                colorType={colorType}
                onClick={(e) => handleAddCart(e)}
                ariaLabel="장바구니"
                type="button"
                tailwind={tailwind}
            >
                {children}
            </ColorButton>

            {/* 토스트 알림들 */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    isVisible={toast.isVisible}
                    onAnimationComplete={() => handleCloseToast(toast.id)}
                    message="상품을 장바구니에 담았습니다."
                    duration={3000}
                    actionButton={{
                        text: '장바구니 이동',
                        onClick: handleCartRedirect,
                    }}
                />
            ))}
        </>
    );
}
