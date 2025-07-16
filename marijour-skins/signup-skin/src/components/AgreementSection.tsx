import React from 'react';
import { AgreementState, TermsContent, PrivacyContent, MarketingContent, SignUpOptions } from '../types';

interface AgreementSectionProps {
  agreements: AgreementState;
  termsContent: TermsContent;
  privacyContent: PrivacyContent;
  marketingContent?: MarketingContent;
  options: SignUpOptions;
  onAgreementChange: (type: keyof AgreementState) => void;
  utils: {
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
  };
}

export const AgreementSection: React.FC<AgreementSectionProps> = ({
  agreements,
  termsContent,
  privacyContent,
  marketingContent,
  options,
  onAgreementChange,
  utils
}) => {
  const handleViewTerms = () => {
    utils.openModal(
      <div className="modal-content">
        <h3 className="modal-title">{termsContent.title}</h3>
        <div className="modal-body">
          <div className="terms-content" dangerouslySetInnerHTML={{ __html: termsContent.content }} />
          <div className="terms-meta">
            <p>버전: {termsContent.version}</p>
            <p>최종 수정일: {new Date(termsContent.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleViewPrivacy = () => {
    utils.openModal(
      <div className="modal-content">
        <h3 className="modal-title">{privacyContent.title}</h3>
        <div className="modal-body">
          <div className="privacy-content" dangerouslySetInnerHTML={{ __html: privacyContent.content }} />
          <div className="privacy-meta">
            <p>버전: {privacyContent.version}</p>
            <p>최종 수정일: {new Date(privacyContent.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleViewMarketing = () => {
    if (!marketingContent) return;
    
    utils.openModal(
      <div className="modal-content">
        <h3 className="modal-title">{marketingContent.title}</h3>
        <div className="modal-body">
          <div className="marketing-description">
            <p>{marketingContent.description}</p>
          </div>
          <div className="marketing-content" dangerouslySetInnerHTML={{ __html: marketingContent.content }} />
        </div>
      </div>
    );
  };

  return (
    <div className="agreement-section">
      <h3 className="section-title">약관 동의</h3>
      <p className="section-description">
        서비스 이용을 위해 아래 약관에 동의해주세요.
      </p>

      <div className="agreement-list">
        <div className="agreement-item all-agreement">
          <label className="agreement-label">
            <input
              type="checkbox"
              checked={agreements.all}
              onChange={() => onAgreementChange('all')}
              className="agreement-checkbox"
            />
            <span className="checkbox-custom"></span>
            <span className="agreement-text">
              모든 약관에 동의합니다.
            </span>
          </label>
        </div>

        <div className="agreement-divider"></div>

        <div className="agreement-item">
          <label className="agreement-label">
            <input
              type="checkbox"
              checked={agreements.age}
              onChange={() => onAgreementChange('age')}
              className="agreement-checkbox"
            />
            <span className="checkbox-custom"></span>
            <span className="agreement-text">
              만 14세 이상입니다.
              <span className="required-badge">필수</span>
            </span>
          </label>
        </div>

        <div className="agreement-item">
          <label className="agreement-label">
            <input
              type="checkbox"
              checked={agreements.terms}
              onChange={() => onAgreementChange('terms')}
              className="agreement-checkbox"
            />
            <span className="checkbox-custom"></span>
            <span className="agreement-text">
              이용약관 동의
              <span className="required-badge">필수</span>
            </span>
          </label>
          <button
            type="button"
            className="view-button"
            onClick={handleViewTerms}
            style={{ color: options.theme.primaryColor }}
          >
            보기
          </button>
        </div>

        <div className="agreement-item">
          <label className="agreement-label">
            <input
              type="checkbox"
              checked={agreements.privacy}
              onChange={() => onAgreementChange('privacy')}
              className="agreement-checkbox"
            />
            <span className="checkbox-custom"></span>
            <span className="agreement-text">
              개인정보 수집·이용 동의
              <span className="required-badge">필수</span>
            </span>
          </label>
          <button
            type="button"
            className="view-button"
            onClick={handleViewPrivacy}
            style={{ color: options.theme.primaryColor }}
          >
            보기
          </button>
        </div>

        {options.showMarketingConsent && marketingContent && (
          <div className="agreement-item">
            <label className="agreement-label">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={() => onAgreementChange('marketing')}
                className="agreement-checkbox"
              />
              <span className="checkbox-custom"></span>
              <span className="agreement-text">
                마케팅 정보 수신 동의
                {options.requireMarketingConsent ? (
                  <span className="required-badge">필수</span>
                ) : (
                  <span className="optional-badge">선택</span>
                )}
              </span>
            </label>
            <button
              type="button"
              className="view-button"
              onClick={handleViewMarketing}
              style={{ color: options.theme.primaryColor }}
            >
              보기
            </button>
          </div>
        )}
      </div>

      <div className="agreement-notice">
        <p className="notice-text">
          <span className="required-badge">필수</span> 항목은 서비스 이용을 위해 반드시 동의해야 합니다.
        </p>
        {options.showMarketingConsent && !options.requireMarketingConsent && (
          <p className="notice-text">
            <span className="optional-badge">선택</span> 항목은 동의하지 않으셔도 서비스 이용이 가능합니다.
          </p>
        )}
      </div>
    </div>
  );
};