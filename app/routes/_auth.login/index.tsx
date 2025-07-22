import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

import { TextInput, WarningLabel } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';

gsap.registerPlugin(useGSAP);

interface LoginFormData {
    user_id: string;
    password: string;
}

interface LoginValidationErrors {
    user_id?: string;
    password?: string;
    [key: string]: string | undefined;
}

export function meta() {
    return [
        {
            title: '로그인 - Marijour',
        },
        {
            name: 'description',
            content: '마리쥬르에 로그인하여 더 많은 혜택을 누려보세요. 이메일과 비밀번호를 입력해주세요.',
        },
        {
            name: 'keywords',
            content: '로그인, 이메일, 비밀번호, 인증, 마리쥬르, 회원',
        },
    ];
}

/**
 * Login 페이지 - 로그인
 * 이메일과 비밀번호를 통한 로그인 기능
 *
 * 주의: 현재 폼 유효성 검사는 임시 검사로, 내부 기획에 따라 재정의 필요
 */

const LoginSkin: React.FC<SkinProps> = ({ 
    data, 
    actions, 
    options, 
    mode, 
    utils,
    app 
}) => {
    const { t, navigate } = utils;
    
    // 데이터 추출
    const formData = data.formData as LoginFormData || { user_id: '', password: '' };
    const validationErrors = data.validationErrors as LoginValidationErrors || {};
    const loading = data.loading || false;
    const loginSuccess = data.loginSuccess || false;
    const loginError = data.loginError || null;
    
    // 옵션 추출
    const {
        title = t('로그인'),
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
    const { handleChange, handleSubmit, handleSignupClick } = actions;

    useGSAP(() => {
        gsap.to('.loginContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    // 로그인 성공 시
    if (loginSuccess) {
        return (
            <div className="loginContainer opacity-0">
                <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                    <div className="text-center">
                        <p className="text-lg">{t('로그인 성공! 환영합니다.')}</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="loginContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2 style={titleColor ? { color: titleColor } : undefined}>{title}</h2>
                </div>
                <form
                    className="flex flex-col items-center gap-6 pt-5"
                    onSubmit={(e) => {
                        if (handleSubmit) {
                            handleSubmit(e);
                        }
                    }}
                >
                    <div className="w-full space-y-2">
                        <TextInput
                            type="text"
                            id="user_id"
                            name="user_id"
                            placeholder={t("이메일을 입력하세요")}
                            value={formData?.user_id || ''}
                            onChange={(e) => {
                                if (handleChange) {
                                    handleChange(e);
                                }
                            }}
                        />
                        {validationErrors?.user_id && <WarningLabel message={validationErrors.user_id} />}
                        <TextInput
                            type="password"
                            id="password"
                            name="password"
                            placeholder={t("비밀번호를 입력하세요")}
                            value={formData?.password || ''}
                            onChange={(e) => {
                                if (handleChange) {
                                    handleChange(e);
                                }
                            }}
                        />
                        {validationErrors?.password && <WarningLabel message={validationErrors.password} />}
                    </div>
                    
                    {/* 로그인 에러 메시지 */}
                    {loginError && (
                        <div className="w-full">
                            <WarningLabel message={typeof loginError === 'string' ? t(loginError) : JSON.stringify(loginError)} />
                        </div>
                    )}
                    <div className="w-full space-y-2">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                            disabled={loading}
                        >
                            {loading ? t('로그인 중...') : t('로그인')}
                        </ColorButton>
                        <ColorButton
                            type="button"
                            colorType="white"
                            tailwind="w-full px-4.5 py-3.5"
                            to="/signup"
                            onClick={(e) => {
                                if (handleSignupClick) {
                                    e.preventDefault();
                                    handleSignupClick();
                                }
                            }}
                        >
                            {t('회원가입')}
                        </ColorButton>
                    </div>
                    <div className="flex items-center justify-center gap-1 w-full text-primary">
                        <Link
                            to="/find-password"
                            className="hover-primary-80"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/find-password');
                            }}
                        >
                            {t('비밀번호 찾기')}
                        </Link>
                        <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                        <Link
                            to="/guest-order-lookup"
                            className="hover-primary-80"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/guest-order-lookup');
                            }}
                        >
                            {t('비회원 주문 조회')}
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
};

// 기본 props (개발/테스트용)
const defaultProps: SkinProps = {
    data: {
        formData: {
            user_id: '',
            password: ''
        },
        validationErrors: {},
        loading: false,
        loginSuccess: false,
        loginError: null,
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
            console.log('[LoginSkin] Input changed:', e.target.name, e.target.value);
        },
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log('[LoginSkin] Form submitted');
        },
        handleSignupClick: () => {
            console.log('[LoginSkin] Signup clicked');
        }
    },
    options: {
        title: '로그인',
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

export default function Login(props?: SkinProps) {
    const mergedProps = props && Object.keys(props).length > 0 ? props : defaultProps;
    return <LoginSkin {...mergedProps} />;
}
