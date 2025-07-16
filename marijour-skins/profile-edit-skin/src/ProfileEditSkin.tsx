import React, { useState, useEffect } from 'react';
import { 
  ComponentSkinProps, 
  UserInfo, 
  UserAddress, 
  FormErrors,
  ProfileEditFormData,
  PasswordChangeForm,
  WithdrawalForm,
  AddressFormData 
} from './types';
import { ProfileInfoForm } from './components/ProfileInfoForm';
import { PasswordChangeForm as PasswordChangeFormComponent } from './components/PasswordChangeForm';
import { AddressManagement } from './components/AddressManagement';
import { AccountWithdrawal } from './components/AccountWithdrawal';
import './profile-edit-skin.scss';

const ProfileEditSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  utils, 
  mode 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'address' | 'withdrawal'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const clearErrors = () => {
    setErrors({});
  };

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    const { passwordPolicy } = options;
    if (password.length < passwordPolicy.minLength) return false;
    if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) return false;
    if (passwordPolicy.requireNumbers && !/[0-9]/.test(password)) return false;
    if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
  };

  const handleProfileSubmit = async (formData: ProfileEditFormData) => {
    clearErrors();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        setFieldError('name', '이름을 입력해주세요.');
        return;
      }

      if (!formData.email.trim()) {
        setFieldError('email', '이메일을 입력해주세요.');
        return;
      }

      if (!validateEmail(formData.email)) {
        setFieldError('email', '올바른 이메일 형식을 입력해주세요.');
        return;
      }

      if (!formData.phoneNumber.trim()) {
        setFieldError('phoneNumber', '휴대폰 번호를 입력해주세요.');
        return;
      }

      if (!validatePhone(formData.phoneNumber)) {
        setFieldError('phoneNumber', '올바른 휴대폰 번호 형식을 입력해주세요.');
        return;
      }

      await actions.updateUserInfo(formData);
      utils.showToast('회원정보가 수정되었습니다.', 'success');
    } catch (error) {
      utils.showToast('회원정보 수정에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (formData: PasswordChangeForm) => {
    clearErrors();
    setIsLoading(true);

    try {
      if (!formData.currentPassword.trim()) {
        setFieldError('currentPassword', '현재 비밀번호를 입력해주세요.');
        return;
      }

      if (!formData.newPassword.trim()) {
        setFieldError('newPassword', '새 비밀번호를 입력해주세요.');
        return;
      }

      if (!validatePassword(formData.newPassword)) {
        setFieldError('newPassword', '비밀번호 정책에 맞지 않습니다.');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setFieldError('confirmPassword', '비밀번호가 일치하지 않습니다.');
        return;
      }

      await actions.changePassword(formData.currentPassword, formData.newPassword);
      utils.showToast('비밀번호가 변경되었습니다.', 'success');
    } catch (error) {
      utils.showToast('비밀번호 변경에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSubmit = async (formData: AddressFormData, isEdit: boolean, addressId?: string) => {
    clearErrors();
    setIsLoading(true);

    try {
      if (!formData.name.trim()) {
        setFieldError('addressName', '주소 이름을 입력해주세요.');
        return;
      }

      if (!formData.recipient.trim()) {
        setFieldError('recipient', '수령인을 입력해주세요.');
        return;
      }

      if (!formData.phoneNumber.trim()) {
        setFieldError('addressPhone', '휴대폰 번호를 입력해주세요.');
        return;
      }

      if (!validatePhone(formData.phoneNumber)) {
        setFieldError('addressPhone', '올바른 휴대폰 번호 형식을 입력해주세요.');
        return;
      }

      if (!formData.zonecode || !formData.roadAddress) {
        setFieldError('address', '주소를 검색해주세요.');
        return;
      }

      if (!formData.detailAddress.trim()) {
        setFieldError('detailAddress', '상세 주소를 입력해주세요.');
        return;
      }

      if (isEdit && addressId) {
        await actions.updateAddress(addressId, formData);
        utils.showToast('주소가 수정되었습니다.', 'success');
      } else {
        await actions.addAddress(formData);
        utils.showToast('주소가 추가되었습니다.', 'success');
      }
    } catch (error) {
      utils.showToast('주소 저장에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawalSubmit = async (formData: WithdrawalForm) => {
    clearErrors();
    setIsLoading(true);

    try {
      if (!formData.reason) {
        setFieldError('reason', '탈퇴 사유를 선택해주세요.');
        return;
      }

      if (!formData.confirmPassword.trim()) {
        setFieldError('confirmPassword', '비밀번호를 입력해주세요.');
        return;
      }

      if (!formData.agreeToTerms) {
        setFieldError('agreeToTerms', '탈퇴 안내사항에 동의해주세요.');
        return;
      }

      await actions.requestWithdrawal(formData.reason, formData.detail);
      utils.showToast('회원탈퇴가 요청되었습니다.', 'success');
    } catch (error) {
      utils.showToast('회원탈퇴 요청에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const tabItems = [
    { id: 'profile', label: '회원정보 수정', enabled: true },
    { id: 'password', label: '비밀번호 변경', enabled: options.allowPasswordChange },
    { id: 'address', label: '주소 관리', enabled: true },
    { id: 'withdrawal', label: '회원탈퇴', enabled: options.allowWithdrawal }
  ].filter(item => item.enabled);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInfoForm
            userInfo={data.userInfo}
            onSubmit={handleProfileSubmit}
            errors={errors}
            isLoading={isLoading}
            options={options}
            actions={actions}
            utils={utils}
          />
        );
      case 'password':
        return (
          <PasswordChangeFormComponent
            onSubmit={handlePasswordSubmit}
            errors={errors}
            isLoading={isLoading}
            options={options}
          />
        );
      case 'address':
        return (
          <AddressManagement
            addresses={data.addresses}
            onSubmit={handleAddressSubmit}
            onDelete={actions.deleteAddress}
            onSetDefault={actions.setDefaultAddress}
            onSearchAddress={actions.searchAddress}
            errors={errors}
            isLoading={isLoading}
            options={options}
            utils={utils}
          />
        );
      case 'withdrawal':
        return (
          <AccountWithdrawal
            withdrawalReasons={data.withdrawalReasons}
            onSubmit={handleWithdrawalSubmit}
            errors={errors}
            isLoading={isLoading}
            utils={utils}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-edit-skin">
      <div className="profile-edit-container">
        <div className="profile-edit-header">
          <h2 className="profile-edit-title">회원정보 관리</h2>
        </div>

        <div className="profile-edit-content">
          <div className="profile-edit-tabs">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`profile-edit-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="profile-edit-panel">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditSkin;