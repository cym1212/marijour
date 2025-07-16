# 외부 회원가입 스킨 개발 가이드

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

WithCookie WebBuilder의 회원가입 컴포넌트는 외부 스킨을 지원합니다. 이를 통해 개발자는 자신만의 독특한 회원가입 UI를 만들어 적용할 수 있습니다. 이 가이드는 외부 회원가입 스킨을 개발하는 전체 과정을 상세히 설명합니다.

### 외부 스킨의 장점
- **커스터마이징**: 프로젝트에 맞는 고유한 디자인 적용
- **재사용성**: 한 번 만든 스킨을 여러 프로젝트에서 사용
- **독립적 개발**: WithCookie 코드 수정 없이 별도 개발
- **쉬운 배포**: CDN을 통한 간편한 배포 및 업데이트

### 회원가입 컴포넌트의 특징
- 다양한 필드 타입 지원 (기본 필드, 커스텀 필드, 특수 필드)
- 실시간 유효성 검사
- 조건부 필드 표시
- 회사별 맞춤 설정 지원

## 시작하기

### 1. 프로젝트 생성

```bash
# 프로젝트 디렉토리 생성
mkdir my-signup-skin
cd my-signup-skin

# package.json 초기화
npm init -y

# 필요한 패키지 설치
npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-react
```

### 2. 프로젝트 구조

```
my-signup-skin/
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
    filename: 'my-signup-skin.umd.js',
    library: 'MyCustomSignupSkin',
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
  "name": "my-signup-skin",
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

웹빌더 속성 패널의 모든 옵션을 활용하고, 기본 스킨과 동일한 디자인을 구현한 완전한 템플릿입니다:

```jsx
import React from 'react';

