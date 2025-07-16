import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState } from 'react';

import { LabelInput, TextInput, WarningLabel } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';

gsap.registerPlugin(useGSAP);

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
            title: '비밀번호 찾기 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '비밀번호 찾기 페이지입니다. 이메일을 입력하여 비밀번호를 재설정하세요.',
        },
        {
            name: 'keywords',
            content: '비밀번호 찾기, 이메일, 인증',
        },
    ];
}

// 현재 폼 유효성 검사는 약식입니다. 내부 기획에 맞게 수정이 필요합니다.
export default function FindPassword() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');

    // 각 필드별 에러 상태
    const [errors, setErrors] = useState({
        email: '',
        name: '',
    });

    // 이메일 유효성 검사
    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // 버튼 활성화 조건
    const isFormValid = email.trim() !== '' && name.trim() !== '';

    // 에러 초기화 함수
    const clearErrors = () => {
        setErrors({
            email: '',
            name: '',
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
        if (!name.trim()) {
            setFieldError('name', '이름을 입력해주세요.');
            return;
        }
        if (!email.trim()) {
            setFieldError('email', '이메일을 입력해주세요.');
            return;
        }
        if (!isEmailValid(email)) {
            setFieldError('email', '올바른 이메일 형식을 입력해주세요.');
            return;
        }

        // 모든 유효성 검사 통과
        clearErrors();
        alert('비밀번호 재설정 코드가 발송되었습니다! 이메일: ' + email + ', 이름: ' + name);
    };

    useGSAP(() => {
        gsap.to('.findPasswordContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="findPasswordContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2>비밀번호 찾기</h2>
                </div>
                <form
                    className="flex flex-col items-center pt-5"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full space-y-6">
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
                            label="이메일"
                            htmlFor="email"
                            validateContent={errors.email && <WarningLabel message={errors.email} />}
                        >
                            <TextInput
                                type="email"
                                id="email"
                                placeholder="가입 시 사용한 이메일을 입력해주세요"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        </LabelInput>
                    </div>
                    <div className="w-full mt-10">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                            disabled={!isFormValid}
                            to="/find-password/reset"
                        >
                            재설정 코드 받기
                        </ColorButton>
                    </div>
                </form>
            </section>
        </div>
    );
}
