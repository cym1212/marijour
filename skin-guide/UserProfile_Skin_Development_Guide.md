# UserProfile 스킨 개발 가이드

## 개요

UserProfile 컴포넌트는 사용자 정보를 표시하고 수정할 수 있는 기능을 제공합니다. 이 가이드는 외부 개발자가 UserProfile 컴포넌트의 커스텀 스킨을 개발하는 방법을 설명합니다.

## 컴포넌트 구조

### 스킨 Props 인터페이스

UserProfile 스킨 컴포넌트는 다음과 같은 props를 받습니다:

```typescript
interface ComponentSkinProps {
  data: {
    userInfo: UserInfo | null;           // 현재 사용자 정보
    editedInfo: EditedUserInfo;          // 편집 중인 사용자 정보
    loading: boolean;                    // 로딩 상태
    errors: Record<string, string>;      // 필드별 에러 메시지
    showPasswordFields: boolean;         // 비밀번호 변경 필드 표시 여부
    isUserLoggedIn: boolean;            // 로그인 상태
    isAdminMode: boolean;               // 관리자 모드 여부
    varFields: VarFields;               // 커스텀 필드 설정
    theme: Record<string, any>;         // 테마 정보
  };
  actions: {
    handleFieldChange: (field: keyof EditedUserInfo, value: string) => void;  // 필드 값 변경
    handleUpdate: () => Promise<void>;                                        // 정보 업데이트
    togglePasswordChange: () => void;                                         // 비밀번호 변경 토글
  };
  options: {
    title?: string;          // 제목 (기본값: '내 정보')
    showPassword?: boolean;  // 비밀번호 변경 기능 표시 (기본값: true)
    showPhone?: boolean;     // 전화번호 필드 표시 (기본값: true)
    showEmail?: boolean;     // 이메일 필드 표시 (기본값: true)
    showBirthday?: boolean;  // 생년월일 필드 표시 (기본값: true)
    showAddress?: boolean;   // 주소 필드 표시 (기본값: true)
    buttonColor?: string;    // 버튼 색상 (기본값: '#007bff')
    titleColor?: string;     // 제목 색상 (기본값: '#333333')
    labelColor?: string;     // 라벨 색상 (기본값: '#666666')
  };
  mode: ComponentRenderMode;  // 'viewer' | 'editor'
  utils: {
    t: (key: string) => string;  // 번역 함수
    navigate?: (path: string) => void;  // 페이지 이동 함수
  };
  app: any;     // 앱 전역 정보
  editor: any;  // 에디터 관련 정보
}
```

## 데이터 타입 정의

### UserInfo 인터페이스

```typescript
interface UserInfo {
  id?: string | number;
  insungId?: string;      // 사용자 ID
  name?: string;          // 이름
  phone?: string;         // 전화번호
  email?: string;         // 이메일
  birthdate?: string;     // 생년월일
  birthday?: string;      // 생년월일 (대체 필드)
  address?: string;       // 주소
  created_at?: string;    // 가입일
  company_id?: number;    // 회사 ID
  var01?: string;         // 커스텀 필드 1
  var02?: string;         // 커스텀 필드 2
  var03?: string;         // 커스텀 필드 3
  var04?: string;         // 커스텀 필드 4
  var05?: string;         // 커스텀 필드 5
  var06?: string;         // 커스텀 필드 6
  var07?: string;         // 커스텀 필드 7
  var08?: string;         // 커스텀 필드 8
  var09?: string;         // 커스텀 필드 9
  var10?: string;         // 커스텀 필드 10
}
```

### EditedUserInfo 인터페이스

```typescript
interface EditedUserInfo {
  name?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  address?: string;
  password?: string;         // 새 비밀번호
  passwordConfirm?: string;  // 비밀번호 확인
  var01?: string;
  var02?: string;
  var03?: string;
  var04?: string;
  var05?: string;
  var06?: string;
  var07?: string;
  var08?: string;
  var09?: string;
  var10?: string;
}
```

### VarFields 인터페이스

```typescript
interface VarFieldOption {
  show: boolean;    // 필드 표시 여부
  label: string;    // 필드 라벨
  type?: 'input' | 'select' | 'radio' | 'document' | 'account' | 'ssn';
  options?: Array<{ value: string; label: string }>;  // select/radio 옵션
  required?: boolean;  // 필수 입력 여부
  content?: string;    // 추가 콘텐츠
}

interface VarFields {
  var01?: VarFieldOption;
  var02?: VarFieldOption;
  var03?: VarFieldOption;
  var04?: VarFieldOption;
  var05?: VarFieldOption;
  var06?: VarFieldOption;
  var07?: VarFieldOption;
  var08?: VarFieldOption;
  var09?: VarFieldOption;
  var10?: VarFieldOption;
}
```

## 주요 기능

### 1. 사용자 정보 표시 및 수정

- 기본 정보: 아이디, 이름, 전화번호, 이메일, 생년월일, 주소
- 읽기 전용 정보: 아이디, 가입일
- 편집 가능 정보: 이름, 전화번호, 이메일, 생년월일, 주소

### 2. 비밀번호 변경

- `showPassword` 옵션이 true일 때 표시
- 토글 버튼으로 비밀번호 변경 필드 표시/숨김
- 새 비밀번호와 확인 필드 제공

### 3. 커스텀 필드

- 최대 10개의 커스텀 필드 지원 (var01 ~ var10)
- 각 필드별로 표시 여부, 라벨, 필수 입력 설정 가능
- 다양한 입력 타입 지원 (input, select, radio 등)

