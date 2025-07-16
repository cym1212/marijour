import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { ColorButton } from '@/components/ui/button';
import { LabelInput, TextInput, WarningLabel, ValidateLabel } from '@/components/ui/input';
import { CloseIcon } from '@/components/icons';

gsap.registerPlugin(useGSAP);

import type { PasswordChangeModalProps } from '@/types/userInfo';

/**
 * PasswordChangeModal 컴포넌트 - 비밀번호 변경 모달
 *
 * 기능:
 * - 사용자 비밀번호 변경 모달
 * - 현재 비밀번호 확인 및 새 비밀번호 설정
 * - 폼 유효성 검사 포함
 *
 * 주의사항:
 * - 현재 폼 유효성 검사는 임시 검사라 내부 기획에 따라 재정의 필요
 *
 * 파라미터:
 * @param isOpen - 모달 표시 여부
 * @param onClose - 모달 닫기 핸들러
 * @param onSubmit - 비밀번호 변경 제출 핸들러
 */
export function PasswordChangeModal({ isOpen, onClose, onSubmit }: PasswordChangeModalProps) {
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    // 에러 상태
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // 유효성 검사 상태
    const isPasswordValid = newPassword.length >= 6 && /[a-zA-Z]/.test(newPassword);
    const isPasswordMatch = newPassword !== '' && newPassword === confirmPassword;

    // 폼 초기화 함수
    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
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

    // 현재 비밀번호 변경 핸들러
    const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCurrentPassword(value);
        if (errors.currentPassword) {
            clearFieldError('currentPassword');
        }
    };

    // 현재 비밀번호 blur 핸들러
    const handleCurrentPasswordBlur = () => {
        if (!currentPassword.trim()) {
            setFieldError('currentPassword', '현재 비밀번호를 입력해주세요.');
        }
    };

    // 새 비밀번호 변경 핸들러
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        if (errors.newPassword) {
            clearFieldError('newPassword');
        }
    };

    // 새 비밀번호 blur 핸들러
    const handleNewPasswordBlur = () => {
        if (!newPassword.trim()) {
            setFieldError('newPassword', '새 비밀번호를 입력해주세요.');
        } else if (!isPasswordValid) {
            setFieldError('newPassword', '비밀번호는 영문 포함 6자 이상이어야 합니다.');
        }
    };

    // 새 비밀번호 확인 변경 핸들러
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (errors.confirmPassword) {
            clearFieldError('confirmPassword');
        }
    };

    // 새 비밀번호 확인 blur 핸들러
    const handleConfirmPasswordBlur = () => {
        if (!confirmPassword.trim()) {
            setFieldError('confirmPassword', '새 비밀번호를 한 번 더 입력해주세요.');
        } else if (!isPasswordMatch) {
            setFieldError('confirmPassword', '비밀번호가 일치하지 않습니다.');
        }
    };

    // 비밀번호 변경 제출 핸들러
    const handleSubmit = () => {
        // 에러 초기화
        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        // 유효성 검사
        if (!currentPassword.trim()) {
            setFieldError('currentPassword', '현재 비밀번호를 입력해주세요.');
            return;
        }

        if (!newPassword.trim()) {
            setFieldError('newPassword', '새 비밀번호를 입력해주세요.');
            return;
        }

        if (!isPasswordValid) {
            setFieldError('newPassword', '비밀번호는 영문 포함 6자 이상이어야 합니다.');
            return;
        }

        if (!confirmPassword.trim()) {
            setFieldError('confirmPassword', '새 비밀번호를 한 번 더 입력해주세요.');
            return;
        }

        if (!isPasswordMatch) {
            setFieldError('confirmPassword', '비밀번호가 일치하지 않습니다.');
            return;
        }

        // 비밀번호 변경 제출
        onSubmit({
            currentPassword: currentPassword.trim(),
            newPassword: newPassword.trim(),
            confirmPassword: confirmPassword.trim(),
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
        const container = document.querySelector('.passwordModalContainer');

        if (isOpen) {
            gsap.to(container, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
            });
        }
    }, [isOpen]);

    // 폼 유효성 검사 (변경 버튼 활성화 조건)
    const isFormValid = currentPassword && isPasswordValid && isPasswordMatch;

    if (!isOpen) return null;

    return (
        <div className="passwordModalContainer fixed top-0 left-0 w-full h-full overflow-hidden z-10000 opacity-0">
            <div
                className="passwordModalOverlay fixed bg-black/60 w-full h-full"
                onClick={handleOverlayClick}
            ></div>
            <div className="passwordModalContent fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-black/10">
                    <h2 className="text-2xl font-serif">비밀번호 변경</h2>
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
                    {/* 현재 비밀번호 */}
                    <LabelInput
                        label="현재 비밀번호"
                        htmlFor="currentPassword"
                        validateContent={errors.currentPassword && <WarningLabel message={errors.currentPassword} />}
                    >
                        <TextInput
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            placeholder="비밀번호를 입력해주세요"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                            onBlur={handleCurrentPasswordBlur}
                            required
                        />
                    </LabelInput>

                    {/* 새 비밀번호 */}
                    <LabelInput
                        label="새 비밀번호"
                        htmlFor="newPassword"
                        validateContent={
                            errors.newPassword ? (
                                <WarningLabel message={errors.newPassword} />
                            ) : (
                                <ValidateLabel
                                    isValid={isPasswordValid}
                                    message="영문 포함 6자 이상"
                                />
                            )
                        }
                    >
                        <TextInput
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            placeholder="비밀번호를 입력해주세요"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            onBlur={handleNewPasswordBlur}
                            required
                        />
                    </LabelInput>

                    {/* 새 비밀번호 확인 */}
                    <LabelInput
                        label="새 비밀번호 확인"
                        htmlFor="confirmPassword"
                        validateContent={
                            errors.confirmPassword ? (
                                <WarningLabel message={errors.confirmPassword} />
                            ) : (
                                <ValidateLabel
                                    isValid={isPasswordMatch}
                                    message="비밀번호 일치"
                                />
                            )
                        }
                    >
                        <TextInput
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="비밀번호를 한 번 더 입력해주세요"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            onBlur={handleConfirmPasswordBlur}
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
                        변경
                    </ColorButton>
                </div>
            </div>
        </div>
    );
}
