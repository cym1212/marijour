export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
}

export interface ResetMethod {
  type: 'email' | 'phone';
  value: string;
  verified: boolean;
}

export interface PasswordResetData {
  user?: User;
  resetMethod?: ResetMethod;
  resetCode?: string;
  codeExpiry?: string;
  attempts?: number;
  maxAttempts?: number;
  resendCount?: number;
  maxResendCount?: number;
}

export interface PasswordResetActions {
  // Step 1: Request reset code
  requestPasswordReset: (method: 'email' | 'phone', value: string, name?: string) => Promise<{
    success: boolean;
    message: string;
    codeExpiry?: string;
    requiresName?: boolean;
  }>;
  
  // Step 2: Verify reset code
  verifyResetCode: (code: string) => Promise<{
    success: boolean;
    message: string;
    token?: string;
  }>;
  
  // Step 3: Reset password
  resetPassword: (newPassword: string, token: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  
  // Resend reset code
  resendResetCode: () => Promise<{
    success: boolean;
    message: string;
    codeExpiry?: string;
  }>;
  
  // Validation
  validateEmail: (email: string) => boolean;
  validatePhoneNumber: (phone: string) => boolean;
  validatePassword: (password: string) => {
    isValid: boolean;
    score: number;
    messages: string[];
    suggestions: string[];
  };
  
  // Check if user exists
  checkUserExists: (method: 'email' | 'phone', value: string) => Promise<{
    exists: boolean;
    requiresName?: boolean;
  }>;
}

export interface PasswordResetOptions {
  // Reset methods
  allowEmailReset?: boolean;
  allowPhoneReset?: boolean;
  defaultMethod?: 'email' | 'phone';
  
  // Code settings
  codeLength?: number;
  codeExpiryMinutes?: number;
  maxAttempts?: number;
  maxResendCount?: number;
  resendDelaySeconds?: number;
  
  // Password policy
  passwordPolicy?: {
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    forbiddenPatterns?: string[];
  };
  
  // UI customization
  showPasswordStrength?: boolean;
  showResendCountdown?: boolean;
  showAttemptsRemaining?: boolean;
  autoFocusFirstField?: boolean;
  
  // Steps configuration
  steps?: {
    requestReset?: boolean;
    verifyCode?: boolean;
    resetPassword?: boolean;
    showResult?: boolean;
  };
  
  // Custom messages
  messages?: {
    title?: string;
    requestTitle?: string;
    verifyTitle?: string;
    resetTitle?: string;
    resultTitle?: string;
    successMessage?: string;
    errorMessage?: string;
  };
  
  // Theme
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    errorColor?: string;
    successColor?: string;
    warningColor?: string;
  };
}

export interface ComponentSkinProps<T = any> {
  data: T;
  actions: any;
  options: any;
  utils: {
    navigate: (path: string) => void;
    openModal?: (content: any) => void;
    closeModal?: () => void;
    showToast?: (message: string, type?: 'success' | 'error' | 'warning') => void;
  };
  mode: 'edit' | 'view';
  app?: any;
  editor?: any;
}

export type FindPasswordSkinProps = ComponentSkinProps<PasswordResetData> & {
  actions: PasswordResetActions;
  options: PasswordResetOptions;
};