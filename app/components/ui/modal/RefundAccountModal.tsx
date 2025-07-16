import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button';
import { LabelInput, TextInput, SelectBox, WarningLabel } from '@/components/ui/input';
import { CloseIcon } from '@/components/icons';

gsap.registerPlugin(useGSAP);

import type { RefundAccountModalProps } from '@/types/userInfo';

// 은행 목록
const BANK_OPTIONS = [
    { value: '신한은행', label: '신한은행' },
    { value: '우리은행', label: '우리은행' },
    { value: 'KB국민은행', label: 'KB국민은행' },
    { value: '하나은행', label: '하나은행' },
    { value: 'NH농협은행', label: 'NH농협은행' },
    { value: '기업은행', label: '기업은행' },
    { value: '새마을금고', label: '새마을금고' },
    { value: '신협', label: '신협' },
    { value: '카카오뱅크', label: '카카오뱅크' },
    { value: '토스뱅크', label: '토스뱅크' },
    { value: '케이뱅크', label: '케이뱅크' },
];

/**
 * RefundAccountModal 컴포넌트 - 환불계좌 등록 모달
 *
 * 기능:
 * - 환불 시 사용할 계좌 정보 등록
 * - 예금주명, 은행명, 계좌번호 입력
 * - 폼 유효성 검사 포함
 *
 * 주의사항:
 * - 현재 폼 유효성 검사는 임시 검사라 내부 기획에 따라 재정의 필요
 *
 * 파라미터:
 * @param isOpen - 모달 표시 여부
 * @param onClose - 모달 닫기 핸들러
 * @param onSubmit - 환불계좌 등록 제출 핸들러
 */
