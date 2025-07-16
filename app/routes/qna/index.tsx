import { Link } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useState } from 'react';

import { LabelInput, TextInput, SelectBox, TextArea, WarningLabel, CheckLabelBox } from '@/components/ui/input';
import { ColorButton } from '@/components/ui/button';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

export function meta() {
    return [
        {
            title: '문의하기 - Marijour',
        },
        {
            name: 'description',
            content: '궁금한 사항이나 문의사항을 남겨주세요. 빠른 시간 내에 답변드리겠습니다.',
        },
        {
            name: 'keywords',
            content: '문의, 질문, 고객센터, 상담, 마리쥬르',
        },
    ];
}

/**
 * QnA 페이지 - 고객 문의 페이지
 * 문의 폼 및 유효성 검사 기능 포함
 *
 * 주의: 현재 폼 유효성 검사는 임시 검사로, 내부 기획에 따라 재정의 필요
 */
export default function QnA() {
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [content, setContent] = useState<string>('');

    // 각 필드별 에러 상태
    const [errors, setErrors] = useState({
        email: '',
        name: '',
        phoneNumber: '',
        category: '',
        content: '',
    });

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

    // 에러 초기화 함수
    const clearErrors = () => {
        setErrors({
            email: '',
            name: '',
            phoneNumber: '',
            category: '',
            content: '',
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
        if (!phoneNumber) {
            setFieldError('phoneNumber', '휴대폰 번호를 입력해주세요.');
            return;
        }
        if (!isPhoneValid(phoneNumber)) {
            setFieldError('phoneNumber', '올바른 휴대폰 번호 형식을 입력해주세요.');
            return;
        }
        if (!category) {
            setFieldError('category', '문의 유형을 선택해주세요.');
            return;
        }
        if (!content.trim()) {
            setFieldError('content', '문의 내용을 입력해주세요.');
            return;
        }
        if (content.trim().length < 10) {
            setFieldError('content', '문의 내용을 10자 이상 입력해주세요.');
            return;
        }

        // 모든 유효성 검사 통과
        clearErrors();
        alert('문의가 접수되었습니다! 이메일: ' + email + ', 이름: ' + name + ', 휴대폰 번호: ' + phoneNumber + ', 문의 유형: ' + category + ', 문의 내용: ' + content.substring(0, 50) + (content.length > 50 ? '...' : ''));
    };

    useGSAP(() => {
        gsap.to('.qnaContainer', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
        });
    });

    return (
        <div className="qnaContainer opacity-0">
            <section className="globalWrapper w-full py-8 md:py-13 max-w-[480px]">
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2>문의하기</h2>
                </div>
                <div className="flex items-center justify-between p-4 bg-primary/10 mt-10">
                    <p className="text-xs">회원이라면 로그인 후 문의를 작성해주세요</p>
                    <Link
                        to="/login"
                        className="text-xs text-primary hover-primary-80 font-bold"
                    >
                        로그인
                    </Link>
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
                                placeholder="이메일을 입력해주세요"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                            label="문의 유형"
                            htmlFor="category"
                            validateContent={errors.category && <WarningLabel message={errors.category} />}
                        >
                            <SelectBox
                                name="category"
                                id="category"
                                value={category}
                                placeholder="문의 유형을 선택해주세요"
                                options={[
                                    { value: 'general', label: '일반 문의' },
                                    { value: 'order', label: '주문 관련' },
                                    { value: 'product', label: '상품 관련' },
                                    { value: 'other', label: '기타' },
                                ]}
                                required
                                onChange={(value: string) => setCategory(value)}
                            />
                        </LabelInput>
                        <LabelInput
                            label="문의 내용"
                            htmlFor="content"
                            validateContent={errors.content && <WarningLabel message={errors.content} />}
                        >
                            <TextArea
                                name="content"
                                id="content"
                                placeholder="문의하실 내용을 자세히 입력해주세요 (최소 10자 이상)"
                                value={content}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                                rows={6}
                                maxLength={2000}
                                showCharCount={true}
                            />
                        </LabelInput>
                    </div>
                    <div className="w-full mt-10">
                        <ColorButton
                            type="submit"
                            colorType="primary"
                            tailwind="w-full px-4.5 py-3.5"
                        >
                            문의하기
                        </ColorButton>
                    </div>
                </form>
            </section>
        </div>
    );
}
