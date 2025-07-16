import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useState } from 'react';

import { LabelInput, TextInput, WarningLabel, ValidateLabel, CheckLabelBox } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';
import { PrivacyContents, PolicyContents } from '@/components/terms';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

export function meta() {
    return [
        {
            title: '회원가입 - Marijour',
        },
        {
            name: 'description',
            content: '마리쥬르에 회원가입하여 다양한 혜택을 누려보세요. 간편하게 가입하실 수 있습니다.',
        },
        {
            name: 'keywords',
            content: '회원가입, 이메일, 비밀번호, 인증, 마리쥬르, 가입',
        },
    ];
}

/**
 * Signup 페이지 - 회원가입
 * 회원정보 입력 및 약관 동의를 통한 회원가입 기능
 *
 * 주의: 현재 폼 유효성 검사는 임시 검사로, 내부 기획에 따라 재정의 필요
 */
export default function Signup() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [referrer, setReferrer] = useState<string>('');

    // 각 필드별 에러 상태
    const [errors, setErrors] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        agreements: '',
    });

    // 약관 동의 상태
    const [agreements, setAgreements] = useState({
        all: false,
        age: false,
        terms: false,
        privacy: false,
        marketing: false,
    });

    // 유효성 검사 상태
    const isPasswordValid = password.length >= 6 && /[a-zA-Z]/.test(password);
    const isPasswordMatch = password !== '' && password === confirmPassword;
    const isRequiredAgreementsValid = agreements.age && agreements.terms && agreements.privacy;

    // 이메일 유효성 검사
    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 휴대폰 번호 유효성 검사
    const isPhoneValid = (phone: string) => {
        const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
        return phoneRegex.test(phone);
    };

    // 약관 동의 핸들러
    const handleAgreementChange = (type: keyof typeof agreements) => {
        if (type === 'all') {
            const newValue = !agreements.all;
            setAgreements({
                all: newValue,
                age: newValue,
                terms: newValue,
                privacy: newValue,
                marketing: newValue,
            });
        } else {
            const newAgreements = { ...agreements, [type]: !agreements[type] };
            // 전체 동의 체크 상태 업데이트
            newAgreements.all = newAgreements.age && newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
            setAgreements(newAgreements);
        }
    };

    // 에러 초기화 함수
    const clearErrors = () => {
        setErrors({
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            agreements: '',
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 순차적 유효성 검사
        if (!email) {
            setFieldError('email', '이메일을 입력해주세요.');
            return;
        }
        if (!isEmailValid(email)) {
            setFieldError('email', '올바른 이메일 형식을 입력해주세요.');
            return;
        }
        if (!name) {
            setFieldError('name', '이름을 입력해주세요.');
            return;
        }
        if (!password) {
            setFieldError('password', '비밀번호를 입력해주세요.');
            return;
        }
        if (!isPasswordValid) {
            setFieldError('password', '비밀번호는 영문 포함 6자 이상이어야 합니다.');
            return;
        }
        if (!confirmPassword) {
            setFieldError('confirmPassword', '비밀번호 확인을 입력해주세요.');
            return;
        }
        if (!isPasswordMatch) {
            setFieldError('confirmPassword', '비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!phoneNumber) {
            setFieldError('phoneNumber', '휴대폰 번호를 입력해주세요.');
            return;
        }
        if (!isPhoneValid(phoneNumber)) {
            setFieldError('phoneNumber', '올바른 휴대폰 번호 형식을 입력해주세요.');
            return;
        }
        if (!isRequiredAgreementsValid) {
            // 약관 동의 영역으로 스크롤 이동
            setTimeout(() => {
                const element = document.getElementById('ageCheck'); // 첫 번째 필수 약관으로 이동
                if (element) {
                    gsap.to(window, {
                        duration: 0.8,
                        scrollTo: {
                            y: element,
                            offsetY: 100,
                        },
                        ease: 'power2.out',
                    });
                }
            }, 100);
            setFieldError('agreements', '필수 약관에 모두 동의해주세요.');
            return;
        }

        // 모든 유효성 검사 통과
        clearErrors();
        const referrerText = referrer ? `, 추천인: ${referrer}` : '';
        alert('회원가입이 완료되었습니다! 이메일: ' + email + ', 이름: ' + name + ', 비밀번호: ' + password + ', 휴대폰 번호: ' + phoneNumber + referrerText + ', 약관 동의: ' + JSON.stringify(agreements));
    };

    useGSAP(() => {
        gsap.to('.signupContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="signupContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2>회원가입</h2>
                </div>
                <form
                    className="flex flex-col items-center pt-5"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full space-y-6">
                        <LabelInput
                            label="이메일"
                            htmlFor="email"
                            validateContent={errors.email && <WarningLabel message={errors.email} />}
                        >
                            <TextInput
                                type="email"
                                id="email"
                                placeholder="이메일을 입력해주세요"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        </LabelInput>
                        <LabelInput
                            label="이름"
                            htmlFor="name"
                            validateContent={errors.name && <WarningLabel message={errors.name} />}
                        >
                            <TextInput
                                type="text"
                                id="name"
                                placeholder="이름을 입력해주세요"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />
                        </LabelInput>
                        <LabelInput
                            label="비밀번호"
                            htmlFor="password"
                            validateContent={
                                errors.password ? (
                                    <WarningLabel message={errors.password} />
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
                                id="password"
                                placeholder="비밀번호를 입력해주세요"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                        </LabelInput>
                        <LabelInput
                            label="비밀번호 확인"
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
                                placeholder="비밀번호를 재입력해주세요"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            />
                        </LabelInput>
                        <LabelInput
                            label="휴대폰 번호"
                            htmlFor="phoneNumber"
                            validateContent={errors.phoneNumber && <WarningLabel message={errors.phoneNumber} />}
                        >
                            <TextInput
                                type="tel"
                                id="phoneNumber"
                                placeholder="휴대폰 번호를 입력해주세요"
                                value={phoneNumber}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                            />
                        </LabelInput>
                        <LabelInput
                            label="추천인"
                            htmlFor="referrer"
                            required={false}
                        >
                            <TextInput
                                type="text"
                                id="referrer"
                                placeholder="추천인의 이메일이나 닉네임을 입력해주세요"
                                value={referrer}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReferrer(e.target.value)}
                            />
                        </LabelInput>
                    </div>
                    <div className="w-full space-y-5 my-10">
                        <CheckLabelBox
                            id="termsAllCheck"
                            label="모든 약관에 동의합니다."
                            checked={agreements.all}
                            onChange={() => handleAgreementChange('all')}
                        />
                        <div className="w-full h-[1px] bg-black/10"></div>
                        <CheckLabelBox
                            id="ageCheck"
                            label="만 14세 이상입니다."
                            description="(필수)"
                            required
                            checked={agreements.age}
                            onChange={() => handleAgreementChange('age')}
                        />
                        <CheckLabelBox
                            id="termsCheck"
                            label="이용약관 동의"
                            description="(필수)"
                            required
                            checked={agreements.terms}
                            onChange={() => handleAgreementChange('terms')}
                            modalContents={
                                <div className="pb-10">
                                    <PolicyContents />
                                </div>
                            }
                        />
                        <CheckLabelBox
                            id="privacyCheck"
                            label="개인 정보 수집 및 이용 동의"
                            description="(필수)"
                            required
                            checked={agreements.privacy}
                            onChange={() => handleAgreementChange('privacy')}
                            modalContents={
                                <div className="pb-10">
                                    <PrivacyContents />
                                </div>
                            }
                        />
                        <CheckLabelBox
                            id="marketingCheck"
                            label="이메일 및 SNS 마케팅 정보 수신 동의"
                            description="(선택)"
                            checked={agreements.marketing}
                            onChange={() => handleAgreementChange('marketing')}
                        />
                    </div>
                    <div className="w-full bt-5">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                            disabled={!isRequiredAgreementsValid}
                        >
                            회원가입
                        </ColorButton>
                    </div>
                </form>
                <div className="flex items-center justify-center gap-2 w-full text-sm mt-5">
                    <p>이미 아이디가 있으신가요?</p>
                    <Link
                        to="/login"
                        className="text-primary hover-primary-80 font-bold"
                    >
                        로그인
                    </Link>
                </div>
            </section>
        </div>
    );
}
