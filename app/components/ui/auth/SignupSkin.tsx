import React from 'react';

// 스타일 import
import './signup-skin-scoped.css';

// Mock 데이터 (번들에 포함)
const SIGNUP_DATA = {
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
    labels: {
        title: '회원가입',
        email: '이메일',
        name: '이름',
        password: '비밀번호',
        confirmPassword: '비밀번호 확인',
        phone: '휴대폰 번호',
        referral: '추천인',
        submitButton: '회원가입',
        loginLink: '로그인',
        loginText: '이미 아이디가 있으신가요?',
        allAgree: '모든 약관에 동의합니다.',
        ageAgree: '만 14세 이상입니다.',
        termsAgree: '이용약관 동의',
        privacyAgree: '개인 정보 수집 및 이용 동의',
        marketingAgree: '이메일 및 SNS 마케팅 정보 수신 동의',
        required: '(필수)',
        optional: '(선택)',
        passwordRule: '영문 포함 6자 이상',
        passwordMatch: '비밀번호 일치'
    },
    placeholders: {
        email: '이메일을 입력해주세요',
        name: '이름을 입력해주세요',
        password: '비밀번호를 입력해주세요',
        confirmPassword: '비밀번호를 재입력해주세요',
        phone: '휴대폰 번호를 입력해주세요',
        referral: '추천인의 이메일이나 닉네임을 입력해주세요'
    }
};

/**
 * SignupSkin 컴포넌트 - 회원가입 UMD 버전
 *
 * 기능:
 * - 회원가입 폼 (이메일, 이름, 비밀번호, 휴대폰, 추천인)
 * - 실시간 유효성 검사
 * - 약관 동의 체크박스
 * - 완전히 독립적인 컴포넌트 (props 없음)
 */
