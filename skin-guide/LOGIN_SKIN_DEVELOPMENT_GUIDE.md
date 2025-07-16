# 외부 로그인 스킨 개발 가이드

## 목차
1. [개요](#개요)
2. [시작하기](#시작하기)
3. [기본 스킨 템플릿](#기본-스킨-템플릿)
4. [Props 상세 설명](#props-상세-설명)
5. [스타일링 가이드](#스타일링-가이드)
6. [빌드 및 배포](#빌드-및-배포)
7. [테스트 방법](#테스트-방법)
8. [실전 예제](#실전-예제)
9. [속성 패널에서 스킨 선택하기](#속성-패널에서-스킨-선택하기)
10. [주의사항 및 팁](#주의사항-및-팁)

## 개요

WithCookie WebBuilder의 로그인 컴포넌트는 외부 스킨을 지원합니다. 이를 통해 개발자는 자신만의 독특한 로그인 UI를 만들어 적용할 수 있습니다. 이 가이드는 외부 로그인 스킨을 개발하는 전체 과정을 상세히 설명합니다.

### 외부 스킨의 장점
- **커스터마이징**: 프로젝트에 맞는 고유한 디자인 적용
- **재사용성**: 한 번 만든 스킨을 여러 프로젝트에서 사용
- **독립적 개발**: WithCookie 코드 수정 없이 별도 개발
- **쉬운 배포**: CDN을 통한 간편한 배포 및 업데이트

## 시작하기

### 1. 프로젝트 생성

```bash
# 프로젝트 디렉토리 생성
mkdir my-login-skin
cd my-login-skin

# package.json 초기화
npm init -y

# 필요한 패키지 설치
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-react
```

### 2. 프로젝트 구조

```
my-login-skin/
├── src/
│   └── index.jsx        # 메인 스킨 컴포넌트
├── dist/               # 빌드 결과물
├── package.json
├── webpack.config.js
├── .babelrc
└── README.md
```

### 3. 설정 파일

**.babelrc**
```json
{
  "presets": ["@babel/preset-react"]
}
```

**webpack.config.js**
```javascript
const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-login-skin.umd.js',
    library: 'MyCustomLoginSkin',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
```

**package.json (scripts 추가)**
```json
{
  "name": "my-login-skin",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch",
    "serve": "npx http-server dist -p 3001 --cors"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-react": "^7.18.0",
    "babel-loader": "^9.1.0",
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.0"
  }
}
```

## 기본 스킨 템플릿

### JavaScript 파일 (src/index.jsx)

웹빌더 속성 패널의 모든 옵션을 활용하는 완전한 템플릿입니다:

```jsx
import React from 'react';

const MyCustomLoginSkin = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils,
  app,
  editor 
}) => {
  // 유틸리티 함수
  const { t, cx, navigate, formatCurrency, formatDate, getAssetUrl } = utils;
  
  // 로그인 로직에서 제공하는 데이터
  const { 
    formData,          // { user_id: '', password: '' }
    validationErrors,  // { user_id?: string, password?: string }
    loading,           // boolean
    loginSuccess,      // boolean
    loginError,        // string | null
    theme             // 테마 정보
  } = data;
  
  // 로그인 로직에서 제공하는 액션
  const {
    handleChange,      // input 변경 핸들러
    handleSubmit,      // 폼 제출 핸들러
    handleSignupClick  // 회원가입 클릭 핸들러
  } = actions;
  
  // 사용자가 설정한 옵션
  const {
    title = t('로그인'),
    redirectPath = '/',
    backgroundType = 'image',
    backgroundUrl = '',
    buttonColor = '#007bff',
    titleColor = '#333',
    labelColor = '#333',
    inputTextColor = '#333'
  } = options;
  
  // 스타일 정의
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundImage: backgroundType === 'image' && backgroundUrl ? `url(${backgroundUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: backgroundUrl ? 'transparent' : '#f5f5f5'
  };

  const formStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%'
  };

  const titleStyle = {
    textAlign: 'center',
    color: titleColor,
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: labelColor,
    fontSize: '14px',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    color: inputTextColor,
    backgroundColor: '#fff',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const errorStyle = {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '5px',
    display: 'block'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: buttonColor,
    border: 'none',
    borderRadius: '6px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.2s',
    marginTop: '10px'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: buttonColor,
    border: `2px solid ${buttonColor}`
  };

  const successStyle = {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '6px',
    fontSize: '16px'
  };

  const errorMessageStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px'
  };
  
  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={titleStyle}>{title}</h2>
        
        {loginSuccess ? (
          <div style={successStyle}>
            <p>{t('로그인 성공! 환영합니다.')}</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              {t('잠시 후 페이지가 이동됩니다...')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 전체 에러 메시지 */}
            {loginError && (
              <div style={errorMessageStyle}>
                {t(loginError)}
              </div>
            )}
            
            {/* 아이디 입력 */}
            <div style={formGroupStyle}>
              <label htmlFor="user_id" style={labelStyle}>
                {t('아이디')}
              </label>
              <input 
                id="user_id" 
                type="text" 
                value={formData?.user_id || ''}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors?.user_id ? '#dc3545' : '#ddd'
                }}
                placeholder={t("아이디를 입력하세요")}
                required
                autoComplete="username"
              />
              {validationErrors?.user_id && (
                <span style={errorStyle}>{validationErrors.user_id}</span>
              )}
            </div>
            
            {/* 비밀번호 입력 */}
            <div style={formGroupStyle}>
              <label htmlFor="password" style={labelStyle}>
                {t('비밀번호')}
              </label>
              <input 
                id="password" 
                type="password" 
                value={formData?.password || ''}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  borderColor: validationErrors?.password ? '#dc3545' : '#ddd'
                }}
                placeholder={t("비밀번호를 입력하세요")}
                required
                autoComplete="current-password"
              />
              {validationErrors?.password && (
                <span style={errorStyle}>{validationErrors.password}</span>
              )}
            </div>
            
            {/* 로그인 버튼 */}
            <button 
              type="submit" 
              disabled={loading}
              style={buttonStyle}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? t('로그인 중...') : t('로그인')}
            </button>
            
            {/* 회원가입 버튼 */}
            <button 
              type="button"
              onClick={handleSignupClick}
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = buttonColor;
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = buttonColor;
              }}
            >
              {t('회원가입')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// UMD 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyCustomLoginSkin;
} else {
  window.MyCustomLoginSkin = MyCustomLoginSkin;
}
```

## 웹빌더 속성 패널 연동

### 로그인 컴포넌트 속성 패널에서 설정 가능한 옵션들

웹빌더 에디터에서 로그인 컴포넌트를 선택하면 우측 속성 패널에서 다음 옵션들을 실시간으로 설정할 수 있습니다:

#### 기본 설정
- **제목**: 로그인 폼 상단에 표시될 제목 텍스트
- **로그인 후 이동 경로**: 로그인 성공 후 리다이렉트될 페이지 경로

#### 배경 설정  
- **배경 타입**: 없음 / 이미지 / 비디오 선택
- **배경 URL**: 배경으로 사용할 이미지 또는 비디오 파일의 URL

#### 색상 설정
- **버튼 색상**: 로그인 버튼의 배경색 (색상 선택기 제공)
- **제목 색상**: 폼 제목 텍스트 색상
- **레이블 색상**: 입력 필드 레이블 텍스트 색상  
- **입력 텍스트 색상**: 입력 필드 내 텍스트 색상

#### 스킨 설정
- **컴포넌트 스킨**: 기본 스킨 또는 등록된 외부 스킨 선택

### 실시간 옵션 반영 메커니즘

#### 데이터 흐름
```
속성 패널에서 옵션 변경
        ↓
ComponentProps 업데이트 
        ↓
ComponentRenderer가 새로운 props로 리렌더링
        ↓  
스킨 컴포넌트가 변경된 options로 즉시 업데이트
```

#### 구현 원리
```jsx
// 1. 속성 패널에서 옵션 변경 시 (LoginProperties.js)
const handleColorChange = (key, color) => {
  handleComponentPropsChange(key, color);
  // 즉시 프리뷰에 반영됨
};

// 2. 스킨에서 실시간으로 받는 방식
const MyLoginSkin = ({ options }) => {
  const {
    title = '로그인',
    buttonColor = '#007bff',
    titleColor = '#333333'
    // ... 기타 옵션들
  } = options;
  
  // options가 변경되면 React가 자동으로 리렌더링
  return (
    <div>
      <h2 style={{ color: titleColor }}>{title}</h2>
      <button style={{ backgroundColor: buttonColor }}>
        로그인
      </button>
    </div>
  );
};
```

### 속성 패널 ↔ options 완전 매핑표

| 속성 패널 필드명 | options 키 | UI 타입 | 기본값 | 설명 |
|---|---|---|---|---|
| 제목 | `title` | 텍스트 입력 | '로그인' | 폼 상단 제목 텍스트 |
| 로그인 후 이동 경로 | `redirectPath` | 텍스트 입력 | '/' | 성공 시 리다이렉트 경로 |
| 배경 타입 | `backgroundType` | 드롭다운 | 'image' | none/image/video |
| 배경 URL | `backgroundUrl` | 텍스트 입력 | '' | 배경 파일 URL |
| 버튼 색상 | `buttonColor` | 색상 선택기 | '#007bff' | 로그인 버튼 배경색 |
| 제목 색상 | `titleColor` | 색상 입력 | '#333333' | 제목 텍스트 색상 |
| 레이블 색상 | `labelColor` | 색상 입력 | '#333333' | 필드 레이블 색상 |
| 입력 텍스트 색상 | `inputTextColor` | 색상 입력 | '#333333' | 입력 필드 텍스트 색상 |
| 컴포넌트 스킨 | `skin` | SkinSelector | 'basic' | 사용할 스킨 ID |

### 실시간 미리보기 활용법

#### 1. 색상 테스트
- 색상 선택기에서 색상을 클릭하면 즉시 프리뷰에 반영
- 여러 색상을 빠르게 테스트하여 최적의 조합 찾기

#### 2. 배경 설정 테스트  
- 배경 타입을 변경하여 다양한 스타일 확인
- 배경 URL 입력 후 즉시 결과 확인

#### 3. 텍스트 커스터마이징
- 제목 텍스트 변경 시 실시간으로 반영
- 다국어 텍스트 테스트 가능

#### 4. 개발 워크플로우
```bash
# 1. 로컬에서 스킨 개발
npm run dev

# 2. 웹빌더에서 스킨 등록
registerComponentSkin({
  id: 'my-custom-login-dev',
  umdUrl: 'http://localhost:3001/my-login-skin.umd.js',
  // ...
});

# 3. 속성 패널에서 실시간 테스트
# - 색상 변경
# - 텍스트 수정  
# - 배경 설정
# 모든 변경사항이 즉시 반영됨

# 4. 최종 빌드 및 배포
npm run build
```

## Props 상세 설명

### data 객체

| 속성 | 타입 | 설명 |
|------|------|------|
| `formData` | `{ user_id: string, password: string }` | 현재 입력된 폼 데이터 |
| `validationErrors` | `{ user_id?: string, password?: string }` | 필드별 유효성 검사 오류 메시지 |
| `loading` | `boolean` | 로그인 요청 진행 중 여부 |
| `loginSuccess` | `boolean` | 로그인 성공 여부 |
| `loginError` | `string \| null` | 로그인 실패 시 에러 메시지 |
| `theme` | `object` | 현재 적용된 테마 정보 |

### actions 객체

| 함수 | 설명 | 사용법 |
|------|------|--------|
| `handleChange` | input 값 변경 처리 | `onChange={handleChange}` (input의 id 속성 필수) |
| `handleSubmit` | 폼 제출 처리 | `onSubmit={handleSubmit}` |
| `handleSignupClick` | 회원가입 페이지 이동 | `onClick={handleSignupClick}` |

### options 객체

속성 패널에서 설정한 모든 옵션이 `options` 객체를 통해 스킨으로 전달됩니다:

| 속성 | 타입 | 기본값 | 설명 | 웹빌더 설정 위치 |
|------|------|--------|------|------------------|
| `title` | `string` | '로그인' | 로그인 폼 제목 | 기본 설정 → 제목 |
| `redirectPath` | `string` | '/' | 로그인 후 이동할 경로 | 기본 설정 → 로그인 후 이동 경로 |
| `backgroundType` | `'none' \| 'image' \| 'video'` | 'image' | 배경 타입 | 배경 설정 → 배경 타입 |
| `backgroundUrl` | `string` | '' | 배경 이미지/비디오 URL | 배경 설정 → 배경 URL |
| `buttonColor` | `string` | '#007bff' | 로그인 버튼 배경색 | 색상 설정 → 버튼 색상 |
| `titleColor` | `string` | '#333333' | 제목 텍스트 색상 | 색상 설정 → 제목 색상 |
| `labelColor` | `string` | '#333333' | 입력 필드 레이블 색상 | 색상 설정 → 레이블 색상 |
| `inputTextColor` | `string` | '#333333' | 입력 필드 텍스트 색상 | 색상 설정 → 입력 텍스트 색상 |

#### options 사용 모범 사례

```jsx
const MyLoginSkin = ({ data, actions, options, utils }) => {
  // ✅ 모든 옵션에 기본값 설정
  const {
    title = '로그인',
    redirectPath = '/',
    backgroundType = 'image',
    backgroundUrl = '',
    buttonColor = '#007bff',
    titleColor = '#333333',
    labelColor = '#333333',
    inputTextColor = '#333333'
  } = options;
  
  // ✅ 배경 타입에 따른 조건부 스타일링
  const backgroundStyle = {
    none: {},
    image: backgroundUrl ? {
      backgroundImage: `url(${backgroundUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {},
    video: {} // 비디오 배경 처리 로직
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      ...backgroundStyle[backgroundType]
    }}>
      <h2 style={{ color: titleColor }}>{title}</h2>
      {/* 나머지 컴포넌트 */}
    </div>
  );
};
```

#### 호환성 옵션

다음 옵션들은 기존 버전과의 호환성을 위해 지원됩니다:

| 기존 옵션 | 새로운 옵션 | 우선순위 |
|-----------|-------------|----------|
| `redirectUrl` | `redirectPath` | `redirectPath` 우선 |

```jsx
// ✅ 호환성을 고려한 안전한 방식
const redirectTarget = redirectPath || redirectUrl || '/';
```

### utils 객체

| 함수 | 설명 | 예시 |
|------|------|------|
| `t(key)` | 다국어 번역 | `t('로그인')` |
| `cx(...classes)` | 클래스명 조합 | `cx('base', isActive && 'active')` |
| `navigate(path)` | 페이지 이동 | `navigate('/dashboard')` |
| `formatCurrency(amount)` | 통화 포맷 | `formatCurrency(10000)` |
| `formatDate(date)` | 날짜 포맷 | `formatDate(new Date())` |
| `getAssetUrl(path)` | 에셋 URL 생성 | `getAssetUrl('/images/logo.png')` |

### 기타 Props

| 속성 | 타입 | 설명 |
|------|------|------|
| `mode` | `'editor' \| 'preview' \| 'production'` | 현재 렌더링 모드 |
| `app` | `object` | 앱 전역 정보 (user, company 등) |
| `editor` | `object` | 에디터 모드에서만 제공되는 추가 정보 |

## 스타일링 가이드

### 1. 인라인 스타일 사용

```jsx
const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: buttonColor,
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

<button style={buttonStyle}>로그인</button>
```

### 2. CSS 파일 분리 (권장)

CSS는 별도 파일로 분리하여 관리하는 것이 좋습니다. WithCookie는 `cssUrls`를 통해 CSS 파일을 자동으로 로드합니다.

**dist/my-login-skin.css**
```css
.my-custom-login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-size: cover;
  background-position: center;
}

.my-custom-login-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.my-custom-login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
}

.my-custom-login-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.my-custom-login-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.my-custom-login-button {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
}

.my-custom-login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.my-custom-login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .my-custom-login-form {
    padding: 30px 20px;
    margin: 0 20px;
  }
}
```

**스킨 등록 시 CSS 파일 포함**
```javascript
registerComponentSkin({
  id: 'my-custom-login',
  name: '나의 커스텀 로그인',
  componentTypes: ['login'],
  umdUrl: 'https://cdn.example.com/my-login-skin.umd.js',
  cssUrls: [
    'https://cdn.example.com/my-login-skin.css'  // CSS 파일 추가
  ],
  globalName: 'MyCustomLoginSkin'
});
```

### 3. 반응형 디자인

```jsx
const containerStyle = {
  padding: '20px',
  '@media (min-width: 768px)': {
    padding: '40px'
  }
};

// 또는 동적 스타일
const isMobile = window.innerWidth < 768;
const formStyle = {
  padding: isMobile ? '20px' : '40px',
  maxWidth: isMobile ? '100%' : '400px'
};
```

## 빌드 및 배포

### 1. 개발 모드

```bash
# 파일 변경 감지 및 자동 빌드
npm run dev

# 별도 터미널에서 로컬 서버 실행
npm run serve
```

### 2. 프로덕션 빌드

```bash
npm run build
```

### 3. 배포 옵션

#### GitHub Pages
```bash
# gh-pages 설치
npm install --save-dev gh-pages

# package.json에 스크립트 추가
"deploy": "gh-pages -d dist"

# 배포
npm run deploy
```

#### AWS S3
```bash
# AWS CLI 사용
aws s3 cp dist/my-login-skin.umd.js s3://my-bucket/skins/ --acl public-read
aws s3 cp dist/my-login-skin.css s3://my-bucket/skins/ --acl public-read
```

#### CDN (jsDelivr + GitHub)
```
# JavaScript 파일
https://cdn.jsdelivr.net/gh/username/repo@version/dist/my-login-skin.umd.js

# CSS 파일
https://cdn.jsdelivr.net/gh/username/repo@version/dist/my-login-skin.css
```

### 4. CORS 설정

외부 스킨 호스팅 시 CORS 헤더 설정 필요:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

## 테스트 방법

### 1. 로컬 테스트

```javascript
// 개발 환경에서 테스트용 등록
import { registerComponentSkin } from '@withcookie/webbuilder';

if (process.env.NODE_ENV === 'development') {
  registerComponentSkin({
    id: 'my-custom-login-dev',
    name: '개발용: 나의 커스텀 로그인',
    componentTypes: ['login'],
    umdUrl: 'http://localhost:3001/my-login-skin.umd.js',
    cssUrls: ['http://localhost:3001/my-login-skin.css'],  // CSS 파일도 포함
    globalName: 'MyCustomLoginSkin'
  });
}
```

### 2. 브라우저 콘솔 확인

```javascript
// 스킨이 로드되었는지 확인
console.log(window.MyCustomLoginSkin);

// Props 구조 확인
const TestSkin = (props) => {
  console.log('Props:', props);
  return window.MyCustomLoginSkin(props);
};
```

### 3. 에러 디버깅

```jsx
// 개발 중 디버깅을 위한 로그
const MyCustomLoginSkin = (props) => {
  console.log('Received props:', props);
  console.log('Form data:', props.data.formData);
  console.log('Options:', props.options);
  
  // ... 나머지 코드
};
```

## 실전 예제

### 1. 글래스모피즘 로그인

```jsx
const GlassmorphismLogin = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { formData, loading, loginError } = data;
  const { handleSubmit, handleChange } = actions;
  
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  
  const formStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
  };
  
  // ... 컴포넌트 구현
};
```

### 2. 미니멀 로그인

```jsx
const MinimalLogin = ({ data, actions, options, utils }) => {
  const { t } = utils;
  
  const formStyle = {
    maxWidth: '320px',
    margin: '0 auto',
    padding: '60px 20px'
  };
  
  const inputStyle = {
    width: '100%',
    padding: '16px 0',
    fontSize: '16px',
    border: 'none',
    borderBottom: '2px solid #e0e0e0',
    background: 'transparent',
    outline: 'none',
    transition: 'border-color 0.3s'
  };
  
  // ... 컴포넌트 구현
};
```

### 3. 다크 테마 로그인

```jsx
const DarkThemeLogin = ({ data, actions, options, utils }) => {
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#ffffff'
  };
  
  const formStyle = {
    backgroundColor: '#2d2d2d',
    border: '1px solid #404040',
    borderRadius: '12px',
    padding: '40px'
  };
  
  const inputStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #404040',
    color: '#ffffff'
  };
  
  // ... 컴포넌트 구현
};
```

## 속성 패널에서 스킨 선택하기

WithCookie WebBuilder는 에디터의 속성 패널에서 손쉽게 스킨을 선택할 수 있는 UI를 제공합니다.

### 스킨 선택 UI

로그인 컴포넌트를 선택하면 속성 패널 상단에 "컴포넌트 스킨" 섹션이 표시됩니다:

```
┌─────────────────────────────────┐
│ 🛡️ 컴포넌트 스킨                │
├─────────────────────────────────┤
│ [기본 스킨          ▼]         │
│                                 │
│ 사용 가능한 스킨:              │
│ • 기본 스킨                    │
│ • 나의 커스텀 로그인           │
│ • 글래스모피즘 로그인          │
│                                 │
│ [🛒 더 많은 스킨 구매하기]      │
└─────────────────────────────────┘
```

### 구현 방식

WithCookie는 공통 스킨 선택 컴포넌트인 `SkinSelector`를 제공합니다:

```jsx
// LoginProperties.js에서 사용 예시
import { SkinSelector } from '../CommonProperties';

const LoginProperties = () => {
  // ... 기타 코드
  
  return (
    <>
      {/* 스킨 선택 UI - 공통 컴포넌트 사용 */}
      <SkinSelector 
        selectedComponent={selectedComponent}
        onSkinChange={(skinId) => handleComponentPropsChange('skin', skinId)}
      />
      
      {/* 나머지 속성 설정 UI */}
    </>
  );
};
```

### SkinSelector 컴포넌트 특징

1. **자동 스킨 감지**: 컴포넌트 타입에 따라 사용 가능한 스킨을 자동으로 감지
2. **내장/외부 스킨 통합**: 기본 스킨과 외부 스킨을 하나의 목록으로 표시
3. **실시간 미리보기**: 스킨 선택 시 즉시 컴포넌트에 반영
4. **스킨 구매 버튼**: 추가 스킨을 구매할 수 있는 링크 제공

### 스킨 선택 작동 방식

1. **스킨 목록 로드**
   ```javascript
   // 내장 스킨 (기본값)
   const skins = [{ id: 'basic', name: '기본 스킨' }];
   
   // 외부 스킨 추가
   const externalSkins = getSkinsForComponent(componentType);
   skins.push(...externalSkins);
   ```

2. **스킨 변경 처리**
   ```javascript
   onSkinChange={(skinId) => {
     // componentProps에 스킨 ID 저장
     handleComponentPropsChange('skin', skinId);
   });
   ```

3. **스킨 적용**
   - 선택된 스킨 ID는 `componentProps.skin`에 저장
   - 컴포넌트 렌더링 시 해당 스킨을 로드하여 적용

### 개발자를 위한 팁

1. **스킨 지원 확인**: `isSkinnableComponent()` 함수로 컴포넌트의 스킨 지원 여부 확인
2. **스킨 ID 관리**: 스킨 ID는 고유해야 하며, 'basic'은 예약된 ID
3. **스킨 로드 디버깅**: 콘솔에서 `[SkinSelector]` 로그로 스킨 로드 과정 확인 가능

### 회원가입 컴포넌트도 동일하게 지원

회원가입(Signup) 컴포넌트도 동일한 방식으로 스킨 선택을 지원합니다:

```jsx
// SignupProperties.js
<SkinSelector 
  selectedComponent={selectedComponent}
  onSkinChange={(skinId) => handleComponentPropsChange('skin', skinId)}
/>
```

이를 통해 로그인과 회원가입 컴포넌트의 일관된 디자인을 쉽게 유지할 수 있습니다.

## 주의사항 및 팁

### 필수 요구사항

1. **input ID 속성**: 반드시 `user_id`와 `password` 사용
   ```jsx
   <input id="user_id" ... />
   <input id="password" ... />
   ```

2. **이벤트 핸들러**: 제공된 핸들러 사용
   ```jsx
   <form onSubmit={handleSubmit}>
     <input onChange={handleChange} />
   </form>
   ```

3. **로딩 상태 처리**: 버튼 비활성화
   ```jsx
   <button disabled={loading}>
     {loading ? '로그인 중...' : '로그인'}
   </button>
   ```

### 성능 최적화

1. **조건부 렌더링**: 불필요한 렌더링 방지
   ```jsx
   {loginError && <div>{loginError}</div>}
   ```

2. **스타일 객체 캐싱**: 컴포넌트 외부에 정의
   ```jsx
   const styles = {
     container: { ... },
     form: { ... }
   };
   
   const MyLoginSkin = (props) => {
     return <div style={styles.container}>...</div>;
   };
   ```

3. **이미지 최적화**: 적절한 크기와 포맷 사용
   ```jsx
   backgroundImage: `url(${optimizedImageUrl})`
   ```

### 접근성 고려

1. **레이블 연결**: for 속성 또는 중첩 사용
   ```jsx
   <label htmlFor="user_id">아이디</label>
   <input id="user_id" />
   ```

2. **ARIA 속성**: 스크린 리더 지원
   ```jsx
   <button aria-label="로그인" aria-busy={loading}>
   ```

3. **키보드 네비게이션**: 탭 순서 고려
   ```jsx
   <input tabIndex={1} />
   <input tabIndex={2} />
   <button tabIndex={3} />
   ```

### 보안 고려사항

1. **XSS 방지**: 사용자 입력 직접 렌더링 금지
2. **HTTPS 사용**: 스킨 파일 호스팅 시 SSL 인증서 사용
3. **입력 검증**: 클라이언트 측 기본 검증 구현

### 다국어 지원

```jsx
// 항상 t() 함수 사용
<label>{t('아이디')}</label>
<button>{t('로그인')}</button>

// 동적 메시지
<div>{t(loginError)}</div>
```

### 브라우저 호환성

1. **CSS 프리픽스**: 구형 브라우저 지원
   ```jsx
   style={{
     display: '-webkit-box',
     display: '-ms-flexbox',
     display: 'flex'
   }}
   ```

2. **폴리필**: 필요시 포함
3. **기능 감지**: 지원하지 않는 기능 대체

## 문제 해결

### 스킨이 로드되지 않을 때

1. 브라우저 개발자 도구 > Network 탭 확인
2. CORS 에러 확인
3. 전역 변수명 확인: `window.MyCustomLoginSkin`
4. UMD 빌드 설정 확인

### 스타일이 적용되지 않을 때

1. CSS 우선순위 확인
2. 인라인 스타일 사용 고려
3. !important 사용 (최후의 수단)

### Props가 undefined일 때

1. 컴포넌트 등록 시 globalName 확인
2. 빌드 설정의 library 이름 확인
3. 개발자 도구에서 props 로깅

## 결론

이 가이드를 따라 자신만의 독특한 로그인 스킨을 만들 수 있습니다. 기본 템플릿을 시작으로 점진적으로 커스터마이징하며, 테스트를 통해 안정성을 확보하세요. 

추가 지원이 필요하면 WithCookie 개발팀에 문의하거나 [공식 문서](https://docs.withcookie.com)를 참고하세요.

---

**버전**: 1.0.0  
**최종 업데이트**: 2024년 1월  
**작성자**: WithCookie 개발팀