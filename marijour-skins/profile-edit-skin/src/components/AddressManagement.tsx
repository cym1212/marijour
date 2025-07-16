import React, { useState } from 'react';
import { 
  UserAddress, 
  AddressFormData, 
  FormErrors, 
  ProfileEditOptions,
  AddressSearchResult 
} from '../types';

interface AddressManagementProps {
  addresses: UserAddress[];
  onSubmit: (formData: AddressFormData, isEdit: boolean, addressId?: string) => void;
  onDelete: (addressId: string) => Promise<void>;
  onSetDefault: (addressId: string) => Promise<void>;
  onSearchAddress: (query: string) => Promise<AddressSearchResult[]>;
  errors: FormErrors;
  isLoading: boolean;
  options: ProfileEditOptions;
  utils: {
    showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
  };
}

export const AddressManagement: React.FC<AddressManagementProps> = ({
  addresses,
  onSubmit,
  onDelete,
  onSetDefault,
  onSearchAddress,
  errors,
  isLoading,
  options,
  utils
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    recipient: '',
    phoneNumber: '',
    zonecode: '',
    roadAddress: '',
    detailAddress: '',
    deliveryRequest: '',
    isDefault: false
  });

  const [addressSearchResults, setAddressSearchResults] = useState<AddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      recipient: '',
      phoneNumber: '',
      zonecode: '',
      roadAddress: '',
      detailAddress: '',
      deliveryRequest: '',
      isDefault: false
    });
    setEditingAddress(null);
    setAddressSearchResults([]);
  };

  const handleInputChange = (field: keyof AddressFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (address: UserAddress) => {
    setFormData({
      name: address.name,
      recipient: address.recipient,
      phoneNumber: address.phoneNumber,
      zonecode: address.zonecode,
      roadAddress: address.roadAddress,
      detailAddress: address.detailAddress,
      deliveryRequest: address.deliveryRequest || '',
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const isEdit = editingAddress !== null;
    onSubmit(formData, isEdit, editingAddress?.id);
    
    if (!errors.addressName && !errors.recipient && !errors.addressPhone && !errors.address && !errors.detailAddress) {
      setShowForm(false);
      resetForm();
    }
  };

  const handleDelete = async (addressId: string) => {
    if (window.confirm('이 주소를 삭제하시겠습니까?')) {
      try {
        await onDelete(addressId);
        utils.showToast('주소가 삭제되었습니다.', 'success');
      } catch (error) {
        utils.showToast('주소 삭제에 실패했습니다.', 'error');
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await onSetDefault(addressId);
      utils.showToast('기본 주소가 설정되었습니다.', 'success');
    } catch (error) {
      utils.showToast('기본 주소 설정에 실패했습니다.', 'error');
    }
  };

  const handleAddressSearch = async () => {
    if (!formData.zonecode && !formData.roadAddress) {
      utils.showToast('우편번호 또는 도로명 주소를 입력해주세요.', 'warning');
      return;
    }

    setIsSearching(true);
    try {
      const query = formData.zonecode || formData.roadAddress;
      const results = await onSearchAddress(query);
      setAddressSearchResults(results);
    } catch (error) {
      utils.showToast('주소 검색에 실패했습니다.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const selectAddress = (result: AddressSearchResult) => {
    setFormData(prev => ({
      ...prev,
      zonecode: result.zonecode,
      roadAddress: result.roadAddress
    }));
    setAddressSearchResults([]);
  };

  const canAddMoreAddresses = addresses.length < options.maxAddresses;

  return (
    <div className="address-management">
      <div className="address-management-header">
        <h3 className="section-title">주소 관리</h3>
        <p className="section-description">
          배송지 주소를 관리할 수 있습니다. (최대 {options.maxAddresses}개)
        </p>
        {canAddMoreAddresses && (
          <button
            type="button"
            className="add-address-button"
            onClick={handleAddNew}
            disabled={showForm}
          >
            + 새 주소 추가
          </button>
        )}
      </div>

      {showForm && (
        <div className="address-form-container">
          <form onSubmit={handleSubmit} className="address-form">
            <div className="form-header">
              <h4 className="form-title">
                {editingAddress ? '주소 수정' : '새 주소 추가'}
              </h4>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="addressName">
                주소 이름 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="addressName"
                className={`form-input ${errors.addressName ? 'error' : ''}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="예: 집, 회사, 친구집"
                required
              />
              {errors.addressName && <span className="error-message">{errors.addressName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="recipient">
                수령인 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="recipient"
                className={`form-input ${errors.recipient ? 'error' : ''}`}
                value={formData.recipient}
                onChange={(e) => handleInputChange('recipient', e.target.value)}
                placeholder="수령인 이름을 입력해주세요"
                required
              />
              {errors.recipient && <span className="error-message">{errors.recipient}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="addressPhone">
                휴대폰 번호 <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="addressPhone"
                className={`form-input ${errors.addressPhone ? 'error' : ''}`}
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="휴대폰 번호를 입력해주세요"
                required
              />
              {errors.addressPhone && <span className="error-message">{errors.addressPhone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="address">
                주소 <span className="required">*</span>
              </label>
              <div className="address-search-container">
                <div className="address-search-row">
                  <input
                    type="text"
                    id="zonecode"
                    className="form-input zonecode-input"
                    value={formData.zonecode}
                    onChange={(e) => handleInputChange('zonecode', e.target.value)}
                    placeholder="우편번호"
                    readOnly
                  />
                  <button
                    type="button"
                    className="address-search-button"
                    onClick={handleAddressSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? '검색 중...' : '주소 검색'}
                  </button>
                </div>
                <input
                  type="text"
                  id="roadAddress"
                  className="form-input"
                  value={formData.roadAddress}
                  onChange={(e) => handleInputChange('roadAddress', e.target.value)}
                  placeholder="도로명 주소"
                  readOnly
                />
                <input
                  type="text"
                  id="detailAddress"
                  className={`form-input ${errors.detailAddress ? 'error' : ''}`}
                  value={formData.detailAddress}
                  onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                  placeholder="상세 주소를 입력해주세요"
                  required
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
                {errors.detailAddress && <span className="error-message">{errors.detailAddress}</span>}
              </div>

              {addressSearchResults.length > 0 && (
                <div className="address-search-results">
                  <h5 className="results-title">검색 결과</h5>
                  <ul className="results-list">
                    {addressSearchResults.map((result, index) => (
                      <li key={index} className="result-item">
                        <button
                          type="button"
                          className="result-button"
                          onClick={() => selectAddress(result)}
                        >
                          <div className="result-address">
                            <span className="result-zonecode">[{result.zonecode}]</span>
                            <span className="result-road">{result.roadAddress}</span>
                          </div>
                          {result.buildingName && (
                            <div className="result-building">({result.buildingName})</div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deliveryRequest">
                배송 요청사항 (선택사항)
              </label>
              <input
                type="text"
                id="deliveryRequest"
                className="form-input"
                value={formData.deliveryRequest}
                onChange={(e) => handleInputChange('deliveryRequest', e.target.value)}
                placeholder="배송 시 요청사항을 입력해주세요"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">기본 배송지로 설정</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? '저장 중...' : editingAddress ? '수정' : '추가'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="address-list">
        {addresses.length === 0 ? (
          <div className="empty-state">
            <p>등록된 주소가 없습니다.</p>
            <button
              type="button"
              className="add-first-address-button"
              onClick={handleAddNew}
            >
              첫 번째 주소 추가하기
            </button>
          </div>
        ) : (
          <div className="address-cards">
            {addresses.map((address) => (
              <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                <div className="address-header">
                  <h4 className="address-name">{address.name}</h4>
                  {address.isDefault && (
                    <span className="default-badge">기본 배송지</span>
                  )}
                </div>
                
                <div className="address-info">
                  <div className="address-recipient">
                    <span className="label">수령인:</span>
                    <span className="value">{address.recipient}</span>
                  </div>
                  <div className="address-phone">
                    <span className="label">연락처:</span>
                    <span className="value">{address.phoneNumber}</span>
                  </div>
                  <div className="address-location">
                    <span className="label">주소:</span>
                    <span className="value">
                      [{address.zonecode}] {address.roadAddress} {address.detailAddress}
                    </span>
                  </div>
                  {address.deliveryRequest && (
                    <div className="address-request">
                      <span className="label">배송 요청:</span>
                      <span className="value">{address.deliveryRequest}</span>
                    </div>
                  )}
                </div>

                <div className="address-actions">
                  {!address.isDefault && (
                    <button
                      type="button"
                      className="action-button set-default"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      기본 설정
                    </button>
                  )}
                  <button
                    type="button"
                    className="action-button edit"
                    onClick={() => handleEdit(address)}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="action-button delete"
                    onClick={() => handleDelete(address.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};