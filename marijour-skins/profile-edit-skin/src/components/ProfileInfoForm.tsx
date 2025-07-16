import React, { useState, useEffect } from 'react';
import { 
  UserInfo, 
  ProfileEditFormData, 
  FormErrors, 
  ProfileEditOptions, 
  ProfileEditActions 
} from '../types';

interface ProfileInfoFormProps {
  userInfo: UserInfo;
  onSubmit: (formData: ProfileEditFormData) => void;
  errors: FormErrors;
  isLoading: boolean;
  options: ProfileEditOptions;
  actions: ProfileEditActions;
  utils: {
    showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
  };
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  userInfo,
  onSubmit,
  errors,
  isLoading,
  options,
  actions,
  utils
}) => {
  const [formData, setFormData] = useState<ProfileEditFormData>({
    name: userInfo.name || '',
    email: userInfo.email || '',
    phoneNumber: userInfo.phoneNumber || '',
    birthDate: userInfo.birthDate || '',
    gender: userInfo.gender || undefined,
    marketingConsent: userInfo.marketingConsent || false
  });

  const [profileImage, setProfileImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData({
      name: userInfo.name || '',
      email: userInfo.email || '',
      phoneNumber: userInfo.phoneNumber || '',
      birthDate: userInfo.birthDate || '',
      gender: userInfo.gender || undefined,
      marketingConsent: userInfo.marketingConsent || false
    });
  }, [userInfo]);

  const handleInputChange = (field: keyof ProfileEditFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0]) return;
    
    const file = event.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      utils.showToast('이미지 파일은 5MB 이하로 업로드해주세요.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await actions.uploadProfileImage(file);
      setProfileImage(imageUrl);
      utils.showToast('프로필 이미지가 업로드되었습니다.', 'success');
    } catch (error) {
      utils.showToast('이미지 업로드에 실패했습니다.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const isRequired = (field: string) => {
    return options.requiredFields.includes(field);
  };

  return (
    <div className="profile-info-form">
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3 className="section-title">기본 정보</h3>
          
          {options.allowProfileImageUpload && (
            <div className="form-group profile-image-group">
              <label className="form-label">프로필 이미지</label>
              <div className="profile-image-upload">
                <div className="image-preview">
                  {profileImage ? (
                    <img src={profileImage} alt="프로필 이미지" className="profile-image" />
                  ) : (
                    <div className="profile-image-placeholder">
                      <span className="placeholder-text">이미지 없음</span>
                    </div>
                  )}
                </div>
                <label className="upload-button" htmlFor="profileImage">
                  {isUploading ? '업로드 중...' : '이미지 변경'}
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden-input"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              이름 {isRequired('name') && <span className="required">*</span>}
            </label>
            <input
              type="text"
              id="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="이름을 입력해주세요"
              required={isRequired('name')}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              이메일 {isRequired('email') && <span className="required">*</span>}
            </label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="이메일을 입력해주세요"
              required={isRequired('email')}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">
              휴대폰 번호 {isRequired('phoneNumber') && <span className="required">*</span>}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="휴대폰 번호를 입력해주세요"
              required={isRequired('phoneNumber')}
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="birthDate">
              생년월일 {isRequired('birthDate') && <span className="required">*</span>}
            </label>
            <input
              type="date"
              id="birthDate"
              className={`form-input ${errors.birthDate ? 'error' : ''}`}
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              required={isRequired('birthDate')}
            />
            {errors.birthDate && <span className="error-message">{errors.birthDate}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              성별 {isRequired('gender') && <span className="required">*</span>}
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">남성</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">여성</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="radio-input"
                />
                <span className="radio-text">기타</span>
              </label>
            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">마케팅 정보</h3>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                이메일 및 SMS 마케팅 정보 수신에 동의합니다.
              </span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">계정 정보</h3>
          
          <div className="account-info">
            <div className="info-item">
              <span className="info-label">가입일</span>
              <span className="info-value">{new Date(userInfo.joinDate).toLocaleDateString()}</span>
            </div>
            {userInfo.lastLoginDate && (
              <div className="info-item">
                <span className="info-label">최근 로그인</span>
                <span className="info-value">{new Date(userInfo.lastLoginDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? '저장 중...' : '회원정보 수정'}
          </button>
        </div>
      </form>
    </div>
  );
};