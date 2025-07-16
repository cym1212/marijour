import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { ColorButton, WarningLabel } from '@/components/ui';
import { TextInput, CheckLabelBox } from '@/components/ui';
import { PasswordChangeModal, RefundAccountModal, Alert, Confirm } from '@/components/ui/modal';

import type { Route } from './+types';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

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
            title: '마이페이지 주문 배송 조회 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '고객 정보를 확인하고 주문 내역을 관리하세요',
        },
        {
            name: 'keywords',
            content: '마이페이지, 고객정보, 주문내역',
        },
    ];
}

export async function clientLoader({ request, params }: Route.LoaderArgs) {
    return {};
}

/**
 * MyInfo 컴포넌트 - 마이페이지
 *
 * 기능:
 * - 고객 정보 표시
 * - 주문 내역 표시
 * - 문의 내역 표시
 */
export default function MyInfo({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();

    // 상태 관리
    const [name, setName] = useState<string>('홍길동');
    const [phone, setPhone] = useState<string>('010-1234-5678');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);
    const [isRefundAccountModalOpen, setIsRefundAccountModalOpen] = useState<boolean>(false);

    // Alert 상태
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertTitle, setAlertTitle] = useState<string>('');

    // Confirm 상태
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

    // 수신 동의 상태
    const [agreements, setAgreements] = useState({
        all: false,
        email: false,
        sms: false,
        onlineMessenger: false,
    });

    // 에러 상태
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
    });

    // 휴대폰 번호 유효성 검사
    const isPhoneValid = (phone: string) => {
        const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
        return phoneRegex.test(phone);
    };

    // 에러 설정 함수 (GSAP ScrollTo로 스크롤 이동)
    const setFieldError = (field: keyof typeof errors, message: string) => {
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

    // 에러 클리어 함수
    const clearFieldError = (field: keyof typeof errors) => {
        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }));
    };

    // 이름 변경 핸들러
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (errors.name) {
            clearFieldError('name');
        }
    };

    // 이름 blur 핸들러
    const handleNameBlur = () => {
        if (!name.trim()) {
            setFieldError('name', '이름을 입력해주세요.');
        }
    };

    // 휴대폰 번호 변경 핸들러
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhone(value);
        if (errors.phone) {
            clearFieldError('phone');
        }
    };

    // 휴대폰 번호 blur 핸들러
    const handlePhoneBlur = () => {
        if (!phone.trim()) {
            setFieldError('phone', '휴대폰 번호를 입력해주세요.');
        } else if (!isPhoneValid(phone)) {
            setFieldError('phone', '올바른 휴대폰 번호 형식을 입력해주세요.');
        }
    };

    // 약관 동의 핸들러
    const handleAgreementChange = (type: keyof typeof agreements) => {
        if (type === 'all') {
            const newValue = !agreements.all;
            setAgreements({
                all: newValue,
                email: newValue,
                sms: newValue,
                onlineMessenger: newValue,
            });
        } else {
            const newAgreements = { ...agreements, [type]: !agreements[type] };
            // 전체 동의 체크 상태 업데이트
            newAgreements.all = newAgreements.email && newAgreements.sms && newAgreements.onlineMessenger;
            setAgreements(newAgreements);
        }
    };

    // Alert 표시 함수
    const showAlert = (message: string, title: string = '') => {
        setAlertTitle(title);
        setAlertMessage(message);
        setIsAlertOpen(true);
    };

    // Alert 닫기 핸들러
    const handleAlertClose = () => {
        setIsAlertOpen(false);
        setAlertTitle('');
        setAlertMessage('');
    };

    // 비밀번호 변경 핸들러
    const handleChangePassword = () => {
        setIsPasswordModalOpen(true);
    };

    // 비밀번호 변경 모달 닫기 핸들러
    const handlePasswordModalClose = () => {
        setIsPasswordModalOpen(false);
    };

    // 비밀번호 변경 제출 핸들러
    const handlePasswordChange = (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
        showAlert('비밀번호가 성공적으로 변경되었습니다.', '변경 완료');
        setIsPasswordModalOpen(false);
    };

    // 환불 계좌 등록 핸들러
    const handleRegisterRefundAccount = () => {
        setIsRefundAccountModalOpen(true);
    };

    // 환불계좌 모달 닫기 핸들러
    const handleRefundAccountModalClose = () => {
        setIsRefundAccountModalOpen(false);
    };

    // 환불계좌 등록 제출 핸들러
    const handleRefundAccountSubmit = (data: { depositor: string; bank: string; accountNumber: string }) => {
        showAlert('환불계좌가 성공적으로 등록되었습니다.', '등록 완료');
        setIsRefundAccountModalOpen(false);
    };

    // 회원 탈퇴 핸들러
    const handleWithdraw = () => {
        setIsConfirmOpen(true);
    };

    // 회원 탈퇴 확인 핸들러
    const handleConfirmWithdraw = () => {
        setIsConfirmOpen(false);
        showAlert('회원 탈퇴 기능은 추후 구현 예정입니다.', '안내');
    };

    // 회원 탈퇴 취소 핸들러
    const handleCancelWithdraw = () => {
        setIsConfirmOpen(false);
    };

    // 폼 유효성 검사
    const validateForm = () => {
        // 이름 검사
        if (!name.trim()) {
            setFieldError('name', '이름을 입력해주세요.');
            return false;
        }

        // 휴대폰 번호 검사
        if (!phone.trim()) {
            setFieldError('phone', '휴대폰 번호를 입력해주세요.');
            return false;
        }
        if (!isPhoneValid(phone)) {
            setFieldError('phone', '올바른 휴대폰 번호 형식을 입력해주세요.');
            return false;
        }

        return true;
    };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 에러 초기화
        setErrors({ name: '', phone: '' });

        if (!validateForm()) {
            return;
        }

        // 폼 데이터 구성
        const formData = {
            name: name.trim(),
            phone: phone.trim(),
            agreements,
        };

        showAlert('회원정보가 성공적으로 수정되었습니다.', '수정 완료');
    };
    useGSAP(() => {
        gsap.to('.myInfoContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    }, []);

    return (
        <div className="myInfoContainer">
            <div className="flex items-center gap-3 pt-1 pb-5">
                <h3 className="font-serif text-2xl leading-heading flex items-center gap-2">
                    <Link
                        to="/my-page/orders"
                        className="p-1 lg:hidden"
                    >
                        <ArrowIcon rotate="-90" />
                    </Link>
                    <span>회원정보 수정</span>
                </h3>
            </div>
            <form onSubmit={handleSubmit}>
                {/* 로그인 정보 */}
                <div className="pt-3 border-t border-black">
                    <div>
                        <h4 className="font-bold">로그인 정보</h4>
                    </div>
                    <div className="w-full space-y-6 mt-6 mb-9">
                        <dl className="flex items-start md:items-center flex-col md:flex-row gap-2">
                            <dt className="w-full md:w-[120px] shrink-0 text-sm text-black/80">이메일</dt>
                            <dd className="w-full text-sm text-black">
                                <TextInput
                                    type="email"
                                    name="email"
                                    id="email"
                                    value="text@naver.com"
                                    disabled
                                />
                            </dd>
                        </dl>
                        <dl className="flex items-start md:items-center flex-col md:flex-row gap-2">
                            <dt className="w-full md:w-[120px] shrink-0 text-sm text-black/80">비밀번호</dt>
                            <dd className="flex gap-2 w-full text-sm text-black">
                                <TextInput
                                    type="password"
                                    name="password"
                                    id="password"
                                    value="*********"
                                    disabled
                                />
                                <ColorButton
                                    type="button"
                                    colorType="grayLine"
                                    onClick={handleChangePassword}
                                    aria-label="변경"
                                    tailwind="w-[100px] py-2 text-sm"
                                >
                                    변경
                                </ColorButton>
                            </dd>
                        </dl>
                    </div>
                </div>

                {/* 회원 정보 */}
                <div className="pt-3 border-t border-black">
                    <div>
                        <h4 className="font-bold">회원 정보</h4>
                    </div>
                    <div className="w-full space-y-6 mt-6 mb-9">
                        <dl className="flex items-start md:items-center flex-col md:flex-row gap-2">
                            <dt className="w-full md:w-[120px] shrink-0 text-sm text-black/80">이름</dt>
                            <dd className="w-full text-sm text-black">
                                <TextInput
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                    onBlur={handleNameBlur}
                                />
                                {errors.name && <WarningLabel message={errors.name} />}
                            </dd>
                        </dl>
                        <dl className="flex items-start md:items-center flex-col md:flex-row gap-2">
                            <dt className="w-full md:w-[120px] shrink-0 text-sm text-black/80">휴대폰 번호</dt>
                            <dd className="w-full text-sm text-black">
                                <TextInput
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    onBlur={handlePhoneBlur}
                                />
                                {errors.phone && <WarningLabel message={errors.phone} />}
                            </dd>
                        </dl>
                        <dl className="flex items-start md:items-center flex-col md:flex-row gap-2">
                            <dt className="w-[120px] shrink-0 text-sm text-black/80">가입일자</dt>
                            <dd className="text-sm text-black">2025-01-01</dd>
                        </dl>
                        <dl className="flex items-start md:items-center flex-col md:flex-row gap-2">
                            <dt className="w-[120px] shrink-0 text-sm text-black/80">등급</dt>
                            <dd className="text-sm text-black">일반</dd>
                        </dl>
                    </div>
                </div>

                {/* 수신 설정 */}
                <div className="pt-3 border-t border-black">
                    <div>
                        <h4 className="font-bold">수신 설정</h4>
                    </div>
                    <div className="w-full space-y-6 mt-6 mb-9">
                        <dl className="flex items-start md:items-start flex-col md:flex-row gap-2">
                            <dt className="w-full md:w-[120px] shrink-0 text-sm text-black/80">마케팅 수신 동의</dt>
                            <dd className="w-full text-sm text-black">
                                <CheckLabelBox
                                    id="termsAllCheck"
                                    label="모든 약관에 동의합니다."
                                    checked={agreements.all}
                                    onChange={() => handleAgreementChange('all')}
                                />
                                <div className="w-full h-[1px] bg-black/10 my-3"></div>
                                <div className="flex items-center gap-4 mb-3">
                                    <CheckLabelBox
                                        id="emailCheck"
                                        label="이메일"
                                        checked={agreements.email}
                                        onChange={() => handleAgreementChange('email')}
                                    />
                                    <CheckLabelBox
                                        id="smsCheck"
                                        label="문자"
                                        checked={agreements.sms}
                                        onChange={() => handleAgreementChange('sms')}
                                    />
                                    <CheckLabelBox
                                        id="onlineMessengerCheck"
                                        label="온라인 메신저"
                                        checked={agreements.onlineMessenger}
                                        onChange={() => handleAgreementChange('onlineMessenger')}
                                    />
                                </div>
                                <p className="text-sm text-black/80">주문/배송 및 안내사항 알림은 위 수신 여부와 관계없이 발송됩니다.</p>
                            </dd>
                        </dl>
                    </div>
                </div>

                {/* 결제 정보 */}
                <div className="pt-3 border-t border-black">
                    <div>
                        <h4 className="font-bold">결제 정보</h4>
                    </div>
                    <div className="w-full space-y-6 mt-6 mb-9">
                        <dl className="flex items-start md:items-center flex-col md:flex-row gap-2">
                            <dt className="w-full md:w-[120px] shrink-0 text-sm text-black/80">환불 계좌</dt>
                            <dd className="w-full text-sm text-black">
                                <ColorButton
                                    type="button"
                                    colorType="grayLine"
                                    onClick={handleRegisterRefundAccount}
                                    aria-label="계좌 등록"
                                    tailwind="w-full py-3 text-sm"
                                >
                                    계좌 등록
                                </ColorButton>
                            </dd>
                        </dl>
                    </div>
                </div>

                {/* 회원 탈퇴 */}
                <div className="pt-3">
                    <button
                        type="button"
                        aria-label="회원 탈퇴"
                        className="text-sm text-black/40 underline hover-black"
                        onClick={handleWithdraw}
                    >
                        회원 탈퇴
                    </button>
                </div>

                {/* 변경하기 버튼 */}
                <div className="mt-10">
                    <ColorButton
                        type="submit"
                        colorType="primary"
                        tailwind="w-full lg:w-auto text-sm py-3 px-10 mx-auto"
                    >
                        변경하기
                    </ColorButton>
                </div>
            </form>
            {/* 비밀번호 변경 모달 */}
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={handlePasswordModalClose}
                onSubmit={handlePasswordChange}
            />
            {/* 환불계좌 등록 모달 */}
            <RefundAccountModal
                isOpen={isRefundAccountModalOpen}
                onClose={handleRefundAccountModalClose}
                onSubmit={handleRefundAccountSubmit}
            />
            {/* 회원 탈퇴 확인 모달 */}
            <Confirm
                isOpen={isConfirmOpen}
                title="정말 탈퇴하시겠습니까?"
                message="탈퇴 시 계정은 삭제되며 복구되지 않아요."
                confirmText="탈퇴"
                cancelText="취소"
                onConfirm={handleConfirmWithdraw}
                onCancel={handleCancelWithdraw}
            />

            {/* Alert 모달 */}
            <Alert
                isOpen={isAlertOpen}
                title={alertTitle}
                message={alertMessage}
                onClose={handleAlertClose}
            />
        </div>
    );
}
