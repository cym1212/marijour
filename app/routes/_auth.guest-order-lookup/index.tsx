import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useState } from 'react';

import { TextInput, WarningLabel } from '@/components/ui/input';
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
            title: '비회원 주문 조회 - 쇼핑몰',
        },
        {
            name: 'description',
            content: '비회원 주문 조회 페이지입니다. 주문 정보를 입력하여 조회하세요.',
        },
        {
            name: 'keywords',
            content: '비회원, 주문, 조회',
        },
    ];
}

export default function GuestOrderLookup() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [orderNumber, setOrderNumber] = useState<string>('');

    // 각 필드별 에러 상태
    const [errors, setErrors] = useState({
        email: '',
        name: '',
        orderNumber: '',
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
            name: '',
            orderNumber: '',
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
        if (!orderNumber.trim()) {
            setFieldError('orderNumber', '주문번호를 입력해주세요.');
            return;
        }

        // 모든 유효성 검사 통과
        clearErrors();
        alert('주문 조회를 진행합니다. 이름: ' + name + ', 이메일: ' + email + ', 주문번호: ' + orderNumber);
        // 실제 주문 조회 로직 추가 (예: API 호출)
    };

    useGSAP(() => {
        gsap.to('.guestOrderContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="guestOrderContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2>비회원 주문 조회</h2>
                </div>
                <form
                    className="flex flex-col items-center gap-6 pt-5"
                    onSubmit={handleSubmit}
                >
                    <div className="w-full space-y-2">
                        <TextInput
                            type="text"
                            id="name"
                            placeholder="이름"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                        <TextInput
                            type="email"
                            id="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        />
                        <TextInput
                            type="text"
                            id="orderNumber"
                            placeholder="주문번호"
                            value={orderNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrderNumber(e.target.value)}
                        />
                        {(errors.name || errors.email || errors.orderNumber) && <WarningLabel message={errors.name || errors.email || errors.orderNumber} />}
                    </div>
                    <div className="w-full space-y-2">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                            to={`/my-page/orders/detail/${orderNumber}`}
                        >
                            주문 조회
                        </ColorButton>
                    </div>
                </form>
            </section>
        </div>
    );
}
