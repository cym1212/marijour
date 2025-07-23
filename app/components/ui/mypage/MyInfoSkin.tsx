import React from 'react';

// 스타일 import
import './my-info-skin-scoped.css';

// Mock 데이터 (번들에 포함)
const MY_INFO_DATA = {
    user: {
        email: 'text@naver.com',
        password: '*********',
        name: '홍길동',
        phone: '010-1234-5678',
        joinDate: '2025-01-01',
        grade: '일반'
    },
    navigation: [
        { id: 1, name: '주문 배송 조회', href: '/my-page/orders', active: false },
        { id: 2, name: '문의 내역', href: '/my-page/qna', active: false },
        { id: 3, name: '회원정보 수정', href: '/my-page/info', active: true }
    ]
};

/**
 * MyInfoSkin 컴포넌트 - 회원정보 수정 UMD 버전
 *
 * 기능:
 * - 사이드 네비게이션 (데스크톱만)
 * - 로그인 정보 섹션
 * - 회원 정보 섹션
 * - 수신 설정 섹션
 * - 결제 정보 섹션
 * - 완전히 독립적인 컴포넌트 (props 없음)
 */
export function MyInfo() {
    const [formData, setFormData] = React.useState(MY_INFO_DATA.user);
    const [agreements, setAgreements] = React.useState({
        all: false,
        email: false,
        sms: false,
        messenger: false
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAgreementChange = (field: string, checked: boolean) => {
        if (field === 'all') {
            setAgreements({
                all: checked,
                email: checked,
                sms: checked,
                messenger: checked
            });
        } else {
            const newAgreements = { ...agreements, [field]: checked };
            const allChecked = newAgreements.email && newAgreements.sms && newAgreements.messenger;
            setAgreements({ ...newAgreements, all: allChecked });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 폼 제출 로직 (UI만)
        console.log('Form submitted:', formData, agreements);
    };

    return (
        <div className="mi-skin-globalWrapper mi-skin-flex mi-skin-items-start mi-skin-justify-between mi-skin-gap-15 mi-skin-w-full mi-skin-pt-8 mi-skin-md-py-10 mi-skin-mb-5 mi-skin-md-mb-10">
            {/* 사이드 네비게이션 */}
            <section className="mi-skin-w-full mi-skin-lg-w-auto mi-skin-flex mi-skin-flex-col mi-skin-gap-10 mi-skin-items-start mi-skin-lg-flex mi-skin-hidden">
                <div className="mi-skin-flex mi-skin-items-center mi-skin-gap-3 mi-skin-font-serif mi-skin-text-3xl">
                    <h2>마이페이지</h2>
                </div>
                <nav className="mi-skin-w-full">
                    <ul className="mi-skin-flex mi-skin-flex-col mi-skin-gap-1">
                        {MY_INFO_DATA.navigation.map((item) => (
                            <li key={item.id} className={`mi-skin-py-2 ${
                                item.active 
                                    ? 'mi-skin-lg-text-primary mi-skin-lg-font-bold' 
                                    : 'mi-skin-text-black mi-skin-lg-text-black-60 mi-skin-hover-black-80'
                            }`}>
                                <a className="mi-skin-w-full mi-skin-flex mi-skin-items-center mi-skin-justify-between" href={item.href} data-discover="true">
                                    <span>{item.name}</span>
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mi-skin-hover-primary mi-skin-w-4 mi-skin-h-4 mi-skin-block mi-skin-lg-hidden" style={{ transform: 'rotate(90deg)' }}>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
                                    </svg>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

            {/* 메인 컨텐츠 */}
            <section className="mi-skin-flex-1 mi-skin-block mi-skin-lg-block">
                <div className="mi-skin-myInfoContainer" style={{ opacity: 1 }}>
                    {/* 헤더 */}
                    <div className="mi-skin-flex mi-skin-items-center mi-skin-gap-3 mi-skin-pt-1 mi-skin-pb-5">
                        <h3 className="mi-skin-font-serif mi-skin-text-2xl mi-skin-leading-heading mi-skin-flex mi-skin-items-center mi-skin-gap-2">
                            <a className="mi-skin-p-1 mi-skin-lg-hidden" href="/my-page/orders" data-discover="true">
                                <svg width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="mi-skin-hover-primary" style={{ transform: 'rotate(-90deg)' }}>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z" fill="currentColor"></path>
                                </svg>
                            </a>
                            <span>회원정보 수정</span>
                        </h3>
                    </div>

                    {/* 폼 */}
                    <form onSubmit={handleSubmit}>
                        {/* 로그인 정보 */}
                        <div className="mi-skin-pt-3 mi-skin-border-t mi-skin-border-black">
                            <div>
                                <h4 className="mi-skin-font-bold">로그인 정보</h4>
                            </div>
                            <div className="mi-skin-w-full mi-skin-space-y-6 mi-skin-mt-6 mi-skin-mb-9">
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-center mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-full mi-skin-md-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">이메일</dt>
                                    <dd className="mi-skin-w-full mi-skin-text-sm mi-skin-text-black">
                                        <input 
                                            id="email" 
                                            aria-labelledby="email" 
                                            className="mi-skin-w-full mi-skin-px-4-5 mi-skin-py-3-5 mi-skin-border mi-skin-border-black-20 mi-skin-text-sm mi-skin-disabled-border-black-10 mi-skin-disabled-bg-black-3 mi-skin-disabled-text-black-60" 
                                            disabled 
                                            type="email" 
                                            value={formData.email} 
                                            name="email" 
                                            readOnly
                                        />
                                    </dd>
                                </dl>
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-center mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-full mi-skin-md-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">비밀번호</dt>
                                    <dd className="mi-skin-flex mi-skin-gap-2 mi-skin-w-full mi-skin-text-sm mi-skin-text-black">
                                        <input 
                                            id="password" 
                                            aria-labelledby="password" 
                                            className="mi-skin-w-full mi-skin-px-4-5 mi-skin-py-3-5 mi-skin-border mi-skin-border-black-20 mi-skin-text-sm mi-skin-disabled-border-black-10 mi-skin-disabled-bg-black-3 mi-skin-disabled-text-black-60" 
                                            disabled 
                                            type="password" 
                                            value={formData.password} 
                                            name="password" 
                                            readOnly
                                        />
                                        <button type="button" className="mi-skin-flex mi-skin-items-center mi-skin-justify-center mi-skin-border mi-skin-hover-bg-primary-90 mi-skin-transition-colors mi-skin-bg-white mi-skin-text-black-80 mi-skin-border-black-20 mi-skin-hover-bg-primary-10 mi-skin-w-100 mi-skin-py-2 mi-skin-text-sm">
                                            변경
                                        </button>
                                    </dd>
                                </dl>
                            </div>
                        </div>

                        {/* 회원 정보 */}
                        <div className="mi-skin-pt-3 mi-skin-border-t mi-skin-border-black">
                            <div>
                                <h4 className="mi-skin-font-bold">회원 정보</h4>
                            </div>
                            <div className="mi-skin-w-full mi-skin-space-y-6 mi-skin-mt-6 mi-skin-mb-9">
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-center mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-full mi-skin-md-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">이름</dt>
                                    <dd className="mi-skin-w-full mi-skin-text-sm mi-skin-text-black">
                                        <input 
                                            id="name" 
                                            aria-labelledby="name" 
                                            className="mi-skin-w-full mi-skin-px-4-5 mi-skin-py-3-5 mi-skin-border mi-skin-border-black-20 mi-skin-text-sm" 
                                            type="text" 
                                            value={formData.name} 
                                            name="name"
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </dd>
                                </dl>
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-center mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-full mi-skin-md-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">휴대폰 번호</dt>
                                    <dd className="mi-skin-w-full mi-skin-text-sm mi-skin-text-black">
                                        <input 
                                            id="phone" 
                                            aria-labelledby="phone" 
                                            className="mi-skin-w-full mi-skin-px-4-5 mi-skin-py-3-5 mi-skin-border mi-skin-border-black-20 mi-skin-text-sm" 
                                            type="text" 
                                            value={formData.phone} 
                                            name="phone"
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </dd>
                                </dl>
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-center mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">가입일자</dt>
                                    <dd className="mi-skin-text-sm mi-skin-text-black">{formData.joinDate}</dd>
                                </dl>
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-center mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">등급</dt>
                                    <dd className="mi-skin-text-sm mi-skin-text-black">{formData.grade}</dd>
                                </dl>
                            </div>
                        </div>

                        {/* 수신 설정 */}
                        <div className="mi-skin-pt-3 mi-skin-border-t mi-skin-border-black">
                            <div>
                                <h4 className="mi-skin-font-bold">수신 설정</h4>
                            </div>
                            <div className="mi-skin-w-full mi-skin-space-y-6 mi-skin-mt-6 mi-skin-mb-9">
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-start mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-full mi-skin-md-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">마케팅 수신 동의</dt>
                                    <dd className="mi-skin-w-full mi-skin-text-sm mi-skin-text-black">
                                        <div className="mi-skin-flex mi-skin-items-center mi-skin-justify-between mi-skin-w-full mi-skin-gap-x-2">
                                            <label className="mi-skin-flex mi-skin-items-center mi-skin-cursor-pointer">
                                                <input 
                                                    id="termsAllCheck" 
                                                    className="mi-skin-peer mi-skin-sr-only" 
                                                    type="checkbox" 
                                                    checked={agreements.all}
                                                    onChange={(e) => handleAgreementChange('all', e.target.checked)}
                                                />
                                                <span className={`mi-skin-flex mi-skin-items-center mi-skin-justify-center mi-skin-w-20 mi-skin-h-20 mi-skin-border mi-skin-border-black-20 mi-skin-text-black-20 mi-skin-hover-border-primary mi-skin-transition-colors mi-skin-duration-300 ${agreements.all ? 'mi-skin-bg-primary mi-skin-text-white' : ''}`}>
                                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mi-skin-hover-primary mi-skin-w-18 mi-skin-h-18">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                                    </svg>
                                                </span>
                                                <span className="mi-skin-text-sm mi-skin-ml-2">모든 약관에 동의합니다.</span>
                                            </label>
                                        </div>
                                        <div className="mi-skin-w-full mi-skin-h-1 mi-skin-bg-black-10 mi-skin-my-3"></div>
                                        <div className="mi-skin-flex mi-skin-items-center mi-skin-gap-4 mi-skin-mb-3">
                                            <div className="mi-skin-flex mi-skin-items-center mi-skin-justify-between mi-skin-w-full mi-skin-gap-x-2">
                                                <label className="mi-skin-flex mi-skin-items-center mi-skin-cursor-pointer">
                                                    <input 
                                                        id="emailCheck" 
                                                        className="mi-skin-peer mi-skin-sr-only" 
                                                        type="checkbox" 
                                                        checked={agreements.email}
                                                        onChange={(e) => handleAgreementChange('email', e.target.checked)}
                                                    />
                                                    <span className={`mi-skin-flex mi-skin-items-center mi-skin-justify-center mi-skin-w-20 mi-skin-h-20 mi-skin-border mi-skin-border-black-20 mi-skin-text-black-20 mi-skin-hover-border-primary mi-skin-transition-colors mi-skin-duration-300 ${agreements.email ? 'mi-skin-bg-primary mi-skin-text-white' : ''}`}>
                                                        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mi-skin-hover-primary mi-skin-w-18 mi-skin-h-18">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                                        </svg>
                                                    </span>
                                                    <span className="mi-skin-text-sm mi-skin-ml-2">이메일</span>
                                                </label>
                                            </div>
                                            <div className="mi-skin-flex mi-skin-items-center mi-skin-justify-between mi-skin-w-full mi-skin-gap-x-2">
                                                <label className="mi-skin-flex mi-skin-items-center mi-skin-cursor-pointer">
                                                    <input 
                                                        id="smsCheck" 
                                                        className="mi-skin-peer mi-skin-sr-only" 
                                                        type="checkbox" 
                                                        checked={agreements.sms}
                                                        onChange={(e) => handleAgreementChange('sms', e.target.checked)}
                                                    />
                                                    <span className={`mi-skin-flex mi-skin-items-center mi-skin-justify-center mi-skin-w-20 mi-skin-h-20 mi-skin-border mi-skin-border-black-20 mi-skin-text-black-20 mi-skin-hover-border-primary mi-skin-transition-colors mi-skin-duration-300 ${agreements.sms ? 'mi-skin-bg-primary mi-skin-text-white' : ''}`}>
                                                        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mi-skin-hover-primary mi-skin-w-18 mi-skin-h-18">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                                        </svg>
                                                    </span>
                                                    <span className="mi-skin-text-sm mi-skin-ml-2">문자</span>
                                                </label>
                                            </div>
                                            <div className="mi-skin-flex mi-skin-items-center mi-skin-justify-between mi-skin-w-full mi-skin-gap-x-2">
                                                <label className="mi-skin-flex mi-skin-items-center mi-skin-cursor-pointer">
                                                    <input 
                                                        id="onlineMessengerCheck" 
                                                        className="mi-skin-peer mi-skin-sr-only" 
                                                        type="checkbox" 
                                                        checked={agreements.messenger}
                                                        onChange={(e) => handleAgreementChange('messenger', e.target.checked)}
                                                    />
                                                    <span className={`mi-skin-flex mi-skin-items-center mi-skin-justify-center mi-skin-w-20 mi-skin-h-20 mi-skin-border mi-skin-border-black-20 mi-skin-text-black-20 mi-skin-hover-border-primary mi-skin-transition-colors mi-skin-duration-300 ${agreements.messenger ? 'mi-skin-bg-primary mi-skin-text-white' : ''}`}>
                                                        <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mi-skin-hover-primary mi-skin-w-18 mi-skin-h-18">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                                        </svg>
                                                    </span>
                                                    <span className="mi-skin-text-sm mi-skin-ml-2">온라인 메신저</span>
                                                </label>
                                            </div>
                                        </div>
                                        <p className="mi-skin-text-sm mi-skin-text-black-80">주문/배송 및 안내사항 알림은 위 수신 여부와 관계없이 발송됩니다.</p>
                                    </dd>
                                </dl>
                            </div>
                        </div>

                        {/* 결제 정보 */}
                        <div className="mi-skin-pt-3 mi-skin-border-t mi-skin-border-black">
                            <div>
                                <h4 className="mi-skin-font-bold">결제 정보</h4>
                            </div>
                            <div className="mi-skin-w-full mi-skin-space-y-6 mi-skin-mt-6 mi-skin-mb-9">
                                <dl className="mi-skin-flex mi-skin-items-start mi-skin-md-items-center mi-skin-flex-col mi-skin-md-flex-row mi-skin-gap-2">
                                    <dt className="mi-skin-w-full mi-skin-md-w-120 mi-skin-shrink-0 mi-skin-text-sm mi-skin-text-black-80">환불 계좌</dt>
                                    <dd className="mi-skin-w-full mi-skin-text-sm mi-skin-text-black">
                                        <button type="button" className="mi-skin-flex mi-skin-items-center mi-skin-justify-center mi-skin-border mi-skin-hover-bg-primary-90 mi-skin-transition-colors mi-skin-bg-white mi-skin-text-black-80 mi-skin-border-black-20 mi-skin-hover-bg-primary-10 mi-skin-w-full mi-skin-py-3 mi-skin-text-sm">
                                            계좌 등록
                                        </button>
                                    </dd>
                                </dl>
                            </div>
                        </div>

                        {/* 회원 탈퇴 */}
                        <div className="mi-skin-pt-3">
                            <button type="button" aria-label="회원 탈퇴" className="mi-skin-text-sm mi-skin-text-black-40 mi-skin-underline mi-skin-hover-black">
                                회원 탈퇴
                            </button>
                        </div>

                        {/* 제출 버튼 */}
                        <div className="mi-skin-mt-10">
                            <button type="submit" className="mi-skin-flex mi-skin-items-center mi-skin-justify-center mi-skin-border mi-skin-hover-bg-primary-90 mi-skin-transition-colors mi-skin-bg-primary mi-skin-text-white mi-skin-border-primary mi-skin-hover-bg-primary-80 mi-skin-w-full mi-skin-lg-w-auto mi-skin-text-sm mi-skin-py-3 mi-skin-px-10 mi-skin-mx-auto">
                                변경하기
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(MyInfo as any).SAMPLE_DATA = MY_INFO_DATA;

export default MyInfo;