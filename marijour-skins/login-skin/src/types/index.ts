// External Skin Props (Withcookie 표준)
export interface ExternalSkinProps {
  data: {
    // 인증 관련
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    } | null;
    
    // 사이트 데이터
    withcookieData: {
      skin?: {
        theme?: {
          main_logo_url?: string;
          colorset?: {
            primary?: string;
            secondary?: string;
            tertiary?: string;
          };
        };
        extra?: {
          company_name?: string;
        };
      };
    };
    
    // 로그인 관련 설정
    loginOptions?: LoginOptions;
    loginData?: LoginData;
  };
  
  actions: {
    onLogin: (credentials: LoginCredentials) => Promise<LoginResponse>;
    onLogout: () => void;
    onCheckAuth: () => void;
    onSocialLogin?: (provider: string) => Promise<LoginResponse>;
    onPasswordReset?: (email: string) => Promise<void>;
  };
  
  utils: {
    navigate: (path: string) => void;
    location: {
      pathname: string;
      search: string;
      hash: string;
      state: any;
    };
    params: Record<string, string>;
    t: (key: string) => string;
    showToast?: (message: string, type?: 'success' | 'error' | 'warning') => void;
    openModal?: (content: React.ReactNode) => void;
    closeModal?: () => void;
  };
  
  layout: {
    children: React.ReactNode;
    currentMenuId?: string;
    pageTitle?: string;
    showHeader?: boolean;
    showFooter?: boolean;
  };
  
  theme?: {
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
    spacing?: Record<string, string>;
  };
}

// ✅ 프론트엔드 LoginLogic에 맞춘 ComponentSkinProps
export interface ComponentSkinProps {
  // ✅ LoginLogic에서 제공하는 데이터 구조
  data: {
    formData: {
      user_id: string;        // ← email이 아닌 user_id
      password: string;       // ← 비밀번호만
      // rememberMe 없음!
    };
    loading: boolean;
    loginSuccess: boolean;
    loginError: string | null;
    validationErrors: Record<string, string>;
    theme?: {
      primaryColor?: string;
      backgroundColor?: string;
    };
  };
  
  // ✅ LoginLogic에서 제공하는 액션들만
  actions: {
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;  // ← 통일된 handleChange
    handleSubmit: (event: React.FormEvent) => void;                      // ← 로그인 API 호출
    handleSignupClick?: () => void;                                      // ← 회원가입 페이지 이동
  };
  
  // ✅ 컴포넌트 옵션 (사용자가 설정한 값) - 속성 패널에서 설정 가능한 모든 옵션
  options: {
    // 기본 설정
    title?: string;                    // 제목 (기본값: '로그인')
    redirectPath?: string;             // 로그인 후 이동 경로 (기본값: '/')
    
    // 배경 설정
    backgroundType?: 'none' | 'image' | 'video'; // 배경 타입 (기본값: 'image')
    backgroundUrl?: string;            // 배경 URL (기본값: '')
    
    // 색상 설정
    buttonColor?: string;              // 버튼 색상 (기본값: '#007bff')
    titleColor?: string;               // 제목 색상 (기본값: '#333333')
    labelColor?: string;               // 레이블 색상 (기본값: '#333333')
    inputTextColor?: string;           // 입력 텍스트 색상 (기본값: '#333333')
    
    // 스킨 설정
    skin?: string;                     // 컴포넌트 스킨 ID (기본값: 'basic')
    
    // 기타 확장 가능한 옵션들
    [optionName: string]: any;
  };
  
  // ✅ 유틸리티 함수
  utils: {
    t: (key: string) => string; // 번역
    navigate: (path: string) => void; // 페이지 이동
    cx?: (...classes: any[]) => string; // 클래스명 조합 (선택사항)
  };
  
  // ✅ 렌더링 모드
  mode?: 'editor' | 'preview' | 'production';
  
  // ✅ 앱 전역 데이터 (선택적)
  app?: {
    theme?: {
      colorset?: {
        primaryColor?: string;
        secondaryColor?: string;
        tertiaryColor?: string;
      };
    };
  };
  
  // ✅ 에디터 모드 전용 props (선택적)
  editor?: {
    isSelected?: boolean;
    onSelect?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
  };
}

export interface LoginData {
  socialProviders: SocialProvider[];
  rememberMe: boolean;
  lastEmail?: string;
  loginAttempts?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
  redirectUrl?: string;
}

export interface SocialProvider {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  enabled: boolean;
  color?: string;
  backgroundColor?: string;
}

export interface LoginActions {
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  socialLogin: (provider: string) => Promise<LoginResult>;
  sendPasswordReset: (email: string) => Promise<void>;
  checkLoginStatus: () => Promise<boolean>;
  logout: () => Promise<void>;
  validateEmail: (email: string) => boolean;
  validatePassword: (password: string) => boolean;
}

export interface LoginOptions {
  allowRememberMe: boolean;
  allowSocialLogin: boolean;
  allowPasswordReset: boolean;
  allowGuestOrderLookup: boolean;
  requireEmailVerification: boolean;
  enableCaptcha: boolean;
  showSignupLink: boolean;
  customBackground?: string;
  customLogo?: string;
  customTitle?: string;
  customSubtitle?: string;
  passwordRequirements: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    colorset?: {
      primaryColor?: string;
      secondaryColor?: string;
      tertiaryColor?: string;
    };
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role: string;
    emailVerified: boolean;
  };
  token?: string;
  refreshToken?: string;
  redirectUrl?: string;
  requiresVerification?: boolean;
  requiresPasswordChange?: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginState {
  isLoading: boolean;
  isLocked: boolean;
  lockoutEndTime?: Date;
  showPassword: boolean;
  attempts: number;
}