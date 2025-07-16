import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button';
import { TextInput } from '@/components/ui/input';
import { CloseIcon } from '@/components/icons';

gsap.registerPlugin(useGSAP);

import type { CouponModalProps } from '@/types/ui';

/**
 * CouponModal 컴포넌트 - 쿠폰 적용 모달
 *
 * Props:
 * - isOpen: boolean - 모달 표시 여부
 * - onClose: () => void - 모달 닫기 핸들러
 * - onApplyCoupon: (couponCode: string) => void - 쿠폰 적용 핸들러
 * - availableCoupons: Array<{ id: string, name: string, discountType: 'amount' | 'percentage', discountAmount: number, expiryDate: string }> - 사용 가능한 쿠폰 목록   
 */
export function CouponModal({ isOpen, onClose, onApplyCoupon, availableCoupons = [] }: CouponModalProps) {
    const [couponCode, setCouponCode] = useState<string>('');
    const [error, setError] = useState<string>('');

    // 쿠폰 코드 입력 핸들러
    const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCouponCode(value);
        if (error) {
            setError('');
        }
    };

    // 쿠폰 등록 핸들러
    const handleRegisterCoupon = () => {
        if (!couponCode.trim()) {
            setError('쿠폰 코드를 입력해주세요.');
            return;
        }

        // 임시: 쿠폰 코드 유효성 검사
        if (couponCode.length < 4) {
            setError('올바른 쿠폰 코드를 입력해주세요.');
            return;
        }

        // 쿠폰 적용 성공 시
        onApplyCoupon(couponCode);
        setCouponCode('');
        setError('');
        onClose();
    };

    // 사용 가능한 쿠폰 적용 핸들러
    const handleSelectCoupon = (coupon: any) => {
        onApplyCoupon(coupon.name);
        onClose();
    };

    // 모달 배경 클릭 시 닫기
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // 모달 fade-in-out 애니메이션
    useGSAP(() => {
        const container = document.querySelector('.couponModalContainer');

        if (isOpen) {
            gsap.to(container, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    }, [isOpen]);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
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

    return (
        <div className="couponModalContainer fixed top-0 left-0 w-full h-full overflow-hidden z-10000 opacity-0">
            <div
                className="couponModalOveray fixed bg-black/60 w-full h-full"
                onClick={handleOverlayClick}
            ></div>
            <div className="couponModalContent fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md mx-auto">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4">
                    <h2 className="text-2xl font-serif">쿠폰 적용</h2>
                    <button
                        onClick={onClose}
                        className="closeBtn p-3.5"
                        aria-label="모달 닫기"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="p-5 pt-0 space-y-6">
                    {/* 쿠폰 코드 입력 */}
                    <div className="space-y-2 border-b border-black/10 pb-4">
                        <div className="flex gap-2">
                            <TextInput
                                type="text"
                                placeholder="쿠폰 코드를 입력해주세요"
                                value={couponCode}
                                onChange={handleCouponCodeChange}
                                tailwind="flex-1"
                            />
                            <ColorButton
                                type="button"
                                colorType="white"
                                onClick={handleRegisterCoupon}
                                tailwind="px-4 py-2 text-sm whitespace-nowrap"
                            >
                                쿠폰 등록
                            </ColorButton>
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>

                    {/* 사용 가능한 쿠폰 */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-bold">사용 가능 쿠폰</h3>
                            <span className="text-primary font-bold">{availableCoupons.length}</span>
                        </div>

                        {availableCoupons.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-black/40">사용 가능한 쿠폰이 없어요</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {availableCoupons.map((coupon) => (
                                    <div
                                        key={coupon.id}
                                        className="border border-black/10 p-4 hover:border-primary hover-bg-primary-10 transition-colors cursor-pointer"
                                        onClick={() => handleSelectCoupon(coupon)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-sm">{coupon.name}</h4>
                                                <p className="text-xs text-black/40 mt-1">{coupon.expiryDate}까지</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary">{coupon.discountType === 'amount' ? `${coupon.discountAmount.toLocaleString()}원` : `${coupon.discountAmount}%`}</p>
                                                <p className="text-xs text-black/40">할인</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 모달 푸터 */}
                <div className="py-5 mx-5 border-t border-black/10">
                    <ColorButton
                        type="button"
                        colorType="primary"
                        onClick={onClose}
                        tailwind="w-full py-3"
                    >
                        확인
                    </ColorButton>
                </div>
            </div>
        </div>
    );
}
