export interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    // 폼 데이터
    formData: SignUpFormData;
    
    // 상태
    loading: boolean;
    signUpSuccess: boolean;
    signUpError: string | null;
    validationErrors: Record<string, string>;
    
    // 기본 필드 표시 설정
    basicFields: {
      userId: boolean;
      password: boolean;
      name: boolean;
      phone: boolean;
      email: boolean;
      birthday: boolean;
      address: boolean;
      referralCode: boolean;
    };
    
    // 커스텀 필드 설정 (var01~var10)
    varFields: Record<string, {
      show: boolean;
      label: string;
      type: 'input' | 'select' | 'radio' | 'document' | 'account' | 'ssn';
      required: boolean;
      options?: string[];                // select, radio 타입의 선택 옵션들
      content?: string;                  // document 타입의 동의 내용
    }>;
    
    // 정책 및 설정
    isSpecifiedLegPolicy: boolean;
    companyId: number;
    policies: any;
    
    // 테마
    theme: {
      primaryColor: string;
      secondaryColor: string;
    };
    
    // 전역 앱 데이터
    withcookieData: any;
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
  };
  
  // 컴포넌트 액션
  actions: {
    handleSubmit: (event: React.FormEvent) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (fieldName: string) => void;
    handleRadioChange: (fieldName: string, value: string) => void;
    handleCheckboxChange: (fieldName: string, label: string, checked: boolean) => void;
    validateField: (fieldName: string, value: any) => void;
    validateForm: () => boolean;
  };
  
  // 컴포넌트 옵션 (사용자가 설정한 값) - 속성 패널에서 설정 가능한 모든 옵션
  options: {
    // 기본 설정
    title?: string;                    // 제목 (기본값: '회원가입')
    referralCode?: string;             // 기본 추천인 코드
    
    // 스타일 설정
    backgroundColor?: string;          // 배경색 (기본값: '#ffffff')
    borderRadius?: string;             // 테두리 둥글기 (기본값: '10px')
    boxShadow?: string;                // 그림자 (기본값: '0 2px 8px rgba(0, 0, 0, 0.1)')
    maxWidth?: string;                 // 최대 너비 (기본값: '1200px')
    margin?: string;                   // 여백 (기본값: '0 auto')
    
    // 기타 확장 가능한 옵션들
    [optionName: string]: any;
  };
  
  // 렌더링 모드
  mode: 'editor' | 'preview' | 'production';
  
  // 유틸리티 함수
  utils: {
    t: (key: string) => string; // 번역
    navigate: (path: string) => void; // 페이지 이동
    formatCurrency: (amount: number) => string;
    formatDate: (date: Date | string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: any[]) => string; // 클래스명 조합
  };
  
  // 앱 전역 데이터 (선택적)
  app?: {
    user?: any;
    company?: any;
    currentLanguage?: string;
    theme?: any;
  };
  
  // 에디터 모드 전용 props
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
  };
}

// API 문서에 맞는 회원가입 폼 데이터
export interface SignUpFormData {
  // 기본 필드 (문서에 명시된 정확한 ID 사용)
  user_id: string;      // 아이디
  password: string;     // 비밀번호
  name: string;         // 이름
  phone: string;        // 전화번호
  email: string;        // 이메일
  birthday?: string;    // 생년월일
  address?: string;     // 주소
  referral_code?: string; // 추천인 코드
  
  // 커스텀 필드 (var01~var10)
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
  
  // 내부적으로 사용되는 필드들
  [key: string]: any;
}

// 기존 타입들을 유지하되 사용하지 않을 예정

// 간소화된 옵션 인터페이스 (필요한 경우 확장 가능)
export interface SignUpOptions {
  [key: string]: any;
}

// 필요시 추가할 수 있는 확장 타입들
export interface ValidationResult {
  isValid: boolean;
  messages: string[];
}

export interface FormErrors {
  [key: string]: string;
}

// 기존 복잡한 인터페이스들 제거
// 외부 스킨에서는 Logic 레이어에서 제공하는 data와 actions만 사용