const MyCustomSignupSkin = ({ 
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
  
  // 회원가입 로직에서 제공하는 데이터
  const { 
    formData,          // 폼 데이터 객체
    validationErrors,  // 유효성 검사 오류
    loading,           // 로딩 상태
    signUpSuccess,     // 회원가입 성공 여부
    signUpError,       // 회원가입 오류
    isSpecifiedLegPolicy, // SPECIFIED 정책 사용 여부
    policies,          // 정책 데이터
    companyId,         // 회사 ID
    theme,             // 테마 정보
    basicFields,       // 기본 필드 표시 설정
    varFields          // 커스텀 필드 설정
  } = data;
  
  // 회원가입 로직에서 제공하는 액션
  const {
    handleChange,       // input 변경 핸들러
    handleSubmit,       // 폼 제출 핸들러
    handleBlur,         // 포커스 아웃 핸들러
    handleRadioChange,  // 라디오 버튼 변경
    handleCheckboxChange, // 체크박스 변경
    validateField,      // 필드 유효성 검사
    validateForm        // 전체 폼 유효성 검사
  } = actions;
  
  // 속성 패널에서 설정한 옵션
  const {
    title = t('회원가입'),
    referralCode: defaultReferralCode,
    // 스타일 옵션
    backgroundColor = '#ffffff',
    borderRadius = '10px',
    boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth = '1200px',
    margin = '0 auto'
  } = options;
  
  // 특수 회사 ID 체크 (지갑 주소 필드용)
  const isSpecialCompany = companyId === 190 || companyId === 290;
  
  // 컨테이너 스타일
  const containerStyle = {
    backgroundColor,
    borderRadius,
    boxShadow,
    maxWidth,
    margin,
    padding: '30px'
  };
  
  // 그리드 레이아웃 스타일
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  };
  
  // 필드 렌더링 함수
  const renderField = (fieldId, label, type = 'text', required = false, options = []) => {
    const hasError = validationErrors && validationErrors[fieldId];
    
    // 특수 필드 타입 처리
    if (type === 'account') {
      return (
        <div className="signup-form-group">
          <label htmlFor={fieldId}>
            {label} {required && <span className="required">*</span>}
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select 
              id={`${fieldId}_bank`}
              name={`${fieldId}_bank`}
              value={formData[`${fieldId}_bank`] || ''}
              onChange={handleChange}
              style={{ flex: 1 }}
            >
              <option value="">은행 선택</option>
              <option value="004">KB국민은행</option>
              <option value="088">신한은행</option>
              <option value="020">우리은행</option>
              <option value="081">하나은행</option>
              <option value="089">케이뱅크</option>
              <option value="090">카카오뱅크</option>
              <option value="092">토스뱅크</option>
            </select>
            <input
              id={fieldId}
              name={fieldId}
              type="text"
              placeholder="계좌번호"
              value={formData[fieldId] || ''}
              onChange={handleChange}
              onBlur={() => handleBlur(fieldId)}
              style={{ flex: 2 }}
            />
          </div>
          {hasError && <span className="error-message">{hasError}</span>}
        </div>
      );
    }
    
    if (type === 'ssn') {
      return (
        <div className="signup-form-group">
          <label htmlFor={fieldId}>
            {label} {required && <span className="required">*</span>}
          </label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              id={`${fieldId}_front`}
              name={`${fieldId}_front`}
              type="text"
              placeholder="앞자리"
              maxLength="6"
              value={formData[`${fieldId}_front`] || ''}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
            <span>-</span>
            <input
              id={fieldId}
              name={fieldId}
              type="password"
              placeholder="뒷자리"
              maxLength="7"
              value={formData[fieldId] || ''}
              onChange={handleChange}
              onBlur={() => handleBlur(fieldId)}
              style={{ flex: 1 }}
            />
          </div>
          {hasError && <span className="error-message">{hasError}</span>}
        </div>
      );
    }
    
    if (type === 'document') {
      return (
        <div className="signup-form-group" style={{ gridColumn: '1 / -1' }}>
          <label>{label}</label>
          <div className="document-container">
            <div className="document-content" style={{ 
              height: '200px', 
              overflowY: 'auto',
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              {options.content || '동의 내용이 여기에 표시됩니다.'}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                id={fieldId}
                name={fieldId}
                checked={formData[fieldId] === '1'}
                onChange={(e) => handleCheckboxChange(fieldId, label, e.target.checked)}
              />
              {required ? t('위 내용에 동의합니다 (필수)') : t('위 내용에 동의합니다 (선택)')}
            </label>
          </div>
          {hasError && <span className="error-message">{hasError}</span>}
        </div>
      );
    }
    
    if (type === 'select') {
      return (
        <div className="signup-form-group">
          <label htmlFor={fieldId}>
            {label} {required && <span className="required">*</span>}
          </label>
          <select
            id={fieldId}
            name={fieldId}
            value={formData[fieldId] || ''}
            onChange={handleChange}
            onBlur={() => handleBlur(fieldId)}
            className={hasError ? 'error' : ''}
          >
            <option value="">선택하세요</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
          {hasError && <span className="error-message">{hasError}</span>}
        </div>
      );
    }
    
    if (type === 'radio') {
      return (
        <div className="signup-form-group">
          <label>{label} {required && <span className="required">*</span>}</label>
          <div style={{ display: 'flex', gap: '15px' }}>
            {options.map((opt, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name={fieldId}
                  value={opt}
                  checked={formData[fieldId] === opt}
                  onChange={(e) => handleRadioChange(fieldId, e.target.value)}
                />
                {opt}
              </label>
            ))}
          </div>
          {hasError && <span className="error-message">{hasError}</span>}
        </div>
      );
    }
    
    // 기본 input 필드
    return (
      <div className="signup-form-group">
        <label htmlFor={fieldId}>
          {label} {required && <span className="required">*</span>}
        </label>
        <input
          id={fieldId}
          name={fieldId}
          type={type}
          value={formData[fieldId] || ''}
          onChange={handleChange}
          onBlur={() => handleBlur(fieldId)}
          className={hasError ? 'error' : ''}
          placeholder={`${label}${required ? ' (필수)' : ''}`}
        />
        {hasError && <span className="error-message">{hasError}</span>}
      </div>
    );
  };
  
  // 회원가입 성공 화면
  if (signUpSuccess) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>
            {t('회원가입이 완료되었습니다!')}
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            {t('회원가입을 축하합니다. 로그인 후 서비스를 이용해 주세요.')}
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
      </div>
    );
  }
  
  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        {title}
      </h2>
      
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
      
      <form onSubmit={handleSubmit}>
        {/* 회원 정보 섹션 */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: '2px solid #f0f0f0'
          }}>
            {t('회원 정보')}
          </h3>
          
          <div style={gridStyle}>
            {/* 기본 필드들 */}
            {basicFields.userId && renderField('user_id', t('아이디'), 'text', true)}
            {basicFields.password && renderField('password', t('비밀번호'), 'password', true)}
            {basicFields.name && renderField('name', t('이름'), 'text', true)}
            {basicFields.phone && renderField('phone', t('핸드폰 번호'), 'tel', true)}
            {basicFields.email && renderField('email', t('이메일'), 'email', false)}
            {basicFields.birthday && renderField('birthday', t('생년월일'), 'date', false)}
            {basicFields.address && renderField('address', t('주소'), 'text', false)}
            
            {/* 추천인 코드 */}
            {basicFields.referralCode && (
              <div className="signup-form-group">
                <label htmlFor="referral_code">
                  {t('추천인 코드')}
                </label>
                <input
                  id="referral_code"
                  name="referral_code"
                  type="text"
                  value={formData.referral_code || defaultReferralCode || ''}
                  onChange={handleChange}
                  readOnly={!!defaultReferralCode}
                  style={defaultReferralCode ? { backgroundColor: '#f0f0f0' } : {}}
                />
              </div>
            )}
            
            {/* SPECIFIED 정책 필드 */}
            {isSpecifiedLegPolicy && (
              <>
                <div className="signup-form-group">
                  <label htmlFor="upperer_code">
                    {t('후원인 코드')} <span className="required">*</span>
                  </label>
                  <input
                    id="upperer_code"
                    name="upperer_code"
                    type="text"
                    value={formData.upperer_code || ''}
                    onChange={handleChange}
                    onBlur={() => handleBlur('upperer_code')}
                    className={validationErrors?.upperer_code ? 'error' : ''}
                  />
                  {validationErrors?.upperer_code && (
                    <span className="error-message">{validationErrors.upperer_code}</span>
                  )}
                </div>
                
                <div className="signup-form-group">
                  <label>
                    {t('좌/우')} <span className="required">*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input
                        type="radio"
                        name="left_or_right"
                        value="left"
                        checked={formData.left_or_right === 'left'}
                        onChange={(e) => handleRadioChange('left_or_right', e.target.value)}
                      />
                      {t('좌')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <input
                        type="radio"
                        name="left_or_right"
                        value="right"
                        checked={formData.left_or_right === 'right'}
                        onChange={(e) => handleRadioChange('left_or_right', e.target.value)}
                      />
                      {t('우')}
                    </label>
                  </div>
                  {validationErrors?.left_or_right && (
                    <span className="error-message">{validationErrors.left_or_right}</span>
                  )}
                </div>
              </>
            )}
            
            {/* 특수 회사 전용 지갑 주소 필드 */}
            {isSpecialCompany && (
              <>
                <div className="signup-form-group">
                  <label htmlFor="trxWithdrawAddress">
                    {t('TRX 지갑 주소')}
                  </label>
                  <input
                    id="trxWithdrawAddress"
                    name="trxWithdrawAddress"
                    type="text"
                    value={formData.trxWithdrawAddress || ''}
                    onChange={handleChange}
                    placeholder="TRX 지갑 주소를 입력하세요"
                  />
                </div>
                
                <div className="signup-form-group">
                  <label htmlFor="bscWithdrawAddress">
                    {t('BSC 지갑 주소')}
                  </label>
                  <input
                    id="bscWithdrawAddress"
                    name="bscWithdrawAddress"
                    type="text"
                    value={formData.bscWithdrawAddress || ''}
                    onChange={handleChange}
                    placeholder="BSC 지갑 주소를 입력하세요"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* 추가 정보 섹션 (커스텀 필드) */}
        {Object.keys(varFields).filter(key => varFields[key].show).length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #f0f0f0'
            }}>
              {t('추가 정보')}
            </h3>
            
            <div style={gridStyle}>
              {Object.entries(varFields).map(([fieldId, config]) => {
                if (!config.show) return null;
                
                return (
                  <React.Fragment key={fieldId}>
                    {renderField(
                      fieldId,
                      config.label,
                      config.type,
                      config.required,
                      config.options || [config]
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
        
        {/* 제출 버튼 */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '15px 40px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: theme?.primaryColor || '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? t('처리 중...') : t('회원가입')}
          </button>
        </div>
      </form>
      
      {/* CSS 스타일 */}
      <style jsx>{`
        .signup-form-group {
          margin-bottom: 20px;
        }
        
        .signup-form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }
        
        .signup-form-group input[type="text"],
        .signup-form-group input[type="password"],
        .signup-form-group input[type="email"],
        .signup-form-group input[type="tel"],
        .signup-form-group input[type="date"],
        .signup-form-group select {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .signup-form-group input[type="text"]:focus,
        .signup-form-group input[type="password"]:focus,
        .signup-form-group input[type="email"]:focus,
        .signup-form-group input[type="tel"]:focus,
        .signup-form-group input[type="date"]:focus,
        .signup-form-group select:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .signup-form-group input.error,
        .signup-form-group select.error {
          border-color: #dc3545;
        }
        
        .signup-form-group .error-message {
          display: block;
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .signup-form-group .required {
          color: #dc3545;
        }
        
        @media (max-width: 768px) {
          .signup-form-group {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
};

// UMD 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyCustomSignupSkin;
} else {
  window.MyCustomSignupSkin = MyCustomSignupSkin;
}
```

## 웹빌더 속성 패널 연동

### 회원가입 컴포넌트 속성 패널에서 설정 가능한 옵션들

웹빌더 에디터에서 회원가입 컴포넌트를 선택하면 우측 속성 패널에서 다음 옵션들을 실시간으로 설정할 수 있습니다:

#### 스킨 설정
- **컴포넌트 스킨**: 기본 스킨 또는 등록된 외부 스킨 선택

#### 기본 설정
- **제목**: 회원가입 폼 상단에 표시될 제목 텍스트 (기본값: '회원가입')
- **기본 추천인 코드**: 자동으로 입력될 추천인 코드

#### 회원정보 필드 표시 설정
- **아이디**: 표시 여부 설정
- **비밀번호**: 표시 여부 설정
- **이름**: 표시 여부 설정
- **핸드폰 번호**: 표시 여부 설정
- **이메일**: 표시 여부 설정
- **생년월일**: 표시 여부 설정
- **주소**: 표시 여부 설정
- **추천인 코드**: 표시 여부 설정

#### 커스텀 필드 설정 (var01~var10)
각 커스텀 필드에 대해 다음을 설정할 수 있습니다:
- **표시**: 필드 표시 여부
- **필드명**: 필드 레이블
- **타입**: input / select / radio / document / account / ssn 중 선택
- **동의 내용**: document 타입일 경우 표시할 내용
- **필수 여부**: 필수 입력 여부
- **옵션**: select나 radio 타입일 경우 선택 옵션 목록

#### 스타일 설정
- **배경색**: 폼 컨테이너 배경색
- **테두리 둥글기**: 폼 컨테이너 모서리 둥글기
- **그림자**: 폼 컨테이너 그림자 효과
- **최대 너비**: 폼의 최대 너비
- **여백**: 폼 컨테이너 여백

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
// 1. 속성 패널에서 옵션 변경 시 (SignupProperties.js)
const handleFieldToggle = (fieldName) => {
  handleComponentPropsChange(fieldName, !componentProps[fieldName]);
  // 즉시 프리뷰에 반영됨
};

// 2. 스킨에서 실시간으로 받는 방식
const MySignupSkin = ({ data, options }) => {
  const { basicFields, varFields } = data;
  
  // basicFields와 varFields가 변경되면 React가 자동으로 리렌더링
  return (
    <div>
      {basicFields.userId && <input placeholder="아이디" />}
      {basicFields.password && <input placeholder="비밀번호" />}
      {/* ... */}
    </div>
  );
};
```

### 속성 패널 ↔ options/data 완전 매핑표

| 속성 패널 섹션 | 속성명 | 데이터 위치 | 타입 | 설명 |
|---|---|---|---|---|
| **기본 설정** | | | | |
| | 제목 | `options.title` | string | 폼 제목 |
| | 기본 추천인 코드 | `options.referralCode` | string | 기본 추천인 코드 |
| **회원정보 필드** | | | | |
| | 아이디 | `data.basicFields.userId` | boolean | 표시 여부 |
| | 비밀번호 | `data.basicFields.password` | boolean | 표시 여부 |
| | 이름 | `data.basicFields.name` | boolean | 표시 여부 |
| | 핸드폰 번호 | `data.basicFields.phone` | boolean | 표시 여부 |
| | 이메일 | `data.basicFields.email` | boolean | 표시 여부 |
| | 생년월일 | `data.basicFields.birthday` | boolean | 표시 여부 |
| | 주소 | `data.basicFields.address` | boolean | 표시 여부 |
| | 추천인 코드 | `data.basicFields.referralCode` | boolean | 표시 여부 |
| **커스텀 필드** | | | | |
| | var01~var10 | `data.varFields.var01` 등 | object | 커스텀 필드 설정 |
| **스타일 설정** | | | | |
| | 배경색 | `options.backgroundColor` | string | 컨테이너 배경색 |
| | 테두리 둥글기 | `options.borderRadius` | string | 모서리 둥글기 |
| | 그림자 | `options.boxShadow` | string | 그림자 효과 |
| | 최대 너비 | `options.maxWidth` | string | 최대 너비 |
| | 여백 | `options.margin` | string | 컨테이너 여백 |

### 커스텀 필드 타입별 구현 가이드

#### 1. input 타입 (기본)
```jsx
<input
  type="text"
  value={formData[fieldId] || ''}
  onChange={handleChange}
  onBlur={() => handleBlur(fieldId)}
/>
```

#### 2. select 타입
```jsx
<select value={formData[fieldId] || ''} onChange={handleChange}>
  <option value="">선택하세요</option>
  {config.options.map(opt => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
</select>
```

#### 3. radio 타입
```jsx
{config.options.map(opt => (
  <label key={opt}>
    <input
      type="radio"
      name={fieldId}
      value={opt}
      checked={formData[fieldId] === opt}
      onChange={(e) => handleRadioChange(fieldId, e.target.value)}
    />
    {opt}
  </label>
))}
```

#### 4. document 타입 (동의서)
```jsx
<div className="document-content">
  {config.content}
</div>
<input
  type="checkbox"
  checked={formData[fieldId] === '1'}
  onChange={(e) => handleCheckboxChange(fieldId, config.label, e.target.checked)}
/>
```

#### 5. account 타입 (은행계좌)
```jsx
<select name={`${fieldId}_bank`} onChange={handleChange}>
  {/* 은행 옵션들 */}
</select>
<input
  name={fieldId}
  type="text"
  placeholder="계좌번호"
  onChange={handleChange}
/>
```

#### 6. ssn 타입 (주민등록번호)
```jsx
<input
  name={`${fieldId}_front`}
  maxLength="6"
  placeholder="앞자리"
/>
<input
  name={fieldId}
  type="password"
  maxLength="7"
  placeholder="뒷자리"
/>
```

## Props 상세 설명

### data 객체

| 속성 | 타입 | 설명 |
|------|------|------|
| `formData` | `object` | 모든 폼 필드의 현재 값 |
| `validationErrors` | `object` | 필드별 유효성 검사 오류 메시지 |
| `loading` | `boolean` | 회원가입 요청 진행 중 여부 |
| `signUpSuccess` | `boolean` | 회원가입 성공 여부 |
| `signUpError` | `any` | 회원가입 실패 시 에러 정보 |
| `isSpecifiedLegPolicy` | `boolean` | SPECIFIED 정책 사용 여부 |
| `policies` | `object` | 정책 정보 |
| `companyId` | `number` | 현재 회사 ID |
| `theme` | `object` | 테마 정보 (primaryColor, secondaryColor) |
| `basicFields` | `object` | 기본 필드 표시 설정 |
| `varFields` | `object` | 커스텀 필드 설정 |

#### formData 상세 구조
```javascript
{
  // 기본 필드
  user_id: string,
  password: string,
  phone: string,
  name: string,
  referral_code: string,
  email: string,
  birthday: string,
  address: string,
  
  // SPECIFIED 정책 필드
  upperer_code: string,    // 후원인 코드
  center_code: string,     // 센터 코드
  left_or_right: string,   // 좌/우 선택
  
  // 커스텀 필드
  var01~var10: string,
  
  // 특수 회사 전용 필드
  trxWithdrawAddress: string,  // TRX 지갑 주소
  bscWithdrawAddress: string   // BSC 지갑 주소
}
```

#### varFields 구조 예시
```javascript
{
  var01: {
    show: true,
    label: "직업",
    type: "select",
    required: true,
    options: ["회사원", "자영업", "학생", "기타"]
  },
  var02: {
    show: true,
    label: "개인정보 수집 동의",
    type: "document",
    content: "개인정보 수집 및 이용에 대한 안내...",
    required: true
  }
}
```

### actions 객체

| 함수 | 설명 | 사용법 |
|------|------|--------|
| `handleChange` | input 값 변경 처리 | `onChange={handleChange}` |
| `handleSubmit` | 폼 제출 처리 | `onSubmit={handleSubmit}` |
| `handleBlur` | 필드 포커스 아웃 시 유효성 검사 | `onBlur={() => handleBlur(fieldId)}` |
| `handleRadioChange` | 라디오 버튼 변경 | `onChange={(e) => handleRadioChange(fieldId, value)}` |
| `handleCheckboxChange` | 체크박스 변경 | `onChange={(e) => handleCheckboxChange(fieldId, label, checked)}` |
| `validateField` | 특정 필드 유효성 검사 | `validateField(fieldId, value)` |
| `validateForm` | 전체 폼 유효성 검사 | `const isValid = validateForm()` |

### options 객체

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | '회원가입' | 회원가입 폼 제목 |
| `referralCode` | `string` | '' | 기본 추천인 코드 |
| `backgroundColor` | `string` | '#ffffff' | 폼 배경색 |
| `borderRadius` | `string` | '10px' | 테두리 둥글기 |
| `boxShadow` | `string` | '0 2px 8px rgba(0, 0, 0, 0.1)' | 그림자 효과 |
| `maxWidth` | `string` | '1200px' | 폼 최대 너비 |
| `margin` | `string` | '0 auto' | 폼 여백 |

### utils 객체

| 함수 | 설명 | 예시 |
|------|------|------|
| `t(key)` | 다국어 번역 | `t('회원가입')` |
| `cx(...classes)` | 클래스명 조합 | `cx('base', isActive && 'active')` |
| `navigate(path)` | 페이지 이동 | `navigate('/')` |
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
const formStyle = {
  backgroundColor: options.backgroundColor || '#ffffff',
  borderRadius: options.borderRadius || '10px',
  boxShadow: options.boxShadow || '0 2px 8px rgba(0, 0, 0, 0.1)',
  maxWidth: options.maxWidth || '1200px',
  margin: options.margin || '0 auto',
  padding: '30px'
};

<div style={formStyle}>
  {/* 폼 내용 */}
</div>
```

### 2. CSS 파일 분리 (권장)

**dist/my-signup-skin.css**
```css
.signup-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

.signup-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.signup-section {
  margin-bottom: 30px;
}

.signup-section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.signup-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.signup-form-group {
  margin-bottom: 20px;
}

.signup-form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.signup-form-group input[type="text"],
.signup-form-group input[type="password"],
.signup-form-group input[type="email"],
.signup-form-group input[type="tel"],
.signup-form-group input[type="date"],
.signup-form-group select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.signup-form-group input:focus,
.signup-form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.signup-form-group .error {
  border-color: #dc3545;
}

.signup-form-group .error-message {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.signup-form-group .required {
  color: #dc3545;
}

.document-container {
  margin-top: 10px;
}

.document-content {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.signup-submit-button {
  padding: 15px 40px;
  font-size: 16px;
  font-weight: 600;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.signup-submit-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.signup-submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.signup-success {
  text-align: center;
  padding: 50px 0;
}

.signup-success h2 {
  color: #4CAF50;
  margin-bottom: 20px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .signup-grid {
    grid-template-columns: 1fr;
  }
  
  .signup-container {
    padding: 20px;
    margin: 10px;
  }
  
  .document-container {
    grid-column: 1;
  }
}
```

**스킨 등록 시 CSS 파일 포함**
```javascript
registerComponentSkin({
  id: 'my-custom-signup',
  name: '나의 커스텀 회원가입',
  componentTypes: ['signup'],
  umdUrl: 'https://cdn.example.com/my-signup-skin.umd.js',
  cssUrls: [
    'https://cdn.example.com/my-signup-skin.css'  // CSS 파일 추가
  ],
  globalName: 'MyCustomSignupSkin'
});
```

### 3. 반응형 디자인

```jsx
// 그리드 시스템
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
  gap: '15px'
};

// 미디어 쿼리 적용
const isMobile = window.innerWidth < 768;
const containerStyle = {
  padding: isMobile ? '20px' : '30px',
  margin: isMobile ? '10px' : '0 auto'
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
aws s3 cp dist/my-signup-skin.umd.js s3://my-bucket/skins/ --acl public-read
aws s3 cp dist/my-signup-skin.css s3://my-bucket/skins/ --acl public-read
```

#### CDN (jsDelivr + GitHub)
```
# JavaScript 파일
https://cdn.jsdelivr.net/gh/username/repo@version/dist/my-signup-skin.umd.js

# CSS 파일
https://cdn.jsdelivr.net/gh/username/repo@version/dist/my-signup-skin.css
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
    id: 'my-custom-signup-dev',
    name: '개발용: 나의 커스텀 회원가입',
    componentTypes: ['signup'],
    umdUrl: 'http://localhost:3001/my-signup-skin.umd.js',
    cssUrls: ['http://localhost:3001/my-signup-skin.css'],
    globalName: 'MyCustomSignupSkin'
  });
}
```

### 2. 브라우저 콘솔 확인

```javascript
// 스킨이 로드되었는지 확인
console.log(window.MyCustomSignupSkin);

// Props 구조 확인
const TestSkin = (props) => {
  console.log('Received props:', props);
  console.log('Form data:', props.data.formData);
  console.log('Options:', props.options);
  console.log('Basic fields:', props.data.basicFields);
  console.log('Var fields:', props.data.varFields);
  
  return window.MyCustomSignupSkin(props);
};
```

### 3. 에러 디버깅

```jsx
// 개발 중 디버깅을 위한 로그
const MyCustomSignupSkin = (props) => {
  // Props 전체 구조 확인
  console.log('Props:', props);
  
  // 특정 데이터 확인
  console.log('Company ID:', props.data.companyId);
  console.log('Is SPECIFIED policy:', props.data.isSpecifiedLegPolicy);
  console.log('Validation errors:', props.data.validationErrors);
  
  // ... 나머지 코드
};
```

## 실전 예제

### 1. 모던 카드 스타일 회원가입

```jsx
const ModernCardSignup = ({ data, actions, options, utils }) => {
  const { t } = utils;
  
  const cardStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  };
  
  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    textAlign: 'center',
    color: 'white'
  };
  
  const bodyStyle = {
    padding: '40px'
  };
  
  // ... 컴포넌트 구현
};
```

### 2. 스텝 방식 회원가입

```jsx
const StepSignup = ({ data, actions, options, utils }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const totalSteps = 3;
  
  const stepContainerStyle = {
    maxWidth: '600px',
    margin: '0 auto'
  };
  
  const progressStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px'
  };
  
  const stepStyle = (stepNumber) => ({
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: currentStep >= stepNumber ? '#007bff' : '#e0e0e0',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  });
  
  // 단계별 필드 그룹핑
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div>
            <h3>{t('기본 정보')}</h3>
            {/* 아이디, 비밀번호, 이름 필드 */}
          </div>
        );
      case 2:
        return (
          <div>
            <h3>{t('연락처 정보')}</h3>
            {/* 전화번호, 이메일, 주소 필드 */}
          </div>
        );
      case 3:
        return (
          <div>
            <h3>{t('추가 정보')}</h3>
            {/* 커스텀 필드들 */}
          </div>
        );
    }
  };
  
  // ... 컴포넌트 구현
};
```

### 3. 다크 테마 회원가입

```jsx
const DarkThemeSignup = ({ data, actions, options, utils }) => {
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: '40px 20px'
  };
  
  const formStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#2d2d2d',
    border: '1px solid #404040',
    borderRadius: '12px',
    padding: '40px'
  };
  
  const inputStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #404040',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: '6px'
  };
  
  // ... 컴포넌트 구현
};
```

## 속성 패널에서 스킨 선택하기

WithCookie WebBuilder는 에디터의 속성 패널에서 손쉽게 스킨을 선택할 수 있는 UI를 제공합니다.

### 스킨 선택 UI

회원가입 컴포넌트를 선택하면 속성 패널 상단에 "컴포넌트 스킨" 섹션이 표시됩니다:

```
┌─────────────────────────────────┐
│ 🛡️ 컴포넌트 스킨                │
├─────────────────────────────────┤
│ [기본 스킨          ▼]         │
│                                 │
│ 사용 가능한 스킨:              │
│ • 기본 스킨                    │
│ • 나의 커스텀 회원가입         │
│ • 모던 카드 회원가입           │
│                                 │
│ [🛒 더 많은 스킨 구매하기]      │
└─────────────────────────────────┘
```

### 구현 방식

WithCookie는 공통 스킨 선택 컴포넌트인 `SkinSelector`를 제공합니다:

```jsx
// SignupProperties.js에서 사용 예시
import { SkinSelector } from '../CommonProperties';

const SignupProperties = () => {
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

### 스킨 적용 과정

1. **스킨 선택**: 속성 패널에서 원하는 스킨 선택
2. **즉시 반영**: 선택과 동시에 에디터 캔버스에 실시간 반영
3. **설정 저장**: 선택된 스킨 ID가 컴포넌트 속성에 저장
4. **프로덕션 적용**: 배포 시 선택된 스킨으로 렌더링

## 주의사항 및 팁

### 필수 요구사항

1. **input ID 속성**: 반드시 정확한 필드 ID 사용
   ```jsx
   <input id="user_id" name="user_id" ... />
   <input id="password" name="password" ... />
   ```

2. **이벤트 핸들러**: 제공된 핸들러 사용
   ```jsx
   <form onSubmit={handleSubmit}>
     <input onChange={handleChange} onBlur={() => handleBlur(fieldId)} />
   </form>
   ```

3. **특수 필드 처리**: account, ssn, document 타입 구현 필수
   ```jsx
   // account 타입: 은행 선택 + 계좌번호
   // ssn 타입: 앞자리 + 뒷자리
   // document 타입: 내용 표시 + 동의 체크박스
   ```

4. **조건부 필드**: 회사별/정책별 특수 필드 처리
   ```jsx
   {isSpecifiedLegPolicy && (
     // 후원인 코드, 좌/우 선택 필드
   )}
   
   {(companyId === 190 || companyId === 290) && (
     // 지갑 주소 필드
   )}
   ```

### 성능 최적화

1. **조건부 렌더링**: 불필요한 렌더링 방지
   ```jsx
   {basicFields.userId && renderField('user_id', ...)}
   {varFields.var01.show && renderField('var01', ...)}
   ```

2. **스타일 객체 캐싱**: 컴포넌트 외부에 정의
   ```jsx
   const styles = {
     container: { ... },
     form: { ... },
     grid: { ... }
   };
   
   const MySignupSkin = (props) => {
     return <div style={styles.container}>...</div>;
   };
   ```

3. **메모이제이션**: 복잡한 계산 결과 캐싱
   ```jsx
   const visibleFields = React.useMemo(() => {
     return Object.entries(varFields).filter(([_, config]) => config.show);
   }, [varFields]);
   ```

### 접근성 고려

1. **레이블 연결**: for 속성 사용
   ```jsx
   <label htmlFor="user_id">아이디</label>
   <input id="user_id" />
   ```

2. **필수 필드 표시**: 시각적 + 시맨틱 표시
   ```jsx
   <label>
     이름 <span className="required" aria-label="필수">*</span>
   </label>
   <input required aria-required="true" />
   ```

3. **에러 메시지**: ARIA 속성 활용
   ```jsx
   <input aria-invalid={!!error} aria-describedby={`${fieldId}-error`} />
   <span id={`${fieldId}-error`} role="alert">{error}</span>
   ```

### 유효성 검사 처리

1. **실시간 검사**: onBlur 이벤트 활용
   ```jsx
   onBlur={() => handleBlur(fieldId)}
   ```

2. **제출 시 검사**: 전체 폼 유효성 확인
   ```jsx
   const handleFormSubmit = (e) => {
     e.preventDefault();
     if (validateForm()) {
       handleSubmit(e);
     }
   };
   ```

3. **에러 표시**: 필드별 에러 메시지
   ```jsx
   {validationErrors[fieldId] && (
     <span className="error-message">{validationErrors[fieldId]}</span>
   )}
   ```

### 다국어 지원

```jsx
// 항상 t() 함수 사용
<label>{t('아이디')}</label>
<button>{t('회원가입')}</button>

// 동적 메시지
<div>{t(signUpError)}</div>
```

### 디버깅 팁

1. **Props 확인**: 개발 시 콘솔 로깅
2. **네트워크 확인**: 스킨 파일 로드 상태
3. **에러 추적**: try-catch로 에러 처리
4. **상태 모니터링**: React DevTools 활용

## API 호출 처리

### ❌ 하지 말아야 할 것

스킨에서 직접 API를 호출하지 마세요:

```jsx
// 잘못된 예시
const MySignupSkin = ({ data, actions, utils }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ❌ 스킨에서 직접 API 호출하지 마세요
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      // ...
    } catch (error) {
      // ...
    }
  };
};
```

### ✅ 올바른 방법

Logic에서 제공하는 액션 사용:

```jsx
// 올바른 예시
const MySignupSkin = ({ data, actions, utils }) => {
  // ✅ Logic에서 제공하는 액션 사용
  const { handleSubmit } = actions;
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드들 */}
    </form>
  );
};
```

## 문제 해결

### 스킨이 로드되지 않을 때

1. 브라우저 개발자 도구 > Network 탭 확인
2. CORS 에러 확인
3. 전역 변수명 확인: `window.MyCustomSignupSkin`
4. UMD 빌드 설정 확인

### 필드가 표시되지 않을 때

1. `basicFields`와 `varFields` 데이터 확인
2. 속성 패널에서 필드 표시 설정 확인
3. 조건부 렌더링 로직 확인

### 유효성 검사가 작동하지 않을 때

1. 필드 ID가 정확한지 확인
2. `handleBlur` 함수 호출 확인
3. `validationErrors` 객체 구조 확인

### Props가 undefined일 때

1. 컴포넌트 등록 시 globalName 확인
2. 빌드 설정의 library 이름 확인
3. 개발자 도구에서 props 로깅

## 결론

이 가이드를 따라 자신만의 독특한 회원가입 스킨을 만들 수 있습니다. 기본 템플릿을 시작으로 점진적으로 커스터마이징하며, 테스트를 통해 안정성을 확보하세요. 

중요한 점은:
- 속성 패널의 모든 설정이 실시간으로 반영되도록 구현
- 다양한 필드 타입(account, ssn, document 등) 지원
- 회사별/정책별 조건부 필드 처리
- 유효성 검사와 에러 처리 구현

추가 지원이 필요하면 WithCookie 개발팀에 문의하거나 [공식 문서](https://docs.withcookie.com)를 참고하세요.

---

**버전**: 1.0.0  
**최종 업데이트**: 2024년 12월  
**작성자**: WithCookie 개발팀