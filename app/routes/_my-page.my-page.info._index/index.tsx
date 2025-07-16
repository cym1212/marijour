import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

import { ArrowIcon } from '@/components/icons';
import { ColorButton } from '@/components/ui';
import { TextInput } from '@/components/ui';

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
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (error) {
            setError('');
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 순차적 유효성 검사
        if (!password.trim()) {
            setError('비밀번호를 입력해주세요.');
            return;
        }

        // 모든 유효성 검사 통과
        setError('');

        // 실제 로그인 로직 추가 (예: API 호출)
        // 로그인 실패 시 setFieldError('email', '이메일 또는 비밀번호가 올바르지 않습니다.');
        navigate('/my-page/info/update'); // 로그인 성공 시 홈으로 이동
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
            <form
                className="pt-4 border-t border-black space-y-8"
                onSubmit={handleSubmit}
            >
                <div className="space-y-2">
                    <p className="text-sm text-black font-bold">비밀번호 확인</p>
                    <p className="text-xs text-black/80">회원정보를 안전하게 보호하기 위해 비밀번호를 한번 더 입력해주세요.</p>
                </div>
                <div className="pb-8 border-b border-black/10 space-y-4">
                    <dl className="flex items-center">
                        <dt className="w-[100px] shrink-0 text-sm text-black/80">이메일</dt>
                        <dd className="text-sm text-black">text@naver.com</dd>
                    </dl>
                    <dl className="flex items-center">
                        <dt className="w-[100px] shrink-0 text-sm text-black/80">비밀번호</dt>
                        <dd className="text-sm text-black">
                            <TextInput
                                type="password"
                                name="password"
                                id="password"
                                placeholder="비밀번호를 입력해주세요"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </dd>
                    </dl>
                </div>
                <ColorButton
                    type="submit"
                    colorType="primary"
                    tailwind="w-full lg:w-auto text-sm py-3 px-10 mx-auto"
                >
                    확인
                </ColorButton>
            </form>
        </div>
    );
}
