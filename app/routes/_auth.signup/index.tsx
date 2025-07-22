import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

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

// 회원가입 폼 데이터 타입 정의
interface SignupFormData {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    phone: string;
    referral_code: string;
    agreements: {
        all: boolean;
        age: boolean;
        terms: boolean;
        privacy: boolean;
        marketing: boolean;
    };
}

interface SignupValidationErrors {
    email?: string;
    name?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    agreements?: string;
    [key: string]: string | undefined;
}

/**
 * Signup 페이지 - 회원가입
 * 회원정보 입력 및 약관 동의를 통한 회원가입 기능
 *
 * 주의: 현재 폼 유효성 검사는 임시 검사로, 내부 기획에 따라 재정의 필요
 */
const SignupSkin: React.FC<SkinProps> = ({ 
    data, 
    actions, 
    options, 
    mode, 
    utils,
    app 
}) => {
    const { t, navigate } = utils;
    
    // 데이터 추출
    const formData = data.formData as SignupFormData || {
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        phone: '',
        referral_code: '',
        agreements: {
            all: false,
            age: false,
            terms: false,
            privacy: false,
            marketing: false,
        }
    };
    const validationErrors = data.validationErrors as SignupValidationErrors || {};
    const loading = data.loading || false;
    const signUpSuccess = data.signUpSuccess || false;
    const signUpError = data.signUpError || null;
    
    // 옵션 추출  
    const {
        title = t('회원가입'),
        redirectPath = '/',
        redirectUrl = redirectPath,
        backgroundType = 'none',
        backgroundUrl = '',
        buttonColor,
        titleColor = '#333',
        labelColor = '#333',
        inputTextColor = '#333',
        style = {}
    } = options;
    
    // 액션 사용
    const { handleChange, handleSubmit, handleAgreementChange, handleLoginClick } = actions;
    
    // 상태 변수들
    const email = formData?.email || '';
    const name = formData?.name || '';
    const password = formData?.password || '';
    const confirmPassword = formData?.confirmPassword || '';
    const phoneNumber = formData?.phone || '';
    const referrer = formData?.referral_code || '';
    const agreements = formData?.agreements || {
        all: false,
        age: false,
        terms: false,
        privacy: false,
        marketing: false,
    };

    // 각 필드별 에러 상태
    const errors = {
        email: validationErrors?.email || '',
        name: validationErrors?.name || '',
        password: validationErrors?.password || '',
        confirmPassword: validationErrors?.confirmPassword || '',
        phoneNumber: validationErrors?.phone || '',
        agreements: validationErrors?.agreements || '',
    };

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

    // 약관 동의 핸들러 (actions에서 사용)
    const handleAgreementChangeLocal = (type: keyof typeof agreements) => {
        if (handleAgreementChange) {
            handleAgreementChange(type);
        }
    };

    // 회원가입 성공 시
    if (signUpSuccess) {
        return (
            <div className="signupContainer opacity-0">
                <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl mb-5">{t('회원가입이 완료되었습니다!')}</h2>
                        <p className="text-lg">{t('3초 후 홈페이지로 이동합니다...')}</p>
                    </div>
                </section>
            </div>
        );
    }

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
                    <h2 style={titleColor ? { color: titleColor } : undefined}>{title}</h2>
                </div>
                <form
                    className="flex flex-col items-center pt-5"
                    onSubmit={(e) => {
                        if (handleSubmit) {
                            handleSubmit(e);
                        }
                    }}
                >
                    <div className="w-full space-y-6">
                        <LabelInput
                            label={t("이메일")}
                            htmlFor="email"
                            validateContent={errors.email && <WarningLabel message={errors.email} />}
                        >
                            <TextInput
                                type="email"
                                id="email"
                                name="email"
                                placeholder={t("이메일을 입력해주세요")}
                                value={email}
                                onChange={(e) => {
                                    if (handleChange) {
                                        handleChange(e);
                                    }
                                }}
                            />
                        </LabelInput>
                        <LabelInput
                            label={t("이름")}
                            htmlFor="name"
                            validateContent={errors.name && <WarningLabel message={errors.name} />}
                        >
                            <TextInput
                                type="text"
                                id="name"
                                name="name"
                                placeholder={t("이름을 입력해주세요")}
                                value={name}
                                onChange={(e) => {
                                    if (handleChange) {
                                        handleChange(e);
                                    }
                                }}
                            />
                        </LabelInput>
                        <LabelInput
                            label={t("비밀번호")}
                            htmlFor="password"
                            validateContent={
                                errors.password ? (
                                    <WarningLabel message={errors.password} />
                                ) : (
                                    <ValidateLabel
                                        isValid={isPasswordValid}
                                        message={t("영문 포함 6자 이상")}
                                    />
                                )
                            }
                        >
                            <TextInput
                                type="password"
                                id="password"
                                name="password"
                                placeholder={t("비밀번호를 입력해주세요")}
                                value={password}
                                onChange={(e) => {
                                    if (handleChange) {
                                        handleChange(e);
                                    }
                                }}
                            />
                        </LabelInput>
                        <LabelInput
                            label={t("비밀번호 확인")}
                            htmlFor="confirmPassword"
                            validateContent={
                                errors.confirmPassword ? (
                                    <WarningLabel message={errors.confirmPassword} />
                                ) : (
                                    <ValidateLabel
                                        isValid={isPasswordMatch}
                                        message={t("비밀번호 일치")}
                                    />
                                )
                            }
                        >
                            <TextInput
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder={t("비밀번호를 재입력해주세요")}
                                value={confirmPassword}
                                onChange={(e) => {
                                    if (handleChange) {
                                        handleChange(e);
                                    }
                                }}
                            />
                        </LabelInput>
                        <LabelInput
                            label={t("휴대폰 번호")}
                            htmlFor="phone"
                            validateContent={errors.phoneNumber && <WarningLabel message={errors.phoneNumber} />}
                        >
                            <TextInput
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder={t("휴대폰 번호를 입력해주세요")}
                                value={phoneNumber}
                                onChange={(e) => {
                                    if (handleChange) {
                                        handleChange(e);
                                    }
                                }}
                            />
                        </LabelInput>
                        <LabelInput
                            label={t("추천인")}
                            htmlFor="referral_code"
                            required={false}
                        >
                            <TextInput
                                type="text"
                                id="referral_code"
                                name="referral_code"
                                placeholder={t("추천인의 이메일이나 닉네임을 입력해주세요")}
                                value={referrer}
                                onChange={(e) => {
                                    if (handleChange) {
                                        handleChange(e);
                                    }
                                }}
                            />
                        </LabelInput>
                    </div>
                    <div className="w-full space-y-5 my-10">
                        <CheckLabelBox
                            id="termsAllCheck"
                            label={t("모든 약관에 동의합니다.")}
                            checked={agreements.all}
                            onChange={() => handleAgreementChangeLocal('all')}
                        />
                        <div className="w-full h-[1px] bg-black/10"></div>
                        <CheckLabelBox
                            id="ageCheck"
                            label={t("만 14세 이상입니다.")}
                            description={t("(필수)")}
                            required
                            checked={agreements.age}
                            onChange={() => handleAgreementChangeLocal('age')}
                        />
                        <CheckLabelBox
                            id="termsCheck"
                            label={t("이용약관 동의")}
                            description={t("(필수)")}
                            required
                            checked={agreements.terms}
                            onChange={() => handleAgreementChangeLocal('terms')}
                            modalContents={
                                <div className="pb-10">
                                    <PolicyContents />
                                </div>
                            }
                        />
                        <CheckLabelBox
                            id="privacyCheck"
                            label={t("개인 정보 수집 및 이용 동의")}
                            description={t("(필수)")}
                            required
                            checked={agreements.privacy}
                            onChange={() => handleAgreementChangeLocal('privacy')}
                            modalContents={
                                <div className="pb-10">
                                    <PrivacyContents />
                                </div>
                            }
                        />
                        <CheckLabelBox
                            id="marketingCheck"
                            label={t("이메일 및 SNS 마케팅 정보 수신 동의")}
                            description={t("(선택)")}
                            checked={agreements.marketing}
                            onChange={() => handleAgreementChangeLocal('marketing')}
                        />
                    </div>
                    
                    {/* 회원가입 에러 메시지 */}
                    {signUpError && (
                        <div className="w-full">
                            <WarningLabel message={typeof signUpError === 'string' ? t(signUpError) : JSON.stringify(signUpError)} />
                        </div>
                    )}
                    
                    <div className="w-full bt-5">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                            disabled={!isRequiredAgreementsValid || loading}
                        >
                            {loading ? t('처리 중...') : t('회원가입')}
                        </ColorButton>
                    </div>
                </form>
                <div className="flex items-center justify-center gap-2 w-full text-sm mt-5">
                    <p>{t('이미 아이디가 있으신가요?')}</p>
                    <Link
                        to="/login"
                        className="text-primary hover-primary-80 font-bold"
                        onClick={(e) => {
                            if (handleLoginClick) {
                                e.preventDefault();
                                handleLoginClick();
                            }
                        }}
                    >
                        {t('로그인')}
                    </Link>
                </div>
            </section>
        </div>
    );
};