export function RefundAccountModal({ isOpen, onClose, onSubmit }: RefundAccountModalProps) {
    const [depositor, setDepositor] = useState<string>('');
    const [bank, setBank] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<string>('');

    // 에러 상태
    const [errors, setErrors] = useState({
        depositor: '',
        bank: '',
        accountNumber: '',
    });

    // 폼 초기화 함수
    const resetForm = () => {
        setDepositor('');
        setBank('');
        setAccountNumber('');
        setErrors({
            depositor: '',
            bank: '',
            accountNumber: '',
        });
    };

    // 에러 클리어 함수
    const clearFieldError = (field: keyof typeof errors) => {
        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }));
    };

    // 에러 설정 함수
    const setFieldError = (field: keyof typeof errors, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    // 모달 닫기 핸들러 (폼 초기화 포함)
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // 예금주 변경 핸들러
    const handleDepositorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDepositor(value);
        if (errors.depositor) {
            clearFieldError('depositor');
        }
    };

    // 예금주 blur 핸들러
    const handleDepositorBlur = () => {
        if (!depositor.trim()) {
            setFieldError('depositor', '예금주명을 입력해주세요.');
        } else if (depositor.trim().length < 2) {
            setFieldError('depositor', '예금주명은 2자 이상 입력해주세요.');
        }
    };

    // 은행 선택 핸들러
    const handleBankSelect = (value: string) => {
        setBank(value);
        if (errors.bank) {
            clearFieldError('bank');
        }
    };

    // 계좌번호 변경 핸들러
    const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9-]/g, ''); // 숫자와 하이픈만 허용
        setAccountNumber(value);
        if (errors.accountNumber) {
            clearFieldError('accountNumber');
        }
    };

    // 계좌번호 blur 핸들러
    const handleAccountNumberBlur = () => {
        if (!accountNumber.trim()) {
            setFieldError('accountNumber', '계좌번호를 입력해주세요.');
        } else if (accountNumber.replace(/[^0-9]/g, '').length < 10) {
            setFieldError('accountNumber', '올바른 계좌번호를 입력해주세요.');
        }
    };

    // 환불계좌 등록 제출 핸들러
    const handleSubmit = () => {
        // 에러 초기화
        setErrors({
            depositor: '',
            bank: '',
            accountNumber: '',
        });

        // 유효성 검사
        if (!depositor.trim()) {
            setFieldError('depositor', '예금주명을 입력해주세요.');
            return;
        }

        if (depositor.trim().length < 2) {
            setFieldError('depositor', '예금주명은 2자 이상 입력해주세요.');
            return;
        }

        if (!bank) {
            setFieldError('bank', '입금 은행을 선택해주세요.');
            return;
        }

        if (!accountNumber.trim()) {
            setFieldError('accountNumber', '계좌번호를 입력해주세요.');
            return;
        }

        if (accountNumber.replace(/[^0-9]/g, '').length < 10) {
            setFieldError('accountNumber', '올바른 계좌번호를 입력해주세요.');
            return;
        }

        // 환불계좌 등록 제출
        onSubmit({
            depositor: depositor.trim(),
            bank: bank,
            accountNumber: accountNumber.trim(),
        });

        // 폼 초기화 및 모달 닫기
        handleClose();
    };

    // 모달 배경 클릭 시 닫기
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // 모달이 열릴 때 스크롤 방지
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // 모달 fade-in-out 애니메이션
    useGSAP(() => {
        const container = document.querySelector('.refundAccountModalContainer');

        if (isOpen) {
            gsap.to(container, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    }, [isOpen]);

    // 폼 유효성 검사 (등록 버튼 활성화 조건)
    const isFormValid = depositor && bank && accountNumber;

    if (!isOpen) return null;

    return (
        <div className="refundAccountModalContainer fixed top-0 left-0 w-full h-full overflow-hidden z-10000 opacity-0">
            <div
                className="refundAccountModalOverlay fixed bg-black/60 w-full h-full"
                onClick={handleOverlayClick}
            ></div>
            <div className="refundAccountModalContent fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-black/10">
                    <h2 className="text-2xl font-serif">환불계좌 등록</h2>
                    <button
                        onClick={handleClose}
                        className="closeBtn p-3.5"
                        aria-label="모달 닫기"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* 모달 콘텐츠 */}
                <div className="p-5 space-y-6">
                    {/* 예금주 */}
                    <LabelInput
                        label="예금주"
                        htmlFor="depositor"
                        validateContent={errors.depositor && <WarningLabel message={errors.depositor} />}
                    >
                        <TextInput
                            type="text"
                            name="depositor"
                            id="depositor"
                            placeholder="예금주명을 입력해주세요"
                            value={depositor}
                            onChange={handleDepositorChange}
                            onBlur={handleDepositorBlur}
                            required
                        />
                    </LabelInput>

                    {/* 입금 은행 */}
                    <LabelInput
                        label="입금 은행"
                        htmlFor="bank"
                        validateContent={errors.bank && <WarningLabel message={errors.bank} />}
                    >
                        <SelectBox
                            name="bank"
                            id="bank"
                            value={bank}
                            placeholder="입금 은행을 선택해주세요"
                            options={BANK_OPTIONS}
                            required
                            onChange={handleBankSelect}
                        />
                    </LabelInput>

                    {/* 계좌번호 */}
                    <LabelInput
                        label="계좌번호"
                        htmlFor="accountNumber"
                        validateContent={errors.accountNumber && <WarningLabel message={errors.accountNumber} />}
                    >
                        <TextInput
                            type="text"
                            name="accountNumber"
                            id="accountNumber"
                            placeholder="계좌번호를 입력해주세요"
                            value={accountNumber}
                            onChange={handleAccountNumberChange}
                            onBlur={handleAccountNumberBlur}
                            required
                        />
                    </LabelInput>
                </div>

                {/* 모달 푸터 */}
                <div className="p-5 border-t border-black/10">
                    <ColorButton
                        type="button"
                        colorType={isFormValid ? 'primary' : 'grayLine'}
                        onClick={handleSubmit}
                        tailwind="w-full py-3"
                        disabled={!isFormValid}
                    >
                        등록
                    </ColorButton>
                </div>
            </div>
        </div>
    );
}
