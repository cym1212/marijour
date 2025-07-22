# 로그인 스킨 개발 가이드

이 가이드는 웹빌더의 로그인(Login) 컴포넌트를 위한 커스텀 스킨을 개발할 때 데이터를 주고받는 방법을 설명합니다.

## 데이터 구조

### 로그인 폼 데이터 (LoginFormData)

```typescript
interface LoginFormData {
  user_id: string;    // 사용자 ID
  password: string;   // 비밀번호
}
```

### 로그인 유효성 검사 에러 (LoginValidationErrors)

```typescript
interface LoginValidationErrors {
  user_id?: string;    // 아이디 필드 에러 메시지
  password?: string;   // 비밀번호 필드 에러 메시지
  [key: string]: string | undefined;  // 추가 에러 필드
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
    
    // LoginLogic에서 반환된 data 객체의 모든 필드가 직접 포함됨
    formData: LoginFormData;              // 폼 입력 데이터
    validationErrors: LoginValidationErrors;  // 유효성 검사 에러
    loading: boolean;                     // 로딩 상태
    loginSuccess: boolean;                // 로그인 성공 여부
    loginError: string | null;            // 로그인 에러 메시지
    theme: {                              // 테마 설정
      primary?: string;
      primaryDark?: string;
      secondary?: string;
      [key: string]: any;
    };
    withcookieData: any;                  // 위드쿠키 전역 데이터
    isUserLoggedIn: boolean;              // 사용자 로그인 상태
    isAdminLoggedIn: boolean;             // 관리자 로그인 상태
    
    // LoginLogic에서 반환된 기타 데이터
    [key: string]: any;
  };
  
  // LoginLogic에서 반환된 액션들
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;      // 입력 변경 핸들러
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;         // 폼 제출 핸들러
    handleSignupClick: () => void;                                       // 회원가입 클릭 핸들러
  };
  
  // 프로퍼티 패널에서 설정한 옵션들
  options: {
    title?: string;                      // 로그인 제목
    redirectPath?: string;               // 로그인 후 리다이렉트 경로 (우선순위 높음)
    redirectUrl?: string;                // 로그인 후 리다이렉트 URL (호환성)
    backgroundType?: string;             // 배경 타입 ('none', 'image', 'video')
    backgroundUrl?: string;              // 배경 이미지/비디오 URL
    buttonColor?: string;                // 버튼 색상
    titleColor?: string;                 // 제목 색상
    labelColor?: string;                 // 라벨 색상
    inputTextColor?: string;             // 입력 텍스트 색상
    style?: React.CSSProperties;         // 추가 스타일
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

로그인 컴포넌트는 다음과 같은 방식으로 데이터를 받습니다:

1. **Property Panel**: 에디터에서 설정한 UI 옵션값 (options 객체로 전달)
2. **Form State**: 사용자 입력 상태 (data.formData로 전달)
3. **Redux State**: 로그인 상태 및 에러 정보 (data 객체에 병합)
4. **Theme Data**: 테마 색상 정보 (data.theme로 전달)

## 기본 사용 예제

```typescript
import React from 'react';
import { SkinProps } from '@withcookie/webbuilder-sdk';