// 기본 props (개발/테스트용)
const defaultProps: SkinProps = {
    data: {
        formData: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            phone: '',
            referral_code: '',
            agreements: {
                all: false,
                age: false,
                terms: false,
                privacy: false,
                marketing: false,
            }
        },
        validationErrors: {},
        loading: false,
        signUpSuccess: false,
        signUpError: null,
        theme: {
            primary: '#007bff',
            primaryDark: '#0056b3',
            secondary: '#6c757d'
        },
        isUserLoggedIn: false,
        isAdminLoggedIn: false
    },
    actions: {
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log('[SignupSkin] Input changed:', e.target.name, e.target.value);
        },
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log('[SignupSkin] Form submitted');
        },
        handleAgreementChange: (type: string) => {
            console.log('[SignupSkin] Agreement changed:', type);
        },
        handleLoginClick: () => {
            console.log('[SignupSkin] Login clicked');
        }
    },
    options: {
        title: '회원가입',
        redirectPath: '/',
        buttonColor: '#007bff',
        titleColor: '#333',
        labelColor: '#333',
        inputTextColor: '#333'
    },
    mode: 'production',
    utils: {
        t: (key: string) => key,
        navigate: (path: string) => console.log('Navigate to:', path),
        formatCurrency: (amount: number) => `${amount.toLocaleString()}원`,
        formatDate: (date: string | Date) => new Date(date).toLocaleDateString(),
        getAssetUrl: (path: string) => path,
        cx: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')
    }
};

export default function Signup(props?: SkinProps) {
    const mergedProps = props && Object.keys(props).length > 0 ? props : defaultProps;
    return <SignupSkin {...mergedProps} />;
}
