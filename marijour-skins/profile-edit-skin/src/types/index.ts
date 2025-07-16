export interface ComponentSkinProps {
  data: ProfileEditData;
  actions: ProfileEditActions;
  options: ProfileEditOptions;
  utils: {
    navigate: (path: string) => void;
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
    showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
  };
  mode: 'edit' | 'view';
  app?: any;
  editor?: any;
}

export interface ProfileEditData {
  userInfo: UserInfo;
  addresses: UserAddress[];
  refundAccount?: RefundAccount;
  withdrawalReasons: string[];
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  joinDate: string;
  lastLoginDate?: string;
  marketingConsent: boolean;
}

export interface UserAddress {
  id: string;
  name: string;
  recipient: string;
  phoneNumber: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  isDefault: boolean;
  deliveryRequest?: string;
}

export interface RefundAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface ProfileEditActions {
  updateUserInfo: (userInfo: Partial<UserInfo>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  addAddress: (address: Omit<UserAddress, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  updateRefundAccount: (account: RefundAccount) => Promise<void>;
  requestWithdrawal: (reason: string, detail?: string) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string>;
  searchAddress: (query: string) => Promise<AddressSearchResult[]>;
}

export interface ProfileEditOptions {
  allowProfileImageUpload: boolean;
  allowPasswordChange: boolean;
  allowWithdrawal: boolean;
  maxAddresses: number;
  requiredFields: string[];
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
}

export interface AddressSearchResult {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName?: string;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface WithdrawalForm {
  reason: string;
  detail?: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ProfileEditFormData {
  name: string;
  email: string;
  phoneNumber: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  marketingConsent: boolean;
}

export interface AddressFormData {
  name: string;
  recipient: string;
  phoneNumber: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  deliveryRequest?: string;
  isDefault: boolean;
}

export interface FormErrors {
  [key: string]: string;
}