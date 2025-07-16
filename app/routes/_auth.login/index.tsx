import { Link, useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState } from 'react';

import { TextInput, WarningLabel } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';

gsap.registerPlugin(useGSAP);

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

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // 각 필드별 에러 상태
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    // 이메일 유효성 검사
    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 에러 초기화 함수
    const clearErrors = () => {
        setErrors({
            email: '',
            password: '',
        });
    };

    // 개별 에러 설정 함수 (GSAP ScrollTo로 스크롤 이동)
    const setFieldError = (field: keyof typeof errors, message: string) => {
        clearErrors();
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 순차적 유효성 검사
        if (!email.trim()) {
            setFieldError('email', '이메일을 입력해주세요.');
            return;
        }
        if (!isEmailValid(email)) {
            setFieldError('email', '올바른 이메일 형식을 입력해주세요.');
            return;
        }
        if (!password.trim()) {
            setFieldError('password', '비밀번호를 입력해주세요.');
            return;
        }

        // 모든 유효성 검사 통과
        clearErrors();

        // 실제 로그인 로직 추가 (예: API 호출)
        // 로그인 실패 시 setFieldError('email', '이메일 또는 비밀번호가 올바르지 않습니다.');
        navigate('/'); // 로그인 성공 시 홈으로 이동
    };

    useGSAP(() => {
        gsap.to('.loginContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="loginContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2>로그인</h2>
                </div>
                <form
                    className="flex flex-col items-center gap-6 pt-5"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full space-y-2">
                        <TextInput
                            type="email"
                            id="email"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <WarningLabel message={errors.email} />}
                        <TextInput
                            type="password"
                            id="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <WarningLabel message={errors.password} />}
                    </div>
                    <div className="w-full space-y-2">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                        >
                            로그인
                        </ColorButton>
                        <ColorButton
                            type="button"
                            colorType="white"
                            tailwind="w-full px-4.5 py-3.5"
                            to="/signup"
                        >
                            회원가입
                        </ColorButton>
                    </div>
                    <div className="flex items-center justify-center gap-1 w-full text-primary">
                        <Link
                            to="/find-password"
                            className="hover-primary-80 "
                        >
                            비밀번호 찾기
                        </Link>
                        <span className="w-[1px] h-[0.875rem] mx-1 bg-black/20"></span>
                        <Link
                            to="/guest-order-lookup"
                            className="hover-primary-80"
                        >
                            비회원 주문 조회
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
}
