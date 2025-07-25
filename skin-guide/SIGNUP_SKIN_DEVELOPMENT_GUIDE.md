# 회원가입 스킨 개발 가이드

이 가이드는 웹빌더의 회원가입(Signup) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 데이터 구조

### 회원가입 폼 데이터 (SignupFormData)

```typescript
interface SignupFormData {
  // 기본 필드
  user_id: string;           // 아이디 (2-20자)
  password: string;          // 비밀번호
  phone: string;             // 핸드폰 번호
  name: string;              // 이름
  referral_code: string;     // 추천인 코드
  email: string;             // 이메일
  birthday: string;          // 생년월일
  address: string;           // 주소
  
  // 특수 필드 (회사별)
  upperer_code: string;      // 상위 코드 (SPECIFIED 정책)
  center_code: string;       // 센터/리더 코드 (회사 24, 26)
  left_or_right: string;     // 좌/우 선택 (SPECIFIED 정책)
  trxWithdrawAddress: string;// TRX 지갑 주소 (회사 24)
  bscWithdrawAddress: string;// USDT-BNB 지갑 주소 (회사 24, 26)
  
  // 커스텀 필드
  var01: string;             // 커스텀 필드 01
  var02: string;             // 커스텀 필드 02
  var03: string;             // 커스텀 필드 03
  var04: string;             // 커스텀 필드 04
  var05: string;             // 커스텀 필드 05
  var06: string;             // 커스텀 필드 06
  var07: string;             // 커스텀 필드 07
  var08: string;             // 커스텀 필드 08
  var09: string;             // 커스텀 필드 09
  var10: string;             // 커스텀 필드 10
  
  // 시스템 필드
  referral_code_from_url: boolean;  // URL에서 추천인 코드를 가져왔는지 여부
}
```

### 기본 필드 설정 (BasicFieldsConfig)

```typescript
interface BasicFieldsConfig {
  userId: boolean;      // 아이디 필드 표시 여부
  password: boolean;    // 비밀번호 필드 표시 여부
  name: boolean;        // 이름 필드 표시 여부
  phone: boolean;       // 핸드폰 번호 필드 표시 여부
  email: boolean;       // 이메일 필드 표시 여부
  birthday: boolean;    // 생년월일 필드 표시 여부
  address: boolean;     // 주소 필드 표시 여부
  referralCode: boolean;// 추천인 코드 필드 표시 여부
}
```

### 커스텀 필드 설정 (VarFieldConfig)

```typescript
interface VarFieldConfig {
  show: boolean;        // 필드 표시 여부
  label: string;        // 필드 라벨
  type: 'input' | 'select' | 'radio' | 'document' | 'account' | 'ssn';  // 필드 타입
  options?: Array<{     // select, radio 타입의 경우 옵션 목록
    value: string;
    label: string;
  }>;
  required: boolean;    // 필수 여부
  content?: string;     // document 타입의 경우 표시할 내용
}
```

## SkinProps 인터페이스

실제 스킨이 받는 props는 다음과 같은 구조입니다:

