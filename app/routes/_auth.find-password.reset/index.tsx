import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useState } from 'react';

import { LabelInput, TextInput, WarningLabel, ValidateLabel } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';
import { Alert } from '@/components/ui/modal';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

/**
 * meta 함수 - 페이지 메타데이터 설정
 *
 * 구조:
 * - SEO를 위한 title, description, keywords 설정
 * - React Router 7의 메타 함수 규칙 준수
 *
 * 반환값:
 * - 메타 태그 배열 (title, description, keywords)
 */
export function meta() {
    return [
        {
            title: '비밀번호 재설정 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '비밀번호 재설정 페이지입니다. 이메일을 입력하여 비밀번호를 재설정하세요.',
        },
        {
            name: 'keywords',
            content: '비밀번호 재설정, 이메일, 인증',
        },
    ];
}

// 현재 폼 유효성 검사는 약식입니다. 내부 기획에 맞게 수정이 필요합니다.
export default function FindPasswordReset() {
    const [resetCode, setResetCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    // 각 필드별 에러 상태
    const [errors, setErrors] = useState({
        resetCode: '',
        newPassword: '',
        confirmPassword: '',
    });

    // 재발송 관련 상태
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
    const [resendCountdown, setResendCountdown] = useState<number>(0);

    // Alert 모달 상태
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

    // 비밀번호 유효성 검사
    const isPasswordValid = newPassword.length >= 6 && /[a-zA-Z]/.test(newPassword);
    const isPasswordMatch = newPassword !== '' && newPassword === confirmPassword;

    // 버튼 활성화 조건
    const isFormValid = resetCode.trim() !== '' && newPassword.trim() !== '' && confirmPassword.trim() !== '';

    // 에러 초기화 함수
    const clearErrors = () => {
        setErrors({
            resetCode: '',
            newPassword: '',
            confirmPassword: '',
        });
    };

    // 개별 에러 설정 함수 (GSAP ScrollTo로 스크롤 이동)
    const setFieldError = (field: keyof typeof errors, message: string) => {
        clearErrors();
        setErrors((prev) => ({ ...prev, [field]: message }));

        // GSAP ScrollTo로 해당 필드로 스크롤 이동
        setTimeout(() => {
            const element = document.getElementById(field);
            if (element) {
                gsap.to(window, {
                    duration: 0.6,
                    scrollTo: {
                        y: element,
                        offsetY: 100, // 헤더 공간 확보
                    },
                    ease: 'power2.out',
                    onComplete: () => {
                        // 스크롤 완료 후 포커스
                        element.focus();
                    },
                });
            }
        }, 100);
    };

    // 재발송 버튼 클릭 핸들러
    const handleResendCode = () => {
        if (isResendDisabled) return;

        // Alert 모달 표시
        setIsAlertOpen(true);

        // 재발송 버튼 비활성화 및 카운트다운 시작
        setIsResendDisabled(true);
        setResendCountdown(60); // 60초 카운트다운

        const countdown = setInterval(() => {
            setResendCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setIsResendDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Alert 확인 버튼 클릭 핸들러
    const handleAlertClose = () => {
        setIsAlertOpen(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 순차적 유효성 검사
        if (!resetCode.trim()) {
            setFieldError('resetCode', '재설정 코드를 입력해주세요.');
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
            setFieldError('confirmPassword', '비밀번호 확인을 입력해주세요.');
            return;
        }
        if (!isPasswordMatch) {
            setFieldError('confirmPassword', '비밀번호가 일치하지 않습니다.');
            return;
        }

        // 모든 유효성 검사 통과
        clearErrors();
        alert('비밀번호가 성공적으로 재설정되었습니다! 재설정 코드: ' + resetCode + ', 새 비밀번호: ' + newPassword);
    };

    useGSAP(() => {
        gsap.to('.resetPasswordContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="resetPasswordContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2>비밀번호 재설정</h2>
                </div>
                <form
                    className="flex flex-col items-center pt-5"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full space-y-6">
                        <LabelInput
                            label="재설정 코드"
                            htmlFor="resetCode"
                            validateContent={errors.resetCode && <WarningLabel message={errors.resetCode} />}
                        >
                            <div className="flex gap-2">
                                <TextInput
                                    type="text"
                                    id="resetCode"
                                    placeholder="이메일로 받은 재설정 코드를 입력해주세요"
                                    value={resetCode}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResetCode(e.target.value)}
                                    tailwind="flex-1"
                                />
                                <ColorButton
                                    type="button"
                                    colorType="grayLine"
                                    onClick={handleResendCode}
                                    disabled={isResendDisabled}
                                    aria-label="재발송"
                                    tailwind="w-[100px] py-2 text-sm"
                                    data-testid="resend-button"
                                >
                                    {isResendDisabled ? `재발송 ${resendCountdown}s` : '재발송'}
                                </ColorButton>
                            </div>
                        </LabelInput>
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
                                id="newPassword"
                                placeholder="새 비밀번호를 입력해주세요"
                                value={newPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                            />
                        </LabelInput>
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
                                id="confirmPassword"
                                placeholder="새 비밀번호를 재입력해주세요"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            />
                        </LabelInput>
                    </div>
                    <div className="w-full mt-10">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                            disabled={!isFormValid}
                            to="/find-password/result"
                        >
                            비밀번호 재설정
                        </ColorButton>
                    </div>
                </form>
            </section>

            {/* Alert 모달 */}
            <Alert
                isOpen={isAlertOpen}
                message="재설정 코드가 재발송되었습니다.
                이메일을 확인해주세요."
                confirmText="확인"
                onClose={handleAlertClose}
            />
        </div>
    );
}