const MyLoginSkin: React.FC<SkinProps> = ({ 
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
    loginSuccess,
    loginError,
    theme
  } = data;
  
  // 옵션 추출
  const {
    title = t('로그인'),
    redirectPath = '/',  // redirectPath를 우선 사용
    redirectUrl = redirectPath,  // 호환성을 위해 redirectUrl도 지원
    backgroundType = 'image',
    backgroundUrl = '',
    buttonColor,
    titleColor = '#333',
    labelColor = '#333',
    inputTextColor = '#333',
    style = {}
  } = options;
  
  // 액션 사용
  const {
    handleChange,
    handleSubmit,
    handleSignupClick
  } = actions;
  
  // 테마 색상 설정
  const primaryColor = theme?.primary || buttonColor || "#007bff";
  const primaryDarkColor = theme?.primaryDark || shadeColor(primaryColor, -15);
  const secondaryColor = theme?.secondary || "#6c757d";
  
  // 색상을 어둡게 하는 유틸리티 함수
  function shadeColor(color: string, percent: number): string {
    // 색상 변환 로직...
  }
  
  if (loginSuccess) {
    return (
      <div className="login-success">
        <p>{t('로그인 성공! 환영합니다.')}</p>
      </div>
    );
  }
  
  return (
    <div className={cx('login-form', options.className)}>
      <h2 style={{ color: titleColor }}>{title}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* 아이디 입력 필드 */}
        <div className="form-group">
          <label htmlFor="user_id" style={{ color: labelColor }}>
            {t('아이디')}
          </label>
          <input 
            id="user_id" 
            type="text" 
            placeholder={t("아이디 입력 (2~20자)")}
            required 
            className={validationErrors?.user_id ? 'error' : ''}
            style={{ color: inputTextColor }}
            value={formData?.user_id || ''}
            onChange={handleChange}
            minLength={2}
            maxLength={20}
          />
          {validationErrors?.user_id && (
            <div className="error-message">
              {validationErrors.user_id}
            </div>
          )}
        </div>

        {/* 비밀번호 입력 필드 */}
        <div className="form-group">
          <label htmlFor="password" style={{ color: labelColor }}>
            {t('비밀번호')}
          </label>
          <input 
            id="password" 
            type="password" 
            placeholder={t("비밀번호 입력")}
            required 
            className={validationErrors?.password ? 'error' : ''}
            style={{ color: inputTextColor }}
            value={formData?.password || ''}
            onChange={handleChange}
          />
          {validationErrors?.password && (
            <div className="error-message">
              {validationErrors.password}
            </div>
          )}
        </div>

        {/* 로그인 에러 메시지 */}
        {loginError && (
          <div className="login-error">
            {typeof loginError === 'string' ? t(loginError) : JSON.stringify(loginError)}
          </div>
        )}

        {/* 로그인 버튼 */}
        <button 
          type="submit" 
          className="login-button"
          style={{ backgroundColor: primaryColor }}
          disabled={loading}
        >
          {loading ? t('로그인 중...') : t('로그인')}
        </button>
        
        {/* 회원가입 링크 */}
        <a 
          href="/signup" 
          className="signup-link"
          onClick={(e) => {
            e.preventDefault();
            handleSignupClick();
          }}
        >
          {t('회원가입')}
        </a>
      </form>
    </div>
  );
};

export default MyLoginSkin;
```

## 배경 처리

로그인 컴포넌트는 다양한 배경 타입을 지원합니다:

### 배경 타입별 처리

```typescript
// 배경 타입 확인
const shouldRemoveBackground = backgroundType === 'none' || !backgroundUrl;

// 배경 스타일 적용
const containerStyle = {
  width: '100%',
  height: '100vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...style
} as React.CSSProperties;

// 배경 타입별 스타일
if (shouldRemoveBackground) {
  containerStyle.background = 'none';
  containerStyle.backgroundColor = 'transparent';
} else if (backgroundType === 'image' && backgroundUrl) {
  containerStyle.backgroundImage = `url(${backgroundUrl})`;
  containerStyle.backgroundSize = 'cover';
  containerStyle.backgroundPosition = 'center';
  containerStyle.backgroundRepeat = 'no-repeat';
}

// 비디오 배경
{backgroundType === 'video' && backgroundUrl && (
  <video 
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
    autoPlay 
    loop 
    muted
  >
    <source src={backgroundUrl} type="video/mp4" />
  </video>
)}
```

## 폼 데이터 처리

### 입력 필드 핸들링

```typescript
// 입력값 변경 처리
const handleChange = actions.handleChange;

// 입력 필드 예제
<input 
  id="user_id"  // 중요: id는 반드시 'user_id'여야 함
  type="text" 
  value={formData?.user_id || ''}
  onChange={handleChange}
  minLength={2}
  maxLength={20}
/>

<input 
  id="password"  // 중요: id는 반드시 'password'여야 함
  type="password" 
  value={formData?.password || ''}
  onChange={handleChange}
/>
```

### 유효성 검사 에러 표시

```typescript
// 에러가 있는 경우 스타일 변경
const inputClassName = validationErrors?.user_id ? 'input-error' : 'input-normal';

// 에러 메시지 표시
{validationErrors?.user_id && (
  <span className="error-text">
    {validationErrors.user_id}
  </span>
)}
```

## 회사별 특수 처리

특정 회사의 경우 로고를 표시하거나 다른 리다이렉트 경로를 사용합니다:

```typescript
// 회사 정보 확인
const companyId = app?.company?.id || data?.withcookieData?.skin?.company?.id;
const skinId = data?.withcookieData?.skin?.id;

// 특정 회사 로고 표시
const showLogo = (companyId === 24 || companyId === 26 || companyId === 27 || skinId === 317);
const logoUrl = data?.withcookieData?.skin?.androidAppIconImage;

{showLogo && logoUrl ? (
  <img 
    src={logoUrl} 
    alt="logo" 
    style={{ maxWidth: '300px', objectFit: 'contain' }} 
  />
) : (
  <h2>{title}</h2>
)}