### 4. 유효성 검증

- 필수 필드 검증
- 이메일 형식 검증
- 비밀번호 일치 검증 (6자 이상)
- 에러 메시지 표시

### 5. 로그인 상태 처리

- 비로그인 시 로그인 유도 화면 표시
- 관리자 모드에서는 특정 사용자 정보 조회/수정 가능

## 스킨 개발 예제

### 기본 구조

```tsx
import React from 'react';
import { ComponentSkinProps } from '@/types/component-skin';

const CustomUserProfileSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode, 
  utils 
}) => {
  const { t } = utils;
  
  // 데이터 추출
  const { 
    userInfo,
    editedInfo,
    loading,
    errors,
    showPasswordFields,
    isUserLoggedIn,
    varFields
  } = data || {};
  
  // 액션 추출
  const {
    handleFieldChange,
    handleUpdate,
    togglePasswordChange
  } = actions || {};
  
  // 옵션 추출
  const {
    title = t('내 정보'),
    showPhone = true,
    showEmail = true,
    buttonColor = '#007bff'
  } = options || {};
  
  // 로그인 체크
  if (!isUserLoggedIn) {
    return (
      <div>
        <p>{t('로그인이 필요한 서비스입니다.')}</p>
        <button onClick={() => utils.navigate?.('/login')}>
          {t('로그인하기')}
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h2>{title}</h2>
      
      {/* 기본 정보 표시 */}
      <div>
        <strong>{t('아이디')}:</strong> {userInfo?.insungId || '-'}
      </div>
      
      {/* 편집 폼 */}
      <form onSubmit={(e) => { 
        e.preventDefault(); 
        handleUpdate(); 
      }}>
        {/* 이름 필드 */}
        <div>
          <label>{t('이름')}</label>
          <input
            type="text"
            value={editedInfo.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
          />
          {errors.name && <span>{errors.name}</span>}
        </div>
        
        {/* 전화번호 필드 */}
        {showPhone && (
          <div>
            <label>{t('전화번호')}</label>
            <input
              type="tel"
              value={editedInfo.phone || ''}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
          </div>
        )}
        
        {/* 커스텀 필드 렌더링 */}
        {Object.keys(varFields).map((key) => {
          const field = varFields[key];
          if (!field.show) return null;
          
          return (
            <div key={key}>
              <label>
                {field.label}
                {field.required && <span> *</span>}
              </label>
              <input
                type="text"
                value={editedInfo[key] || ''}
                onChange={(e) => handleFieldChange(key, e.target.value)}
              />
              {errors[key] && <span>{errors[key]}</span>}
            </div>
          );
        })}
        
        {/* 비밀번호 변경 */}
        {options.showPassword && (
          <div>
            <button type="button" onClick={togglePasswordChange}>
              {showPasswordFields ? t('비밀번호 변경 취소') : t('비밀번호 변경')}
            </button>
            
            {showPasswordFields && (
              <>
                <div>
                  <label>{t('새 비밀번호')}</label>
                  <input
                    type="password"
                    value={editedInfo.password || ''}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                  />
                  {errors.password && <span>{errors.password}</span>}
                </div>
                
                <div>
                  <label>{t('비밀번호 확인')}</label>
                  <input
                    type="password"
                    value={editedInfo.passwordConfirm || ''}
                    onChange={(e) => handleFieldChange('passwordConfirm', e.target.value)}
                  />
                  {errors.passwordConfirm && <span>{errors.passwordConfirm}</span>}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* 저장 버튼 */}
        <button 
          type="submit" 
          disabled={loading}
          style={{ backgroundColor: buttonColor }}
        >
          {loading ? t('저장 중...') : t('변경사항 저장')}
        </button>
      </form>
    </div>
  );
};

export default CustomUserProfileSkin;
```

## 스타일링 가이드

### 1. 반응형 디자인

```css
/* 모바일 우선 접근 */
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

@media (min-width: 768px) {
  .container {
    padding: 40px;
  }
}
```

### 2. 테마 연동

```tsx
// theme 객체 활용
const { theme } = data;

const styles = {
  button: {
    backgroundColor: theme?.primaryColor || buttonColor,
    color: theme?.primaryTextColor || '#fff'
  }
};
```

### 3. 접근성 고려사항

- 적절한 라벨 제공
- 키보드 네비게이션 지원
- 에러 메시지 명확히 표시
- 적절한 색상 대비

## 개발 시 주의사항

1. **필수 필드 처리**: 이름은 항상 필수 필드입니다.

2. **에러 처리**: errors 객체를 통해 각 필드별 에러 메시지를 표시해야 합니다.

3. **로딩 상태**: loading이 true일 때 버튼을 비활성화하고 적절한 피드백을 제공하세요.

4. **비밀번호 검증**: 비밀번호는 최소 6자 이상이어야 하며, 확인 필드와 일치해야 합니다.

5. **번역 지원**: utils.t() 함수를 사용하여 다국어를 지원하세요.

6. **폼 제출**: form의 onSubmit 이벤트를 사용하여 엔터키로도 제출할 수 있도록 하세요.

## 테스트 체크리스트

- [ ] 로그인/비로그인 상태 전환 테스트
- [ ] 모든 필드 입력 및 수정 테스트
- [ ] 유효성 검증 및 에러 메시지 표시 테스트
- [ ] 비밀번호 변경 기능 테스트
- [ ] 커스텀 필드 표시 및 입력 테스트
- [ ] 로딩 상태 처리 테스트
- [ ] 반응형 디자인 테스트
- [ ] 키보드 접근성 테스트