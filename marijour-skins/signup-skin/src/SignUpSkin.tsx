import React from 'react';
import { ComponentSkinProps } from './types';
import './signup-skin.scss';

// ✅ 원본 앱의 실제 컴포넌트들을 그대로 복사
const LabelInput = ({ label, validateContent, htmlFor, children, required = true }) => {
    return (
        <div className="flex flex-col">
            <label
                htmlFor={htmlFor}
                className={`mb-2 text-sm ${required ? "after:content-['*'] after:text-primary after:ml-1" : ''}`}
            >
                {label}
            </label>
            {children}
            {validateContent && <div className="mt-2">{validateContent}</div>}
        </div>
    );
};

const TextInput = ({ id, type = 'text', placeholder, value, onChange, name, required, tailwind, readOnly, onBlur, disabled }) => {
    return (
        <input
            id={id}
            type={type}
            aria-labelledby={name || type}
            placeholder={placeholder}
            name={name || type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            className={`w-full px-4.5 py-3.5 border border-black/20 text-sm disabled:border-black/10 disabled:bg-black/3 disabled:text-black/60 ${tailwind || ''}`}
            readOnly={readOnly}
            disabled={disabled}
        />
    );
};

const WarningIcon = ({ tailwind }) => {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind || ''}`}
        >
            <path
                d="m17.318 13.44-4.8-8.64C11.873 3.638 10.98 3 9.998 3c-.983 0-1.875.638-2.52 1.8l-4.8 8.64c-.608 1.103-.675 2.16-.188 2.993.488.832 1.448 1.29 2.708 1.29h9.6c1.26 0 2.22-.458 2.707-1.29.488-.833.42-1.898-.187-2.993ZM9.435 8.25c0-.308.255-.563.563-.563.307 0 .562.255.562.563V12a.567.567 0 0 1-.562.563.567.567 0 0 1-.563-.563V8.25Zm1.095 6.533-.112.09a.568.568 0 0 1-.135.067.452.452 0 0 1-.143.045.919.919 0 0 1-.142.015c-.045 0-.098-.008-.15-.015a.477.477 0 0 1-.135-.045.568.568 0 0 1-.135-.067l-.113-.09a.789.789 0 0 1-.217-.533c0-.195.082-.39.217-.533l.113-.09a.568.568 0 0 1 .135-.067.477.477 0 0 1 .135-.045.642.642 0 0 1 .292 0 .452.452 0 0 1 .143.045c.045.015.09.037.135.067l.112.09a.789.789 0 0 1 .218.533c0 .195-.083.39-.218.533Z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

const ValidateIcon = ({ tailwind }) => {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind || ''}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.02-8.94a.75.75 0 1 0-1.08-1.04l-2.797 2.9L8.06 9.797a.75.75 0 1 0-1.08 1.041l2.162 2.243 3.876-4.02Z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

const WarningLabel = ({ message }) => {
    return (
        <div className="flex items-center gap-1.5 text-error">
            <WarningIcon />
            <p className="text-sm">{message}</p>
        </div>
    );
};

const ValidateLabel = ({ isValid, message }) => {
    return (
        <div className={`flex items-center gap-1.5 ${isValid ? 'text-success' : 'text-black/40'}`}>
            <ValidateIcon />
            <p className="text-sm">{message}</p>
        </div>
    );
};

const CheckIcon = ({ tailwind }) => {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind || ''}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.527 4.467a.75.75 0 0 1 .006 1.06l-9.426 9.54-5.64-5.7A.75.75 0 0 1 3.533 8.31l4.573 4.622 8.36-8.46a.75.75 0 0 1 1.061-.006Z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

const ArrowIcon = ({ tailwind = '', rotate }) => {
    return (
        <svg
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className={`hover-primary ${tailwind}`}
            style={{ transform: rotate ? `rotate(${rotate}deg)` : 'none' }}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.028 6.414a1 1 0 0 1 1.415 0l6.292 6.293a.75.75 0 0 1-1.06 1.06l-5.94-5.939-5.939 5.94a.75.75 0 1 1-1.06-1.061l6.292-6.293Z"
                fill="currentColor"
            ></path>
        </svg>
    );
};

const CheckLabelBox = ({ id, label, description, required, modalContents, checked = false, onChange }) => {
    const handleCheckboxClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onChange) {
            onChange(!checked);
        }
    };

    const handleOpenModal = () => {
        alert('약관 내용을 표시해야 합니다');
    };

    return (
        <div className="flex items-center justify-between w-full gap-x-2">
            <div className="flex items-center cursor-pointer" onClick={handleCheckboxClick}>
                <input
                    id={id}
                    type="checkbox"
                    className="sr-only"
                    required={required}
                    checked={checked}
                    readOnly
                />
                <span className={`checkbox-container ${checked ? 'checked' : ''}`}>
                    <CheckIcon tailwind="w-[18px] h-[18px]" />
                </span>
                {label && <span className="text-sm ml-2">{label}</span>}
                {description && <span className="text-sm text-black/40 ml-1">{description}</span>}
            </div>
            {modalContents && (
                <button
                    type="button"
                    className="p-1 border-0 bg-transparent"
                    onClick={handleOpenModal}
                >
                    <ArrowIcon
                        tailwind="text-black w-4 h-4"
                        rotate="90"
                    />
                </button>
            )}
        </div>
    );
};

const ColorButton = ({ children, colorType, ariaLabel, type, onClick, tailwind = '', to, disabled = false }) => {
    const colors = {
        primary: 'bg-primary text-white border-primary hover-bg-primary-80',
        white: 'bg-white text-primary border-primary hover-bg-primary-10',
        grayLine: 'bg-white text-black/80 border-black/20 hover-bg-primary-10',
    };

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    return (
        <button
            type={type}
            aria-label={ariaLabel}
            disabled={disabled}
            className={`flex items-center justify-center border hover:bg-primary/90 transition-colors ${colors[colorType]} ${disabledStyles} ${tailwind}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

// ✅ API 문서 패턴에 따른 외부 스킨 컴포넌트
const SignUpSkin: React.FC<ComponentSkinProps> = ({ data, actions, options, utils }) => {
    const { t, navigate } = utils;
    
    // ✅ Logic 레이어에서 제공하는 데이터만 사용 (API 패턴)
    const { 
        formData = {},
        loading = false,
        signUpSuccess = false,
        signUpError = null,
        validationErrors = {},
        theme = {},
        basicFields = {},
        varFields = {}
    } = data;
    
    // ✅ 속성 패널에서 설정 가능한 모든 옵션 (문서 가이드 기준)
    const {
        // 기본 설정
        title = '회원가입',
        referralCode: defaultReferralCode,
        
        // 스타일 설정
        backgroundColor = '#ffffff',
        borderRadius = '10px',
        boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)',
        maxWidth = '1200px',
        margin = '0 auto'
    } = options;
    
    // ✅ 클라이언트 사이드 비밀번호 확인 (API 전송 안함)
    const [localPasswordConfirm, setLocalPasswordConfirm] = React.useState('');
    
    // ✅ Logic에서 제공하는 액션들 사용 (API 문서 명시 액션들)
    const { 
        handleSubmit, 
        handleChange, 
        handleBlur
    } = actions;

    // ✅ 폼 데이터에서 개별 값들 추출 (Logic 레이어 데이터만 사용)
    const email = formData.email || '';
    const name = formData.name || '';
    const password = formData.password || '';
    const phoneNumber = formData.phone || '';
    const referrer = formData.referral_code || defaultReferralCode || '';
    
    // ✅ 약관 동의 상태 (Logic 레이어 데이터만 사용)
    const agreements = formData.agreements || {
        all: false,
        age: false,
        terms: false,
        privacy: false,
        marketing: false
    };

    // ✅ 유효성 검사 상태 (Logic 레이어 데이터 기반)
    const isPasswordMatch = password !== '' && password === localPasswordConfirm;
    const isRequiredAgreementsValid = agreements.age && agreements.terms && agreements.privacy;

    // ✅ 동적 버튼 색상 설정
    const buttonColor = theme?.primaryColor || '#89a1be';           // 기본 버튼 색상
    const buttonTextColor = '#ffffff';                              // 텍스트 색상 (흰색)
    const buttonHoverColor = theme?.primaryHoverColor || theme?.primaryColor || '#7a91ac';  // 호버 색상

    // ✅ 약관 동의 처리 - handleChange를 통해 Logic 레이어로 전달
    const handleAgreementChange = (type) => {
        const newAgreements = { ...agreements };
        
        if (type === 'all') {
            const newValue = !agreements.all;
            newAgreements.all = newValue;
            newAgreements.age = newValue;
            newAgreements.terms = newValue;
            newAgreements.privacy = newValue;
            newAgreements.marketing = newValue;
        } else {
            newAgreements[type] = !agreements[type];
            newAgreements.all = newAgreements.age && newAgreements.terms && newAgreements.privacy && newAgreements.marketing;
        }
        
        // ✅ Logic 레이어의 handleChange 사용
        const event = {
            target: { id: 'agreements', value: newAgreements }
        };
        handleChange(event);
    };

    // ✅ 디버깅이 포함된 제출 핸들러
    const handleSubmitWithValidation = (e) => {
        e.preventDefault();
        console.log('🔥 handleSubmitWithValidation 호출 시작');
        
        // 현재 상태 로깅
        console.log('📋 현재 formData:', formData);
        console.log('📋 validationErrors:', validationErrors);
        console.log('📋 loading 상태:', loading);
        console.log('📋 agreements 상태:', agreements);
        
        // 필수 필드 체크
        console.log('📋 필수 필드 확인:', {
            email: formData.email,
            name: formData.name,
            password: formData.password,
            phone: formData.phone,
            user_id: formData.user_id,
        });
        
        // 클라이언트 사이드 비밀번호 확인 검증
        if (password !== localPasswordConfirm) {
            console.log('❌ 비밀번호 불일치');
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        console.log('✅ 비밀번호 일치 확인');
        
        // Logic 레이어 유효성 검사 (있다면)
        if (actions?.validateForm) {
            console.log('🔍 Logic 유효성 검사 시작');
            const isValid = actions.validateForm();
            console.log('✅ Logic 유효성 검사 결과:', isValid);
            if (!isValid) {
                console.log('❌ Logic 유효성 검사 실패로 API 호출 안함');
                return;
            }
        } else {
            console.log('⚠️ validateForm 액션이 없습니다');
        }
        
        // Logic 레이어의 실제 handleSubmit 호출
        console.log('🚀 Logic handleSubmit 호출 시작');
        console.log('handleSubmit type:', typeof handleSubmit);
        console.log('handleSubmit function:', handleSubmit);
        
        handleSubmit(e);
        console.log('✅ Logic handleSubmit 호출 완료');
    };

    // ✅ 성공 시 UI (스타일 옵션 적용)
    if (signUpSuccess) {
        return (
            <div className="signupContainer opacity-100" style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <section className="globalWrapper w-full py-8 md:py-13" style={{
                    backgroundColor,
                    borderRadius,
                    boxShadow,
                    maxWidth: '600px',
                    margin,
                    padding: '40px'
                }}>
                    <div className="text-center">
                        <h2 className="font-serif text-3xl mb-5" style={{ color: theme?.primaryColor || '#333' }}>
                            {t('회원가입 완료!')}
                        </h2>
                        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                            {t('환영합니다! 잠시 후 페이지가 이동됩니다.')}
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            style={{
                                padding: '12px 30px',
                                fontSize: '16px',
                                backgroundColor: theme?.primaryColor || '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            {t('홈으로 이동')}
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    // ✅ 원본 앱의 정확한 구조를 그대로 사용 (스타일 옵션 적용)
    return (
        <div className="signupContainer opacity-100" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <section className="globalWrapper w-full py-8 md:py-13" style={{
                backgroundColor,
                borderRadius,
                boxShadow,
                maxWidth,
                margin,
                padding: '40px'
            }}>
                <div className="font-serif text-3xl mb-5 text-center">
                    <h2 style={{ color: theme?.primaryColor || '#333' }}>{title}</h2>
                </div>
                
                {/* 에러 메시지 표시 */}
                {signUpError && (
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        borderRadius: '4px',
                        marginBottom: '20px'
                    }}>
                        {typeof signUpError === 'object' ? signUpError.msg || JSON.stringify(signUpError) : signUpError}
                    </div>
                )}
                <form
                    className="flex flex-col items-center pt-5"
                    onSubmit={handleSubmitWithValidation}
                >
                    <div className="w-full space-y-6">
                        {/* 기본 필드들 - basicFields 설정에 따라 조건부 표시 */}
                        {basicFields.userId !== false && (
                            <LabelInput
                                label={t('아이디')}
                                htmlFor="user_id"
                                validateContent={validationErrors.user_id && <WarningLabel message={validationErrors.user_id} />}
                            >
                                <TextInput
                                    type="text"
                                    id="user_id"
                                    placeholder={t('아이디를 입력해주세요 (이메일 또는 닉네임)')}
                                    value={formData.user_id || email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur && handleBlur('user_id')}
                                />
                            </LabelInput>
                        )}
                        
                        {basicFields.name !== false && (
                            <LabelInput
                                label={t('이름')}
                                htmlFor="name"
                                validateContent={validationErrors.name && <WarningLabel message={validationErrors.name} />}
                            >
                                <TextInput
                                    type="text"
                                    id="name"
                                    placeholder={t('이름을 입력해주세요')}
                                    value={name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur && handleBlur('name')}
                                />
                            </LabelInput>
                        )}
                        
                        {basicFields.password !== false && (
                            <>
                                <LabelInput
                                    label={t('비밀번호')}
                                    htmlFor="password"
                                    validateContent={validationErrors.password && <WarningLabel message={validationErrors.password} />}
                                >
                                    <TextInput
                                        type="password"
                                        id="password"
                                        placeholder={t('비밀번호를 입력해주세요')}
                                        value={password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur && handleBlur('password')}
                                    />
                                </LabelInput>
                                <LabelInput
                                    label={t('비밀번호 확인')}
                                    htmlFor="password_confirm_local"
                                    validateContent={
                                        <ValidateLabel
                                            isValid={isPasswordMatch}
                                            message={t('비밀번호 일치')}
                                        />
                                    }
                                >
                                    <TextInput
                                        type="password"
                                        id="password_confirm_local"
                                        placeholder={t('비밀번호를 재입력해주세요')}
                                        value={localPasswordConfirm}
                                        onChange={(e) => setLocalPasswordConfirm(e.target.value)}
                                    />
                                </LabelInput>
                            </>
                        )}
                        
                        {basicFields.phone !== false && (
                            <LabelInput
                                label={t('휴대폰 번호')}
                                htmlFor="phone"
                                validateContent={validationErrors.phone && <WarningLabel message={validationErrors.phone} />}
                            >
                                <TextInput
                                    type="tel"
                                    id="phone"
                                    placeholder={t('휴대폰 번호를 입력해주세요')}
                                    value={phoneNumber}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur && handleBlur('phone')}
                                />
                            </LabelInput>
                        )}
                        
                        {basicFields.email !== false && (
                            <LabelInput
                                label={t('이메일')}
                                htmlFor="email"
                                required={false}
                                validateContent={validationErrors.email && <WarningLabel message={validationErrors.email} />}
                            >
                                <TextInput
                                    type="email"
                                    id="email"
                                    placeholder={t('이메일을 입력해주세요')}
                                    value={email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur && handleBlur('email')}
                                />
                            </LabelInput>
                        )}
                        
                        {basicFields.birthday !== false && (
                            <LabelInput
                                label={t('생년월일')}
                                htmlFor="birthday"
                                required={false}
                                validateContent={validationErrors.birthday && <WarningLabel message={validationErrors.birthday} />}
                            >
                                <TextInput
                                    type="date"
                                    id="birthday"
                                    value={formData.birthday || ''}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur && handleBlur('birthday')}
                                />
                            </LabelInput>
                        )}
                        
                        {basicFields.address !== false && (
                            <LabelInput
                                label={t('주소')}
                                htmlFor="address"
                                required={false}
                                validateContent={validationErrors.address && <WarningLabel message={validationErrors.address} />}
                            >
                                <TextInput
                                    type="text"
                                    id="address"
                                    placeholder={t('주소를 입력해주세요')}
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur && handleBlur('address')}
                                />
                            </LabelInput>
                        )}
                        
                        {basicFields.referralCode !== false && (
                            <LabelInput
                                label={t('추천인')}
                                htmlFor="referral_code"
                                required={false}
                            >
                                <TextInput
                                    type="text"
                                    id="referral_code"
                                    placeholder={t('추천인의 이메일이나 닉네임을 입력해주세요')}
                                    value={referrer}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur && handleBlur('referral_code')}
                                    readOnly={!!defaultReferralCode}
                                />
                            </LabelInput>
                        )}
                        
                        {/* 커스텀 필드들 - varFields 설정에 따라 동적 렌더링 */}
                        {Object.entries(varFields).map(([fieldId, config]) => {
                            if (!config.show) return null;
                            
                            return (
                                <LabelInput
                                    key={fieldId}
                                    label={config.label}
                                    htmlFor={fieldId}
                                    required={config.required}
                                    validateContent={validationErrors[fieldId] && <WarningLabel message={validationErrors[fieldId]} />}
                                >
                                    {config.type === 'select' ? (
                                        <select
                                            id={fieldId}
                                            name={fieldId}
                                            value={formData[fieldId] || ''}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur && handleBlur(fieldId)}
                                            className="w-full px-4.5 py-3.5 border border-black/20 text-sm"
                                        >
                                            <option value="">{t('선택하세요')}</option>
                                            {config.options?.map((opt, idx) => (
                                                <option key={idx} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : config.type === 'radio' ? (
                                        <div className="flex gap-4">
                                            {config.options?.map((opt, idx) => (
                                                <label key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name={fieldId}
                                                        value={opt}
                                                        checked={formData[fieldId] === opt}
                                                        onChange={handleChange}
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    ) : config.type === 'document' ? (
                                        <div>
                                            <div style={{
                                                height: '200px',
                                                overflowY: 'auto',
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                marginBottom: '10px',
                                                backgroundColor: '#f9f9f9',
                                                borderRadius: '4px'
                                            }}>
                                                {config.content || t('동의 내용이 여기에 표시됩니다.')}
                                            </div>
                                            <CheckLabelBox
                                                id={fieldId}
                                                label={config.required ? t('위 내용에 동의합니다 (필수)') : t('위 내용에 동의합니다 (선택)')}
                                                required={config.required}
                                                checked={formData[fieldId] === '1'}
                                                onChange={(checked) => {
                                                    const event = {
                                                        target: { id: fieldId, value: checked ? '1' : '0' }
                                                    };
                                                    handleChange(event);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <TextInput
                                            type="text"
                                            id={fieldId}
                                            placeholder={`${config.label}${config.required ? ' (필수)' : ''}`}
                                            value={formData[fieldId] || ''}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur && handleBlur(fieldId)}
                                        />
                                    )}
                                </LabelInput>
                            );
                        })}
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
                            modalContents={<div className="pb-10"><p>이용약관 내용...</p></div>}
                        />
                        <CheckLabelBox
                            id="privacyCheck"
                            label="개인 정보 수집 및 이용 동의"
                            description="(필수)"
                            required
                            checked={agreements.privacy}
                            onChange={() => handleAgreementChange('privacy')}
                            modalContents={<div className="pb-10"><p>개인정보 처리방침 내용...</p></div>}
                        />
                        <CheckLabelBox
                            id="marketingCheck"
                            label="이메일 및 SNS 마케팅 정보 수신 동의"
                            description="(선택)"
                            checked={agreements.marketing}
                            onChange={() => handleAgreementChange('marketing')}
                        />
                        {validationErrors.agreements && (
                            <WarningLabel message={validationErrors.agreements} />
                        )}
                    </div>
                    <div className="w-full bt-5">
                        <button
                            type="submit"
                            disabled={!isRequiredAgreementsValid || loading}
                            className={`w-full px-4.5 py-3.5 border-0 rounded-md font-medium transition-colors ${
                                !isRequiredAgreementsValid || loading 
                                    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                                    : 'hover:opacity-90'
                            }`}
                            style={{
                                backgroundColor: buttonColor,
                                color: buttonTextColor,
                            }}
                            onMouseEnter={(e) => {
                                if (!loading && isRequiredAgreementsValid) {
                                    e.target.style.backgroundColor = buttonHoverColor;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading && isRequiredAgreementsValid) {
                                    e.target.style.backgroundColor = buttonColor;
                                }
                            }}
                        >
                            {loading ? '처리 중...' : '회원가입'}
                        </button>
                    </div>
                </form>
                <div className="flex items-center justify-center gap-2 w-full text-sm mt-5">
                    <span>이미 아이디가 있으신가요?</span>
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-primary hover-primary-80 font-bold cursor-pointer border-0 bg-transparent p-0 text-sm leading-none"
                    >
                        로그인
                    </button>
                </div>
            </section>
        </div>
    );
};

// ✅ UMD 내보내기 방법
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignUpSkin;
} else {
    window.SignUpSkin = SignUpSkin;
}

export default SignUpSkin;