// 모바일 리다이렉트 처리 (LoginLogic에서 자동 처리됨)
// 회사 ID 24, 26: /finapp으로 리다이렉트
// 회사 ID 27, 28: /gpc로 리다이렉트
```

## 테마 색상 활용

```typescript
// 테마 색상 추출
const theme = data.theme || {};
const primaryColor = theme.primary || options.buttonColor || "#007bff";
const primaryDarkColor = theme.primaryDark || shadeColor(primaryColor, -15);
const secondaryColor = theme.secondary || "#6c757d";

// 버튼 호버 효과
<button 
  style={{
    backgroundColor: loading ? secondaryColor : primaryColor,
    transition: 'all 0.2s ease'
  }}
  onMouseOver={(e) => {
    if (!loading) {
      e.currentTarget.style.backgroundColor = primaryDarkColor;
    }
  }}
  onMouseOut={(e) => {
    if (!loading) {
      e.currentTarget.style.backgroundColor = primaryColor;
    }
  }}
>
  {loading ? t('로그인 중...') : t('로그인')}
</button>
```

## 외부 스킨 개발 및 배포

### 1. UMD 번들 빌드 설정

외부 스킨은 UMD(Universal Module Definition) 형식으로 빌드되어야 합니다:

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'login-skin.js',
    library: 'LoginCustomSkin',  // 전역 변수명
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

#### 수동 등록 (Manual Registration)
```javascript
// 애플리케이션 초기화 시
import { registerComponentSkin } from '@withcookie/webbuilder-sdk';

registerComponentSkin({
  id: 'custom-login',
  name: '커스텀 로그인',
  componentTypes: ['login'],  // 지원하는 컴포넌트 타입
  umdUrl: 'https://cdn.example.com/skins/login-skin.js',
  globalName: 'LoginCustomSkin',
  cssUrls: ['https://cdn.example.com/skins/login-skin.css'],
  preview: 'https://cdn.example.com/skins/preview.png',
  description: '모던한 디자인의 로그인 폼',
  version: '1.0.0',
  author: 'Your Name'
});
```

#### API 기반 자동 등록
위드쿠키 스킨 마켓플레이스에 등록하면 자동으로 사용 가능합니다.

### 3. 전역 변수 충돌 방지

API 기반 스킨의 경우 자동으로 전역 변수 충돌을 방지합니다:
- 각 스킨은 고유한 전역 변수명으로 로드됩니다
- 로드 후 원본 전역 변수는 자동으로 정리됩니다

## 주의사항

1. **입력 필드 ID**: `user_id`와 `password` ID는 정확히 일치해야 합니다
2. **리다이렉트 경로**: `redirectPath`가 `redirectUrl`보다 우선순위가 높습니다
3. **에디터 모드**: 에디터 모드에서는 실제 로그인이 수행되지 않습니다
4. **로그인 상태**: 이미 로그인된 경우 자동으로 리다이렉트됩니다
5. **모바일 대응**: 특정 회사의 경우 모바일에서 다른 경로로 리다이렉트됩니다
6. **다국어 지원**: utils.t() 함수를 사용하여 모든 텍스트 번역
7. **테마 통합**: 테마 색상을 우선 사용하고, 없으면 옵션값 사용
8. **폼 제출**: handleSubmit을 사용하여 일관된 로그인 처리

## 액션 상세 설명

### handleChange
- **용도**: 입력 필드 값 변경 처리
- **매개변수**: `React.ChangeEvent<HTMLInputElement>`
- **동작**: 폼 데이터 업데이트 및 실시간 유효성 검사

### handleSubmit
- **용도**: 로그인 폼 제출 처리
- **매개변수**: `React.FormEvent<HTMLFormElement>`
- **동작**: 유효성 검사 후 로그인 API 호출

### handleSignupClick
- **용도**: 회원가입 페이지로 이동
- **매개변수**: 없음
- **동작**: `/signup` 경로로 네비게이션

## 스타일링 가이드

### 반응형 디자인
```css
/* 모바일 대응 */
@media (max-width: 768px) {
  .login-form {
    padding: 20px;
    width: 100%;
  }
}

/* 태블릿 대응 */
@media (max-width: 1024px) {
  .login-form {
    max-width: 400px;
  }
}
```

### 접근성 고려사항
- 라벨과 입력 필드 연결 (`htmlFor` 사용)
- 에러 메시지 명확하게 표시
- 키보드 네비게이션 지원
- 적절한 색상 대비

## 성능 최적화 팁

1. **조건부 렌더링**: 로그인 성공 시 불필요한 폼 렌더링 방지
2. **메모이제이션**: React.memo 활용하여 불필요한 리렌더링 방지
3. **이벤트 핸들러**: 인라인 함수 대신 actions 사용
4. **스타일 최적화**: 정적 스타일은 CSS 파일로 분리