export function Signup() {
    const [formData, setFormData] = React.useState(SIGNUP_DATA.formData);
    const [errors, setErrors] = React.useState<{[key: string]: string}>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // 실시간 유효성 검사
        validateField(field, value);
    };

    const handleAgreementChange = (field: string, checked: boolean) => {
        if (field === 'all') {
            setFormData(prev => ({
                ...prev,
                agreements: {
                    all: checked,
                    age: checked,
                    terms: checked,
                    privacy: checked,
                    marketing: checked
                }
            }));
        } else {
            const newAgreements = { ...formData.agreements, [field]: checked };
            const allChecked = newAgreements.age && newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
            setFormData(prev => ({
                ...prev,
                agreements: { ...newAgreements, all: allChecked }
            }));
        }
    };

    const validateField = (field: string, value: string) => {
        const newErrors = { ...errors };

        switch (field) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                newErrors.email = value && !emailRegex.test(value) ? '올바른 이메일 형식을 입력해주세요' : '';
                break;
            case 'name':
                newErrors.name = value.length < 2 ? '이름을 2자 이상 입력해주세요' : '';
                break;
            case 'password':
                const passwordValid = value.length >= 6 && /[a-zA-Z]/.test(value);
                newErrors.password = value && !passwordValid ? '영문 포함 6자 이상 입력해주세요' : '';
                break;
            case 'confirmPassword':
                newErrors.confirmPassword = value && value !== formData.password ? '비밀번호가 일치하지 않습니다' : '';
                break;
            case 'phone':
                const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
                newErrors.phone = value && !phoneRegex.test(value) ? '올바른 휴대폰 번호를 입력해주세요' : '';
                break;
        }

        setErrors(newErrors);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 폼 제출 로직 (UI만)
        console.log('Form submitted:', formData);
    };

    const isPasswordValid = formData.password.length >= 6 && /[a-zA-Z]/.test(formData.password);
    const isPasswordMatch = formData.password !== '' && formData.password === formData.confirmPassword;
    const isRequiredAgreementsValid = formData.agreements.age && formData.agreements.terms && formData.agreements.privacy;

    return (
        <div className="su-skin-signupContainer">
            <section className="su-skin-globalWrapper su-skin-w-full su-skin-py-8 su-skin-md-py-13 su-skin-max-w-480">
                <div className="su-skin-font-serif su-skin-text-3xl su-skin-mb-5 su-skin-text-center">
                    <h2>{SIGNUP_DATA.labels.title}</h2>
                </div>
                <form className="su-skin-flex su-skin-flex-col su-skin-items-center su-skin-pt-5" onSubmit={handleSubmit}>
                    <div className="su-skin-w-full su-skin-space-y-6">
                        {/* 이메일 */}
                        <div className="su-skin-w-full">
                            <label htmlFor="email" className="su-skin-block su-skin-text-sm su-skin-font-bold su-skin-mb-2">
                                {SIGNUP_DATA.labels.email}
                                <span className="su-skin-text-error su-skin-ml-1">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder={SIGNUP_DATA.placeholders.email}
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="su-skin-w-full su-skin-px-4-5 su-skin-py-3-5 su-skin-border su-skin-border-black-20 su-skin-text-sm"
                            />
                            {errors.email && <p className="su-skin-text-error su-skin-text-xs su-skin-mt-1">{errors.email}</p>}
                        </div>

                        {/* 이름 */}
                        <div className="su-skin-w-full">
                            <label htmlFor="name" className="su-skin-block su-skin-text-sm su-skin-font-bold su-skin-mb-2">
                                {SIGNUP_DATA.labels.name}
                                <span className="su-skin-text-error su-skin-ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder={SIGNUP_DATA.placeholders.name}
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="su-skin-w-full su-skin-px-4-5 su-skin-py-3-5 su-skin-border su-skin-border-black-20 su-skin-text-sm"
                            />
                            {errors.name && <p className="su-skin-text-error su-skin-text-xs su-skin-mt-1">{errors.name}</p>}
                        </div>

                        {/* 비밀번호 */}
                        <div className="su-skin-w-full">
                            <label htmlFor="password" className="su-skin-block su-skin-text-sm su-skin-font-bold su-skin-mb-2">
                                {SIGNUP_DATA.labels.password}
                                <span className="su-skin-text-error su-skin-ml-1">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder={SIGNUP_DATA.placeholders.password}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="su-skin-w-full su-skin-px-4-5 su-skin-py-3-5 su-skin-border su-skin-border-black-20 su-skin-text-sm"
                            />
                            {errors.password ? (
                                <p className="su-skin-text-error su-skin-text-xs su-skin-mt-1">{errors.password}</p>
                            ) : (
                                <p className={`su-skin-text-xs su-skin-mt-1 ${isPasswordValid ? 'su-skin-text-success' : 'su-skin-text-gray'}`}>
                                    {SIGNUP_DATA.labels.passwordRule}
                                </p>
                            )}
                        </div>

                        {/* 비밀번호 확인 */}
                        <div className="su-skin-w-full">
                            <label htmlFor="confirmPassword" className="su-skin-block su-skin-text-sm su-skin-font-bold su-skin-mb-2">
                                {SIGNUP_DATA.labels.confirmPassword}
                                <span className="su-skin-text-error su-skin-ml-1">*</span>
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder={SIGNUP_DATA.placeholders.confirmPassword}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className="su-skin-w-full su-skin-px-4-5 su-skin-py-3-5 su-skin-border su-skin-border-black-20 su-skin-text-sm"
                            />
                            {errors.confirmPassword ? (
                                <p className="su-skin-text-error su-skin-text-xs su-skin-mt-1">{errors.confirmPassword}</p>
                            ) : (
                                <p className={`su-skin-text-xs su-skin-mt-1 ${isPasswordMatch ? 'su-skin-text-success' : 'su-skin-text-gray'}`}>
                                    {SIGNUP_DATA.labels.passwordMatch}
                                </p>
                            )}
                        </div>

                        {/* 휴대폰 번호 */}
                        <div className="su-skin-w-full">
                            <label htmlFor="phone" className="su-skin-block su-skin-text-sm su-skin-font-bold su-skin-mb-2">
                                {SIGNUP_DATA.labels.phone}
                                <span className="su-skin-text-error su-skin-ml-1">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder={SIGNUP_DATA.placeholders.phone}
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="su-skin-w-full su-skin-px-4-5 su-skin-py-3-5 su-skin-border su-skin-border-black-20 su-skin-text-sm"
                            />
                            {errors.phone && <p className="su-skin-text-error su-skin-text-xs su-skin-mt-1">{errors.phone}</p>}
                        </div>

                        {/* 추천인 */}
                        <div className="su-skin-w-full">
                            <label htmlFor="referral_code" className="su-skin-block su-skin-text-sm su-skin-font-bold su-skin-mb-2">
                                {SIGNUP_DATA.labels.referral}
                            </label>
                            <input
                                type="text"
                                id="referral_code"
                                name="referral_code"
                                placeholder={SIGNUP_DATA.placeholders.referral}
                                value={formData.referral_code}
                                onChange={(e) => handleInputChange('referral_code', e.target.value)}
                                className="su-skin-w-full su-skin-px-4-5 su-skin-py-3-5 su-skin-border su-skin-border-black-20 su-skin-text-sm"
                            />
                        </div>
                    </div>

                    {/* 약관 동의 */}
                    <div className="su-skin-w-full su-skin-space-y-5 su-skin-my-10">
                        {/* 전체 동의 */}
                        <div className="su-skin-flex su-skin-items-center su-skin-justify-between su-skin-w-full su-skin-gap-x-2">
                            <label className="su-skin-flex su-skin-items-center su-skin-cursor-pointer">
                                <input
                                    id="termsAllCheck"
                                    className="su-skin-peer su-skin-sr-only"
                                    type="checkbox"
                                    checked={formData.agreements.all}
                                    onChange={(e) => handleAgreementChange('all', e.target.checked)}
                                />
                                <span className={`su-skin-flex su-skin-items-center su-skin-justify-center su-skin-w-20 su-skin-h-20 su-skin-border su-skin-border-black-20 su-skin-text-black-20 su-skin-hover-border-primary su-skin-transition-colors su-skin-duration-300 ${formData.agreements.all ? 'su-skin-bg-primary su-skin-text-white' : ''}`}>
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="su-skin-hover-primary su-skin-w-18 su-skin-h-18">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <span className="su-skin-text-sm su-skin-ml-2">{SIGNUP_DATA.labels.allAgree}</span>
                            </label>
                        </div>

                        <div className="su-skin-w-full su-skin-h-1 su-skin-bg-black-10"></div>

                        {/* 만 14세 이상 */}
                        <div className="su-skin-flex su-skin-items-center su-skin-justify-between su-skin-w-full su-skin-gap-x-2">
                            <label className="su-skin-flex su-skin-items-center su-skin-cursor-pointer">
                                <input
                                    id="ageCheck"
                                    className="su-skin-peer su-skin-sr-only"
                                    type="checkbox"
                                    checked={formData.agreements.age}
                                    onChange={(e) => handleAgreementChange('age', e.target.checked)}
                                />
                                <span className={`su-skin-flex su-skin-items-center su-skin-justify-center su-skin-w-20 su-skin-h-20 su-skin-border su-skin-border-black-20 su-skin-text-black-20 su-skin-hover-border-primary su-skin-transition-colors su-skin-duration-300 ${formData.agreements.age ? 'su-skin-bg-primary su-skin-text-white' : ''}`}>
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="su-skin-hover-primary su-skin-w-18 su-skin-h-18">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <span className="su-skin-text-sm su-skin-ml-2">
                                    {SIGNUP_DATA.labels.ageAgree} <span className="su-skin-text-error">{SIGNUP_DATA.labels.required}</span>
                                </span>
                            </label>
                        </div>

                        {/* 이용약관 동의 */}
                        <div className="su-skin-flex su-skin-items-center su-skin-justify-between su-skin-w-full su-skin-gap-x-2">
                            <label className="su-skin-flex su-skin-items-center su-skin-cursor-pointer">
                                <input
                                    id="termsCheck"
                                    className="su-skin-peer su-skin-sr-only"
                                    type="checkbox"
                                    checked={formData.agreements.terms}
                                    onChange={(e) => handleAgreementChange('terms', e.target.checked)}
                                />
                                <span className={`su-skin-flex su-skin-items-center su-skin-justify-center su-skin-w-20 su-skin-h-20 su-skin-border su-skin-border-black-20 su-skin-text-black-20 su-skin-hover-border-primary su-skin-transition-colors su-skin-duration-300 ${formData.agreements.terms ? 'su-skin-bg-primary su-skin-text-white' : ''}`}>
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="su-skin-hover-primary su-skin-w-18 su-skin-h-18">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <span className="su-skin-text-sm su-skin-ml-2">
                                    {SIGNUP_DATA.labels.termsAgree} <span className="su-skin-text-error">{SIGNUP_DATA.labels.required}</span>
                                </span>
                            </label>
                        </div>

                        {/* 개인정보 수집 동의 */}
                        <div className="su-skin-flex su-skin-items-center su-skin-justify-between su-skin-w-full su-skin-gap-x-2">
                            <label className="su-skin-flex su-skin-items-center su-skin-cursor-pointer">
                                <input
                                    id="privacyCheck"
                                    className="su-skin-peer su-skin-sr-only"
                                    type="checkbox"
                                    checked={formData.agreements.privacy}
                                    onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
                                />
                                <span className={`su-skin-flex su-skin-items-center su-skin-justify-center su-skin-w-20 su-skin-h-20 su-skin-border su-skin-border-black-20 su-skin-text-black-20 su-skin-hover-border-primary su-skin-transition-colors su-skin-duration-300 ${formData.agreements.privacy ? 'su-skin-bg-primary su-skin-text-white' : ''}`}>
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="su-skin-hover-primary su-skin-w-18 su-skin-h-18">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <span className="su-skin-text-sm su-skin-ml-2">
                                    {SIGNUP_DATA.labels.privacyAgree} <span className="su-skin-text-error">{SIGNUP_DATA.labels.required}</span>
                                </span>
                            </label>
                        </div>

                        {/* 마케팅 수신 동의 */}
                        <div className="su-skin-flex su-skin-items-center su-skin-justify-between su-skin-w-full su-skin-gap-x-2">
                            <label className="su-skin-flex su-skin-items-center su-skin-cursor-pointer">
                                <input
                                    id="marketingCheck"
                                    className="su-skin-peer su-skin-sr-only"
                                    type="checkbox"
                                    checked={formData.agreements.marketing}
                                    onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
                                />
                                <span className={`su-skin-flex su-skin-items-center su-skin-justify-center su-skin-w-20 su-skin-h-20 su-skin-border su-skin-border-black-20 su-skin-text-black-20 su-skin-hover-border-primary su-skin-transition-colors su-skin-duration-300 ${formData.agreements.marketing ? 'su-skin-bg-primary su-skin-text-white' : ''}`}>
                                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="su-skin-hover-primary su-skin-w-18 su-skin-h-18">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z" fill="currentColor"></path>
                                    </svg>
                                </span>
                                <span className="su-skin-text-sm su-skin-ml-2">
                                    {SIGNUP_DATA.labels.marketingAgree} <span className="su-skin-text-gray">{SIGNUP_DATA.labels.optional}</span>
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* 회원가입 버튼 */}
                    <div className="su-skin-w-full su-skin-bt-5">
                        <button
                            type="submit"
                            disabled={!isRequiredAgreementsValid}
                            className={`su-skin-w-full su-skin-px-4-5 su-skin-py-3-5 su-skin-text-sm su-skin-font-bold su-skin-transition-colors ${
                                isRequiredAgreementsValid 
                                    ? 'su-skin-bg-primary su-skin-text-white su-skin-hover-bg-primary-80' 
                                    : 'su-skin-bg-gray su-skin-text-gray-dark su-skin-cursor-not-allowed'
                            }`}
                        >
                            {SIGNUP_DATA.labels.submitButton}
                        </button>
                    </div>
                </form>

                {/* 로그인 링크 */}
                <div className="su-skin-flex su-skin-items-center su-skin-justify-center su-skin-gap-2 su-skin-w-full su-skin-text-sm su-skin-mt-5">
                    <p>{SIGNUP_DATA.labels.loginText}</p>
                    <a href="/login" className="su-skin-text-primary su-skin-hover-primary-80 su-skin-font-bold">
                        {SIGNUP_DATA.labels.loginLink}
                    </a>
                </div>
            </section>
        </div>
    );
}

// 샘플 데이터를 컴포넌트의 static 속성으로 추가
(Signup as any).SAMPLE_DATA = SIGNUP_DATA;

export default Signup;