```typescript
interface SkinProps {
  // ComponentSkinWrapper에서 병합된 데이터
  data: {
    // 원본 컴포넌트 데이터
    id: string;
    type: string;
    props: Record<string, any>;
    componentProps?: Record<string, any>;
    style?: React.CSSProperties;
    
    // SignupLogic에서 반환된 data 객체의 모든 필드가 직접 포함됨
    formData: SignupFormData;                    // 폼 입력 데이터
    validationErrors: Record<string, string>;    // 유효성 검사 에러
    loading: boolean;                            // 로딩 상태
    signUpSuccess: boolean;                      // 회원가입 성공 여부
    signUpError: string | null;                  // 회원가입 에러 메시지
    theme: {                                     // 테마 설정
      primaryColor?: string;
      secondaryColor?: string;
      [key: string]: any;
    };
    policies: any;                               // 정책 정보
    isSpecifiedLegPolicy: boolean;               // 특정 법적 정책 여부
    companyId: string;                          // 회사 ID
    basicFields: FormFieldConfig[];              // 기본 필드 설정
    varFields: FormFieldConfig[];                // 커스텀 필드 설정
    
    // SignupLogic에서 반환된 기타 데이터
    [key: string]: any;
  };
  
  // SignupLogic에서 반환된 액션들
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;  // 입력 변경 핸들러
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;                                               // 폼 제출 핸들러
    handleBlur: (field: string) => void;                                                                       // 필드 블러 핸들러
    handleRadioChange: (fieldName: string, value: string) => void;                                             // 라디오 버튼 변경 핸들러
    handleCheckboxChange: (fieldName: string, label: string, isChecked: boolean) => void;                      // 체크박스 변경 핸들러
    validateField: (id: string, value: string) => void;                                                        // 필드 유효성 검사
    validateForm: () => boolean;                                                                               // 전체 폼 유효성 검사
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    padding?: string;                            // 패딩
    backgroundColor?: string;                    // 배경색
    borderRadius?: string;                       // 테두리 둥글기
    style?: React.CSSProperties;                 // 추가 스타일
    [key: string]: any;
  };
  
  // 렌더링 모드
  mode: 'editor' | 'preview' | 'production';
  
  // 유틸리티 함수들
  utils: {
    t: (key: string, params?: Record<string, any>) => string;  // 번역
    navigate: (path: string) => void;                          // 라우팅
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: string | Date, format?: string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: (string | undefined | null | false)[]) => string;
  };
  
  // 앱 전역 정보
  app?: {
    user?: any;                   // 사용자 정보
    company?: any;                // 회사 정보
    currentLanguage?: string;     // 현재 언어
    theme?: any;                  // 테마 정보
    isUserLoggedIn?: boolean;     // 로그인 여부
  };
  
  // 에디터 관련 정보 (에디터 모드에서만)
  editor?: {
    isSelected: boolean;         // 선택 상태
    onSelect: () => void;        // 선택 핸들러
    onEdit: () => void;          // 편집 핸들러
    onDelete: () => void;        // 삭제 핸들러
    dragHandleProps?: any;       // 드래그 핸들 props
  };
}
```

## 데이터 소스

회원가입 컴포넌트는 다음과 같은 방식으로 데이터를 받습니다:

1. **Property Panel**: 에디터에서 설정한 필드 표시 옵션 (options.basicFields, options.varFields)
2. **Form State**: 사용자 입력 상태 (data.formData로 전달)
3. **Redux State**: 회원가입 상태 및 에러 정보 (data 객체에 병합)
4. **URL Parameters**: 추천인 코드 (`/signup/{referralCode}` 형식으로 자동 추출)
5. **Company Settings**: 회사별 특수 필드 표시 여부

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MySignupSkin: React.FC<SkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app 
}) => {
  const { t, cx } = utils;
  
  // 데이터 추출
  const { 
    formData,
    validationErrors,
    loading,
    signUpSuccess,
    signUpError,
    theme,
    showSSNField
  } = data;
  
  // 옵션 추출
  const {
    basicFields = {
      userId: true,
      password: true,
      name: true,
      phone: true,
      email: true,
      birthday: true,
      address: true,
      referralCode: true
    },
    varFields = {},
    padding = '20px',
    backgroundColor = '#ffffff',
    borderRadius = '8px',
    style = {}
  } = options;
  
  // 액션 사용
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    handleRadioChange,
    handleCheckboxChange,
    validateField,
    validateForm
  } = actions;
  
  // 회사 정보
  const companyId = app?.company?.id || data?.withcookieData?.skin?.company?.id;
  const paymentPolicy = data?.withcookieData?.company?.payment_policy;
  
  // 특수 필드 표시 여부
  const showCenterCode = companyId === 24 || companyId === 26;
  const showUppererCode = paymentPolicy === 'SPECIFIED';
  const showTrxWallet = companyId === 24;
  const showBscWallet = companyId === 24 || companyId === 26;
  
  if (signUpSuccess) {
    return (
      <div className="signup-success">
        <h2>{t('회원가입 완료!')}</h2>
        <p>{t('3초 후 홈페이지로 이동합니다...')}</p>
      </div>
    );
  }
  
  return (
    <div 
      className={cx('signup-form', options.className)}
      style={{
        padding,
        backgroundColor,
        borderRadius,
        ...style
      }}
    >
      <h2>{t('회원가입')}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 아이디 필드 */}
        {basicFields.userId && (
          <div className="form-group">
            <label htmlFor="user_id">
              {t('아이디')} <span className="required">*</span>
            </label>
            <input 
              id="user_id"
              name="user_id"
              type="text" 
              placeholder={t("아이디 입력 (2~20자)")}
              required 
              className={validationErrors?.user_id ? 'error' : ''}
              value={formData?.user_id || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('user_id')}
              minLength={2}
              maxLength={20}
            />
            {validationErrors?.user_id && (
              <div className="error-message">
                {validationErrors.user_id}
              </div>
            )}
          </div>
        )}

        {/* 비밀번호 필드 */}
        {basicFields.password && (
          <div className="form-group">
            <label htmlFor="password">
              {t('비밀번호')} <span className="required">*</span>
            </label>
            <input 
              id="password"
              name="password"
              type="password" 
              placeholder={t("비밀번호 입력")}
              required 
              className={validationErrors?.password ? 'error' : ''}
              value={formData?.password || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
            />
            {validationErrors?.password && (
              <div className="error-message">
                {validationErrors.password}
              </div>
            )}
          </div>
        )}

        {/* 이름 필드 */}
        {basicFields.name && (
          <div className="form-group">
            <label htmlFor="name">
              {t('이름')} <span className="required">*</span>
            </label>
            <input 
              id="name"
              name="name"
              type="text" 
              placeholder={t("이름 입력")}
              required 
              className={validationErrors?.name ? 'error' : ''}
              value={formData?.name || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
            />
            {validationErrors?.name && (
              <div className="error-message">
                {validationErrors.name}
              </div>
            )}
          </div>
        )}

        {/* 핸드폰 번호 필드 */}
        {basicFields.phone && (
          <div className="form-group">
            <label htmlFor="phone">
              {t('핸드폰 번호')} <span className="required">*</span>
            </label>
            <input 
              id="phone"
              name="phone"
              type="tel" 
              placeholder={t("핸드폰 번호 입력")}
              required 
              className={validationErrors?.phone ? 'error' : ''}
              value={formData?.phone || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('phone')}
            />
            {validationErrors?.phone && (
              <div className="error-message">
                {validationErrors.phone}
              </div>
            )}
          </div>
        )}

        {/* 이메일 필드 */}
        {basicFields.email && (
          <div className="form-group">
            <label htmlFor="email">
              {t('이메일')}
            </label>
            <input 
              id="email"
              name="email"
              type="email" 
              placeholder={t("이메일 입력")}
              className={validationErrors?.email ? 'error' : ''}
              value={formData?.email || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
            />
            {validationErrors?.email && (
              <div className="error-message">
                {validationErrors.email}
              </div>
            )}
          </div>
        )}

        {/* 생년월일 필드 */}
        {basicFields.birthday && (
          <div className="form-group">
            <label htmlFor="birthday">
              {t('생년월일')}
            </label>
            <input 
              id="birthday"
              name="birthday"
              type="date" 
              className={validationErrors?.birthday ? 'error' : ''}
              value={formData?.birthday || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('birthday')}
            />
            {validationErrors?.birthday && (
              <div className="error-message">
                {validationErrors.birthday}
              </div>
            )}
          </div>
        )}

        {/* 주소 필드 */}
        {basicFields.address && (
          <div className="form-group">
            <label htmlFor="address">
              {t('주소')}
            </label>
            <input 
              id="address"
              name="address"
              type="text" 
              placeholder={t("주소 입력")}
              className={validationErrors?.address ? 'error' : ''}
              value={formData?.address || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('address')}
            />
            {validationErrors?.address && (
              <div className="error-message">
                {validationErrors.address}
              </div>
            )}
          </div>
        )}

        {/* 추천인 코드 필드 */}
        {basicFields.referralCode && (
          <div className="form-group">
            <label htmlFor="referral_code">
              {t('추천인 코드')}
            </label>
            <input 
              id="referral_code"
              name="referral_code"
              type="text" 
              placeholder={t("추천인 코드 입력")}
              className={validationErrors?.referral_code ? 'error' : ''}
              value={formData?.referral_code || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('referral_code')}
              readOnly={formData?.referral_code_from_url}  // URL에서 가져온 경우 읽기 전용
            />
            {validationErrors?.referral_code && (
              <div className="error-message">
                {validationErrors.referral_code}
              </div>
            )}
          </div>
        )}

        {/* 회사별 특수 필드 */}
        {/* 센터/리더 코드 (회사 24, 26) */}
        {showCenterCode && (
          <div className="form-group">
            <label htmlFor="center_code">
              {t('리더 코드')} <span className="required">*</span>
            </label>
            <input 
              id="center_code"
              name="center_code"
              type="text" 
              placeholder={t("리더 코드 입력")}
              required 
              className={validationErrors?.center_code ? 'error' : ''}
              value={formData?.center_code || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('center_code')}
            />
            {validationErrors?.center_code && (
              <div className="error-message">
                {validationErrors.center_code}
              </div>
            )}
          </div>
        )}

        {/* 상위 코드 (SPECIFIED 정책) */}
        {showUppererCode && (
          <div className="form-group">
            <label htmlFor="upperer_code">
              {t('상위 코드')} <span className="required">*</span>
            </label>
            <input 
              id="upperer_code"
              name="upperer_code"
              type="text" 
              placeholder={t("상위 코드 입력")}
              required 
              className={validationErrors?.upperer_code ? 'error' : ''}
              value={formData?.upperer_code || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('upperer_code')}
            />
            {validationErrors?.upperer_code && (
              <div className="error-message">
                {validationErrors.upperer_code}
              </div>
            )}
          </div>
        )}

        {/* 좌/우 선택 (SPECIFIED 정책) */}
        {showUppererCode && (
          <div className="form-group">
            <label>{t('좌/우 선택')} <span className="required">*</span></label>
            <div className="radio-group">
              <label>
                <input 
                  type="radio"
                  name="left_or_right"
                  value="left"
                  checked={formData?.left_or_right === 'left'}
                  onChange={() => handleRadioChange('left_or_right', 'left')}
                />
                {t('좌')}
              </label>
              <label>
                <input 
                  type="radio"
                  name="left_or_right"
                  value="right"
                  checked={formData?.left_or_right === 'right'}
                  onChange={() => handleRadioChange('left_or_right', 'right')}
                />
                {t('우')}
              </label>
            </div>
            {validationErrors?.left_or_right && (
              <div className="error-message">
                {validationErrors.left_or_right}
              </div>
            )}
          </div>
        )}

        {/* TRX 지갑 주소 (회사 24) */}
        {showTrxWallet && (
          <div className="form-group">
            <label htmlFor="trxWithdrawAddress">
              {t('TRX 지갑 주소')}
            </label>
            <input 
              id="trxWithdrawAddress"
              name="trxWithdrawAddress"
              type="text" 
              placeholder={t("TRX 지갑 주소 입력")}
              className={validationErrors?.trxWithdrawAddress ? 'error' : ''}
              value={formData?.trxWithdrawAddress || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('trxWithdrawAddress')}
            />
            {validationErrors?.trxWithdrawAddress && (
              <div className="error-message">
                {validationErrors.trxWithdrawAddress}
              </div>
            )}
          </div>
        )}

        {/* BSC(USDT-BNB) 지갑 주소 (회사 24, 26) */}
        {showBscWallet && (
          <div className="form-group">
            <label htmlFor="bscWithdrawAddress">
              {t('USDT-BNB 지갑 주소')}
            </label>
            <input 
              id="bscWithdrawAddress"
              name="bscWithdrawAddress"
              type="text" 
              placeholder={t("USDT-BNB 지갑 주소 입력")}
              className={validationErrors?.bscWithdrawAddress ? 'error' : ''}
              value={formData?.bscWithdrawAddress || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('bscWithdrawAddress')}
            />
            {validationErrors?.bscWithdrawAddress && (
              <div className="error-message">
                {validationErrors.bscWithdrawAddress}
              </div>
            )}
          </div>
        )}

        {/* 커스텀 필드 렌더링 */}
        {Object.entries(varFields).map(([fieldKey, fieldConfig]) => {
          if (!fieldConfig.show) return null;
          
          const fieldName = fieldKey; // var01, var02, etc.
          const fieldValue = formData?.[fieldName] || '';
          
          return (
            <div key={fieldName} className="form-group">
              <label htmlFor={fieldName}>
                {fieldConfig.label}
                {fieldConfig.required && <span className="required">*</span>}
              </label>
              
              {/* input 타입 */}
              {fieldConfig.type === 'input' && (
                <input 
                  id={fieldName}
                  name={fieldName}
                  type="text" 
                  placeholder={fieldConfig.label}
                  required={fieldConfig.required}
                  className={validationErrors?.[fieldName] ? 'error' : ''}
                  value={fieldValue}
                  onChange={handleChange}
                  onBlur={() => handleBlur(fieldName)}
                />
              )}
              
              {/* select 타입 */}
              {fieldConfig.type === 'select' && (
                <select
                  id={fieldName}
                  name={fieldName}
                  required={fieldConfig.required}
                  className={validationErrors?.[fieldName] ? 'error' : ''}
                  value={fieldValue}
                  onChange={handleChange}
                  onBlur={() => handleBlur(fieldName)}
                >
                  <option value="">{t('선택하세요')}</option>
                  {fieldConfig.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {/* radio 타입 */}
              {fieldConfig.type === 'radio' && (
                <div className="radio-group">
                  {fieldConfig.options?.map(option => (
                    <label key={option.value}>
                      <input 
                        type="radio"
                        name={fieldName}
                        value={option.value}
                        checked={fieldValue === option.value}
                        onChange={() => handleRadioChange(fieldName, option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
              
              {/* document 타입 */}
              {fieldConfig.type === 'document' && (
                <div className="document-content">
                  <div dangerouslySetInnerHTML={{ __html: fieldConfig.content || '' }} />
                  <input 
                    type="hidden"
                    id={fieldName}
                    name={fieldName}
                    value="agreed"
                  />
                </div>
              )}
              
              {/* account 타입 */}
              {fieldConfig.type === 'account' && (
                <input 
                  id={fieldName}
                  name={fieldName}
                  type="text" 
                  placeholder={t("계좌번호 입력")}
                  required={fieldConfig.required}
                  className={validationErrors?.[fieldName] ? 'error' : ''}
                  value={fieldValue}
                  onChange={handleChange}
                  onBlur={() => handleBlur(fieldName)}
                />
              )}
              
              {/* ssn 타입 (주민등록번호) */}
              {fieldConfig.type === 'ssn' && showSSNField && (
                <input 
                  id={fieldName}
                  name={fieldName}
                  type="text" 
                  placeholder={t("주민등록번호 입력")}
                  required={fieldConfig.required}
                  className={validationErrors?.[fieldName] ? 'error' : ''}
                  value={fieldValue}
                  onChange={handleChange}
                  onBlur={() => handleBlur(fieldName)}
                  maxLength={14}
                />
              )}
              
              {validationErrors?.[fieldName] && (
                <div className="error-message">
                  {validationErrors[fieldName]}
                </div>
              )}
            </div>
          );
        })}

        {/* 회원가입 에러 메시지 */}
        {signUpError && (
          <div className="signup-error">
            {typeof signUpError === 'string' ? t(signUpError) : JSON.stringify(signUpError)}
          </div>
        )}

        {/* 회원가입 버튼 */}
        <button 
          type="submit" 
          className="signup-button"
          style={{ 
            backgroundColor: theme?.primary || '#007bff',
            color: '#ffffff'
          }}
          disabled={loading}
        >
          {loading ? t('처리 중...') : t('회원가입')}
        </button>
      </form>
    </div>
  );
};

export default MySignupSkin;
```

## 커스텀 필드 타입별 처리 가이드

### input 타입
```typescript
<input 
  id={fieldName}
  name={fieldName}
  type="text" 
  placeholder={fieldConfig.label}
  required={fieldConfig.required}
  value={formData?.[fieldName] || ''}
  onChange={handleChange}
  onBlur={() => handleBlur(fieldName)}
/>
```

### select 타입
```typescript
<select
  id={fieldName}
  name={fieldName}
  required={fieldConfig.required}
  value={formData?.[fieldName] || ''}
  onChange={handleChange}
>
  <option value="">{t('선택하세요')}</option>
  {fieldConfig.options?.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>
```

### radio 타입
```typescript
<div className="radio-group">
  {fieldConfig.options?.map(option => (
    <label key={option.value}>
      <input 
        type="radio"
        name={fieldName}
        value={option.value}
        checked={formData?.[fieldName] === option.value}
        onChange={() => handleRadioChange(fieldName, option.value)}
      />
      {option.label}
    </label>
  ))}
</div>
```

### document 타입
```typescript
// 약관 등의 문서를 표시하고 동의 여부를 저장
<div className="document-content">
  <div dangerouslySetInnerHTML={{ __html: fieldConfig.content || '' }} />
  <label>
    <input 
      type="checkbox"
      onChange={(e) => handleCheckboxChange(fieldName, 'agreed', e.target.checked)}
    />
    {t('동의합니다')}
  </label>
</div>
```

### account 타입
```typescript
// 계좌번호 입력 (숫자와 하이픈만 허용하는 패턴 적용 가능)
<input 
  id={fieldName}
  name={fieldName}
  type="text" 
  pattern="[0-9-]+"
  placeholder={t("계좌번호 입력 (예: 123-456-789)")}
  required={fieldConfig.required}
  value={formData?.[fieldName] || ''}
  onChange={handleChange}
/>
```

### ssn 타입
```typescript
// 주민등록번호 입력 (보안상 마스킹 처리 권장)
{fieldConfig.type === 'ssn' && showSSNField && (
  <input 
    id={fieldName}
    name={fieldName}
    type="text" 
    placeholder={t("주민등록번호 입력")}
    pattern="[0-9]{6}-[0-9]{7}"
    maxLength={14}
    required={fieldConfig.required}
    value={formData?.[fieldName] || ''}
    onChange={handleChange}
  />
)}
```

## 회사별 특수 처리

### 회사 ID별 특수 필드

```typescript
// 회사 정보 확인
const companyId = app?.company?.id || data?.withcookieData?.skin?.company?.id;
const paymentPolicy = data?.withcookieData?.company?.payment_policy;

// 회사별 필드 표시
const specialFields = {
  // 회사 24
  company24: companyId === 24,
  showTrxWallet: companyId === 24,
  showBscWallet: companyId === 24 || companyId === 26,
  showCenterCode: companyId === 24 || companyId === 26,
  
  // 회사 26
  company26: companyId === 26,
  
  // SPECIFIED 정책
  showUppererCode: paymentPolicy === 'SPECIFIED',
  showLeftRight: paymentPolicy === 'SPECIFIED'
};
```

## 추천인 코드 처리

### URL에서 추천인 코드 자동 추출

```typescript
// URL 패턴: /signup/{referralCode}
// 예: /signup/ABC123 → referral_code 필드에 'ABC123' 자동 입력

// URL에서 가져온 추천인 코드는 읽기 전용
{basicFields.referralCode && (
  <input 
    id="referral_code"
    name="referral_code"
    type="text" 
    value={formData?.referral_code || ''}
    onChange={handleChange}
    readOnly={formData?.referral_code_from_url}  // URL에서 가져온 경우 true
    style={{
      backgroundColor: formData?.referral_code_from_url ? '#f5f5f5' : 'white'
    }}
  />
)}
```

## 유효성 검사

### 필드별 유효성 검사 규칙

```typescript
// 실시간 유효성 검사 (onBlur 이벤트)
onBlur={() => handleBlur('field_name')}

// 유효성 검사 규칙
const validationRules = {
  user_id: {
    required: true,
    minLength: 2,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: '아이디는 2-20자의 영문, 숫자, 언더스코어만 사용 가능합니다.'
  },
  password: {
    required: true,
    minLength: 8,
    message: '비밀번호는 8자 이상이어야 합니다.'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '올바른 이메일 형식이 아닙니다.'
  },
  phone: {
    required: true,
    pattern: /^[0-9-]+$/,
    message: '핸드폰 번호는 숫자와 하이픈만 입력 가능합니다.'
  }
};
```

## 폼 제출 및 응답 처리

### 성공 시 처리

```typescript
// 회원가입 성공 시
if (signUpSuccess) {
  return (
    <div className="signup-success">
      <h2>{t('회원가입이 완료되었습니다!')}</h2>
      <p>{t('3초 후 홈페이지로 이동합니다...')}</p>
    </div>
  );
}

// SignupLogic에서 3초 후 자동으로 홈으로 리다이렉트
```

### 에러 처리

```typescript
// 전체 에러 메시지
{signUpError && (
  <div className="signup-error">
    {t(signUpError)}
  </div>
)}

// 필드별 에러 메시지
{validationErrors?.field_name && (
  <div className="field-error">
    {validationErrors.field_name}
  </div>
)}
```

## 외부 스킨 개발 및 배포

### 1. UMD 번들 빌드 설정

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'signup-skin.js',
    library: 'SignupCustomSkin',  // 전역 변수명
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  // ... 기타 설정
};
```

### 2. 스킨 등록 방법

```javascript
import { registerComponentSkin } from '@withcookie/webbuilder-sdk';

registerComponentSkin({
  id: 'custom-signup',
  name: '커스텀 회원가입',
  componentTypes: ['signup'],  // 지원하는 컴포넌트 타입
  umdUrl: 'https://cdn.example.com/skins/signup-skin.js',
  globalName: 'SignupCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/signup-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '모던한 디자인의 회원가입 폼',
  version: '1.0.0',
  author: 'Your Name'
});
```

## 주의사항

1. **필드 ID 정확성**: 모든 input의 id와 name은 정확히 일치해야 합니다
   - 기본 필드: `user_id`, `password`, `phone`, `name`, `email`, `birthday`, `address`, `referral_code`
   - 특수 필드: `center_code`, `upperer_code`, `left_or_right`, `trxWithdrawAddress`, `bscWithdrawAddress`
   - 커스텀 필드: `var01` ~ `var10`

2. **필수 필드 처리**: required 속성이 true인 필드는 반드시 입력받아야 합니다

3. **회사별 분기**: 회사 ID에 따라 특수 필드가 표시되어야 합니다

4. **추천인 코드**: URL에서 가져온 추천인 코드는 수정할 수 없게 처리해야 합니다

5. **에디터 모드**: 에디터 모드에서는 실제 회원가입이 수행되지 않습니다

6. **유효성 검사**: handleBlur를 사용하여 실시간 유효성 검사를 수행합니다

7. **커스텀 필드**: varFields 설정에 따라 동적으로 필드를 렌더링해야 합니다

8. **다국어 지원**: utils.t() 함수를 사용하여 모든 텍스트를 번역 가능하게 합니다

## 액션 상세 설명

### handleChange
- **용도**: 입력 필드 값 변경 처리
- **매개변수**: `React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>`
- **동작**: 폼 데이터 업데이트

### handleSubmit
- **용도**: 회원가입 폼 제출 처리
- **매개변수**: `React.FormEvent<HTMLFormElement>`
- **동작**: 전체 유효성 검사 후 회원가입 API 호출

### handleBlur
- **용도**: 필드 포커스 아웃 시 유효성 검사
- **매개변수**: `field: string` (필드명)
- **동작**: 해당 필드의 유효성 검사 수행

### handleRadioChange
- **용도**: 라디오 버튼 값 변경 처리
- **매개변수**: `fieldName: string, value: string`
- **동작**: 라디오 버튼 선택값 업데이트

### handleCheckboxChange
- **용도**: 체크박스 값 변경 처리
- **매개변수**: `fieldName: string, label: string, isChecked: boolean`
- **동작**: 체크박스 선택 상태 업데이트

### validateField
- **용도**: 특정 필드의 유효성 검사
- **매개변수**: `id: string, value: string`
- **동작**: 필드별 유효성 규칙에 따라 검사

### validateForm
- **용도**: 전체 폼 유효성 검사
- **반환값**: `boolean` (유효하면 true)
- **동작**: 모든 필드의 유효성을 검사하여 결과 반환

## 스타일링 가이드

### 반응형 디자인
```css
/* 모바일 대응 */
@media (max-width: 768px) {
  .signup-form {
    padding: 15px;
    width: 100%;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
}

/* 태블릿 대응 */
@media (max-width: 1024px) {
  .signup-form {
    max-width: 500px;
    margin: 0 auto;
  }
}
```

### 접근성 고려사항
- 모든 입력 필드에 label 연결
- 필수 필드 시각적 표시 (*)
- 에러 메시지 명확하게 표시
- 키보드 네비게이션 지원
- 적절한 색상 대비

## 성능 최적화 팁

1. **조건부 렌더링**: 표시되지 않는 필드는 렌더링하지 않음
2. **메모이제이션**: React.memo 활용하여 불필요한 리렌더링 방지
3. **이벤트 핸들러**: 인라인 함수 대신 actions 사용
4. **동적 import**: 특수 기능은 필요시에만 로드
5. **폼 상태 최적화**: 필요한 필드만 상태로 관리